import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useTranslation } from '../i18n/useTranslation'

export function SignUpPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (signUpError) throw signUpError

      if (data.user) {
        // Redirect to profile onboarding
        navigate('/profile')
      }
    } catch (err: any) {
      setError(err.message || t('auth.signUpError'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '20px',
        backgroundColor: '#f5f5f5',
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          padding: '32px 24px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          maxWidth: '400px',
          width: '100%',
        }}
      >
        <h1
          style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#0b5e2c',
            textAlign: 'center',
            marginBottom: '24px',
          }}
        >
          {t('auth.signUp')}
        </h1>

        <form onSubmit={handleSignUp}>
          <div style={{ marginBottom: '16px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '16px',
                color: '#0b5e2c',
                marginBottom: '8px',
                fontWeight: 'bold',
              }}
            >
              {t('auth.email')}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                minHeight: '48px',
                padding: '12px',
                fontSize: '16px',
                border: '2px solid #e0e0e0',
                borderRadius: '4px',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '16px',
                color: '#0b5e2c',
                marginBottom: '8px',
                fontWeight: 'bold',
              }}
            >
              {t('auth.password')}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              style={{
                width: '100%',
                minHeight: '48px',
                padding: '12px',
                fontSize: '16px',
                border: '2px solid #e0e0e0',
                borderRadius: '4px',
                boxSizing: 'border-box',
              }}
            />
            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
              {t('auth.passwordHint')}
            </div>
          </div>

          {error && (
            <div
              style={{
                padding: '12px',
                marginBottom: '16px',
                backgroundColor: '#fee',
                color: '#c33',
                borderRadius: '4px',
                fontSize: '14px',
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              minHeight: '48px',
              backgroundColor: loading ? '#aaa' : '#0b5e2c',
              color: '#ffffff',
              fontSize: '16px',
              fontWeight: 'bold',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: '16px',
            }}
          >
            {loading ? t('general.loading') : t('auth.signUp')}
          </button>

          <div style={{ textAlign: 'center', fontSize: '14px', color: '#666' }}>
            {t('auth.hasAccount')}{' '}
            <Link to="/signin" style={{ color: '#0b5e2c', textDecoration: 'underline' }}>
              {t('auth.signIn')}
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
