import Link from 'next/link'
import { Suspense } from 'react'
import { Migalha } from '@/components/admin/Migalha'
import { exigirEditor } from '@/lib/auth'
import { clienteComSessao } from '@/lib/supabase/servidor'

async function Lista() {
  await exigirEditor()
  const supabase = await clienteComSessao()
  const { data } = await supabase.from('tour_paradas').select('id, ordem, titulo, imagem_url, audio_url, tour_marcadores(count)').order('ordem')
  return (
    <ol className="grid gap-3">
      {(data ?? []).map((p) => {
        const pontos = (p.tour_marcadores as unknown as { count: number }[])[0]?.count ?? 0
        return (
          <li key={p.id}>
            <Link href={`/admin/tour/${p.id}`} className="group grid gap-2 rounded-md border border-linha bg-superficie p-4 text-tinta no-underline hover:border-azul sm:grid-cols-[1fr_auto] sm:items-center">
              <span className="grid gap-0.5">
                <span className="font-titulo text-xl text-azul group-hover:underline">{p.ordem}. {p.titulo}</span>
                <span className="text-sm text-suave">{pontos} {pontos === 1 ? 'ponto' : 'pontos'} de interesse</span>
              </span>
              <span className="flex flex-wrap gap-1.5">
                <span className={`selo !text-xs ${p.imagem_url ? 'selo-uso_reconhecido' : 'selo-popular'}`}>{p.imagem_url ? 'Com foto' : 'Sem foto'}</span>
                {p.audio_url && <span className="selo selo-evidencia_cientifica !text-xs">Com narração</span>}
              </span>
            </Link>
          </li>
        )
      })}
    </ol>
  )
}

export default function TourAdmin() {
  return (
    <div className="grid gap-6">
      <Migalha itens={[{ href: '/admin', rotulo: 'Painel' }]} />
      <h1>Paradas do tour</h1>
      <p className="leitura text-suave">O percurso segue as cinco paradas da orientação. Em cada uma, envie a foto do local e posicione os pontos de interesse.</p>
      <Suspense fallback={<p className="text-suave">Carregando…</p>}>
        <Lista />
      </Suspense>
    </div>
  )
}
