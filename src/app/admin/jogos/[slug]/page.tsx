import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { EditorJogo } from '@/components/admin/EditorJogo'
import { Migalha } from '@/components/admin/Migalha'
import { jogoDoPainel } from '@/lib/admin-jogos'
import { exigirEditor } from '@/lib/auth'

async function Formulario({ params }: { params: PageProps<'/admin/jogos/[slug]'>['params'] }) {
  await exigirEditor()
  const jogo = await jogoDoPainel((await params).slug)
  if (!jogo) notFound()
  return (
    <>
      <h1>{jogo.titulo}</h1>
      <EditorJogo key={jogo.slug} inicial={jogo} slugOriginal={jogo.slug} />
    </>
  )
}

export default function EditarJogo({ params }: PageProps<'/admin/jogos/[slug]'>) {
  return (
    <div className="grid gap-6">
      <Migalha itens={[{ href: '/admin', rotulo: 'Painel' }, { href: '/admin/jogos', rotulo: 'Jogos' }]} />
      <Suspense fallback={<p className="text-suave">Carregando o jogo…</p>}>
        <Formulario params={params} />
      </Suspense>
    </div>
  )
}
