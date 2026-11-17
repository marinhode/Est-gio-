'use client'

import { clienteNavegador } from '@/lib/supabase/navegador'

/** Envia um arquivo do painel para o armazenamento público 'midias' e devolve o endereço. */
export async function enviarArquivo(arquivo: File, pasta: string, tipos: string[], limiteMb: number): Promise<{ url: string } | { erro: string }> {
  if (!tipos.includes(arquivo.type)) return { erro: 'Formato não aceito. Confira o tipo de arquivo.' }
  if (arquivo.size > limiteMb * 1024 * 1024) return { erro: `O arquivo passa de ${limiteMb} MB. Reduza o tamanho e tente de novo.` }
  const extensao = arquivo.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'bin'
  const caminho = `${pasta}-${Date.now()}.${extensao}`
  const supabase = clienteNavegador()
  const { error } = await supabase.storage.from('midias').upload(caminho, arquivo, { cacheControl: '31536000' })
  if (error) return { erro: `Não foi possível enviar (${error.message}).` }
  return { url: supabase.storage.from('midias').getPublicUrl(caminho).data.publicUrl }
}
