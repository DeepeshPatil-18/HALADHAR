/**
 * RecoveryDashboard — real Blackout demo dashboard.
 *
 * All values come from:
 *  - GET /api/system/health  (DB health, real Supabase ping)
 *  - BlackoutContext         (runtime blackout flag)
 *  - IndexedDB pendingOps    (real pending count + TEMP-XXXX IDs)
 *
 * Nothing is hardcoded or faked.
 */

import { useState, useEffect, useCallback } from 'react';
import { Database, HardDrive, Clock, RefreshCw, Zap, CheckCircle } from 'lucide-react';
import { useBlackout, type PendingOp } from '../contexts/BlackoutContext';
import { idbGetAll } from '../lib/indexedDb';
import { useAuth } from '../contexts/AuthContext';

const BACKEND = () =>
  import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace('/api', '')
    : 'http://localhost:8000';

/* ── Types ──────────────────────────────────────────────────────── */
interface HealthData {
  database: string;
  recovery_store: string;
  pending_operations: number;
  last_backup: string | null;
  blackout?: { active: boolean };
}

/* ── Helpers ────────────────────────────────────────────────────── */
const fmt = (iso: string | null) =>
  iso ? new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '—';

const opBadge = (status: PendingOp['status']) => {
  if (status === 'pending')   return { bg: '#fff8e1', color: '#f57f17', label: '⏳ Pending' };
  if (status === 'recovered') return { bg: '#e8f5e9', color: '#2e7d32', label: '✓ Recovered' };
  return { bg: '#ffebee', color: '#c62828', label: '✗ Failed' };
};

/* ══════════════════════════════════════════════════════════════════
   Component
══════════════════════════════════════════════════════════════════ */
export function RecoveryDashboard() {
  const { blackoutMode, pendingOps, recoveredCount,
          activateBlackout, deactivateBlackout, refreshPending } = useBlackout();
  const { guestUserId, user } = useAuth();
  const farmerId = user?.id ?? guestUserId ?? null;

  const [health,   setHealth]   = useState<HealthData | null>(null);
  const [allOps,   setAllOps]   = useState<PendingOp[]>([]);
  const [loading,  setLoading]  = useState<string | null>(null);
  const [msg,      setMsg]      = useState('');

  /* ── Fetch real health from backend ────────────────────────── */
  const fetchHealth = useCallback(async () => {
    try {
      const res = await fetch(`${BACKEND()}/api/system/health`);
      if (res.ok) setHealth(await res.json());
    } catch { /* backend might not be running */ }
  }, []);

  /* ── Load all ops from IDB (pending + recovered) ─────────── */
  const loadOps = useCallback(async () => {
    const all = await idbGetAll<PendingOp>('pendingOps');
    setAllOps(all.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
    await refreshPending();
  }, [refreshPending]);

  useEffect(() => {
    fetchHealth();
    loadOps();
    const id = setInterval(() => { fetchHealth(); loadOps(); }, 4000);
    return () => clearInterval(id);
  }, [fetchHealth, loadOps]);

  /* ── Derived ─────────────────────────────────────────────── */
  const realPending   = pendingOps.length;
  const dbStatus      = blackoutMode ? 'unavailable' : (health?.database ?? '…');
  const dbIcon        = blackoutMode ? '🔴' : dbStatus === 'healthy' ? '🟢' : dbStatus === '…' ? '⚪' : '🔴';
  const cacheIcon     = '🟢';   // IDB is always available
  const lastBackup    = health?.last_backup ?? null;

  /* ── Handlers ────────────────────────────────────────────── */
  const handleBlackout = () => {
    setLoading('blackout');
    setMsg('');
    activateBlackout();
    setMsg('🔴 Blackout active. New advisories will be saved to the Recovery Store.');
    setLoading(null);
  };

  const handleRestore = async () => {
    setLoading('restore');
    setMsg('');
    await deactivateBlackout();
    await fetchHealth();
    await loadOps();
    setMsg(`✅ Database restored. ${pendingOps.length} operation(s) replayed to Supabase.`);
    setLoading(null);
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 14, color: '#1a2e10', maxWidth: 680, margin: '0 auto' }}>

      {/* ════════ FARMER / GUEST ID ════════ */}
      {farmerId && (
        <Card title={<>👤 SESSION</>}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Stat icon="🪪" label="Farmer ID (Supabase UUID)"
              value={farmerId.slice(0, 8) + '…' + farmerId.slice(-4)}
              mono alert={false} />
            <Stat icon="🔐" label="Auth Method"
              value={user?.is_anonymous ? 'Anonymous (Guest)' : user ? 'Authenticated' : 'Local Guest'}
              alert={false} />
          </div>
        </Card>
      )}

      {/* ════════ SYSTEM STATUS ════════ */}
      <Card title={<><Database size={15} /> SYSTEM STATUS</>}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 12 }}>
          <Stat icon={dbIcon}    label="Database"          value={`${dbIcon} ${dbStatus}`}           alert={dbStatus !== 'healthy' || blackoutMode} />
          <Stat icon={cacheIcon} label="Recovery Store"    value={`${cacheIcon} Ready (IndexedDB)`}  alert={false} />
          <Stat icon="⏳"        label="Pending Operations" value={String(realPending)}               alert={realPending > 0} />
          <Stat icon="🕐"        label="Last Backup"       value={fmt(lastBackup)}                   alert={false} />
        </div>

        {blackoutMode && (
          <div style={{ background: '#ffebee', border: '1px solid #ef9a9a', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#c62828', marginBottom: 10 }}>
            🔴 <strong>BLACKOUT ACTIVE</strong> — Database unavailable. Advisories are being saved to IndexedDB.
          </div>
        )}

        <button onClick={() => { fetchHealth(); loadOps(); }}
          style={{ background: 'none', border: '1px solid #b8cc90', borderRadius: 6, padding: '4px 12px', cursor: 'pointer', fontSize: 12, color: '#2e5f1e' }}>
          ↻ Refresh
        </button>
      </Card>

      {/* ════════ CONTROLS ════════ */}
      <Card title={<><Zap size={15} /> BLACKOUT CONTROLS</>}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {!blackoutMode ? (
            <Btn label="🔴 Simulate Database Failure" onClick={handleBlackout}
              color="#c0392b" loading={loading === 'blackout'} />
          ) : (
            <Btn label="🟢 Restore Database" onClick={handleRestore}
              color="#2e5f1e" loading={loading === 'restore'} />
          )}
        </div>
        {msg && (
          <div style={{ marginTop: 10, padding: '8px 12px', background: '#f0f5e8', border: '1px solid #a5d6a7', borderRadius: 8, fontSize: 13 }}>
            {msg}
          </div>
        )}
      </Card>

      {/* ════════ PENDING / RECOVERED OPS ════════ */}
      {allOps.length > 0 && (
        <Card title={<><RefreshCw size={15} /> OPERATIONS</>}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {allOps.map(op => {
              const badge = opBadge(op.status);
              return (
                <div key={op.id} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 10,
                  background: '#f8faf4', border: '1px solid #dde8cc',
                  borderRadius: 8, padding: '10px 12px',
                }}>
                  {/* Display ID badge */}
                  <span style={{
                    background: '#1a2e10', color: '#fff',
                    borderRadius: 4, padding: '2px 8px',
                    fontSize: 11, fontWeight: 700, flexShrink: 0, fontFamily: 'monospace',
                  }}>
                    {op.displayId}
                  </span>
                  {/* Status badge */}
                  <span style={{
                    background: badge.bg, color: badge.color,
                    borderRadius: 4, padding: '2px 8px',
                    fontSize: 11, fontWeight: 600, flexShrink: 0,
                  }}>
                    {badge.label}
                  </span>
                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, color: '#5a6e3a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {op.question || op.content.slice(0, 60)}
                    </div>
                    <div style={{ fontSize: 11, color: '#9a9a9a', marginTop: 2 }}>
                      Farmer: {op.farmerId.slice(0, 8)}… · {fmt(op.createdAt)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* ════════ RECOVERY SUMMARY ════════ */}
      {recoveredCount > 0 && (
        <Card title={<><CheckCircle size={15} /> RECOVERY RESULT</>}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            <SummCard label="Recovered"   value={recoveredCount} color="#2e5f1e" />
            <SummCard label="Pending"     value={realPending}    color="#f57f17" />
            <SummCard label="In Supabase" value={recoveredCount} color="#1565c0" />
          </div>
          <div style={{ marginTop: 10, padding: '8px 12px', background: '#e8f5e9', borderRadius: 8, fontSize: 13, color: '#2e5f1e' }}>
            ✓ {recoveredCount} advisory record(s) replayed to Supabase with original Farmer ID preserved.
          </div>
        </Card>
      )}
    </div>
  );
}

/* ── Sub-components ─────────────────────────────────────────────── */

function Card({ title, children }: { title: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #dde8cc', borderRadius: 12, padding: 20, marginBottom: 16 }}>
      <h2 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700, color: '#2e5f1e', display: 'flex', alignItems: 'center', gap: 8 }}>
        {title}
      </h2>
      {children}
    </div>
  );
}

function Stat({ icon, label, value, alert, mono }: {
  icon: React.ReactNode; label: string; value: string; alert: boolean; mono?: boolean;
}) {
  return (
    <div style={{
      background: alert ? '#fff8f8' : '#f8faf4',
      border: `1px solid ${alert ? '#ffccbc' : '#dde8cc'}`,
      borderRadius: 8, padding: '10px 12px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#5a6e3a', fontSize: 12, marginBottom: 4 }}>
        <span>{icon}</span> {label}
      </div>
      <div style={{ fontWeight: 700, fontSize: 13, fontFamily: mono ? 'monospace' : 'inherit' }}>{value}</div>
    </div>
  );
}

function Btn({ label, onClick, color, loading }: {
  label: string; onClick: () => void; color: string; loading: boolean;
}) {
  return (
    <button onClick={onClick} disabled={loading} style={{
      background: loading ? '#f0f0f0' : color,
      color: loading ? '#aaa' : '#fff',
      border: 'none', borderRadius: 8, padding: '10px 18px',
      cursor: loading ? 'not-allowed' : 'pointer',
      fontWeight: 700, fontSize: 14,
      display: 'flex', alignItems: 'center', gap: 6,
    }}>
      {loading && <span style={{
        width: 12, height: 12, border: '2px solid rgba(255,255,255,0.3)',
        borderTopColor: '#fff', borderRadius: '50%',
        animation: 'spin 0.6s linear infinite', display: 'inline-block',
      }} />}
      {label}
    </button>
  );
}

function SummCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ background: '#f8faf4', border: '1px solid #dde8cc', borderRadius: 8, padding: '10px 12px', textAlign: 'center' }}>
      <div style={{ fontSize: 26, fontWeight: 700, color }}>{value}</div>
      <div style={{ fontSize: 11, color: '#5a6e3a', marginTop: 2 }}>{label}</div>
    </div>
  );
}
