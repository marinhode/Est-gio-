import { Suspense } from 'react'
import type { DadosProjeto } from '@/app/admin/projetos/acoes'
import { EditorProjetos } from '@/components/admin/EditorProjetos'
import { Migalha } from '@/components/admin/Migalha'
import { exigirEditor } from '@/lib/auth'
import { clienteComSessao } from '@/lib/supabase/servidor'

async function Editor() {
  await exigirEditor()
  const supabase = await clienteComSessao()
  const { data } = await supabase.from('projetos').select('id, curso, tipo, titulo, descricao, link, ano, publicado').order('id', { ascending: false })
  const projetos: DadosProjeto[] = (data ?? []).map((p) => ({ ...p, link: p.link ?? '', ano: p.ano ? String(p.ano) : '' }))
  return <EditorProjetos inicial={projetos} />
}

export default function ProjetosAdmin() {
  return (
    <div className="grid gap-6">
      <Migalha itens={[{ href: '/admin', rotulo: 'Painel' }]} />
      <h1>Projetos acadêmicos</h1>
      <p className="leitura text-suave">Pesquisas, produtos, vídeos e atividades de extensão dos cursos. Aparecem na estação Comunidade.</p>
      <Suspense fallback={<p className="text-suave">Carregando…</p>}>
        <Editor />
      </Suspense>
    </div>
  )
}
