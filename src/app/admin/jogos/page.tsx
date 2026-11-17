import Link from 'next/link'
import { Suspense } from 'react'
import { Migalha } from '@/components/admin/Migalha'
import { jogosDoPainel } from '@/lib/admin-jogos'
import { exigirEditor } from '@/lib/auth'

async function Lista() {
  await exigirEditor()
  const jogos = await jogosDoPainel()
  if (!jogos.length) return <p className="rounded-md border border-dashed border-linha p-6 text-suave">Nenhum jogo cadastrado.</p>
  return (
    <ul className="grid gap-3">
      {jogos.map((j) => (
        <li key={j.slug}>
          <Link href={`/admin/jogos/${j.slug}`} className="group grid gap-2 rounded-md border border-linha bg-superficie p-4 text-tinta no-underline hover:border-azul sm:grid-cols-[1fr_auto] sm:items-center">
            <span className="grid gap-0.5">
              <span className="font-titulo text-xl text-azul group-hover:underline">{j.titulo}</span>
              <span className="text-sm text-suave">{j.tipo === 'mitos_verdades' ? 'Mitos e verdades' : 'Quiz'}, {j.perguntas.length} {j.perguntas.length === 1 ? 'pergunta' : 'perguntas'}</span>
            </span>
            <span className="flex flex-wrap gap-1.5">
              <span className={`selo !text-xs ${j.publicado ? 'selo-uso_reconhecido' : 'selo-popular'}`}>{j.publicado ? 'Publicado' : 'Rascunho'}</span>
              {j.exemplo && <span className="selo selo-popular !border-dashed !text-xs">Provisório</span>}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default function JogosAdmin() {
  return (
    <div className="grid gap-6">
      <Migalha itens={[{ href: '/admin', rotulo: 'Painel' }]} />
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1>Jogos</h1>
        <Link href="/admin/jogos/novo" className="btn">+ Novo jogo</Link>
      </div>
      <Suspense fallback={<p className="text-suave">Carregando jogos…</p>}>
        <Lista />
      </Suspense>
    </div>
  )
}
