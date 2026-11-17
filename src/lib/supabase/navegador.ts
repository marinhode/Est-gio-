'use client'

import { createBrowserClient } from '@supabase/ssr'
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from './config'

/** Cliente no navegador, com a sessão do painel (para enviar fotos direto ao armazenamento). */
export function clienteNavegador() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)
}
