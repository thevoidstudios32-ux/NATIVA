import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * Cliente Supabase do navegador.
 * Usa SOMENTE a URL do projeto e a chave pública (anon/publishable).
 * A chave service_role nunca deve existir no front-end.
 */
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const isSupabaseConfigured = Boolean(url && anonKey)

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url!, anonKey!, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    })
  : null
