import { Suspense } from 'react'
import { EditorTexto } from '@/components/admin/EditorTexto'
import { Migalha } from '@/components/admin/Migalha'
import { exigirEditor } from '@/lib/auth'
import { textoVazio } from '@/lib/formulario-texto'

async function Formulario() {
  await exigirEditor()
  return <EditorTexto inicial={textoVazio()} chaveOriginal={null} />
}

export default function NovoTema() {
  return (
    <div className="grid gap-6">
      <Migalha itens={[{ href: '/admin', rotulo: 'Painel' }, { href: '/admin/textos', rotulo: 'Textos' }]} />
      <h1>Novo tema</h1>
      <Suspense fallback={<p className="text-suave">Carregando…</p>}>
        <Formulario />
      </Suspense>
    </div>
  )
}
