/**
 * BlackoutContext — Blackout simulation state.
 *
 * blackoutMode = true  → advisory saves go to IDB + blackout_demo_records
 * blackoutMode = false → normal operation
 *
 * When Supabase is not configured (placeholder creds) the entire
 * flow works from IndexedDB only — no network errors thrown.
 */

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { idbGetAll, idbPut } from '../lib/indexedDb';
import { checksumAsync } from '../lib/integrity';

/* ── Pending op shape stored in IDB ─────────────────────────────── */
export interface PendingOp {
  id: string;            // operationId (IDB keyPath)
  displayId: string;     // e.g. "TEMP-0001"
  farmerId: string;
  advisoryId: string;
  content: string;
  question: string;
  language: string;
  checksum: string;
  createdAt: string;
  status: 'pending' | 'recovered' | 'failed';
}

interface BlackoutContextValue {
  blackoutMode: boolean;
  pendingOps: PendingOp[];
  recoveredCount: number;
  activateBlackout: () => void;
  deactivateBlackout: () => Promise<void>;
  addPendingOp: (op: PendingOp) => Promise<void>;
  refreshPending: () => Promise<void>;
  nextDisplayId: () => string;
}

const BlackoutContext = createContext<BlackoutContextValue | undefined>(undefined);

export function BlackoutProvider({ children }: { children: ReactNode }) {
  // Check environment variable to force normal mode
  const forceNormalMode = import.meta.env.VITE_FORCE_NORMAL_MODE === 'true';
  
  const [blackoutMode,   setBlackoutMode]   = useState(forceNormalMode ? false : false); // Always start in normal mode
  const [pendingOps,     setPendingOps]     = useState<PendingOp[]>([]);
  const [recoveredCount, setRecoveredCount] = useState(0);
  const [opCounter,      setOpCounter]      = useState(1);

  /* ── Sequential display ID ───────────────────────────────────── */
  const nextDisplayId = useCallback(() => {
    const id = `TEMP-${String(opCounter).padStart(4, '0')}`;
    setOpCounter(c => c + 1);
    return id;
  }, [opCounter]);

  /* ── Load pending ops from IDB ───────────────────────────────── */
  const refreshPending = useCallback(async () => {
    const all = await idbGetAll<PendingOp>('pendingOps');
    setPendingOps(all.filter(op => op.status === 'pending'));
  }, []);

  /* ── Add an op to IDB queue ──────────────────────────────────── */
  const addPendingOp = useCallback(async (op: PendingOp) => {
    await idbPut('pendingOps', op);
    setPendingOps(prev => [...prev.filter(p => p.id !== op.id), op]);
  }, []);

  /* ── Activate blackout ───────────────────────────────────────── */
  const activateBlackout = useCallback(() => {
    // Don't allow blackout activation if force normal mode is enabled
    if (forceNormalMode) {
      console.info('[Blackout] Activation blocked - force normal mode enabled');
      return;
    }
    setBlackoutMode(true);
    console.info('[Blackout] Activated — advisory saves redirected to recovery storage');
  }, [forceNormalMode]);

  /* ── Deactivate + replay pending ops ────────────────────────── */
  const deactivateBlackout = useCallback(async () => {
    setBlackoutMode(false);
    console.info('[Blackout] Deactivated — replaying pending ops');

    const all = await idbGetAll<PendingOp>('pendingOps');
    const toReplay = all.filter(op => op.status === 'pending');
    let replayed = 0;

    for (const op of toReplay) {
      try {
        if (!isSupabaseConfigured) {
          // No real Supabase — mark recovered locally for demo purposes
          await idbPut('pendingOps', { ...op, status: 'recovered' });
          replayed++;
          console.info('[Blackout] Demo mode: marked recovered locally:', op.displayId);
          continue;
        }

        // Idempotency check — skip if already in advisory_events
        const { data: existing } = await supabase
          .from('advisory_events')
          .select('id')
          .eq('operation_id', op.id)
          .limit(1);

        if (existing && existing.length > 0) {
          await idbPut('pendingOps', { ...op, status: 'recovered' });
          replayed++;
          continue;
        }

        // Write to advisory_events
        const { error: evtErr } = await supabase.from('advisory_events').insert({
          operation_id: op.id,
          advisory_id:  op.advisoryId,
          farmer_id:    op.farmerId,
          event_type:   'CREATED',
          payload: {
            content:    op.content,
            question:   op.question,
            language:   op.language,
            checksum:   op.checksum,
            display_id: op.displayId,
          },
          created_at: op.createdAt,
        });
        if (evtErr) throw evtErr;

        // Snapshot
        const checksum = op.checksum || await checksumAsync(op.content);
        await supabase.from('advisory_snapshots').insert({
          advisory_id: op.advisoryId,
          farmer_id:   op.farmerId,
          content:     op.content,
          version:     1,
          checksum,
          created_at:  op.createdAt,
        });

        // Update demo record to VERIFIED
        await supabase.from('blackout_demo_records').upsert({
          id:          op.advisoryId,
          farmer_name: op.farmerId,
          crop:        op.question.slice(0, 80),
          advisory:    op.content.slice(0, 500),
          status:      'VERIFIED',
          version:     1,
          checksum,
          updated_at:  new Date().toISOString(),
        }, { onConflict: 'id' });

        await idbPut('pendingOps', { ...op, status: 'recovered' });
        replayed++;
        console.info('[Blackout] Replayed to Supabase:', op.displayId);

      } catch (err) {
        console.error('[Blackout] Replay failed for', op.displayId, err);
        await idbPut('pendingOps', { ...op, status: 'failed' });
      }
    }

    setRecoveredCount(c => c + replayed);
    await refreshPending();
  }, [refreshPending]);

  return (
    <BlackoutContext.Provider value={{
      blackoutMode,
      pendingOps,
      recoveredCount,
      activateBlackout,
      deactivateBlackout,
      addPendingOp,
      refreshPending,
      nextDisplayId,
    }}>
      {children}
    </BlackoutContext.Provider>
  );
}

export function useBlackout() {
  const ctx = useContext(BlackoutContext);
  if (!ctx) throw new Error('useBlackout must be used within BlackoutProvider');
  return ctx;
}
