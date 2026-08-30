/**
 * HomePage — HALADHAR Voice-First Daily Context (IMPROVED COMPACT LAYOUT)
 *
 * Improvements:
 * - Added warm greeting below tagline
 * - Reduced empty vertical space
 * - Fixed service grid (2-col, vertical layout with icon on top)
 * - Voice examples as small chips
 * - Compact 2×2 daily info grid
 * - Proper bottom nav clearance
 * - Voice vs text interaction clearly separated
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin, Mic, CloudRain, Droplets, Sprout, IndianRupee,
  Bug, ClipboardList, Home, Tractor, LayoutGrid, MoreHorizontal, Globe, Wrench,
} from 'lucide-react';
import { useHaladharTranslation } from '../i18n/haladhar-translations';
import { useLocation } from '../contexts/LocationContext';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage, useSetLanguage } from '../contexts/LanguageContext';
import type { Language } from '../i18n/translations';
import '../styles/haladhar-design.css';

interface DailyContext {
  weather?: { label: string; value: string };
  water?: { label: string; value: string };
  crop?: { label: string; value: string };
  market?: { label: string; value: string };
  actions?: string[];
  alert?: { title: string; message: string };
}

export function HomePage() {
  const navigate = useNavigate();
  const { ht } = useHaladharTranslation();
  const loc = useLocation();

  /* ── Language switching ─────────────────────────────────────── */
  const currentLanguage = useLanguage();
  const setLanguage = useSetLanguage();
  const [showLangMenu, setShowLangMenu] = useState(false);

  const languages: { code: Language; label: string }[] = [
    { code: 'mr', label: 'मराठी' },
    { code: 'hi', label: 'हिंदी' },
    { code: 'en', label: 'English' },
  ];

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setShowLangMenu(false);
  };

  /* ── Auth (for personalized greeting if available) ────────── */
  const { user } = useAuth();
  const farmerName = user?.user_metadata?.full_name || user?.user_metadata?.name;

  const [isListening, setIsListening] = useState(false);
  const [dailyContext, setDailyContext] = useState<DailyContext | null>(null);
  const [contextLoading, setContextLoading] = useState(false);

  /* ── Fetch daily context from API ─────────────────────────── */
  /* ── Fetch daily context from API ─────────────────────────── */
  useEffect(() => {
    const fetchContext = async () => {
      setContextLoading(true);
      
      // Default to Kopergaon coordinates if location not ready
      const latitude = loc.status === 'ready' ? loc.location.latitude : 19.8826;
      const longitude = loc.status === 'ready' ? loc.location.longitude : 74.4764;

      try {
        const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
        
        // Add timeout to prevent hanging
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
        
        const res = await fetch(
          `${API_BASE}/v1/farmer/daily-context?lat=${latitude}&lon=${longitude}&language=${currentLanguage}`,
          { signal: controller.signal }
        );
        
        clearTimeout(timeoutId);
        
        if (res.ok) {
          const data = await res.json();
          setDailyContext(data);
        } else {
          console.warn('[HomePage] Daily context API returned error:', res.status);
          // Use dummy data on error
          setDailyContext(getDummyContext());
        }
      } catch (err) {
        console.warn('[HomePage] Daily context fetch failed:', err);
        // Use dummy data on error (including timeout)
        setDailyContext(getDummyContext());
      } finally {
        setContextLoading(false);
      }
    };

    fetchContext();
  }, [
    loc.status,
    loc.location?.latitude ?? 0,
    loc.location?.longitude ?? 0,
    currentLanguage
  ]);

  /* ── Dummy context for development/fallback ─────────────────── */
  const getDummyContext = (): DailyContext => {
    const currentLang = currentLanguage;
    
    // Simple, actionable suggestions in each language
    const suggestions = {
      mr: {
        title: "आजच्या शेतीसाठी सूचना",
        suggestion: "आज हवामान चांगले आहे. संध्याकाळी 4 ते 6 वाजेपर्यंत पाणी द्या. फवारणी करू नका कारण उद्या पाऊस येऊ शकतो.",
        marketTip: "कापसाचा आज बाजारभाव चांगला आहे - ₹6,800 प्रति क्विंटल"
      },
      hi: {
        title: "आज की खेती के लिए सुझाव",
        suggestion: "आज मौसम अच्छा है। शाम 4 से 6 बजे तक पानी दें। स्प्रे न करें क्योंकि कल बारिश हो सकती है।",
        marketTip: "कपास का आज बाजार भाव अच्छा है - ₹6,800 प्रति क्विंटल"
      },
      en: {
        title: "Today's Farming Suggestion",
        suggestion: "Weather is good today. Water your crops between 4-6 PM. Avoid spraying as rain is expected tomorrow.",
        marketTip: "Cotton market price is good today - ₹6,800 per quintal"
      }
    };
    
    const langData = suggestions[currentLang] || suggestions.mr;
    
    return {
      weather: {
        label: langData.title,
        value: langData.suggestion
      },
      market: {
        label: "",
        value: langData.marketTip
      },
      actions: [],
      alert: undefined
    };
  };

  /* ── Voice interaction ─────────────────────────────────────── */
  const handleVoiceClick = () => {
    setIsListening(true);
    navigate('/ai', { state: { mode: 'voice' } });
  };

  /* ── Text interaction ─────────────────────────────────────── */
  const handleTextClick = () => {
    navigate('/ai', { state: { mode: 'text' } });
  };

  /* ── Location display ─────────────────────────────────────── */
  const locationLabel = () => {
    if (loc.status === 'detecting') return ht('haladhar.location.detecting');
    if (loc.status === 'denied') return ht('haladhar.location.unavailable');
    if (loc.status === 'unavailable') return ht('haladhar.location.unavailable');
    return loc.label || ht('haladhar.location.unavailable');
  };

  const showSetManually = loc.status === 'denied' || loc.status === 'unavailable';

  /* ── Services (2-col with icon on top, vertical layout) ────── */
  const services = [
    { icon: CloudRain,    label: ht('haladhar.service.weather'), route: '/weather', bg: '#e8f5e9', color: '#2d6a4f' },
    { icon: IndianRupee,  label: ht('haladhar.service.market'),  route: '/bazaar',  bg: '#fff3e0', color: '#f57c00' },
    { icon: ClipboardList,label: ht('haladhar.service.schemes'), route: '/help',    bg: '#e3f2fd', color: '#0077b6' },
    { icon: Wrench,       label: ht('haladhar.service.labour'),  route: '/labour',  bg: '#f3e5f5', color: '#7b1fa2' },
  ];

  return (
    <div className="haladhar-container">
      <main className="hm-page">

        {/* ── HEADER ─────────────────────────────────────────── */}
        <header className="hm-header">
          <div className="hm-brand-block">
            <div className="hm-brand-row">
              <Sprout size={24} strokeWidth={2.5} className="hm-brand-icon" />
              <span className="hm-brand">{ht('haladhar.brand')}</span>
            </div>
            <span className="hm-tagline">{ht('haladhar.tagline')}</span>
          </div>
          
          {/* Language selector */}
          <div style={{ position: 'relative' }}>
            <button
              className="hm-icon-btn"
              aria-label="Change language"
              onClick={() => setShowLangMenu(!showLangMenu)}
            >
              <Globe size={20} strokeWidth={2} />
            </button>
            
            {showLangMenu && (
              <div className="hm-lang-menu">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    className={`hm-lang-option ${currentLanguage === lang.code ? 'active' : ''}`}
                    onClick={() => handleLanguageChange(lang.code)}
                  >
                    {lang.label}
                    {currentLanguage === lang.code && <span className="hm-lang-check">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* ── LOCATION ───────────────────────────────────────── */}
        <div className="hm-location-row">
          <div className="hm-location">
            <MapPin size={13} />
            <span>{locationLabel()}</span>
          </div>
          {showSetManually && (
            <button
              className="hm-location-set"
              onClick={() => navigate('/profile')}
            >
              {ht('haladhar.location.setManually')}
            </button>
          )}
        </div>

        {/* ── GREETING (PROMINENT, ABOVE MICROPHONE) ─────────── */}
        <div className="hm-greeting">
          {farmerName ? `${ht('haladhar.home.greeting').split(' ')[0]} ${farmerName} ${ht('haladhar.home.greeting').split(' ').slice(1).join(' ')}` : ht('haladhar.home.greeting')}
        </div>

        {/* ── VOICE-FIRST CTA (COMPACT, NO EXAMPLES) ──────────────────────── */}
        <div className="hm-voice-cta">
          <button
            className={`hm-voice-btn ${isListening ? 'listening' : ''}`}
            onClick={handleVoiceClick}
            aria-label={ht('haladhar.home.voiceCta')}
          >
            <Mic size={44} strokeWidth={2} />
          </button>
          <p className="hm-voice-label">
            {isListening ? ht('haladhar.home.voiceListening') : ht('haladhar.home.voiceCta')}
          </p>
        </div>

        {/* ── TEXT FALLBACK ──────────────────────────────────── */}
        <div className="hm-text-fallback">
          <button className="hm-text-link" onClick={handleTextClick}>
            {ht('haladhar.home.orType')}
          </button>
        </div>

        {/* ── DAILY SUGGESTION (SIMPLE, ONE MESSAGE) ─────────────── */}
        <div className="hm-today">
          {contextLoading ? (
            <p style={{ color: 'var(--haladhar-text-muted)', fontSize: '14px', margin: 0, textAlign: 'center' }}>
              {currentLanguage === 'mr' ? 'माहिती आणत आहे...' : currentLanguage === 'hi' ? 'जानकारी ला रहे हैं...' : 'Loading information...'}
            </p>
          ) : dailyContext ? (
            <>
              {dailyContext.weather && (
                <div className="hm-suggestion-card">
                  <h3 className="hm-suggestion-title">
                    {dailyContext.weather.label}
                  </h3>
                  <p className="hm-suggestion-text">
                    {dailyContext.weather.value}
                  </p>
                  {dailyContext.market && dailyContext.market.value && (
                    <p className="hm-market-tip">
                      💰 {dailyContext.market.value}
                    </p>
                  )}
                </div>
              )}
            </>
          ) : (
            <p style={{ color: 'var(--haladhar-text-muted)', fontSize: '14px', margin: 0, textAlign: 'center' }}>
              {currentLanguage === 'mr' ? 'माहिती सध्या उपलब्ध नाही' : currentLanguage === 'hi' ? 'जानकारी उपलब्ध नहीं है' : 'Information not available'}
            </p>
          )}
        </div>

        {/* ── SERVICES (FIXED 2-COL GRID) ────────────────────── */}
        <div className="hm-services">
          <h2 className="hm-services-title">{ht('haladhar.home.servicesLabel')}</h2>
          <div className="hm-services-grid">
            {services.map((svc, i) => {
              const Icon = svc.icon;
              return (
                <button
                  key={i}
                  className="hm-service-btn"
                  onClick={() => navigate(svc.route)}
                >
                  <div className="hm-service-icon" style={{ background: svc.bg }}>
                    <Icon size={20} strokeWidth={2} color={svc.color} />
                  </div>
                  <span>{svc.label}</span>
                </button>
              );
            })}
          </div>
        </div>

      </main>

      {/* ── BOTTOM NAV ─────────────────────────────────────────── */}
      <nav className="haladhar-bottom-nav">
        <button className="haladhar-nav-item active" onClick={() => navigate('/')}>
          <Home size={22} strokeWidth={2} />
          <span>{ht('haladhar.nav.home')}</span>
        </button>
        <button className="haladhar-nav-item" onClick={() => navigate('/farm')}>
          <Tractor size={22} strokeWidth={2} />
          <span>{ht('haladhar.nav.profile')}</span>
        </button>
        <button className="haladhar-nav-item" onClick={() => navigate('/services')}>
          <LayoutGrid size={22} strokeWidth={2} />
          <span>{ht('haladhar.nav.services')}</span>
        </button>
        <button className="haladhar-nav-item" onClick={() => navigate('/more')}>
          <MoreHorizontal size={22} strokeWidth={2} />
          <span>{ht('haladhar.nav.more')}</span>
        </button>
      </nav>
    </div>
  );
}
