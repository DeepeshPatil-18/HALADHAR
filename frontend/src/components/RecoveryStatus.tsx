/**
 * RecoveryStatus — small inline badge shown to farmers when the system
 * is not in its normal VERIFIED state.
 *
 * Rules:
 *  - VERIFIED   → show nothing (normal operation, no noise)
 *  - PENDING    → 🟡 Recovery mode
 *  - RECOVERED  → show "Showing last verified information"
 *  - UNAVAILABLE→ ⚠ This information could not be verified.
 *  - CORRUPTED  → ⚠ This information could not be verified.
 *
 * Never shows Supabase errors, stack traces, or HTTP codes to farmers.
 */

import type { DataStatus } from '../types/recovery';

interface Props {
  status: DataStatus;
  /** Compact mode for inline use; default = full card */
  compact?: boolean;
  language?: 'mr' | 'hi' | 'en';
}

const LABELS: Record<DataStatus, Record<'mr' | 'hi' | 'en', string>> = {
  VERIFIED:    { mr: '',   hi: '',   en: '' },
  PENDING:     {
    mr: '🟡 रिकव्हरी मोड — माहिती स्थानिक साठवली आहे',
    hi: '🟡 रिकवरी मोड — जानकारी स्थानीय रूप से सहेजी गई है',
    en: '🟡 Recovery mode — data saved locally',
  },
  RECOVERED:   {
    mr: '📋 शेवटची सत्यापित माहिती दाखवत आहे',
    hi: '📋 अंतिम सत्यापित जानकारी दिखा रहे हैं',
    en: '📋 Showing last verified information',
  },
  UNAVAILABLE: {
    mr: '⚠ ही माहिती सत्यापित करता आली नाही.',
    hi: '⚠ यह जानकारी सत्यापित नहीं की जा सकी।',
    en: '⚠ This information could not be verified.',
  },
  CORRUPTED: {
    mr: '⚠ ही माहिती सत्यापित करता आली नाही.',
    hi: '⚠ यह जानकारी सत्यापित नहीं की जा सकी।',
    en: '⚠ This information could not be verified.',
  },
};

const BG: Record<DataStatus, string> = {
  VERIFIED:    'transparent',
  PENDING:     '#fffbe6',
  RECOVERED:   '#e8f5e9',
  UNAVAILABLE: '#fff3e0',
  CORRUPTED:   '#fff3e0',
};

const BORDER: Record<DataStatus, string> = {
  VERIFIED:    'none',
  PENDING:     '1px solid #f9a825',
  RECOVERED:   '1px solid #81c784',
  UNAVAILABLE: '1px solid #ff9800',
  CORRUPTED:   '1px solid #ff9800',
};

export function RecoveryStatus({ status, compact = false, language = 'mr' }: Props) {
  const label = LABELS[status][language];
  if (!label) return null;   // VERIFIED — render nothing

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        background: BG[status],
        border: BORDER[status],
        borderRadius: compact ? 6 : 10,
        padding: compact ? '4px 10px' : '8px 14px',
        fontSize: compact ? 12 : 13,
        color: '#4a3c00',
        fontWeight: 500,
        marginBottom: compact ? 0 : 8,
        display: 'inline-block',
      }}
    >
      {label}
    </div>
  );
}
