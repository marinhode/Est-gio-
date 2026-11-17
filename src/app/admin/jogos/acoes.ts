'use server'

import { updateTag } from 'next/cache'
import type { ErroCampo } from '@/app/admin/plantas/acoes'
import { exigirEditor } from '@/lib/auth'
import { ETIQUETA } from '@/lib/conteudo'
import { clienteComSessao } from '@/lib/supabase/servidor'

export type DadosPergunta = { enunciado: string; opcoes: string[]; correta: number; feedback: string; fonteTitulo: string; fonteUrl: string }
export type DadosJogo = {
  slug: string
  titulo: string
  descricao: string
  tipo: 'quiz' | 'mitos_verdades'
  publicado: boolean
  exemplo: boolean
  perguntas: DadosPergunta[]
}


function validar(d: DadosJogo): ErroCampo[] {
  const erros: ErroCampo[] = []
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(d.slug)) erros.push({ campo: 'slug', mensagem: 'O endereço deve ter só letras minúsculas sem acento, números e hífens.' })
  if (!d.titulo.trim()) erros.push({ campo: 'titulo', mensagem: 'Dê um título ao jogo.' })
  if (!d.perguntas.length) erros.push({ campo: 'perguntas', mensagem: 'Inclua pelo menos uma pergunta.' })
  d.perguntas.forEach((p, i) => {
    const n = i + 1
    const opcoes = p.opcoes.map((o) => o.trim())
    if (!p.enunciado.trim()) erros.push({ campo: `pergunta-${i}`, mensagem: `Escreva o enunciado da pergunta ${n}.` })
    if (opcoes.filter(Boolean).length < 2 || opcoes.some((o) => !o)) erros.push({ campo: `pergunta-${i}`, mensagem: `A pergunta ${n} precisa de pelo menos duas alternativas, todas preenchidas.` })
    if (new Set(opcoes).size !== opcoes.length) erros.push({ campo: `pergunta-${i}`, mensagem: `A pergunta ${n} tem alternativas repetidas.` })
    if (p.correta < 0 || p.correta >= opcoes.length) erros.push({ campo: `pergunta-${i}`, mensagem: `Marque a resposta certa da pergunta ${n}.` })
    if (!p.feedback.trim()) erros.push({ campo: `pergunta-${i}`, mensagem: `Escreva a explicação da pergunta ${n}: ela aparece depois da resposta.` })
    if (p.fonteUrl && !/^https?:\/\//.test(p.fonteUrl)) erros.push({ campo: `pergunta-${i}`, mensagem: `O link da fonte da pergunta ${n} deve começar com https://.` })
  })
  return erros
}

export async function salvarJogo(d: DadosJogo, slugOriginal: string | null): Promise<{ ok: true; slug: string } | { ok: false; erros: ErroCampo[] }> {
  await exigirEditor()
  const erros = validar(d)
  if (erros.length) return { ok: false, erros }
  const supabase = await clienteComSessao()
  const linha = { slug: d.slug, titulo: d.titulo.trim(), descricao: d.descricao.trim(), tipo: d.tipo, publicado: d.publicado, exemplo: d.exemplo }
  const { error } = slugOriginal ? await supabase.from('jogos').update(linha).eq('slug', slugOriginal) : await supabase.from('jogos').insert(linha)
  if (error) {
    if (error.code === '23505') return { ok: false, erros: [{ campo: 'slug', mensagem: 'Já existe um jogo com esse endereço.' }] }
    return { ok: false, erros: [{ campo: 'geral', mensagem: `Não foi possível salvar (${error.message}).` }] }
  }
  await supabase.from('quiz_perguntas').delete().eq('jogo', d.slug)
  const { error: e2 } = await supabase.from('quiz_perguntas').insert(
    d.perguntas.map((p, i) => ({
      jogo: d.slug, enunciado: p.enunciado.trim(), opcoes: p.opcoes.map((o) => o.trim()), correta: p.correta, feedback: p.feedback.trim(),
      fonte_titulo: p.fonteTitulo.trim() || null, fonte_url: p.fonteUrl.trim() || null, ordem: i,
    })),
  )
  if (e2) return { ok: false, erros: [{ campo: 'geral', mensagem: `O jogo foi salvo, mas as perguntas não (${e2.message}). Tente de novo.` }] }
  updateTag(ETIQUETA)
  return { ok: true, slug: d.slug }
}

export async function excluirJogo(slug: string): Promise<{ ok: boolean; mensagem?: string }> {
  await exigirEditor()
  const supabase = await clienteComSessao()
  const { error } = await supabase.from('jogos').delete().eq('slug', slug)
  if (error) return { ok: false, mensagem: `Não foi possível excluir (${error.message}).` }
  updateTag(ETIQUETA)
  return { ok: true }
}
