'use server'

import { updateTag } from 'next/cache'
import type { ErroCampo } from '@/app/admin/plantas/acoes'
import { exigirEditor } from '@/lib/auth'
import { ETIQUETA } from '@/lib/conteudo'
import { clienteComSessao } from '@/lib/supabase/servidor'

export type DadosMarcador = { x: number; y: number; rotulo: string; alvo: string } // alvo: 'planta:slug' ou 'canteiro:id'
export type DadosParada = {
  id: number
  titulo: string
  texto: string
  imagemUrl: string
  imagemAlt: string
  audioUrl: string
  transcricao: string
  exemplo: boolean
  marcadores: DadosMarcador[]
}

export async function salvarParada(d: DadosParada): Promise<{ ok: true } | { ok: false; erros: ErroCampo[] }> {
  await exigirEditor()
  const erros: ErroCampo[] = []
  if (!d.titulo.trim()) erros.push({ campo: 'titulo', mensagem: 'Dê um título à parada.' })
  if (!d.texto.trim()) erros.push({ campo: 'texto', mensagem: 'Escreva o texto da parada.' })
  if (d.imagemUrl && !d.imagemAlt.trim()) erros.push({ campo: 'imagemAlt', mensagem: 'Descreva a foto no texto alternativo.' })
  if (d.audioUrl && !d.transcricao.trim()) erros.push({ campo: 'transcricao', mensagem: 'Todo áudio precisa de transcrição, para quem não pode ouvir.' })
  d.marcadores.forEach((m, i) => {
    if (!m.rotulo.trim()) erros.push({ campo: `marcador-${i}`, mensagem: `Dê um nome ao ponto ${i + 1}.` })
    if (!/^(planta|canteiro):.+/.test(m.alvo)) erros.push({ campo: `marcador-${i}`, mensagem: `Escolha a planta ou o canteiro do ponto ${i + 1}.` })
  })
  if (erros.length) return { ok: false, erros }

  const supabase = await clienteComSessao()
  const { error } = await supabase
    .from('tour_paradas')
    .update({
      titulo: d.titulo.trim(), texto: d.texto.trim(),
      imagem_url: d.imagemUrl || null, imagem_alt: d.imagemUrl ? d.imagemAlt.trim() : null,
      audio_url: d.audioUrl || null, transcricao: d.audioUrl ? d.transcricao.trim() : null,
      exemplo: d.exemplo,
    })
    .eq('id', d.id)
  if (error) return { ok: false, erros: [{ campo: 'geral', mensagem: `Não foi possível salvar (${error.message}).` }] }

  await supabase.from('tour_marcadores').delete().eq('parada_id', d.id)
  if (d.marcadores.length) {
    const { error: e2 } = await supabase.from('tour_marcadores').insert(
      d.marcadores.map((m, i) => {
        const [tipo, valor] = m.alvo.split(':')
        return {
          parada_id: d.id, ordem: i, rotulo: m.rotulo.trim(),
          x: Math.min(100, Math.max(0, Math.round(m.x * 10) / 10)), y: Math.min(100, Math.max(0, Math.round(m.y * 10) / 10)),
          planta: tipo === 'planta' ? valor : null, canteiro_id: tipo === 'canteiro' ? valor : null,
        }
      }),
    )
    if (e2) return { ok: false, erros: [{ campo: 'geral', mensagem: `A parada foi salva, mas os pontos não (${e2.message}).` }] }
  }
  updateTag(ETIQUETA)
  return { ok: true }
}
