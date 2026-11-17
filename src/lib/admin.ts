import 'server-only'
import type { DadosPlanta } from '@/app/admin/plantas/acoes'
import { paraPlanta, SELECAO_PLANTA } from '@/lib/conteudo'
import { clienteComSessao } from '@/lib/supabase/servidor'
import type { Canteiro, Planta } from '@/lib/tipos'

/** Leituras do painel: com a sessão do editor, enxergam também rascunhos. */

export async function canteirosDoPainel(): Promise<Canteiro[]> {
  const supabase = await clienteComSessao()
  const { data } = await supabase.from('canteiros').select('id, numero, nome, descricao').order('numero')
  return data ?? []
}

export async function plantasDoPainel(): Promise<Planta[]> {
  const supabase = await clienteComSessao()
  const { data } = await supabase.from('plantas').select(SELECAO_PLANTA).order('nome_popular')
  return (data ?? []).map((l) => paraPlanta(l as Parameters<typeof paraPlanta>[0]))
}

export async function plantaDoPainel(slug: string): Promise<Planta | null> {
  const supabase = await clienteComSessao()
  const { data } = await supabase.from('plantas').select(SELECAO_PLANTA).eq('slug', slug).maybeSingle()
  return data ? paraPlanta(data as Parameters<typeof paraPlanta>[0]) : null
}

export function paraFormulario(p: Planta): DadosPlanta {
  const s = (x?: { curto: string; ampliado?: string }) => ({ curto: x?.curto ?? '', ampliado: x?.ampliado ?? '' })
  return {
    slug: p.slug, nomePopular: p.nomePopular, nomeCientifico: p.nomeCientifico, autorTaxon: p.autorTaxon ?? '', familia: p.familia,
    canteiroId: p.canteiroId, categorias: p.categorias, caracteristicas: p.caracteristicas, fraseImpacto: p.fraseImpacto, resumo: p.resumo,
    imagemUrl: p.imagem?.src ?? '', imagemAlt: p.imagem?.alt ?? '', imagemCredito: p.imagem?.credito ?? '',
    conhecendo: s(p.conhecendo), cultivo: s(p.cultivo), historia: s(p.historia), experiencia: s(p.experiencia), atividade: p.atividade,
    perguntas: p.perguntas.length ? p.perguntas : [''], psicologia: s(p.psicologia), biomedicina: s(p.biomedicina), farmacia: s(p.farmacia),
    alertas: s(p.alertas), usos: p.usos, fontes: p.fontes, validacoes: p.validacoes, exemplo: p.exemplo, publicado: p.publicado,
  }
}
