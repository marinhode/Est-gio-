import 'server-only'
import type { DadosJogo } from '@/app/admin/jogos/acoes'
import { clienteComSessao } from '@/lib/supabase/servidor'

type Linha = {
  slug: string; titulo: string; descricao: string; tipo: DadosJogo['tipo']; publicado: boolean; exemplo: boolean
  quiz_perguntas: { enunciado: string; opcoes: string[]; correta: number; feedback: string; fonte_titulo: string | null; fonte_url: string | null; ordem: number }[]
}
const SELECAO = 'slug, titulo, descricao, tipo, publicado, exemplo, quiz_perguntas(enunciado, opcoes, correta, feedback, fonte_titulo, fonte_url, ordem)'

const paraDados = (l: Linha): DadosJogo => ({
  slug: l.slug, titulo: l.titulo, descricao: l.descricao, tipo: l.tipo, publicado: l.publicado, exemplo: l.exemplo,
  perguntas: [...l.quiz_perguntas].sort((a, b) => a.ordem - b.ordem).map((q) => ({
    enunciado: q.enunciado, opcoes: q.opcoes, correta: q.correta, feedback: q.feedback, fonteTitulo: q.fonte_titulo ?? '', fonteUrl: q.fonte_url ?? '',
  })),
})

export async function jogosDoPainel(): Promise<DadosJogo[]> {
  const supabase = await clienteComSessao()
  const { data } = await supabase.from('jogos').select(SELECAO).order('ordem')
  return ((data ?? []) as Linha[]).map(paraDados)
}

export async function jogoDoPainel(slug: string): Promise<DadosJogo | null> {
  const supabase = await clienteComSessao()
  const { data } = await supabase.from('jogos').select(SELECAO).eq('slug', slug).maybeSingle()
  return data ? paraDados(data as Linha) : null
}
