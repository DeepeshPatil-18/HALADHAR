// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CloudRain, Cloud, Sun, Wind, Droplets, AlertTriangle, CheckCircle, ChevronLeft
} from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';
import { useHaladharTranslation } from '../i18n/haladhar-translations';
import { useLocation as useUserLocation } from '../contexts/LocationContext';
import '../styles/haladhar-design.css';

interface WeatherData {
  location: { name: string; latitude: number; longitude: number };
  current: {
    temperature_c: number;
    weather_code: number;
    weather_icon: string;
    weather_description: string;
  };
  next_rain: {
    time_start: string;
    time_end: string;
    total_rain_mm: number;
    probability: number;
    duration_hours: number;
  } | null;
  daily_forecast: Array<{
    date: string;
    max_temp_c: number;
    min_temp_c: number;
    rain_mm: number;
    rain_probability: number;
    weather_code: number;
    weather_icon: string;
    weather_description: string;
  }>;
  alerts: Array<{ type: string; icon: string; title: string; description: string }>;
  farmer_advisory: string;
  source: string;
}

// Default fallback only used when location is completely unavailable
const DEFAULT_LOC = { name: 'India', lat: 20.59, lon: 78.96, district: '', state: '' };

function WeatherIcon({ code, size = 28 }: { code: number; size?: number }) {
  const p = { size, strokeWidth: 2 };
  if (code === 0) return <Sun {...p} color="#ca8a04" />;
  if (code <= 2)  return <Cloud {...p} color="#9ca3af" />;
  if (code === 3) return <Cloud {...p} color="#6b7280" />;
  if (code <= 48) return <Wind {...p} color="#9ca3af" />;
  return <CloudRain {...p} color="#3b82f6" />;
}

export function WeatherPage() {
  const navigate = useNavigate();
  const { t }  = useTranslation();
  const { ht } = useHaladharTranslation();
  const userLoc = useUserLocation();

  const [loading, setLoading] = useState(true);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [error, setError] = useState(false);

  // Fetch when location resolves (or use default if still unavailable)
  useEffect(() => {
    if (userLoc.status === 'detecting') return; // wait for resolution
    fetchWeather();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLoc.status]);

  const fetchWeather = async () => {
    setLoading(true);
    setError(false);
    try {
      const loc     = userLoc.location;
      const lat     = loc?.latitude  && loc.latitude  !== 0 ? loc.latitude  : DEFAULT_LOC.lat;
      const lon     = loc?.longitude && loc.longitude !== 0 ? loc.longitude : DEFAULT_LOC.lon;
      const name    = loc?.city     || loc?.district || DEFAULT_LOC.name;
      const state   = loc?.state?.toLowerCase() || DEFAULT_LOC.state;
      const district= loc?.district || DEFAULT_LOC.district;

      const params = new URLSearchParams({ lat: lat.toString(), lon: lon.toString(), location: name, state, district });
      const base = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
      const res = await fetch(`${base}/v1/weather?${params}`);
      if (res.ok) setWeatherData(await res.json());
      else setError(true);
    } catch { setError(true); }
    finally { setLoading(false); }
  };

  const getDayLabel = (dateStr: string, idx: number) => {
    if (idx === 0) return t('day.today');
    if (idx === 1) return t('day.tomorrow');
    const days = [
      t('day.sunday'), t('day.monday'), t('day.tuesday'), t('day.wednesday'),
      t('day.thursday'), t('day.friday'), t('day.saturday'),
    ];
    return days[new Date(dateStr).getDay()];
  };

  // Derive spraying suitability from rain probability
  const suitableForSpray = weatherData
    ? (weatherData.daily_forecast[0]?.rain_probability ?? 0) < 40
    : null;

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
            {ht('haladhar.weather.today')}
          </h1>
        </div>

        {/* Loading */}
        {loading && (
          <div className="haladhar-loading">
            <div className="haladhar-spinner" />
            <p className="haladhar-caption">{t('weather.loading')}</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="haladhar-card" style={{ textAlign: 'center', padding: 'var(--space-xl)' }}>
            <CloudRain size={48} color="var(--haladhar-text-muted)" style={{ margin: '0 auto var(--space-md)' }} />
            <p className="haladhar-body" style={{ marginBottom: 'var(--space-md)' }}>
              {t('weather.unavailable')}
            </p>
            <button className="haladhar-button haladhar-button-primary" onClick={fetchWeather}>
              {t('general.retry')}
            </button>
          </div>
        )}

        {/* Content */}
        {!loading && !error && weatherData && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>

            {/* Current Conditions */}
            <div className="haladhar-card">
              {/* Location + temp row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-md)' }}>
                <div>
                  <p className="haladhar-caption" style={{ marginBottom: 'var(--space-xs)' }}>
                    {weatherData.location.name}
                  </p>
                  <p style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'var(--haladhar-text-primary)', lineHeight: 1 }}>
                    {Math.round(weatherData.current.temperature_c)}°C
                  </p>
                </div>
                <WeatherIcon code={weatherData.current.weather_code} size={48} />
              </div>

              {/* Rain answer */}
              <div style={{
                padding: 'var(--space-md)',
                backgroundColor: 'var(--haladhar-bg-light)',
                borderRadius: 'var(--radius-md)',
              }}>
                <p className="haladhar-caption" style={{ marginBottom: 'var(--space-xs)' }}>
                  {t('weather.rainWhenQuestion')}
                </p>
                {weatherData.next_rain ? (
                  <div>
                    <p style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--haladhar-blue)' }}>
                      {weatherData.next_rain.time_start}
                    </p>
                    <p className="haladhar-caption">
                      {weatherData.next_rain.total_rain_mm} mm &nbsp;·&nbsp; {weatherData.next_rain.probability}%
                    </p>
                  </div>
                ) : (
                  <p style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--haladhar-green)' }}>
                    {t('weather.noRainExpected')}
                  </p>
                )}
              </div>
            </div>

            {/* Farming Advisory */}
            <div className="haladhar-card">
              <p className="haladhar-caption" style={{ marginBottom: 'var(--space-sm)' }}>
                {ht('haladhar.weather.forFarming')}
              </p>

              {/* Spray suitability */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-sm)',
                padding: 'var(--space-md)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: suitableForSpray ? '#f0fdf4' : '#fff7ed',
                border: `1px solid ${suitableForSpray ? '#86efac' : '#fed7aa'}`,
                marginBottom: 'var(--space-sm)',
              }}>
                {suitableForSpray
                  ? <CheckCircle size={20} color="#16a34a" style={{ flexShrink: 0 }} />
                  : <AlertTriangle size={20} color="#ea580c" style={{ flexShrink: 0 }} />
                }
                <p style={{
                  fontSize: 'var(--text-base)', fontWeight: 600,
                  color: suitableForSpray ? '#15803d' : '#c2410c',
                  margin: 0,
                }}>
                  {suitableForSpray
                    ? ht('haladhar.weather.suitableSpray')
                    : ht('haladhar.weather.notSuitableSpray')}
                </p>
              </div>

              {/* Farmer advisory text */}
              {weatherData.farmer_advisory && (
                <p className="haladhar-body" style={{ marginTop: 'var(--space-sm)' }}>
                  {weatherData.farmer_advisory}
                </p>
              )}
            </div>

            {/* Alerts */}
            {weatherData.alerts && weatherData.alerts.length > 0 && (
              <div>
                {weatherData.alerts.map((alert, i) => (
                  <div key={i} className="haladhar-alert haladhar-alert-warning" style={{ marginBottom: 'var(--space-sm)' }}>
                    <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                      <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: 2 }} />
                      <div>
                        <p style={{ fontWeight: 700, marginBottom: 'var(--space-xs)' }}>{alert.title}</p>
                        <p style={{ fontSize: 'var(--text-sm)' }}>{alert.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 7-Day Forecast */}
            <div className="haladhar-card">
              <p className="haladhar-caption" style={{ marginBottom: 'var(--space-md)' }}>
                {t('weather.forecastDays')}
              </p>
              <div style={{ display: 'flex', gap: 'var(--space-sm)', overflowX: 'auto', paddingBottom: 'var(--space-xs)' }}>
                {weatherData.daily_forecast.map((day, idx) => (
                  <div key={day.date} style={{
                    flexShrink: 0,
                    minWidth: '72px',
                    textAlign: 'center',
                    padding: 'var(--space-sm)',
                    backgroundColor: idx === 0 ? 'var(--haladhar-bg-light)' : 'transparent',
                    borderRadius: 'var(--radius-md)',
                    border: idx === 0 ? '1px solid var(--haladhar-border)' : 'none',
                  }}>
                    <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, marginBottom: 'var(--space-xs)', color: 'var(--haladhar-text-secondary)' }}>
                      {getDayLabel(day.date, idx)}
                    </p>
                    <WeatherIcon code={day.weather_code} size={24} />
                    <p style={{ fontSize: 'var(--text-base)', fontWeight: 700, margin: 'var(--space-xs) 0' }}>
                      {Math.round(day.max_temp_c)}°
                    </p>
                    {day.rain_mm > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                        <Droplets size={12} color="#3b82f6" />
                        <span style={{ fontSize: 'var(--text-xs)', color: '#3b82f6', fontWeight: 600 }}>
                          {day.rain_mm}mm
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Source */}
            <p className="haladhar-caption" style={{ textAlign: 'center' }}>
              {weatherData.source} · {t('weather.updateFrequency')}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
