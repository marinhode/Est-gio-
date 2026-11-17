import 'server-only'
import { cacheTag } from 'next/cache'
import { clienteAnonimo } from '@/lib/supabase/servidor'
import type { Canteiro, Fonte, Jogo, NivelEvidencia, Planta, Secao, TemaSensorial } from '@/lib/tipos'

/**
 * Ponto único de leitura do conteúdo público, vindo do Supabase.
 * Tudo fica em cache com a etiqueta 'conteudo'; o painel chama updateTag('conteudo')
 * ao salvar, e o site mostra a mudança na hora.
 * Usa o cliente anônimo: só enxerga o que está publicado (regras do banco).
 */

export const ETIQUETA = 'conteudo'

function falhou(contexto: string, erro: unknown): never {
  throw new Error(`Não foi possível carregar ${contexto} do banco: ${erro instanceof Error ? erro.message : JSON.stringify(erro)}`)
}

// ───────────── Plantas e canteiros ─────────────

type LinhaPlanta = {
  slug: string; nome_popular: string; nome_cientifico: string; autor_taxon: string | null; familia: string
  canteiro_id: string | null; categorias: string[]; caracteristicas: string[]; frase_impacto: string; resumo: string
  imagem_url: string | null; imagem_alt: string | null; imagem_credito: string | null
  conhecendo: Secao; cultivo: Secao; historia: Secao; experiencia: Secao; atividade: string; perguntas: string[]
  psicologia: Secao; biomedicina: Secao | null; farmacia: Secao | null; alertas: Secao | null; fontes: Fonte[]
  exemplo: boolean; publicado: boolean; atualizado_em: string
  usos: { nivel: NivelEvidencia; texto: string; ordem: number }[]
  validacoes: { nome: string; area: Planta['validacoes'][number]['area']; data: string }[]
}

export const SELECAO_PLANTA = '*, usos(nivel, texto, ordem), validacoes(nome, area, data)'

export function paraPlanta(l: LinhaPlanta): Planta {
  return {
    slug: l.slug,
    nomePopular: l.nome_popular,
    nomeCientifico: l.nome_cientifico,
    autorTaxon: l.autor_taxon ?? undefined,
    familia: l.familia,
    canteiroId: l.canteiro_id ?? '',
    categorias: l.categorias,
    caracteristicas: l.caracteristicas,
    fraseImpacto: l.frase_impacto,
    resumo: l.resumo,
    imagem: l.imagem_url ? { src: l.imagem_url, alt: l.imagem_alt ?? '', credito: l.imagem_credito ?? undefined } : undefined,
    conhecendo: l.conhecendo,
    cultivo: l.cultivo,
    historia: l.historia,
    experiencia: l.experiencia,
    atividade: l.atividade,
    perguntas: l.perguntas,
    psicologia: l.psicologia,
    biomedicina: l.biomedicina ?? undefined,
    farmacia: l.farmacia ?? undefined,
    alertas: l.alertas ?? undefined,
    usos: [...(l.usos ?? [])].sort((a, b) => a.ordem - b.ordem).map(({ nivel, texto }) => ({ nivel, texto })),
    fontes: l.fontes ?? [],
    validacoes: l.validacoes ?? [],
    atualizadoEm: l.atualizado_em.slice(0, 10),
    exemplo: l.exemplo,
    publicado: l.publicado,
  }
}

export async function listarPlantas(): Promise<Planta[]> {
  'use cache'
  cacheTag(ETIQUETA)
  const { data, error } = await clienteAnonimo().from('plantas').select(SELECAO_PLANTA).eq('publicado', true).order('nome_popular')
  if (error) falhou('as plantas', error)
  return (data as LinhaPlanta[]).map(paraPlanta)
}

export async function obterPlanta(slug: string): Promise<Planta | null> {
  'use cache'
  cacheTag(ETIQUETA)
  const { data, error } = await clienteAnonimo().from('plantas').select(SELECAO_PLANTA).eq('slug', slug).eq('publicado', true).maybeSingle()
  if (error) falhou('a planta', error)
  return data ? paraPlanta(data as LinhaPlanta) : null
}

export async function listarCanteiros(): Promise<Canteiro[]> {
  'use cache'
  cacheTag(ETIQUETA)
  const { data, error } = await clienteAnonimo().from('canteiros').select('id, numero, nome, descricao').order('numero')
  if (error) falhou('os canteiros', error)
  return data
}

export async function obterCanteiro(id: string): Promise<Canteiro | null> {
  return (await listarCanteiros()).find((c) => c.id === id) ?? null
}

// ───────────── Jogos ─────────────

type LinhaJogo = {
  slug: string; titulo: string; descricao: string; tipo: Jogo['tipo']; exemplo: boolean
  quiz_perguntas: { enunciado: string; opcoes: string[]; correta: number; feedback: string; fonte_titulo: string | null; fonte_url: string | null; ordem: number }[]
}

function paraJogo(l: LinhaJogo): Jogo {
  return {
    slug: l.slug,
    titulo: l.titulo,
    descricao: l.descricao,
    tipo: l.tipo,
    exemplo: l.exemplo,
    perguntas: [...l.quiz_perguntas]
      .sort((a, b) => a.ordem - b.ordem)
      .map((q) => ({
        enunciado: q.enunciado,
        opcoes: q.opcoes,
        correta: q.correta,
        feedback: q.feedback,
        fonte: q.fonte_titulo ? { titulo: q.fonte_titulo, url: q.fonte_url ?? undefined } : undefined,
      })),
  }
}

const SELECAO_JOGO = 'slug, titulo, descricao, tipo, exemplo, quiz_perguntas(enunciado, opcoes, correta, feedback, fonte_titulo, fonte_url, ordem)'

export async function listarJogos(): Promise<Jogo[]> {
  'use cache'
  cacheTag(ETIQUETA)
  const { data, error } = await clienteAnonimo().from('jogos').select(SELECAO_JOGO).eq('publicado', true).order('ordem')
  if (error) falhou('os jogos', error)
  return (data as LinhaJogo[]).map(paraJogo)
}

export async function obterJogo(slug: string): Promise<Jogo | null> {
  return (await listarJogos()).find((j) => j.slug === slug) ?? null
}

// ───────────── Textos da estação Sentidos ─────────────

type LinhaTexto = {
  chave: string; titulo: string; resumo: string; exemplo: boolean
  dados: { secoes?: TemaSensorial['secoes']; experimente?: TemaSensorial['experimente'] | null; pergunta?: string | null; fontes?: Fonte[] }
}

function paraTema(l: LinhaTexto): TemaSensorial {
  return {
    slug: l.chave,
    titulo: l.titulo,
    resumo: l.resumo,
    secoes: l.dados.secoes ?? [],
    experimente: l.dados.experimente ?? undefined,
    pergunta: l.dados.pergunta ?? undefined,
    fontes: l.dados.fontes ?? [],
    exemplo: l.exemplo,
  }
}

export async function listarTemas(): Promise<TemaSensorial[]> {
  'use cache'
  cacheTag(ETIQUETA)
  const { data, error } = await clienteAnonimo()
    .from('textos')
    .select('chave, titulo, resumo, exemplo, dados')
    .eq('estacao', 'sentidos')
    .order('ordem')
  if (error) falhou('os temas', error)
  return (data as LinhaTexto[]).map(paraTema)
}

export async function obterTema(slug: string): Promise<TemaSensorial | null> {
  return (await listarTemas()).find((t) => t.slug === slug) ?? null
}
