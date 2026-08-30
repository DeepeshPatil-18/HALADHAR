import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'
import type { User, Session } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  isGuest: boolean
  /** The real Supabase anonymous UUID for the guest user (null if not yet created) */
  guestUserId: string | null
  /** Sign in anonymously via Supabase Auth — generates a real UUID */
  signInAsGuest: () => Promise<string | null>
  setGuest: (value: boolean) => void
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,    setUser]    = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [isGuest, setIsGuest] = useState<boolean>(() =>
    localStorage.getItem('haladhar_guest') === 'true'
  )
  const [guestUserId, setGuestUserId] = useState<string | null>(() =>
    localStorage.getItem('haladhar_guest_uid') ?? null
  )

  const setGuest = (value: boolean) => {
    setIsGuest(value)
    if (value) {
      localStorage.setItem('haladhar_guest', 'true')
    } else {
      localStorage.removeItem('haladhar_guest')
      localStorage.removeItem('haladhar_guest_uid')
      setGuestUserId(null)
    }
  }

  /**
   * Sign in anonymously — Supabase generates a real UUID.
   * Creates a farmer_profiles stub so the guest has a real user_id.
   * Returns the UUID or null on failure.
   */
  const signInAsGuest = async (): Promise<string | null> => {
    // If Supabase is not configured, generate a local UUID for demo
    if (!isSupabaseConfigured) {
      const localUid = crypto.randomUUID()
      setIsGuest(true)
      setGuestUserId(localUid)
      localStorage.setItem('haladhar_guest',     'true')
      localStorage.setItem('haladhar_guest_uid', localUid)
      console.info('[Auth] Demo mode — local guest UUID:', localUid.slice(0, 8) + '…')
      return localUid
    }

    try {
      const { data, error } = await supabase.auth.signInAnonymously()
      if (error || !data?.user) throw error ?? new Error('No user returned')

      const uid = data.user.id
      setUser(data.user)
      setSession(data.session)
      setIsGuest(true)
      setGuestUserId(uid)
      localStorage.setItem('haladhar_guest',     'true')
      localStorage.setItem('haladhar_guest_uid', uid)

      // Create a minimal farmer_profiles row so foreign keys work
      await supabase.from('farmer_profiles').upsert(
        {
          user_id:            uid,
          preferred_language: localStorage.getItem('language') ?? 'mr',
          updated_at:         new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      )

      console.info('[Auth] Anonymous guest signed in:', uid.slice(0, 8) + '…')
      return uid
    } catch (err) {
      console.warn('[Auth] signInAnonymously failed — falling back to local guest mode:', err)
      // Fallback: generate a local UUID if Supabase is not configured
      const localUid = crypto.randomUUID()
      setIsGuest(true)
      setGuestUserId(localUid)
      localStorage.setItem('haladhar_guest',     'true')
      localStorage.setItem('haladhar_guest_uid', localUid)
      return localUid
    }
  }

  useEffect(() => {
    supabase.auth.getSession()
      .then(({ data: { session }, error }) => {
        if (error) console.error('Auth session error:', error)
        setSession(session)
        setUser(session?.user ?? null)
        if (session?.user) {
          setGuestUserId(session.user.id)
          localStorage.setItem('haladhar_guest_uid', session.user.id)
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to get session:', err)
        setLoading(false)
      })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        setGuestUserId(session.user.id)
        localStorage.setItem('haladhar_guest_uid', session.user.id)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
    setGuest(false)
  }

  return (
    <AuthContext.Provider value={{
      user, session, loading, isGuest, guestUserId,
      signInAsGuest, setGuest, signOut,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
