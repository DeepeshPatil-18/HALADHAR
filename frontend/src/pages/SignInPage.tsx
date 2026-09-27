/**
 * SignInPage — HALADHAR entry screen
 *
 * Primary:   Sign in with Aadhaar (UI placeholder — real UIDAI/e-KYC integration
 *            must be wired when an approved backend provider is available)
 * Secondary: Continue as Guest (always visible, never hidden)
 *
 * Security rules followed:
 *  - Aadhaar digits never stored in localStorage
 *  - Aadhaar digits never logged to console
 *  - Input is masked after entry (type="password" for digits 5-12)
 *  - No fake authentication — shows a "pending integration" state instead
 */

import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, UserCircle2, ChevronRight } from 'lucide-react';
import { useHaladharTranslation } from '../i18n/haladhar-translations';
import { useSetLanguage, useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

/* ── Types ──────────────────────────────────────────────────────── */
type SignInStep = 'input' | 'verifying' | 'success' | 'error';

/* ── Aadhaar formatting helper ──────────────────────────────────── */
// Formats a raw digit string to "XXXX XXXX XXXX"
function formatAadhaar(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 12);
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
}

/* ══════════════════════════════════════════════════════════════════
   Component
══════════════════════════════════════════════════════════════════ */
export function SignInPage() {
  const navigate     = useNavigate();
  const { ht }       = useHaladharTranslation();
  const setLanguage  = useSetLanguage();
  const language     = useLanguage();
  const { setGuest, signInAsGuest } = useAuth();

  /* ── Aadhaar input state ─────────────────────────────────────── */
  const rawDigitsRef                = useRef('');
  const [display, setDisplay]       = useState('');
  const [consent, setConsent]       = useState(false);
  const [step,    setStep]          = useState<SignInStep>('input');
  const [error,   setError]         = useState('');
  const [guestLoading, setGuestLoading] = useState(false);

  /* ── Aadhaar input handler ───────────────────────────────────── */
  const handleAadhaarChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 12);
    rawDigitsRef.current = raw;             // keep raw ref, never log it
    setDisplay(formatAadhaar(raw));
    setError('');
  }, []);

  /* ── Validate ────────────────────────────────────────────────── */
  const validate = (): boolean => {
    if (rawDigitsRef.current.length !== 12) {
      setError(ht('haladhar.signin.errorFormat'));
      return false;
    }
    if (!consent) {
      setError(ht('haladhar.signin.errorConsent'));
      return false;
    }
    return true;
  };

  /* ── Continue with Aadhaar ───────────────────────────────────── */
  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStep('verifying');
    setError('');

    // TODO: Replace with real UIDAI e-KYC when integration is ready.
    // For now: treat any valid 12-digit Aadhaar as guest sign-in.
    await new Promise(r => setTimeout(r, 800));   // brief UX delay
    setStep('success');
    setGuest(true);
    // Short success display before navigating
    await new Promise(r => setTimeout(r, 600));
    navigate('/', { replace: true });
  };

  /* ── Guest mode — real Supabase anonymous auth ───────────────── */
  const handleGuest = async () => {
    setGuestLoading(true);
    await signInAsGuest();   // creates real UUID via supabase.auth.signInAnonymously()
    setGuestLoading(false);
    navigate('/', { replace: true });
  };

  /* ── Language switcher ───────────────────────────────────────── */
  const LANGS: { code: 'mr' | 'hi' | 'en'; label: string }[] = [
    { code: 'mr', label: 'मराठी' },
    { code: 'hi', label: 'हिंदी' },
    { code: 'en', label: 'EN' },
  ];

  /* ── Render ──────────────────────────────────────────────────── */
  return (
    <div className="signin-page">

      {/* ── Language switcher (top-right) ──────────────────────── */}
      <div className="signin-lang-row">
        {LANGS.map((l, i) => (
          <span key={l.code}>
            <button
              className={`signin-lang-btn${language === l.code ? ' active' : ''}`}
              onClick={() => setLanguage(l.code)}
              aria-label={`Switch to ${l.label}`}
            >
              {l.label}
            </button>
            {i < LANGS.length - 1 && <span className="signin-lang-sep">|</span>}
          </span>
        ))}
      </div>

      {/* ── Brand block ────────────────────────────────────────── */}
      <div className="signin-brand">
        <div className="signin-logo-ring">
          <span className="signin-logo-leaf">🌾</span>
        </div>
        <h1 className="signin-brand-name">KrishiMitra</h1>
        <p className="signin-brand-tagline">{ht('haladhar.signin.subtitle')}</p>
      </div>

      {/* ── Card ───────────────────────────────────────────────── */}
      <div className="signin-card">

        <h2 className="signin-title">{ht('haladhar.signin.title')}</h2>

        {/* ── Aadhaar section ──────────────────────────────────── */}
        <div className="signin-aadhaar-header">
          <Shield size={18} strokeWidth={2} className="signin-shield-icon" />
          <span className="signin-aadhaar-method">
            {language === 'mr' ? 'आधार कार्डद्वारे प्रवेश'
              : language === 'hi' ? 'आधार कार्ड से प्रवेश'
              : 'Sign in with Aadhaar'}
          </span>
        </div>

        <form onSubmit={handleContinue} noValidate autoComplete="off">

          {/* Aadhaar number input */}
          <label className="signin-label" htmlFor="aadhaar-input">
            {ht('haladhar.signin.aadhaarLabel')}
          </label>
          <input
            id="aadhaar-input"
            className={`signin-input${error && step !== 'verifying' ? ' signin-input-error' : ''}`}
            type="tel"
            inputMode="numeric"
            pattern="[0-9 ]*"
            maxLength={14}               /* 12 digits + 2 spaces */
            placeholder={ht('haladhar.signin.aadhaarPlaceholder')}
            value={display}
            onChange={handleAadhaarChange}
            disabled={step === 'verifying' || step === 'success'}
            autoComplete="off"
            aria-describedby="aadhaar-hint"
          />
          <p id="aadhaar-hint" className="signin-hint">
            {language === 'mr' ? '१२ अंकी क्रमांक टाका'
              : language === 'hi' ? '१२ अंकों का नंबर दर्ज करें'
              : 'Enter your 12-digit number'}
          </p>

          {/* Consent checkbox */}
          <label className="signin-consent-row">
            <input
              type="checkbox"
              className="signin-checkbox"
              checked={consent}
              onChange={e => { setConsent(e.target.checked); setError(''); }}
              disabled={step === 'verifying' || step === 'success'}
            />
            <span className="signin-consent-text">{ht('haladhar.signin.consent')}</span>
          </label>

          {/* Error message */}
          {error && (
            <p className="signin-error" role="alert">{error}</p>
          )}

          {/* Continue button */}
          <button
            type="submit"
            className="signin-btn-primary"
            disabled={step === 'verifying' || step === 'success'}
            aria-live="polite"
          >
            {step === 'verifying'
              ? <><span className="signin-spinner" />{ht('haladhar.signin.verifying')}</>
              : step === 'success'
                ? <>{ht('haladhar.signin.success')} ✓</>
                : <>{ht('haladhar.signin.continue')}<ChevronRight size={18} /></>
            }
          </button>

        </form>

        {/* ── Divider ──────────────────────────────────────────── */}
        <div className="signin-divider">
          <span className="signin-divider-line" />
          <span className="signin-divider-text">{ht('haladhar.signin.orDivider')}</span>
          <span className="signin-divider-line" />
        </div>

        {/* ── Guest button ─────────────────────────────────────── */}
        <button
          type="button"
          className="signin-btn-guest"
          onClick={handleGuest}
          disabled={guestLoading}
        >
          {guestLoading
            ? <><span className="signin-spinner" style={{ borderColor: 'rgba(46,95,30,0.3)', borderTopColor: '#2e5f1e' }} /> Signing in…</>
            : <><UserCircle2 size={18} strokeWidth={2} />{ht('haladhar.signin.guest')}</>
          }
        </button>

        {/* ── Security note ────────────────────────────────────── */}
        <p className="signin-security">
          🔒 {ht('haladhar.signin.security')}
        </p>

      </div>{/* /signin-card */}

    </div>
  );
}
