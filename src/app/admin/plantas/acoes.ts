'use server'

import { updateTag } from 'next/cache'
import { exigirEditor } from '@/lib/auth'
import { ETIQUETA } from '@/lib/conteudo'
import { clienteComSessao } from '@/lib/supabase/servidor'
import type { Area, Fonte, NivelEvidencia, Secao } from '@/lib/tipos'

/** Dados do formulário de planta, no formato que o editor envia. */
export type DadosPlanta = {
  slug: string
  nomePopular: string
  nomeCientifico: string
  autorTaxon: string
  familia: string
  canteiroId: string
  categorias: string[]
  caracteristicas: string[]
  fraseImpacto: string
  resumo: string
  imagemUrl: string
  imagemAlt: string
  imagemCredito: string
  conhecendo: Secao
  cultivo: Secao
  historia: Secao
  experiencia: Secao
  atividade: string
  perguntas: string[]
  psicologia: Secao
  biomedicina: Secao
  farmacia: Secao
  alertas: Secao
  usos: { nivel: NivelEvidencia; texto: string }[]
  fontes: Fonte[]
  validacoes: { nome: string; area: Area; data: string }[]
  exemplo: boolean
  publicado: boolean
}

export type ErroCampo = { campo: string; mensagem: string }
export type ResultadoSalvar = { ok: true; slug: string } | { ok: false; erros: ErroCampo[] }

const NIVEIS: NivelEvidencia[] = ['popular', 'evidencia_cientifica', 'uso_reconhecido', 'hipotese']
const AREAS: Area[] = ['Botânica', 'Psicologia', 'Biomedicina', 'Farmácia']

const limpar = (s: string) => s.trim()
const secaoLimpa = (s: Secao) => ({ curto: limpar(s.curto), ...(limpar(s.ampliado ?? '') ? { ampliado: limpar(s.ampliado ?? '') } : {}) })
const secaoOpcional = (s: Secao) => (limpar(s.curto) ? secaoLimpa(s) : null)

function validar(d: DadosPlanta): ErroCampo[] {
  const erros: ErroCampo[] = []
  const exigir = (campo: string, valor: string, rotulo: string) => {
    if (!limpar(valor)) erros.push({ campo, mensagem: `Preencha ${rotulo}.` })
  }
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(d.slug)) {
    erros.push({ campo: 'slug', mensagem: 'O endereço deve ter só letras minúsculas sem acento, números e hífens.' })
  }
  exigir('nomePopular', d.nomePopular, 'o nome popular')
  exigir('nomeCientifico', d.nomeCientifico, 'o nome científico')
  exigir('familia', d.familia, 'a família botânica')
  exigir('fraseImpacto', d.fraseImpacto, 'a frase de impacto')
  exigir('resumo', d.resumo, 'a apresentação curta')
  exigir('conhecendo', d.conhecendo.curto, 'o texto curto de "Conhecendo a planta"')
  exigir('cultivo', d.cultivo.curto, 'o texto curto de "Cultivo e sustentabilidade"')
  exigir('historia', d.historia.curto, 'o texto curto de "História e cultura"')
  exigir('experiencia', d.experiencia.curto, 'o texto curto de "Experiência sensorial"')
  exigir('atividade', d.atividade, 'a atividade sensorial')
  exigir('psicologia', d.psicologia.curto, 'o texto curto de "Psicologia e bem-estar"')
  if (!d.perguntas.some((p) => limpar(p))) {
    erros.push({ campo: 'perguntas', mensagem: 'Inclua pelo menos uma pergunta interativa.' })
  }
  if (limpar(d.imagemUrl) && !limpar(d.imagemAlt)) {
    erros.push({ campo: 'imagemAlt', mensagem: 'Descreva a foto no texto alternativo. Ele é lido para pessoas cegas.' })
  }
  d.usos.forEach((u, i) => {
    if (!NIVEIS.includes(u.nivel)) erros.push({ campo: `uso-${i}`, mensagem: `Escolha o nível de evidência do uso ${i + 1}.` })
    if (!limpar(u.texto)) erros.push({ campo: `uso-${i}`, mensagem: `Descreva o uso ${i + 1} ou remova-o.` })
  })
  d.fontes.forEach((f, i) => {
    if (!limpar(f.titulo)) erros.push({ campo: `fonte-${i}`, mensagem: `Escreva a referência da fonte ${i + 1} ou remova-a.` })
    if (f.url && !/^https?:\/\//.test(f.url)) erros.push({ campo: `fonte-${i}`, mensagem: `O link da fonte ${i + 1} deve começar com https://.` })
  })
  d.validacoes.forEach((v, i) => {
    if (!limpar(v.nome) || !AREAS.includes(v.area) || !v.data) {
      erros.push({ campo: `validacao-${i}`, mensagem: `Complete nome, área e data da validação ${i + 1}.` })
    }
  })
  return erros
}

/** Cria (slugOriginal = null) ou atualiza uma planta. */
export async function salvarPlanta(d: DadosPlanta, slugOriginal: string | null): Promise<ResultadoSalvar> {
  await exigirEditor()
  const erros = validar(d)
  if (erros.length) return { ok: false, erros }

  const supabase = await clienteComSessao()
  const linha = {
    slug: d.slug,
    nome_popular: limpar(d.nomePopular),
    nome_cientifico: limpar(d.nomeCientifico),
    autor_taxon: limpar(d.autorTaxon) || null,
    familia: limpar(d.familia),
    canteiro_id: d.canteiroId || null,
    categorias: d.categorias.map(limpar).filter(Boolean),
    caracteristicas: d.caracteristicas.map(limpar).filter(Boolean),
    frase_impacto: limpar(d.fraseImpacto),
    resumo: limpar(d.resumo),
    imagem_url: limpar(d.imagemUrl) || null,
    imagem_alt: limpar(d.imagemUrl) ? limpar(d.imagemAlt) : null,
    imagem_credito: limpar(d.imagemCredito) || null,
    conhecendo: secaoLimpa(d.conhecendo),
    cultivo: secaoLimpa(d.cultivo),
    historia: secaoLimpa(d.historia),
    experiencia: secaoLimpa(d.experiencia),
    atividade: limpar(d.atividade),
    perguntas: d.perguntas.map(limpar).filter(Boolean),
    psicologia: secaoLimpa(d.psicologia),
    biomedicina: secaoOpcional(d.biomedicina),
    farmacia: secaoOpcional(d.farmacia),
    alertas: secaoOpcional(d.alertas),
    fontes: d.fontes.map((f) => ({ titulo: limpar(f.titulo), ...(f.url ? { url: limpar(f.url) } : {}), ...(f.consultadoEm ? { consultadoEm: f.consultadoEm } : {}) })),
    exemplo: d.exemplo,
    publicado: d.publicado,
    atualizado_em: new Date().toISOString(),
  }

  const { error } = slugOriginal
    ? await supabase.from('plantas').update(linha).eq('slug', slugOriginal)
    : await supabase.from('plantas').insert(linha)
  if (error) {
    if (error.code === '23505') return { ok: false, erros: [{ campo: 'slug', mensagem: 'Já existe uma planta com esse endereço. Escolha outro.' }] }
    return { ok: false, erros: [{ campo: 'geral', mensagem: `Não foi possível salvar (${error.message}).` }] }
  }

  // Usos e validações: substitui a lista inteira pela do formulário
  await supabase.from('usos').delete().eq('planta', d.slug)
  if (d.usos.length) {
    await supabase.from('usos').insert(d.usos.map((u, i) => ({ planta: d.slug, nivel: u.nivel, texto: limpar(u.texto), ordem: i })))
  }
  await supabase.from('validacoes').delete().eq('planta', d.slug)
  if (d.validacoes.length) {
    await supabase.from('validacoes').insert(d.validacoes.map((v) => ({ planta: d.slug, nome: limpar(v.nome), area: v.area, data: v.data })))
  }

  updateTag(ETIQUETA)
  return { ok: true, slug: d.slug }
}

export async function excluirPlanta(slug: string): Promise<{ ok: boolean; mensagem?: string }> {
  await exigirEditor()
  const supabase = await clienteComSessao()
  const { data: atual } = await supabase.from('plantas').select('imagem_url').eq('slug', slug).maybeSingle()
  const { error } = await supabase.from('plantas').delete().eq('slug', slug)
  if (error) return { ok: false, mensagem: `Não foi possível excluir (${error.message}).` }
  // Apaga também a foto guardada no armazenamento, para não deixar arquivo órfão
  const caminho = atual?.imagem_url?.split('/storage/v1/object/public/midias/')[1]
  if (caminho) await supabase.storage.from('midias').remove([decodeURIComponent(caminho)])
  updateTag(ETIQUETA)
  return { ok: true }
}
