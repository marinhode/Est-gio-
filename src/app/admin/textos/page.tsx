import Link from 'next/link'
import { Suspense } from 'react'
import { Migalha } from '@/components/admin/Migalha'
import { temasDoPainel } from '@/lib/admin-textos'
import { exigirEditor } from '@/lib/auth'

async function Lista() {
  await exigirEditor()
  const temas = await temasDoPainel()
  return (
    <ul className="grid gap-3">
      {temas.map((t) => (
        <li key={t.slug}>
          <Link href={`/admin/textos/${t.slug}`} className="group grid gap-2 rounded-md border border-linha bg-superficie p-4 text-tinta no-underline hover:border-azul sm:grid-cols-[1fr_auto] sm:items-center">
            <span className="grid gap-0.5">
              <span className="font-titulo text-xl text-azul group-hover:underline">{t.titulo}</span>
              <span className="text-sm text-suave">{t.resumo}</span>
            </span>
            {t.exemplo && <span className="selo selo-popular !border-dashed !text-xs">Provisório</span>}
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default function TextosAdmin() {
  return (
    <div className="grid gap-6">
      <Migalha itens={[{ href: '/admin', rotulo: 'Painel' }]} />
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1>Textos da estação Sentidos</h1>
        <Link href="/admin/textos/novo" className="btn">+ Novo tema</Link>
      </div>
      <Suspense fallback={<p className="text-suave">Carregando…</p>}>
        <Lista />
      </Suspense>
    </div>
  )
}
