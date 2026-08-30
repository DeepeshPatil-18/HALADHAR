import { createClient } from '@supabase/supabase-js'

const supabaseUrl     = import.meta.env.VITE_SUPABASE_URL     as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

// Detect any placeholder / demo value
const PLACEHOLDER_PATTERNS = [
  'your_supabase_project_url',
  'your_supabase_anon_key',
  'placeholder',
  'demo.supabase.co',
  'example.supabase.co',
]

function isPlaceholder(val: string) {
  if (!val) return true
  const lower = val.toLowerCase()
  return PLACEHOLDER_PATTERNS.some(p => lower.includes(p))
}

export const isSupabaseConfigured =
  !!supabaseUrl &&
  !!supabaseAnonKey &&
  !isPlaceholder(supabaseUrl) &&
  !isPlaceholder(supabaseAnonKey)

if (!isSupabaseConfigured) {
  console.warn('⚠️ Supabase credentials not configured. Using local demo mode.')
  console.warn('Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in frontend/.env to enable cloud features.')
}

// Use a no-op offline URL when not configured so no real network requests are made
export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl : 'https://offline.supabase.co',
  isSupabaseConfigured ? supabaseAnonKey : 'offline'
)
