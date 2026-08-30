import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Search, TrendingUp, TrendingDown, Minus, IndianRupee, Handshake, ChevronRight } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';
import { useHaladharTranslation } from '../i18n/haladhar-translations';
import { useLocation as useUserLocation } from '../contexts/LocationContext';
import '../styles/haladhar-design.css';

interface MandiPrice {
  commodity: string;
  market: string;
  district: string;
  state: string;
  modal_price: number;
  min_price: number;
  max_price: number;
  date: string;
  trend?: 'up' | 'down' | 'stable';
}

interface MandiResult {
  prices: MandiPrice[];
  source: string;
  last_updated: string;
}

export function BazaarPage() {
  const navigate = useNavigate();
  const { t }  = useTranslation();
  const { ht } = useHaladharTranslation();
  const userLoc = useUserLocation();

  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MandiResult | null>(null);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState(false);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError(false);
    setSearched(true);
    try {
      const base = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
      const params = new URLSearchParams({ commodity: query.trim() });
      // Add state from shared location when available
      const state = userLoc.location?.state;
      if (state) params.set('state', state);
      const res = await fetch(`${base}/v1/mandi-price?${params}`);
      if (res.ok) setResult(await res.json());
      else setError(true);
    } catch { setError(true); }
    finally { setLoading(false); }
  };

  const TrendIcon = ({ trend }: { trend?: string }) => {
    if (trend === 'up')   return <TrendingUp size={16} color="var(--haladhar-green)" />;
    if (trend === 'down') return <TrendingDown size={16} color="var(--haladhar-red)" />;
    return <Minus size={16} color="var(--haladhar-gray)" />;
  };

  return (
    <div className="haladhar-container">
      <main className="haladhar-page">

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
          <button onClick={() => navigate('/')}
            style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}>
            <ChevronLeft size={24} color="var(--haladhar-text-primary)" />
          </button>
          <h1 className="haladhar-heading" style={{ margin: 0, marginLeft: 'var(--space-sm)' }}>
            {ht('haladhar.market.title')}
          </h1>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} style={{ marginBottom: 'var(--space-md)' }}>
          <div className="haladhar-search-box">
            <Search size={20} color="var(--haladhar-text-muted)" style={{ flexShrink: 0 }} />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={t('mandi.searchPlaceholder')}
            />
            <button
              type="submit"
              disabled={!query.trim() || loading}
              style={{
                background: 'var(--haladhar-green)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                color: 'white',
                padding: '6px 14px',
                fontWeight: 600,
                fontSize: 'var(--text-sm)',
                cursor: 'pointer',
                opacity: !query.trim() || loading ? 0.5 : 1,
                flexShrink: 0,
              }}
            >
              {loading ? '...' : t('mandi.search')}
            </button>
          </div>
        </form>

        {/* Market Linkage Button */}
        <button
          className="haladhar-card"
          onClick={() => navigate('/around')}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 'var(--space-md)',
            marginBottom: 'var(--space-lg)',
            cursor: 'pointer',
            border: '2px solid var(--haladhar-green)',
            background: 'linear-gradient(135deg, #e8f5e9 0%, #ffffff 100%)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 'var(--radius-md)',
              background: 'var(--haladhar-green)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <TrendingUp size={24} color="white" strokeWidth={2.5} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <p style={{ fontWeight: 700, fontSize: 'var(--text-base)', color: 'var(--haladhar-text-primary)', margin: 0 }}>
                {ht('haladhar.market.mandiBhav')}
              </p>
              <p className="haladhar-caption" style={{ margin: '2px 0 0 0' }}>
                {ht('haladhar.market.mandiBhavDesc')}
              </p>
            </div>
          </div>
          <ChevronRight size={20} color="var(--haladhar-green)" strokeWidth={2.5} />
        </button>

        {/* Loading */}
        {loading && (
          <div className="haladhar-loading">
            <div className="haladhar-spinner" />
            <p className="haladhar-caption">{t('mandi.searching')}</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="haladhar-alert haladhar-alert-error">
            {t('mandi.unavailable')}
          </div>
        )}

        {/* No results */}
        {!loading && searched && !error && result?.prices.length === 0 && (
          <div className="haladhar-empty">
            <p className="haladhar-body">{t('mandi.noResults')}</p>
          </div>
        )}

        {/* Results */}
        {!loading && !error && result && result.prices.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>

            {/* Top price hero */}
            <div className="haladhar-card" style={{ textAlign: 'center' }}>
              <p className="haladhar-caption" style={{ marginBottom: 'var(--space-xs)' }}>
                {result.prices[0].commodity}
              </p>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 'var(--space-xs)' }}>
                <IndianRupee size={24} color="var(--haladhar-green)" />
                <span style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'var(--haladhar-text-primary)' }}>
                  {result.prices[0].modal_price.toLocaleString('en-IN')}
                </span>
                <span className="haladhar-caption">{ht('haladhar.market.perQuintal')}</span>
              </div>
              <p className="haladhar-caption" style={{ marginTop: 'var(--space-xs)' }}>
                {result.prices[0].market} · {t('mandi.lastUpdated')}: {result.prices[0].date}
              </p>
            </div>

            {/* Nearby markets heading */}
            <p className="haladhar-subheading" style={{ marginTop: 'var(--space-sm)' }}>
              {ht('haladhar.market.nearbyMarkets')}
            </p>

            {/* Market rows */}
            {result.prices.map((p, i) => (
              <div key={i} className="haladhar-card" style={{ padding: 'var(--space-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 'var(--text-base)', marginBottom: 2 }}>
                      {p.market}
                    </p>
                    <p className="haladhar-caption">{p.district}{p.state ? `, ${p.state}` : ''}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', textAlign: 'right' }}>
                    <TrendIcon trend={p.trend} />
                    <div>
                      <p style={{ fontWeight: 700, fontSize: 'var(--text-lg)', color: 'var(--haladhar-green)' }}>
                        ₹{p.modal_price.toLocaleString('en-IN')}
                      </p>
                      <p className="haladhar-caption">
                        ₹{p.min_price.toLocaleString('en-IN')} – ₹{p.max_price.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Data source */}
            <p className="haladhar-caption" style={{ textAlign: 'center', marginTop: 'var(--space-sm)' }}>
              {result.source} · {result.last_updated}
            </p>
          </div>
        )}

        {/* Sell option — always visible */}
        <div style={{ marginTop: 'var(--space-xl)' }}>
          <div className="haladhar-divider" />
          <button
            className="haladhar-service-box"
            onClick={() => navigate('/market')}
            style={{ marginTop: 'var(--space-md)' }}
          >
            <div className="haladhar-service-icon">
              <Handshake size={28} strokeWidth={2} />
            </div>
            <div className="haladhar-service-content">
              <p className="haladhar-service-title">{t('market.sellHeading')}</p>
              <p className="haladhar-service-desc">{t('market.sellDescription')}</p>
            </div>
            <ChevronRight size={20} color="var(--haladhar-text-muted)" />
          </button>
        </div>

      </main>
    </div>
  );
}
