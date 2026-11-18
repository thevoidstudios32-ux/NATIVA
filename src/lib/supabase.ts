import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * Cliente Supabase do navegador.
 * Usa SOMENTE a URL do projeto e a chave pública (anon/publishable).
 * A chave service_role nunca deve existir no front-end.
 */
// Valores públicos padrão do projeto Supabase "nativa" (a chave publishable é feita para o navegador;
// a segurança vem das políticas RLS). Podem ser sobrescritos por variáveis de ambiente.
const DEFAULT_URL = 'https://qmaodcnoopckbjvgumdm.supabase.co'
const DEFAULT_PUBLISHABLE_KEY = 'sb_publishable_jxopjARm0wYJsOZ4NtvDmA_YD2JuVAM'

const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined) || DEFAULT_URL
const anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) || DEFAULT_PUBLISHABLE_KEY

export const isSupabaseConfigured = Boolean(url && anonKey)

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url!, anonKey!, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    })
  : null
