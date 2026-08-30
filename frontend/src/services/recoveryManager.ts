/**
 * recoveryManager.ts — 4-tier recovery chain + Blackout simulation controller.
 *
 * Recovery priority:
 *   1. Live Supabase record   → VERIFIED
 *   2. Supabase snapshot      → RECOVERED
 *   3. Local IDB cache        → RECOVERED
 *   4. Advisory event history → RECOVERED (partial reconstruction)
 *   5. Unavailable            → UNAVAILABLE
 *
 * Simulation controller:
 *   activateBlackoutSimulation()   — sets simulation mode (no real DB writes destroyed)
 *   deactivateBlackoutSimulation() — restores normal operation
 *   isSimulationActive()           — read current flag
 */

import { supabase } from '../lib/supabaseClient';
import {
  idbGetAll, idbPut, setMeta, getMeta,
} from '../lib/indexedDb';
import {
  saveSnapshot,
  savePendingOperation,
  getPendingOperations,
  markOperationCompleted,
  markOperationFailed,
  incrementRetryCount,
  recordRecoveryEvent,
  getRecoveryStatus,
  checksumAsync,
  MAX_RETRIES,
} from './recoveryService';
import { validateIntegrity } from '../lib/integrity';
import type {
  RecoveryResult,
  RecoverySummary,
  TimelineEvent,
  BlackoutDemoRecord,
  DataStatus,
} from '../types/recovery';

const BACKEND = () =>
  import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace('/api', '')
    : 'http://localhost:8000';

/* ── Real backend health check ──────────────────────────────────── */
async function isBackendBlackoutActive(): Promise<boolean> {
  try {
    const res  = await fetch(`${BACKEND()}/api/system/health`);
    if (!res.ok) return false;
    const data = await res.json();
    return data?.blackout?.active === true || data?.database !== 'healthy';
  } catch {
    // Backend unreachable → treat as blackout
    return true;
  }
}

/** Queue operation via backend (persists to Supabase pending_operations) */
async function queueOperationOnBackend(params: {
  operationId: string;
  operationType: string;
  payload: Record<string, unknown>;
}): Promise<void> {
  try {
    await fetch(`${BACKEND()}/api/blackout/queue-operation`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        operation_id:   params.operationId,
        operation_type: params.operationType,
        payload:        params.payload,
      }),
    });
  } catch {
    // Backend down — IDB is still the safety net
  }
}

/** Create a backend snapshot after a successful save */
async function createBackendSnapshot(params: {
  advisoryId: string;
  farmerId: string;
  content: string;
}): Promise<void> {
  try {
    await fetch(`${BACKEND()}/api/blackout/snapshot`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        advisory_id: params.advisoryId,
        farmer_id:   params.farmerId,
        content:     params.content,
        version:     1,
      }),
    });
  } catch {
    // Non-critical — snapshot failure does not block the user
  }
}

export async function activateBlackoutSimulation(): Promise<void> {
  await setMeta('simulation_active', true);
  await setMeta('simulation_started_at', new Date().toISOString());
  console.warn('[BLACKOUT] Simulation activated — Supabase writes/reads will be intercepted');
}

export async function deactivateBlackoutSimulation(): Promise<void> {
  await setMeta('simulation_active', false);
  console.info('[BLACKOUT] Simulation deactivated — normal operation restored');
}

export async function isSimulationActive(): Promise<boolean> {
  return (await getMeta<boolean>('simulation_active')) ?? false;
}

/* ══════════════════════════════════════════════════════════════════
   SIMULATION VARIANTS
══════════════════════════════════════════════════════════════════ */

/** Simulate a MISSING record in blackout_demo_records */
export async function simulateMissingRecord(recordId: string): Promise<void> {
  await supabase
    .from('blackout_demo_records')
    .update({ status: 'UNAVAILABLE', advisory: '' })
    .eq('id', recordId);
}

/** Simulate a CORRUPTED record (tamper checksum) */
export async function simulateCorruptedRecord(recordId: string): Promise<void> {
  await supabase
    .from('blackout_demo_records')
    .update({ checksum: 'CORRUPTED_XXXXXXXX', status: 'CORRUPTED' })
    .eq('id', recordId);
}

/** Simulate full database failure by enabling simulation mode */
export async function simulateDatabaseFailure(): Promise<void> {
  await activateBlackoutSimulation();
  await recordRecoveryEvent({
    event_type: 'BLACKOUT_DETECTED',
    records_affected: 0,
    records_recovered: 0,
    records_unrecoverable: 0,
    details: { triggered_at: new Date().toISOString(), source: 'manual_simulation' },
    created_at: new Date().toISOString(),
  });
}

/* ══════════════════════════════════════════════════════════════════
   4-TIER RECOVERY CHAIN
══════════════════════════════════════════════════════════════════ */

/**
 * Attempt to retrieve an advisory using the 4-tier fallback chain.
 * Returns a RecoveryResult with status and source.
 */
export async function recoverAdvisory(
  advisoryId: string,
  farmerId: string
): Promise<RecoveryResult> {
  const simActive = await isSimulationActive();

  // ── Tier 1: Live Supabase (skip if simulation active) ──────────
  if (!simActive) {
    try {
      const { data, error } = await supabase
        .from('advisory_snapshots')
        .select('*')
        .eq('advisory_id', advisoryId)
        .eq('farmer_id', farmerId)
        .order('version', { ascending: false })
        .limit(1)
        .single();

      if (!error && data) {
        const integrity = await validateIntegrity(data.content, data.checksum);
        if (integrity === 'VERIFIED') {
          return {
            status: 'VERIFIED',
            source: 'supabase',
            data,
            recoveredAt: new Date().toISOString(),
          };
        }
      }
    } catch {}
  }

  // ── Tier 2: Supabase snapshot table (may still work during partial outage) ─
  if (!simActive) {
    try {
      const { data } = await supabase
        .from('advisory_snapshots')
        .select('*')
        .eq('advisory_id', advisoryId)
        .order('version', { ascending: false })
        .limit(1)
        .single();

      if (data?.content) {
        const integrity = await validateIntegrity(data.content, data.checksum);
        if (integrity === 'VERIFIED') {
          return {
            status: 'RECOVERED',
            source: 'snapshot',
            data,
            message: 'Restored from verified snapshot',
            recoveredAt: new Date().toISOString(),
          };
        }
      }
    } catch {}
  }

  // ── Tier 3: Local IDB cache ─────────────────────────────────────
  try {
    const snapshots = await idbGetAll<{ id: string; advisory_id: string; content: string; checksum: string; version: number }>('snapshots');
    const matching  = snapshots
      .filter(s => s.advisory_id === advisoryId)
      .sort((a, b) => b.version - a.version);

    if (matching.length > 0) {
      const snap = matching[0];
      const integrity = await validateIntegrity(snap.content, snap.checksum);
      if (integrity === 'VERIFIED') {
        return {
          status: 'RECOVERED',
          source: 'indexeddb',
          data: snap,
          message: 'Restored from local emergency cache',
          recoveredAt: new Date().toISOString(),
        };
      }
    }

    // Also check advisories store
    const advisories = await idbGetAll<{ id: string; content: string; checksum: string }>('advisories');
    const adv = advisories.find(a => a.id === advisoryId);
    if (adv?.content) {
      const integrity = await validateIntegrity(adv.content, adv.checksum);
      if (integrity === 'VERIFIED') {
        return {
          status: 'RECOVERED',
          source: 'indexeddb',
          data: adv,
          message: 'Restored from local advisory cache',
          recoveredAt: new Date().toISOString(),
        };
      }
    }
  } catch {}

  // ── Tier 4: Event history reconstruction ───────────────────────
  if (!simActive) {
    try {
      const { data } = await supabase
        .from('advisory_events')
        .select('*')
        .eq('advisory_id', advisoryId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (data && data.length > 0) {
        const latestCreate = data.find(e => e.event_type === 'CREATED' || e.event_type === 'UPDATED');
        if (latestCreate?.payload?.content) {
          return {
            status: 'RECOVERED',
            source: 'events',
            data: latestCreate.payload,
            message: 'Reconstructed from event history',
            recoveredAt: new Date().toISOString(),
          };
        }
      }
    } catch {}
  }

  // ── Tier 5: Unavailable ─────────────────────────────────────────
  return {
    status: 'UNAVAILABLE',
    source: 'none',
    message: 'This record could not be recovered from any source.',
  };
}

/* ══════════════════════════════════════════════════════════════════
   ADVISORY SAVE WITH BLACKOUT PROTECTION
══════════════════════════════════════════════════════════════════ */

/**
 * Save an AI advisory with full resilience:
 *  1. Generate operation_id (caller provides it for idempotency)
 *  2. Save local emergency copy immediately
 *  3. Attempt Supabase write
 *  4. On success: create snapshot, record event
 *  5. On failure: queue pending operation
 */
export async function saveAdvisoryWithResilience(params: {
  operationId: string;
  advisoryId: string;
  farmerId: string;
  content: string;
  question: string;
  language: string;
  simulateFailure?: boolean;
}): Promise<{
  success: boolean;
  status: DataStatus;
  message: string;
}> {
  const { operationId, advisoryId, farmerId, content, question, language } = params;
  const checksum = await checksumAsync(content);
  const now      = new Date().toISOString();

  // Step 1: Always save emergency local copy first (before any network call)
  await idbPut('advisories', {
    id: advisoryId,
    operationId,
    farmerId,
    content,
    checksum,
    timestamp: now,
    question,
    language,
  });

  // Step 2: Check real backend blackout state
  const backendBlackedOut = await isBackendBlackoutActive();
  const shouldFail = backendBlackedOut || params.simulateFailure;

  // Step 3: Attempt Supabase write (only if backend says DB is healthy)
  if (!shouldFail) {
    try {
      // Write the advisory event
      const { error: evtErr } = await supabase.from('advisory_events').insert({
        operation_id: operationId,
        advisory_id:  advisoryId,
        farmer_id:    farmerId,
        event_type:   'CREATED',
        payload:      { content, question, language, checksum },
        created_at:   now,
      });
      if (evtErr) throw evtErr;

      // Write snapshot via backend (so it uses service-role key)
      await createBackendSnapshot({ advisoryId, farmerId, content });

      // Write demo record
      await supabase.from('blackout_demo_records').upsert({
        id:           advisoryId,
        farmer_name:  farmerId,
        crop:         question.slice(0, 80),
        advisory:     content.slice(0, 500),
        status:       'VERIFIED',
        version:      1,
        checksum,
        updated_at:   now,
      }, { onConflict: 'id' });

      await setMeta('last_sync', now);

      return { success: true, status: 'VERIFIED', message: 'Advisory saved and verified.' };
    } catch (err) {
      console.warn('[Blackout] Supabase write failed, queuing:', err);
    }
  }

  // Step 4: DB unavailable → queue via backend + IDB
  await savePendingOperation({
    operation_id:   operationId,
    operation_type: 'SAVE_ADVISORY',
    payload: { advisoryId, farmerId, content, checksum, question, language, created_at: now },
    created_at: now,
  });

  // Also queue on backend so replay works when DB restored
  await queueOperationOnBackend({
    operationId,
    operationType: 'SAVE_ADVISORY',
    payload: { advisoryId, farmerId, content, checksum, question, language, created_at: now },
  });

  return {
    success: false,
    status:  'PENDING',
    message: 'Primary storage unavailable. Emergency copy secured. Operation queued.',
  };
}

/* ══════════════════════════════════════════════════════════════════
   RETRY PENDING OPERATIONS
══════════════════════════════════════════════════════════════════ */

/**
 * Retry all pending operations. Uses exponential-ish backoff via
 * the caller's responsibility (this function does one pass).
 * Returns counts: { retried, succeeded, failed, remaining }
 */
export async function retryPendingOperations(): Promise<{
  retried: number; succeeded: number; failed: number; remaining: number;
}> {
  const pending = await getPendingOperations();
  let succeeded = 0, failed = 0;

  for (const op of pending) {
    const retryCount = await incrementRetryCount(op.operation_id);
    if (retryCount > MAX_RETRIES) {
      await markOperationFailed(op.operation_id);
      failed++;
      continue;
    }

    try {
      if (op.operation_type === 'SAVE_ADVISORY') {
        const p = op.payload as {
          advisoryId: string; farmerId: string; content: string;
          checksum: string; question: string; language: string; created_at: string;
        };

        // Idempotency check: skip if already in Supabase
        const { data: existing } = await supabase
          .from('advisory_events')
          .select('id')
          .eq('operation_id', op.operation_id)
          .limit(1)
          .single();

        if (!existing) {
          const { error } = await supabase.from('advisory_events').insert({
            operation_id: op.operation_id,
            advisory_id:  p.advisoryId,
            farmer_id:    p.farmerId,
            event_type:   'CREATED',
            payload:      { content: p.content, question: p.question, language: p.language, checksum: p.checksum },
            created_at:   p.created_at,
          });
          if (error) throw error;

          await saveSnapshot({
            advisory_id: p.advisoryId,
            farmer_id:   p.farmerId,
            content:     p.content,
            version:     1,
            checksum:    p.checksum,
            created_at:  p.created_at,
          });

          await supabase.from('blackout_demo_records').upsert({
            id:           p.advisoryId,
            farmer_name:  p.farmerId,
            crop:         p.question.slice(0, 80),
            advisory:     p.content.slice(0, 500),
            status:       'VERIFIED',
            version:      1,
            checksum:     p.checksum,
            updated_at:   new Date().toISOString(),
          }, { onConflict: 'id' });
        }

        await markOperationCompleted(op.operation_id);
        succeeded++;
      }
    } catch {
      // Will retry next pass
    }
  }

  await setMeta('last_sync', new Date().toISOString());
  const remaining = await getPendingOperations();

  await recordRecoveryEvent({
    event_type:            'SYNC_COMPLETED',
    records_affected:      pending.length,
    records_recovered:     succeeded,
    records_unrecoverable: failed,
    details:               { retried: pending.length, succeeded, failed },
    created_at:            new Date().toISOString(),
  });

  return { retried: pending.length, succeeded, failed, remaining: remaining.length };
}

/* ══════════════════════════════════════════════════════════════════
   BULK RECOVERY (for the Recover Available Data button)
══════════════════════════════════════════════════════════════════ */

export async function runFullRecovery(): Promise<RecoverySummary> {
  const timeline: TimelineEvent[] = [];
  const addEvent = (label: string, type: TimelineEvent['type']) =>
    timeline.push({ id: crypto.randomUUID(), timestamp: new Date().toISOString(), label, type });

  addEvent('Recovery started', 'warning');

  await recordRecoveryEvent({
    event_type:            'RECOVERY_STARTED',
    records_affected:      0,
    records_recovered:     0,
    records_unrecoverable: 0,
    details: {},
    created_at: new Date().toISOString(),
  });

  // Count demo records that need recovery
  let affected = 0, recovered = 0, fromCache = 0, unavailable = 0;

  try {
    const { data: demoRecords } = await supabase
      .from('blackout_demo_records')
      .select('*');

    if (demoRecords) {
      affected = demoRecords.length;
      addEvent(`${affected} records found`, 'normal');

      for (const rec of demoRecords as BlackoutDemoRecord[]) {
        if (rec.status === 'VERIFIED') {
          recovered++;
          continue;
        }

        // Try to recover from snapshots
        const result = await recoverAdvisory(rec.id!, rec.farmer_name);
        if (result.status === 'RECOVERED' || result.status === 'VERIFIED') {
          if (result.source === 'indexeddb') {
            fromCache++;
            addEvent(`Record ${rec.id?.slice(0, 8)} recovered from local cache`, 'recovery');
          } else {
            recovered++;
            addEvent(`Record ${rec.id?.slice(0, 8)} recovered from snapshot`, 'recovery');
          }
          // Update demo record status
          await supabase.from('blackout_demo_records')
            .update({ status: 'RECOVERED' as DataStatus })
            .eq('id', rec.id);
        } else {
          unavailable++;
          addEvent(`Record ${rec.id?.slice(0, 8)} could not be recovered`, 'error');
        }
      }
    }
  } catch (e) {
    // Supabase still down — try from IDB only
    const localAdvisories = await idbGetAll<{ id: string }>('advisories');
    fromCache = localAdvisories.length;
    addEvent(`${fromCache} records available from local cache`, 'recovery');
  }

  // Retry pending ops
  addEvent('Attempting to sync pending operations…', 'normal');
  const syncResult = await retryPendingOperations();
  if (syncResult.succeeded > 0) {
    addEvent(`${syncResult.succeeded} pending operations synchronised`, 'success');
  }

  const pending = await getPendingOperations();

  addEvent('Recovery complete', 'success');

  await recordRecoveryEvent({
    event_type:            'RECOVERY_COMPLETED',
    records_affected:      affected,
    records_recovered:     recovered + fromCache,
    records_unrecoverable: unavailable,
    details: { from_snapshot: recovered, from_cache: fromCache, pending_writes: pending.length },
    created_at: new Date().toISOString(),
  });

  const health = await getRecoveryStatus();

  return {
    recordsAffected:   affected || fromCache + unavailable,
    recordsRecovered:  recovered,
    recordsFromCache:  fromCache,
    recordsUnavailable: unavailable,
    pendingWrites:     pending.length,
    lastHealthySync:   health.lastSuccessfulSync,
    timeline,
  };
}

export { getRecoveryStatus, saveSnapshot, savePendingOperation };
