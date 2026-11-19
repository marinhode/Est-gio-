'use client'

import { clienteNavegador } from '@/lib/supabase/navegador'

const NOMES: Record<string, string> = {
  'image/jpeg': 'JPG', 'image/png': 'PNG', 'image/webp': 'WebP',
  'audio/mpeg': 'MP3', 'audio/mp4': 'M4A', 'audio/ogg': 'OGG', 'audio/wav': 'WAV',
}

/** Envia um arquivo do painel para o armazenamento público 'midias' e devolve o endereço. Nunca lança erro. */
export async function enviarArquivo(arquivo: File, pasta: string, tipos: string[], limiteMb: number): Promise<{ url: string } | { erro: string }> {
  if (!tipos.includes(arquivo.type)) return { erro: `Formato não aceito. Use ${tipos.map((t) => NOMES[t] ?? t).join(', ')}.` }
  if (arquivo.size > limiteMb * 1024 * 1024) return { erro: `O arquivo passa de ${limiteMb} MB. Reduza o tamanho e tente de novo.` }
  try {
    const extensao = arquivo.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'bin'
    const caminho = `${pasta}-${Date.now()}.${extensao}`
    const supabase = clienteNavegador()
    const { error } = await supabase.storage.from('midias').upload(caminho, arquivo, { cacheControl: '31536000' })
    if (error) return { erro: `Não foi possível enviar (${error.message}).` }
    return { url: supabase.storage.from('midias').getPublicUrl(caminho).data.publicUrl }
  } catch {
    return { erro: 'A conexão caiu durante o envio. Confira a internet e tente de novo.' }
  }
}
