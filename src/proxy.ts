import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from '@/lib/supabase/config'

/** Renova a sessão do painel antes de cada página do /admin (o login dura mais que 1 hora). */
export async function proxy(request: NextRequest) {
  let resposta = NextResponse.next({ request })
  const supabase = createServerClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (lista, cabecalhos) => {
        lista.forEach(({ name, value }) => request.cookies.set(name, value))
        resposta = NextResponse.next({ request })
        lista.forEach(({ name, value, options }) => resposta.cookies.set(name, value, options))
        Object.entries(cabecalhos).forEach(([k, v]) => resposta.headers.set(k, v))
      },
    },
  })
  await supabase.auth.getUser()
  return resposta
}

export const config = {
  matcher: ['/admin/:path*'],
}
