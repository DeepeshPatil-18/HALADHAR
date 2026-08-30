/**
 * SystemRecoveryPage — /system-recovery
 *
 * Developer / Judge panel for the HALADHAR Blackout demo.
 * All status values come from real backend API calls.
 * No hardcoded "Healthy" / "Unavailable" strings.
 */

import { RecoveryDashboard } from '../components/RecoveryDashboard';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Shield } from 'lucide-react';

export function SystemRecoveryPage() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100dvh',
      background: '#f4f6f0',
      paddingBottom: 40,
      fontFamily: 'system-ui, sans-serif',
    }}>
      {/* ── Sticky header ─────────────────────────────────────── */}
      <div style={{
        background: '#1a2e10', color: '#fff',
        padding: '14px 20px',
        display: 'flex', alignItems: 'center', gap: 12,
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 0, display: 'flex' }}
          aria-label="Back"
        >
          <ChevronLeft size={22} />
        </button>
        <Shield size={18} color="#81c784" />
        <div>
          <div style={{ fontWeight: 700, fontSize: 16, letterSpacing: 0.5 }}>SYSTEM RECOVERY</div>
          <div style={{ fontSize: 11, color: '#81c784', marginTop: 1 }}>
            HALADHAR Blackout Resilience — Developer / Judge Panel
          </div>
        </div>
        <div style={{
          marginLeft: 'auto',
          background: '#2e5f1e', border: '1px solid #4caf50',
          borderRadius: 20, padding: '3px 10px',
          fontSize: 11, fontWeight: 600, color: '#a5d6a7',
        }}>
          DEMO MODE
        </div>
      </div>

      {/* ── Safety notice ─────────────────────────────────────── */}
      <div style={{
        background: '#fff8e1', borderBottom: '1px solid #f9a825',
        padding: '10px 20px', fontSize: 12, color: '#7a5e00',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        ⚠ Simulation controls only affect <strong>blackout_demo_records</strong>.
        &nbsp;Real farmer production data is never modified.
      </div>

      {/* ── Main dashboard ────────────────────────────────────── */}
      <div style={{ padding: '20px 16px' }}>
        <RecoveryDashboard />
      </div>
    </div>
  );
}
