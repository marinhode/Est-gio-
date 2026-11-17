import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { EditorTexto } from '@/components/admin/EditorTexto'
import { Migalha } from '@/components/admin/Migalha'
import { temaDoPainel } from '@/lib/admin-textos'
import { exigirEditor } from '@/lib/auth'
import { temaParaFormulario } from '@/lib/formulario-texto'

async function Formulario({ params }: { params: PageProps<'/admin/textos/[chave]'>['params'] }) {
  await exigirEditor()
  const tema = await temaDoPainel((await params).chave)
  if (!tema) notFound()
  return (
    <>
      <h1>{tema.titulo}</h1>
      <EditorTexto key={tema.slug} inicial={temaParaFormulario(tema)} chaveOriginal={tema.slug} />
    </>
  )
}

export default function EditarTema({ params }: PageProps<'/admin/textos/[chave]'>) {
  return (
    <div className="grid gap-6">
      <Migalha itens={[{ href: '/admin', rotulo: 'Painel' }, { href: '/admin/textos', rotulo: 'Textos' }]} />
      <Suspense fallback={<p className="text-suave">Carregando o tema…</p>}>
        <Formulario params={params} />
      </Suspense>
    </div>
  )
}
