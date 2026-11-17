import 'server-only'
import { redirect } from 'next/navigation'
import { clienteComSessao } from '@/lib/supabase/servidor'

export type Editor = { id: string; email: string; nome: string }

/**
 * Camada de acesso: devolve o editor logado ou manda para o login.
 * Estar logado não basta: a conta precisa estar na tabela de editores.
 * Lê cookies, então só pode ser chamada dentro de um <Suspense>.
 */
export async function exigirEditor(): Promise<Editor> {
  const supabase = await clienteComSessao()
  const { data } = await supabase.auth.getUser()
  if (!data.user) redirect('/admin/entrar')

  const { data: autorizado } = await supabase.rpc('eh_editor')
  if (!autorizado) redirect('/admin/entrar?motivo=sem-acesso')

  return {
    id: data.user.id,
    email: data.user.email ?? '',
    nome: (data.user.user_metadata?.nome as string | undefined) ?? data.user.email ?? 'Equipe',
  }
}
