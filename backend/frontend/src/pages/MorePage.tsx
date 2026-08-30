import { useNavigate } from 'react-router-dom';
import {
  User, Globe, Phone, Info, HelpCircle, ChevronRight,
  Home, Tractor, LayoutGrid, MoreHorizontal, LogOut,
} from 'lucide-react';
import { useLanguage, useSetLanguage } from '../contexts/LanguageContext';
import { useHaladharTranslation } from '../i18n/haladhar-translations';
import { useAuth } from '../contexts/AuthContext';
import '../styles/haladhar-design.css';

const LANGUAGES: { code: 'en' | 'hi' | 'mr'; label: string }[] = [
  { code: 'mr', label: 'मराठी' },
  { code: 'hi', label: 'हिंदी' },
  { code: 'en', label: 'English' },
];

export function MorePage() {
  const navigate    = useNavigate();
  const { ht }      = useHaladharTranslation();
  const language    = useLanguage();
  const setLanguage = useSetLanguage();
  const { user, isGuest, signOut, setGuest } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    setGuest(false);
    navigate('/signin', { replace: true });
  };

  return (
    <div className="haladhar-container">
      <main className="haladhar-page">

        <h1 className="haladhar-heading" style={{ marginBottom: 'var(--space-lg)' }}>
          {ht('haladhar.nav.more')}
        </h1>

        {/* ── SETTINGS ────────────────────────────────────────── */}
        <p className="hm-section-label" style={{ padding: '0 0 8px 0' }}>Settings</p>

        {/* Language switcher */}
        <div className="haladhar-card" style={{ marginBottom: 'var(--space-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
            <Globe size={18} color="var(--haladhar-green)" />
            <p style={{ fontWeight: 600, fontSize: 'var(--text-base)', margin: 0 }}>
              {ht('haladhar.profile.changeLanguage')}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
            {LANGUAGES.map(l => (
              <button
                key={l.code}
                onClick={() => setLanguage(l.code)}
                style={{
                  flex: 1,
                  padding: '10px 4px',
                  borderRadius: 'var(--radius-md)',
                  border: `1.5px solid ${l.code === language ? 'var(--haladhar-green)' : 'var(--haladhar-border)'}`,
                  background: l.code === language ? 'var(--haladhar-green)' : 'white',
                  color: l.code === language ? 'white' : 'var(--haladhar-text-secondary)',
                  fontWeight: 600,
                  fontSize: 'var(--text-sm)',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  minHeight: '44px',
                }}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* Profile */}
        <button
          className="haladhar-service-box"
          onClick={() => navigate('/profile')}
          style={{ marginBottom: 'var(--space-sm)' }}
        >
          <div className="haladhar-service-icon"><User size={22} strokeWidth={2} /></div>
          <span className="haladhar-service-title" style={{ flex: 1, textAlign: 'left' }}>
            {ht('haladhar.profile.title')}
          </span>
          <ChevronRight size={18} color="var(--haladhar-text-muted)" />
        </button>

        {/* ── HELP ────────────────────────────────────────────── */}
        <p className="hm-section-label" style={{ padding: '12px 0 8px 0' }}>Help</p>

        <button
          className="haladhar-service-box"
          onClick={() => navigate('/ai', { state: { initialQuery: ht('haladhar.help.faq'), mode: 'text' } })}
          style={{ marginBottom: 'var(--space-sm)' }}
        >
          <div className="haladhar-service-icon"><HelpCircle size={22} strokeWidth={2} /></div>
          <span className="haladhar-service-title" style={{ flex: 1, textAlign: 'left' }}>
            {ht('haladhar.help.faq')}
          </span>
          <ChevronRight size={18} color="var(--haladhar-text-muted)" />
        </button>

        <a
          href="tel:1800-180-1551"
          className="haladhar-service-box"
          style={{ textDecoration: 'none', marginBottom: 'var(--space-sm)' }}
        >
          <div className="haladhar-service-icon"><Phone size={22} strokeWidth={2} /></div>
          <div className="haladhar-service-content">
            <p className="haladhar-service-title">{ht('haladhar.help.contact')}</p>
            <p className="haladhar-service-desc">1800-180-1551</p>
          </div>
          <ChevronRight size={18} color="var(--haladhar-text-muted)" />
        </a>

        <button
          className="haladhar-service-box"
          onClick={() => navigate('/about')}
        >
          <div className="haladhar-service-icon"><Info size={22} strokeWidth={2} /></div>
          <span className="haladhar-service-title" style={{ flex: 1, textAlign: 'left' }}>
            {ht('haladhar.help.about')}
          </span>
          <ChevronRight size={18} color="var(--haladhar-text-muted)" />
        </button>

        {/* Version footer */}
        <div style={{ marginTop: 'var(--space-2xl)', textAlign: 'center' }}>
          {/* Guest mode badge */}
          {isGuest && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: '#fff8e1', border: '1px solid #f9a825',
              borderRadius: 20, padding: '4px 12px',
              fontSize: 12, color: '#7a5e00', fontWeight: 600,
              marginBottom: 12,
            }}>
              👤 {ht('haladhar.signin.guestBadge')}
            </div>
          )}

          {/* Sign out / sign in link */}
          <button
            onClick={handleSignOut}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'none', border: '1.5px solid #e0e0e0',
              borderRadius: 10, padding: '12px 20px',
              cursor: 'pointer', color: '#c0392b', fontWeight: 600,
              fontSize: 14, width: '100%', justifyContent: 'center',
              marginBottom: 'var(--space-lg)',
            }}
          >
            <LogOut size={16} strokeWidth={2} />
            {isGuest
              ? (language === 'mr' ? 'साइन इन करा' : language === 'hi' ? 'साइन इन करें' : 'Sign In')
              : (user
                  ? (language === 'mr' ? 'बाहेर पडा' : language === 'hi' ? 'बाहर निकलें' : 'Sign Out')
                  : (language === 'mr' ? 'साइन इन करा' : language === 'hi' ? 'साइन इन करें' : 'Sign In'))
            }
          </button>

          <p className="haladhar-brand" style={{ fontSize: 'var(--text-lg)' }}>
            {ht('haladhar.brand')}
          </p>
          <p className="haladhar-caption" style={{ marginTop: 4 }}>
            {ht('haladhar.tagline')}
          </p>
        </div>
      </main>

      {/* Bottom nav — More active */}
      <nav className="haladhar-bottom-nav">
        <button className="haladhar-nav-item" onClick={() => navigate('/')}>
          <Home size={24} strokeWidth={2} /><span>{ht('haladhar.nav.home')}</span>
        </button>
        <button className="haladhar-nav-item" onClick={() => navigate('/farm')}>
          <Tractor size={24} strokeWidth={2} /><span>{ht('haladhar.nav.myFarm')}</span>
        </button>
        <button className="haladhar-nav-item" onClick={() => navigate('/services')}>
          <LayoutGrid size={24} strokeWidth={2} /><span>{ht('haladhar.nav.services')}</span>
        </button>
        <button className="haladhar-nav-item active" onClick={() => navigate('/more')}>
          <MoreHorizontal size={24} strokeWidth={2} /><span>{ht('haladhar.nav.more')}</span>
        </button>
      </nav>
    </div>
  );
}
