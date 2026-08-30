import { createContext, useContext, useState, type ReactNode } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from './AuthContext'

type Language = 'en' | 'hi' | 'mr'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [language, setLanguageState] = useState<Language>(() => {
    // Read from localStorage on init
    const stored = localStorage.getItem('language')
    if (stored === 'en' || stored === 'hi' || stored === 'mr') {
      return stored
    }
    return 'en'
  })

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('language', lang)

    // If user is authenticated, persist to farmer_profiles
    if (user) {
      try {
        await supabase
          .from('farmer_profiles')
          .upsert(
            {
              user_id: user.id,
              preferred_language: lang,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'user_id' }
          )
      } catch (err) {
        console.error('Failed to persist language preference:', err)
      }
    }
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context.language
}

export function useSetLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useSetLanguage must be used within a LanguageProvider')
  }
  return context.setLanguage
}
