import { Suspense } from 'react'
import { EditorPlanta } from '@/components/admin/EditorPlanta'
import { plantaVazia } from '@/lib/formulario-planta'
import { Migalha } from '@/components/admin/Migalha'
import { canteirosDoPainel } from '@/lib/admin'
import { exigirEditor } from '@/lib/auth'

async function Formulario() {
  const editor = await exigirEditor()
  const canteiros = await canteirosDoPainel()
  return <EditorPlanta inicial={plantaVazia()} slugOriginal={null} canteiros={canteiros} editor={editor} />
}

export default function NovaPlanta() {
  return (
    <div className="grid gap-6">
      <Migalha itens={[{ href: '/admin', rotulo: 'Painel' }, { href: '/admin/plantas', rotulo: 'Plantas' }]} />
      <h1>Nova planta</h1>
      <p className="leitura text-suave">Siga a ficha padrão do laboratório. Você pode salvar como rascunho e completar depois: só fichas publicadas aparecem no site.</p>
      <Suspense fallback={<p className="text-suave">Carregando…</p>}>
        <Formulario />
      </Suspense>
    </div>
  )
}
