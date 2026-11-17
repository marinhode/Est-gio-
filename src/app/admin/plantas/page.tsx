import Link from 'next/link'
import { Suspense } from 'react'
import { Migalha } from '@/components/admin/Migalha'
import { canteirosDoPainel, plantasDoPainel } from '@/lib/admin'
import { exigirEditor } from '@/lib/auth'

async function Lista({ searchParams }: { searchParams: PageProps<'/admin/plantas'>['searchParams'] }) {
  await exigirEditor()
  const [plantas, canteiros, sp] = await Promise.all([plantasDoPainel(), canteirosDoPainel(), searchParams])
  const nomeCanteiro = (id: string) => canteiros.find((c) => c.id === id)

  return (
    <div className="grid gap-6">
      {sp.excluida && <p role="status" className="rounded border border-linha bg-superficie px-3 py-2">Planta excluída.</p>}
      {plantas.length === 0 ? (
        <p className="rounded-md border border-dashed border-linha p-6 text-suave">Nenhuma planta cadastrada. Comece pela primeira.</p>
      ) : (
        <ul className="grid gap-3">
          {plantas.map((p) => {
            const c = nomeCanteiro(p.canteiroId)
            return (
              <li key={p.slug}>
                <Link href={`/admin/plantas/${p.slug}`} className="group grid gap-2 rounded-md border border-linha bg-superficie p-4 text-tinta no-underline hover:border-azul sm:grid-cols-[1fr_auto] sm:items-center">
                  <span className="grid gap-0.5">
                    <span className="font-titulo text-xl text-azul group-hover:underline">{p.nomePopular}</span>
                    <span className="text-sm text-suave">
                      <em>{p.nomeCientifico}</em>
                      {c ? `, canteiro ${c.numero}` : ', sem canteiro'}
                    </span>
                  </span>
                  <span className="flex flex-wrap gap-1.5">
                    <span className={`selo !text-xs ${p.publicado ? 'selo-uso_reconhecido' : 'selo-popular'}`}>{p.publicado ? 'Publicada' : 'Rascunho'}</span>
                    {p.exemplo && <span className="selo selo-popular !border-dashed !text-xs">Provisória</span>}
                    {p.validacoes.length > 0 && <span className="selo selo-evidencia_cientifica !text-xs">Validada</span>}
                    {!p.imagem && <span className="selo selo-popular !text-xs">Sem foto</span>}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default function PlantasAdmin({ searchParams }: PageProps<'/admin/plantas'>) {
  return (
    <div className="grid gap-6">
      <Migalha itens={[{ href: '/admin', rotulo: 'Painel' }]} />
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1>Plantas</h1>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/canteiros" className="btn btn-sec">Canteiros</Link>
          <Link href="/admin/plantas/nova" className="btn">+ Nova planta</Link>
        </div>
      </div>
      <Suspense fallback={<p className="text-suave">Carregando plantas…</p>}>
        <Lista searchParams={searchParams} />
      </Suspense>
    </div>
  )
}
