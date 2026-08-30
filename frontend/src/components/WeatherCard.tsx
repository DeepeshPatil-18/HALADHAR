import { useEffect, useState } from 'react'
import { useTranslation } from '../i18n/useTranslation'

interface WeatherData {
  temperature: number
  humidity: number
  precipitation_probability: number
  wind_speed: number
  condition: string
  timestamp: string
  location: string
}

interface WeatherCardProps {
  latitude?: number
  longitude?: number
}

export function WeatherCard({ latitude, longitude }: WeatherCardProps) {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<WeatherData | null>(null)

  const fetchWeather = async () => {
    if (!latitude || !longitude) {
      setError(t('weather.unavailable'))
      return
    }

    setLoading(true)
    setError(null)

    try {
      const baseUrl = import.meta.env.VITE_FASTAPI_BASE_URL || 'http://localhost:8000'
      const response = await fetch(
        `${baseUrl}/api/weather?latitude=${latitude}&longitude=${longitude}`
      )

      if (!response.ok) {
        throw new Error('Weather fetch failed')
      }

      const weatherData = await response.json()
      setData(weatherData)
    } catch (err) {
      console.error('Weather fetch error:', err)
      setError(t('weather.unavailable'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWeather()
  }, [latitude, longitude])

  const formatTimestamp = (isoString: string) => {
    try {
      const date = new Date(isoString)
      return date.toLocaleString(undefined, {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return isoString
    }
  }

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '2px solid #e0e0e0',
        borderRadius: '8px',
        padding: '20px',
        minHeight: '200px',
      }}
    >
      <h2
        style={{
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#0b5e2c',
          marginBottom: '16px',
        }}
      >
        {t('weather.title')}
      </h2>

      {loading && (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#666' }}>
          {t('weather.loading')}
        </div>
      )}

      {error && !loading && (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <p style={{ color: '#d32f2f', marginBottom: '16px' }}>{error}</p>
          <button
            onClick={fetchWeather}
            style={{
              backgroundColor: '#f5820a',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              minHeight: '48px',
              minWidth: '120px',
            }}
          >
            {t('weather.retry')}
          </button>
        </div>
      )}

      {data && !loading && !error && (
        <div>
          <div style={{ display: 'grid', gap: '12px' }}>
            <WeatherRow
              label={t('weather.temperature')}
              value={`${Math.round(data.temperature)}°C`}
            />
            <WeatherRow
              label={t('weather.humidity')}
              value={`${Math.round(data.humidity)}%`}
            />
            <WeatherRow
              label={t('weather.precipitation')}
              value={`${Math.round(data.precipitation_probability)}%`}
            />
            <WeatherRow
              label={t('weather.windSpeed')}
              value={`${Math.round(data.wind_speed)} km/h`}
            />
            <WeatherRow label={t('weather.condition')} value={data.condition} />
          </div>

          <div
            style={{
              marginTop: '16px',
              paddingTop: '16px',
              borderTop: '1px solid #e0e0e0',
              fontSize: '14px',
              color: '#666',
            }}
          >
            {t('weather.lastUpdated')}: {formatTimestamp(data.timestamp)}
          </div>
        </div>
      )}
    </div>
  )
}

interface WeatherRowProps {
  label: string
  value: string
}

function WeatherRow({ label, value }: WeatherRowProps) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: '16px', color: '#333' }}>{label}</span>
      <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#0b5e2c' }}>{value}</span>
    </div>
  )
}
