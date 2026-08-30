/**
 * HALADHAR Blackout Resilience — Type Definitions
 *
 * DETECT → PRESERVE → RECOVER → RECONCILE → CONTINUE
 */

/* ── Data integrity status ──────────────────────────────────────── */
export type DataStatus =
  | 'VERIFIED'    // Live Supabase record, checksum matches
  | 'RECOVERED'   // Restored from snapshot / local cache / event replay
  | 'PENDING'     // Queued locally, not yet synchronised to Supabase
  | 'UNAVAILABLE' // Could not be recovered from any source
  | 'CORRUPTED';  // Record exists but checksum mismatch

/* ── Operation types that can be queued ─────────────────────────── */
export type OperationType =
  | 'SAVE_ADVISORY'
  | 'SAVE_PROFILE'
  | 'SAVE_LANGUAGE'
  | 'SAVE_SNAPSHOT';

/* ── Operation queue entry (pending_operations table) ───────────── */
export interface PendingOperation {
  id?: string;
  operation_id: string;          // crypto.randomUUID() — NEVER changes on retry
  operation_type: OperationType;
  payload: Record<string, unknown>;
  created_at: string;
  retry_count: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

/* ── Advisory snapshot (advisory_snapshots table) ───────────────── */
export interface AdvisorySnapshot {
  id?: string;
  advisory_id: string;
  farmer_id: string;
  content: string;               // Full advisory text
  version: number;
  checksum: string;              // SHA-256 hex of content
  created_at: string;
}

/* ── Advisory event (advisory_events table) ─────────────────────── */
export interface AdvisoryEvent {
  id?: string;
  operation_id: string;
  advisory_id: string;
  farmer_id: string;
  event_type: 'CREATED' | 'UPDATED' | 'DELETED' | 'RECOVERED';
  payload: Record<string, unknown>;
  created_at: string;
}

/* ── Recovery log entry (recovery_log table) ────────────────────── */
export interface RecoveryLogEntry {
  id?: string;
  event_type: 'BLACKOUT_DETECTED' | 'RECOVERY_STARTED' | 'RECOVERY_COMPLETED' | 'SYNC_COMPLETED';
  records_affected: number;
  records_recovered: number;
  records_unrecoverable: number;
  details: Record<string, unknown>;
  created_at: string;
}

/* ── Blackout demo record (blackout_demo_records table) ─────────── */
export interface BlackoutDemoRecord {
  id?: string;
  farmer_name: string;
  crop: string;
  advisory: string;
  status: DataStatus;
  version: number;
  checksum: string;
  created_at?: string;
  updated_at?: string;
}

/* ── Recovery result returned to UI ─────────────────────────────── */
export interface RecoveryResult {
  status: DataStatus;
  source: 'supabase' | 'snapshot' | 'indexeddb' | 'events' | 'none';
  data?: unknown;
  message?: string;
  recoveredAt?: string;
}

/* ── System health for the dashboard ────────────────────────────── */
export interface SystemHealth {
  databaseHealthy: boolean;
  localCacheHealthy: boolean;
  pendingOperationsCount: number;
  lastSuccessfulSync: string | null;
  simulationActive: boolean;
}

/* ── Timeline event for the judge dashboard ─────────────────────── */
export interface TimelineEvent {
  id: string;
  timestamp: string;
  label: string;
  type: 'normal' | 'warning' | 'error' | 'recovery' | 'success';
}

/* ── Full recovery summary ───────────────────────────────────────── */
export interface RecoverySummary {
  recordsAffected: number;
  recordsRecovered: number;
  recordsFromCache: number;
  recordsUnavailable: number;
  pendingWrites: number;
  lastHealthySync: string | null;
  timeline: TimelineEvent[];
}
