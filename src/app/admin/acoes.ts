'use server'

import { redirect } from 'next/navigation'
import { clienteComSessao } from '@/lib/supabase/servidor'

export type EstadoLogin = { erro?: string; email?: string }

export async function entrar(_anterior: EstadoLogin, dados: FormData): Promise<EstadoLogin> {
  const email = String(dados.get('email') ?? '').trim()
  const senha = String(dados.get('senha') ?? '')
  if (!email || !senha) return { erro: 'Preencha o e-mail e a senha.', email }

  const supabase = await clienteComSessao()
  const { error } = await supabase.auth.signInWithPassword({ email, password: senha })
  if (error) return { erro: 'E-mail ou senha incorretos. Confira e tente de novo.', email }

  const { data: autorizado } = await supabase.rpc('eh_editor')
  if (!autorizado) {
    await supabase.auth.signOut()
    return { erro: 'Esta conta não tem acesso ao painel. Fale com a coordenação do laboratório.', email }
  }

  redirect('/admin')
}

export async function sair() {
  const supabase = await clienteComSessao()
  await supabase.auth.signOut()
  redirect('/admin/entrar?motivo=saiu')
}
