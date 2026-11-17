import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { EditorPlanta } from '@/components/admin/EditorPlanta'
import { Migalha } from '@/components/admin/Migalha'
import { canteirosDoPainel, paraFormulario, plantaDoPainel } from '@/lib/admin'
import { exigirEditor } from '@/lib/auth'

async function Formulario({ params }: { params: PageProps<'/admin/plantas/[slug]'>['params'] }) {
  const editor = await exigirEditor()
  const { slug } = await params
  const [planta, canteiros] = await Promise.all([plantaDoPainel(slug), canteirosDoPainel()])
  if (!planta) notFound()
  return (
    <>
      <h1>{planta.nomePopular}</h1>
      <p className="nota">Última atualização em {planta.atualizadoEm.split('-').reverse().join('/')}.</p>
      <EditorPlanta key={planta.slug} inicial={paraFormulario(planta)} slugOriginal={planta.slug} canteiros={canteiros} editor={editor} />
    </>
  )
}

export default function EditarPlanta({ params }: PageProps<'/admin/plantas/[slug]'>) {
  return (
    <div className="grid gap-6">
      <Migalha itens={[{ href: '/admin', rotulo: 'Painel' }, { href: '/admin/plantas', rotulo: 'Plantas' }]} />
      <Suspense fallback={<p className="text-suave">Carregando a ficha…</p>}>
        <Formulario params={params} />
      </Suspense>
    </div>
  )
}
