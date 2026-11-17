'use server'

import { clienteAnonimo } from '@/lib/supabase/servidor'

/**
 * Registros anônimos dos visitantes: nenhuma identificação, nenhum IP guardado.
 * Falhas não atrapalham a experiência; o visitante segue normalmente.
 */

export async function registrarResposta(pergunta: string, resposta: string): Promise<boolean> {
  const texto = resposta.trim().slice(0, 500)
  if (!texto) return false
  const { error } = await clienteAnonimo().from('respostas').insert({ pergunta: pergunta.slice(0, 300), resposta: texto })
  return !error
}

export async function registrarEvento(tipo: 'qr' | 'tour' | 'quiz_concluido' | 'resposta', alvo?: string) {
  await clienteAnonimo().from('eventos').insert({ tipo, alvo: alvo?.slice(0, 120) ?? null })
}
