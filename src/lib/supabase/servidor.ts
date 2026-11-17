import 'server-only'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { connection } from 'next/server'
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from './config'

/** Cliente com a sessão de quem está logado (painel). Criar um por requisição. */
export async function clienteComSessao() {
  // A biblioteca lê o relógio ao carregar a sessão: marca a renderização como dinâmica antes
  await connection()
  const cookieStore = await cookies()
  return createServerClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (lista) => {
        try {
          lista.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // Componentes de servidor não gravam cookies; o proxy renova a sessão.
        }
      },
    },
  })
}

/** Cliente anônimo, sem sessão: usado para registrar respostas e acessos dos visitantes. */
export function clienteAnonimo() {
  return createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
