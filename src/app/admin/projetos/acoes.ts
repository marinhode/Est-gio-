'use server'

import { updateTag } from 'next/cache'
import { exigirEditor } from '@/lib/auth'
import { ETIQUETA } from '@/lib/conteudo'
import { clienteComSessao } from '@/lib/supabase/servidor'
import type { Projeto } from '@/lib/tipos'

export type DadosProjeto = Omit<Projeto, 'id' | 'link' | 'ano'> & { id: number | null; link: string; ano: string }

export async function salvarProjeto(p: DadosProjeto): Promise<{ ok: true; id: number; mensagem: string } | { ok: false; mensagem: string }> {
  await exigirEditor()
  if (!p.titulo.trim()) return { ok: false, mensagem: 'Dê um título ao projeto.' }
  if (!p.descricao.trim()) return { ok: false, mensagem: 'Escreva uma descrição curta do projeto.' }
  if (p.link && !/^https?:\/\//.test(p.link.trim())) return { ok: false, mensagem: 'O link deve começar com https://.' }
  const ano = p.ano.trim() ? Number(p.ano) : null
  if (ano !== null && (!Number.isInteger(ano) || ano < 1990 || ano > 2100)) return { ok: false, mensagem: 'Informe o ano com quatro dígitos, como 2026.' }
  const linha = { curso: p.curso, tipo: p.tipo, titulo: p.titulo.trim(), descricao: p.descricao.trim(), link: p.link.trim() || null, ano, publicado: p.publicado }
  const supabase = await clienteComSessao()
  const r = p.id ? await supabase.from('projetos').update(linha).eq('id', p.id).select('id').single() : await supabase.from('projetos').insert(linha).select('id').single()
  if (r.error) return { ok: false, mensagem: `Não foi possível salvar (${r.error.message}).` }
  updateTag(ETIQUETA)
  return { ok: true, id: r.data.id, mensagem: p.publicado ? 'Projeto salvo e publicado.' : 'Projeto salvo como rascunho.' }
}

export async function excluirProjeto(id: number): Promise<{ ok: boolean; mensagem: string }> {
  await exigirEditor()
  const supabase = await clienteComSessao()
  const { error } = await supabase.from('projetos').delete().eq('id', id)
  if (error) return { ok: false, mensagem: `Não foi possível excluir (${error.message}).` }
  updateTag(ETIQUETA)
  return { ok: true, mensagem: 'Projeto excluído.' }
}
