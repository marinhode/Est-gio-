'use server'

import { updateTag } from 'next/cache'
import { exigirEditor } from '@/lib/auth'
import { ETIQUETA } from '@/lib/conteudo'
import { clienteComSessao } from '@/lib/supabase/servidor'
import type { Canteiro } from '@/lib/tipos'

export async function salvarCanteiro(c: Canteiro, novo: boolean): Promise<{ ok: boolean; mensagem: string }> {
  await exigirEditor()
  if (!c.nome.trim()) return { ok: false, mensagem: 'Dê um nome ao canteiro.' }
  if (!Number.isInteger(c.numero) || c.numero < 1) return { ok: false, mensagem: 'O número do canteiro deve ser 1 ou maior.' }
  const supabase = await clienteComSessao()
  const linha = { id: c.id, numero: c.numero, nome: c.nome.trim(), descricao: c.descricao.trim() }
  const { error } = novo ? await supabase.from('canteiros').insert(linha) : await supabase.from('canteiros').update(linha).eq('id', c.id)
  if (error) {
    if (error.code === '23505') return { ok: false, mensagem: `Já existe um canteiro com o número ${c.numero}.` }
    return { ok: false, mensagem: `Não foi possível salvar (${error.message}).` }
  }
  updateTag(ETIQUETA)
  return { ok: true, mensagem: `Canteiro ${c.numero} salvo.` }
}

export async function excluirCanteiro(id: string): Promise<{ ok: boolean; mensagem: string }> {
  await exigirEditor()
  const supabase = await clienteComSessao()
  const { error } = await supabase.from('canteiros').delete().eq('id', id)
  if (error) return { ok: false, mensagem: `Não foi possível excluir (${error.message}).` }
  updateTag(ETIQUETA)
  return { ok: true, mensagem: 'Canteiro excluído. As plantas dele ficaram sem canteiro.' }
}
