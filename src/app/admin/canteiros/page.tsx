import { Suspense } from 'react'
import { EditorCanteiros } from '@/components/admin/EditorCanteiros'
import { Migalha } from '@/components/admin/Migalha'
import { canteirosDoPainel, plantasDoPainel } from '@/lib/admin'
import { exigirEditor } from '@/lib/auth'

async function Editor() {
  await exigirEditor()
  const [canteiros, plantas] = await Promise.all([canteirosDoPainel(), plantasDoPainel()])
  const contagem: Record<string, number> = {}
  plantas.forEach((p) => (contagem[p.canteiroId] = (contagem[p.canteiroId] ?? 0) + 1))
  return <EditorCanteiros inicial={canteiros} contagem={contagem} />
}

export default function CanteirosAdmin() {
  return (
    <div className="grid gap-6">
      <Migalha itens={[{ href: '/admin', rotulo: 'Painel' }, { href: '/admin/plantas', rotulo: 'Plantas' }]} />
      <h1>Canteiros</h1>
      <p className="leitura text-suave">Os canteiros organizam a horta no mapa, no catálogo e nas placas de QR Code.</p>
      <Suspense fallback={<p className="text-suave">Carregando…</p>}>
        <Editor />
      </Suspense>
    </div>
  )
}
