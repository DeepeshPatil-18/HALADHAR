/**
 * recoveryService.ts — interface between the app and both Supabase +
 * local IndexedDB for Blackout resilience.
 *
 * Responsibilities:
 *   saveSnapshot()            — write advisory_snapshots row
 *   getLatestSnapshot()       — read latest snapshot by advisory_id
 *   savePendingOperation()    — write to pending_operations (IDB + Supabase)
 *   getPendingOperations()    — read all pending ops from IDB
 *   markOperationCompleted()  — update status in IDB + Supabase
 *   recordRecoveryEvent()     — append to recovery_log
 *   getRecoveryStatus()       — return SystemHealth
 *   validateRecordIntegrity() — checksum check on a record
 */

import { supabase } from '../lib/supabaseClient';
import {
  idbPut, idbGetAll, idbGet, idbDelete, setMeta, getMeta,
} from '../lib/indexedDb';
import { checksumAsync, validateIntegrity } from '../lib/integrity';
import type {
  AdvisorySnapshot,
  PendingOperation,
  RecoveryLogEntry,
  SystemHealth,
  OperationType,
} from '../types/recovery';

const MAX_RETRIES = 4;

/* ══════════════════════════════════════════════════════════════════
   SNAPSHOTS
══════════════════════════════════════════════════════════════════ */

/** Save a new advisory snapshot to Supabase advisory_snapshots table. */
export async function saveSnapshot(snap: Omit<AdvisorySnapshot, 'id'>): Promise<boolean> {
  try {
    const { error } = await supabase.from('advisory_snapshots').insert(snap);
    if (error) throw error;
    // Also keep in IDB as backup of the snapshot
    await idbPut('snapshots', { id: `${snap.advisory_id}_v${snap.version}`, ...snap });
    await setMeta('last_sync', new Date().toISOString());
    return true;
  } catch {
    // Supabase unavailable — save snapshot locally only
    await idbPut('snapshots', { id: `${snap.advisory_id}_v${snap.version}`, ...snap });
    return false;
  }
}

/** Get the latest snapshot for an advisory_id from Supabase, then IDB fallback. */
export async function getLatestSnapshot(advisoryId: string): Promise<AdvisorySnapshot | null> {
  try {
    const { data, error } = await supabase
      .from('advisory_snapshots')
      .select('*')
      .eq('advisory_id', advisoryId)
      .order('version', { ascending: false })
      .limit(1)
      .single();
    if (!error && data) return data as AdvisorySnapshot;
  } catch {}

  // IDB fallback
  const all = await idbGetAll<AdvisorySnapshot & { id: string }>('snapshots');
  const matching = all
    .filter(s => s.advisory_id === advisoryId)
    .sort((a, b) => b.version - a.version);
  return matching[0] ?? null;
}

/* ══════════════════════════════════════════════════════════════════
   PENDING OPERATIONS
══════════════════════════════════════════════════════════════════ */

/**
 * Save a pending operation to IDB immediately (so it survives offline),
 * then also try to write it to Supabase pending_operations table.
 *
 * IMPORTANT: always use the same operation_id on retry — never generate a new one.
 */
export async function savePendingOperation(
  op: Omit<PendingOperation, 'retry_count' | 'status'>
): Promise<void> {
  const entry: PendingOperation & { id: string } = {
    id: op.operation_id,   // IDB keyPath = operation_id for idempotency
    ...op,
    retry_count: 0,
    status: 'pending',
  };

  await idbPut('pendingOps', entry);

  try {
    await supabase.from('pending_operations').upsert({
      operation_id:   op.operation_id,
      operation_type: op.operation_type,
      payload:        op.payload,
      created_at:     op.created_at,
      retry_count:    0,
      status:         'pending',
    }, { onConflict: 'operation_id' });
  } catch {
    // Supabase unavailable — IDB copy is the source of truth until reconnected
  }
}

/** Get all pending operations from IDB (source of truth during offline). */
export async function getPendingOperations(): Promise<PendingOperation[]> {
  const ops = await idbGetAll<PendingOperation & { id: string }>('pendingOps');
  return ops.filter(op => op.status === 'pending' || op.status === 'processing');
}

/** Mark an operation completed in both IDB and Supabase. */
export async function markOperationCompleted(operationId: string): Promise<void> {
  // Update IDB
  const existing = await idbGet<PendingOperation & { id: string }>('pendingOps', operationId);
  if (existing) {
    await idbPut('pendingOps', { ...existing, status: 'completed' });
  }

  // Update Supabase
  try {
    await supabase
      .from('pending_operations')
      .update({ status: 'completed' })
      .eq('operation_id', operationId);
  } catch {}
}

/** Mark an operation failed after too many retries. */
export async function markOperationFailed(operationId: string): Promise<void> {
  const existing = await idbGet<PendingOperation & { id: string }>('pendingOps', operationId);
  if (existing) {
    await idbPut('pendingOps', { ...existing, status: 'failed' });
  }
  try {
    await supabase
      .from('pending_operations')
      .update({ status: 'failed' })
      .eq('operation_id', operationId);
  } catch {}
}

/** Increment retry count for an operation. */
export async function incrementRetryCount(operationId: string): Promise<number> {
  const existing = await idbGet<PendingOperation & { id: string }>('pendingOps', operationId);
  const newCount = (existing?.retry_count ?? 0) + 1;
  if (existing) {
    await idbPut('pendingOps', { ...existing, retry_count: newCount });
  }
  return newCount;
}

/* ══════════════════════════════════════════════════════════════════
   RECOVERY LOG
══════════════════════════════════════════════════════════════════ */

export async function recordRecoveryEvent(entry: Omit<RecoveryLogEntry, 'id'>): Promise<void> {
  try {
    await supabase.from('recovery_log').insert(entry);
  } catch {
    // Store in IDB if Supabase is down
    await idbPut('metadata', {
      id: `recovery_log_${entry.created_at}`,
      value: entry,
      updatedAt: new Date().toISOString(),
    });
  }
}

/* ══════════════════════════════════════════════════════════════════
   SYSTEM HEALTH
══════════════════════════════════════════════════════════════════ */

/** Check whether Supabase is reachable by doing a lightweight query. */
export async function isDatabaseHealthy(): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('blackout_demo_records')
      .select('id')
      .limit(1);
    return !error;
  } catch {
    return false;
  }
}

export async function getRecoveryStatus(): Promise<SystemHealth> {
  const dbHealthy      = await isDatabaseHealthy();
  const pending        = await getPendingOperations();
  const lastSync       = await getMeta<string>('last_sync') ?? null;

  // Test IDB
  let localCacheHealthy = true;
  try {
    await idbGetAll('metadata');
  } catch {
    localCacheHealthy = false;
  }

  // Check simulation flag
  const simActive = (await getMeta<boolean>('simulation_active')) ?? false;

  return {
    databaseHealthy:       dbHealthy && !simActive,
    localCacheHealthy,
    pendingOperationsCount: pending.length,
    lastSuccessfulSync:    lastSync,
    simulationActive:      simActive,
  };
}

/* ══════════════════════════════════════════════════════════════════
   INTEGRITY VALIDATION
══════════════════════════════════════════════════════════════════ */

export async function validateRecordIntegrity(
  content: string,
  storedChecksum: string
): Promise<'VERIFIED' | 'CORRUPTED' | 'MISSING'> {
  return validateIntegrity(content, storedChecksum);
}

export { checksumAsync, MAX_RETRIES };
export type { OperationType };
