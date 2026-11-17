import 'server-only'
import { clienteComSessao } from '@/lib/supabase/servidor'
import type { TemaSensorial } from '@/lib/tipos'

type Linha = { chave: string; titulo: string; resumo: string; exemplo: boolean; dados: { secoes?: TemaSensorial['secoes']; experimente?: TemaSensorial['experimente'] | null; pergunta?: string | null; fontes?: TemaSensorial['fontes'] } }

const paraTema = (l: Linha): TemaSensorial => ({
  slug: l.chave, titulo: l.titulo, resumo: l.resumo, exemplo: l.exemplo,
  secoes: l.dados.secoes ?? [], experimente: l.dados.experimente ?? undefined, pergunta: l.dados.pergunta ?? undefined, fontes: l.dados.fontes ?? [],
})

export async function temasDoPainel(): Promise<TemaSensorial[]> {
  const supabase = await clienteComSessao()
  const { data } = await supabase.from('textos').select('chave, titulo, resumo, exemplo, dados').eq('estacao', 'sentidos').order('ordem')
  return ((data ?? []) as Linha[]).map(paraTema)
}

export async function temaDoPainel(chave: string): Promise<TemaSensorial | null> {
  const supabase = await clienteComSessao()
  const { data } = await supabase.from('textos').select('chave, titulo, resumo, exemplo, dados').eq('chave', chave).maybeSingle()
  return data ? paraTema(data as Linha) : null
}
