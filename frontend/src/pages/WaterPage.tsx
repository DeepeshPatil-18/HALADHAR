import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Volume2, MessageCircle, Check, X, Home, Tractor, LayoutGrid, MoreHorizontal } from 'lucide-react';
import { useHaladharTranslation } from '../i18n/haladhar-translations';
import '../styles/haladhar-design.css';

export function WaterPage() {
  const navigate = useNavigate();
  const { ht } = useHaladharTranslation();

  const [loading, setLoading]       = useState(true);
  const [rainProb, setRainProb]     = useState<number | null>(null);
  const [rainTomorrow, setRainTomorrow] = useState(false);

  // Derive irrigation advice from live weather
  useEffect(() => {
    const fetchAdvice = async () => {
      try {
        const base = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
        const params = new URLSearchParams({
          lat: '19.88', lon: '74.48', location: 'Kopergaon',
          state: 'maharashtra', district: 'Ahmednagar',
        });
        const res = await fetch(`${base}/v1/weather?${params}`);
        if (res.ok) {
          const data = await res.json();
          const todayProb = data.daily_forecast?.[0]?.rain_probability ?? 0;
          const tomorrowProb = data.daily_forecast?.[1]?.rain_probability ?? 0;
          setRainProb(todayProb);
          setRainTomorrow(tomorrowProb > 50);
        }
      } catch { /* fall through to default */ }
      finally { setLoading(false); }
    };
    fetchAdvice();
  }, []);

  // Logic: don't irrigate if today rain ≥ 50% OR tomorrow rain ≥ 60%
  const shouldIrrigate = !loading && !(rainProb !== null && rainProb >= 50) && !rainTomorrow;

  const reasons: string[] = [];
  if (rainProb !== null && rainProb >= 50)
    reasons.push(ht('haladhar.water.soilMoist'));
  if (rainTomorrow)
    reasons.push(ht('haladhar.water.rainExpected'));
  if (shouldIrrigate)
    reasons.push(ht('haladhar.water.yes'));

  return (
    <div className="haladhar-container">
      <main className="haladhar-page">

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 'var(--space-xl)' }}>
          <button onClick={() => navigate(-1)}
            style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}>
            <ChevronLeft size={24} color="var(--haladhar-text-primary)" />
          </button>
          <h1 className="haladhar-heading" style={{ margin: 0, marginLeft: 'var(--space-sm)' }}>
            {ht('haladhar.water.title')}
          </h1>
        </div>

        {/* Question */}
        <h2 className="haladhar-subheading" style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
          {ht('haladhar.water.shouldIrrigate')}
        </h2>

        {/* Loading */}
        {loading ? (
          <div className="haladhar-loading" style={{ minHeight: '160px' }}>
            <div className="haladhar-spinner" />
          </div>
        ) : (
          <>
            {/* Large answer circle */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-xl)' }}>
              <div style={{
                width: 128, height: 128, borderRadius: '50%',
                backgroundColor: shouldIrrigate ? 'var(--haladhar-green)' : 'var(--haladhar-red)',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', color: 'white',
              }}>
                {shouldIrrigate
                  ? <Check size={48} strokeWidth={3} />
                  : <X size={48} strokeWidth={3} />}
                <span style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginTop: 4 }}>
                  {shouldIrrigate ? ht('haladhar.water.yes') : ht('haladhar.water.no')}
                </span>
              </div>
            </div>

            {/* Reasons */}
            {reasons.length > 0 && (
              <div className="haladhar-card" style={{ marginBottom: 'var(--space-lg)' }}>
                {reasons.map((r, i) => (
                  <p key={i} className="haladhar-body"
                    style={{ marginBottom: i < reasons.length - 1 ? 'var(--space-md)' : 0 }}>
                    • {r}
                  </p>
                ))}
              </div>
            )}

            {/* Next action */}
            <p className="haladhar-body" style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
              {ht('haladhar.water.checkTomorrow')}
            </p>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
              <button
                className="haladhar-button haladhar-button-secondary"
                style={{ flex: 1 }}
                onClick={() => navigate('/weather')}
              >
                <Volume2 size={18} />
                {ht('haladhar.water.listen')}
              </button>
              <button
                className="haladhar-button haladhar-button-secondary"
                style={{ flex: 1 }}
                onClick={() => navigate('/ai', { state: { initialQuery: ht('haladhar.suggest.irrigate') } })}
              >
                <MessageCircle size={18} />
                {ht('haladhar.water.why')}
              </button>
            </div>
          </>
        )}
      </main>

      {/* Bottom nav */}
      <nav className="haladhar-bottom-nav">
        <button className="haladhar-nav-item" onClick={() => navigate('/')}>
          <Home size={24} strokeWidth={2} /><span>{ht('haladhar.nav.home')}</span>
        </button>
        <button className="haladhar-nav-item active" onClick={() => navigate('/farm')}>
          <Tractor size={24} strokeWidth={2} /><span>{ht('haladhar.nav.myFarm')}</span>
        </button>
        <button className="haladhar-nav-item" onClick={() => navigate('/services')}>
          <LayoutGrid size={24} strokeWidth={2} /><span>{ht('haladhar.nav.services')}</span>
        </button>
        <button className="haladhar-nav-item" onClick={() => navigate('/more')}>
          <MoreHorizontal size={24} strokeWidth={2} /><span>{ht('haladhar.nav.more')}</span>
        </button>
      </nav>
    </div>
  );
}
