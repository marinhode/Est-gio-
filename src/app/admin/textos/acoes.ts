'use server'

import { updateTag } from 'next/cache'
import type { ErroCampo } from '@/app/admin/plantas/acoes'
import { exigirEditor } from '@/lib/auth'
import { ETIQUETA } from '@/lib/conteudo'
import { clienteComSessao } from '@/lib/supabase/servidor'
import type { Fonte } from '@/lib/tipos'

export type DadosTexto = {
  chave: string
  titulo: string
  resumo: string
  secoes: { titulo: string; texto: string }[] // texto: parágrafos separados por linha em branco
  temAtividade: boolean
  atividade: { titulo: string; introducao: string; passos: { texto: string; segundos: string }[] }
  pergunta: string
  fontes: Fonte[]
  exemplo: boolean
}

function validar(d: DadosTexto): ErroCampo[] {
  const erros: ErroCampo[] = []
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(d.chave)) erros.push({ campo: 'chave', mensagem: 'O endereço deve ter só letras minúsculas sem acento, números e hífens.' })
  if (!d.titulo.trim()) erros.push({ campo: 'titulo', mensagem: 'Dê um título ao tema.' })
  if (!d.resumo.trim()) erros.push({ campo: 'resumo', mensagem: 'Escreva o resumo do tema.' })
  if (!d.secoes.length) erros.push({ campo: 'secoes', mensagem: 'Inclua pelo menos uma seção de texto.' })
  d.secoes.forEach((s, i) => {
    if (!s.titulo.trim() || !s.texto.trim()) erros.push({ campo: `secao-${i}`, mensagem: `Complete o título e o texto da seção ${i + 1}.` })
  })
  if (d.temAtividade) {
    if (!d.atividade.titulo.trim()) erros.push({ campo: 'atividade-titulo', mensagem: 'Dê um título à atividade.' })
    if (!d.atividade.passos.length) erros.push({ campo: 'passos', mensagem: 'A atividade precisa de pelo menos um passo.' })
    d.atividade.passos.forEach((p, i) => {
      if (!p.texto.trim()) erros.push({ campo: `passo-${i}`, mensagem: `Escreva o passo ${i + 1}.` })
      if (p.segundos && (!/^\d+$/.test(p.segundos) || Number(p.segundos) > 600)) erros.push({ campo: `passo-${i}`, mensagem: `O tempo do passo ${i + 1} deve ser em segundos, até 600.` })
    })
  }
  d.fontes.forEach((f, i) => {
    if (!f.titulo.trim()) erros.push({ campo: `fonte-${i}`, mensagem: `Escreva a referência da fonte ${i + 1} ou remova-a.` })
  })
  return erros
}

export async function salvarTexto(d: DadosTexto, chaveOriginal: string | null): Promise<{ ok: true; chave: string } | { ok: false; erros: ErroCampo[] }> {
  await exigirEditor()
  const erros = validar(d)
  if (erros.length) return { ok: false, erros }
  const supabase = await clienteComSessao()

  const dados = {
    secoes: d.secoes.map((s) => ({ titulo: s.titulo.trim(), texto: s.texto.split(/\n\s*\n/).map((t) => t.trim()).filter(Boolean) })),
    experimente: d.temAtividade
      ? {
          titulo: d.atividade.titulo.trim(),
          introducao: d.atividade.introducao.trim(),
          passos: d.atividade.passos.map((p) => ({ texto: p.texto.trim(), ...(p.segundos ? { segundos: Number(p.segundos) } : {}) })),
        }
      : null,
    pergunta: d.pergunta.trim() || null,
    fontes: d.fontes.map((f) => ({ titulo: f.titulo.trim(), ...(f.url ? { url: f.url.trim() } : {}), ...(f.consultadoEm ? { consultadoEm: f.consultadoEm } : {}) })),
  }
  const linha = { chave: d.chave, estacao: 'sentidos', titulo: d.titulo.trim(), resumo: d.resumo.trim(), corpo: '', dados, exemplo: d.exemplo, atualizado_em: new Date().toISOString() }

  let error
  if (chaveOriginal) {
    ;({ error } = await supabase.from('textos').update(linha).eq('chave', chaveOriginal))
  } else {
    const { data: ultimo } = await supabase.from('textos').select('ordem').order('ordem', { ascending: false }).limit(1).maybeSingle()
    ;({ error } = await supabase.from('textos').insert({ ...linha, ordem: (ultimo?.ordem ?? 0) + 1 }))
  }
  if (error) {
    if (error.code === '23505') return { ok: false, erros: [{ campo: 'chave', mensagem: 'Já existe um tema com esse endereço.' }] }
    return { ok: false, erros: [{ campo: 'geral', mensagem: `Não foi possível salvar (${error.message}).` }] }
  }
  updateTag(ETIQUETA)
  return { ok: true, chave: d.chave }
}

export async function excluirTexto(chave: string): Promise<{ ok: boolean; mensagem?: string }> {
  await exigirEditor()
  const supabase = await clienteComSessao()
  const { error } = await supabase.from('textos').delete().eq('chave', chave)
  if (error) return { ok: false, mensagem: `Não foi possível excluir (${error.message}).` }
  updateTag(ETIQUETA)
  return { ok: true }
}
