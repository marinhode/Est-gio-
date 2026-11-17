import { Suspense } from 'react'
import { EditorJogo } from '@/components/admin/EditorJogo'
import { Migalha } from '@/components/admin/Migalha'
import { exigirEditor } from '@/lib/auth'
import { jogoVazio } from '@/lib/formulario-jogo'

async function Formulario() {
  await exigirEditor()
  return <EditorJogo inicial={jogoVazio()} slugOriginal={null} />
}

export default function NovoJogo() {
  return (
    <div className="grid gap-6">
      <Migalha itens={[{ href: '/admin', rotulo: 'Painel' }, { href: '/admin/jogos', rotulo: 'Jogos' }]} />
      <h1>Novo jogo</h1>
      <Suspense fallback={<p className="text-suave">Carregando…</p>}>
        <Formulario />
      </Suspense>
    </div>
  )
}
