/**
 * HaladharHeader — minimal page header used in secondary pages.
 * Replaces the old DashboardHeader for any pages not yet fully redesigned.
 */
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage, useSetLanguage } from '../contexts/LanguageContext';
import '../styles/haladhar-design.css';

interface Props {
  title?: string;
  onBack?: () => void;
  showLang?: boolean;
}

const LANGS: { code: 'en' | 'hi' | 'mr'; label: string }[] = [
  { code: 'mr', label: 'म' },
  { code: 'hi', label: 'हि' },
  { code: 'en', label: 'En' },
];

export function HaladharHeader({ title, onBack, showLang = true }: Props) {
  const navigate    = useNavigate();
  const language    = useLanguage();
  const setLanguage = useSetLanguage();

  const handleBack = onBack ?? (() => navigate(-1));

  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 40,
      backgroundColor: 'white',
      borderBottom: '1px solid var(--haladhar-border)',
      padding: '0 var(--space-md)',
      display: 'flex', alignItems: 'center',
      height: '56px', gap: 'var(--space-sm)',
    }}>
      <button
        onClick={handleBack}
        style={{ background: 'transparent', border: 'none', padding: 4, cursor: 'pointer', flexShrink: 0 }}
        aria-label="Back"
      >
        <ChevronLeft size={24} color="var(--haladhar-text-primary)" />
      </button>

      <span style={{
        flex: 1, fontWeight: 600, fontSize: 'var(--text-lg)',
        color: 'var(--haladhar-text-primary)', overflow: 'hidden',
        textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>
        {title ?? 'KrishiMitra'}
      </span>

      {showLang && (
        <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
          {LANGS.map(l => (
            <button
              key={l.code}
              onClick={() => setLanguage(l.code)}
              style={{
                padding: '4px 8px',
                borderRadius: 'var(--radius-sm)',
                border: `1px solid ${l.code === language ? 'var(--haladhar-green)' : 'var(--haladhar-border)'}`,
                background: l.code === language ? 'var(--haladhar-green)' : 'transparent',
                color:  l.code === language ? 'white' : 'var(--haladhar-text-muted)',
                fontSize: 'var(--text-xs)', fontWeight: 600, cursor: 'pointer',
                minHeight: 28, minWidth: 28,
              }}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
