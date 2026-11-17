import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import type { DadosParada } from '@/app/admin/tour/acoes'
import { EditorParada } from '@/components/admin/EditorParada'
import { Migalha } from '@/components/admin/Migalha'
import { canteirosDoPainel, plantasDoPainel } from '@/lib/admin'
import { exigirEditor } from '@/lib/auth'
import { clienteComSessao } from '@/lib/supabase/servidor'

type Linha = {
  id: number; ordem: number; titulo: string; texto: string; imagem_url: string | null; imagem_alt: string | null; audio_url: string | null
  transcricao: string | null; exemplo: boolean; tour_marcadores: { x: number; y: number; rotulo: string; planta: string | null; canteiro_id: string | null; ordem: number }[]
}

async function Formulario({ params }: { params: PageProps<'/admin/tour/[id]'>['params'] }) {
  await exigirEditor()
  const id = Number((await params).id)
  if (!Number.isInteger(id)) notFound()
  const supabase = await clienteComSessao()
  const [{ data }, plantas, canteiros] = await Promise.all([
    supabase.from('tour_paradas').select('*, tour_marcadores(x, y, rotulo, planta, canteiro_id, ordem)').eq('id', id).maybeSingle(),
    plantasDoPainel(),
    canteirosDoPainel(),
  ])
  if (!data) notFound()
  const p = data as Linha
  const inicial: DadosParada = {
    id: p.id, titulo: p.titulo, texto: p.texto, imagemUrl: p.imagem_url ?? '', imagemAlt: p.imagem_alt ?? '', audioUrl: p.audio_url ?? '',
    transcricao: p.transcricao ?? '', exemplo: p.exemplo,
    marcadores: [...p.tour_marcadores].sort((a, b) => a.ordem - b.ordem).map((m) => ({
      x: Number(m.x), y: Number(m.y), rotulo: m.rotulo, alvo: m.planta ? `planta:${m.planta}` : m.canteiro_id ? `canteiro:${m.canteiro_id}` : '',
    })),
  }
  const alvos = [
    ...plantas.map((pl) => ({ valor: `planta:${pl.slug}`, rotulo: `Planta: ${pl.nomePopular}` })),
    ...canteiros.map((c) => ({ valor: `canteiro:${c.id}`, rotulo: `Canteiro ${c.numero}: ${c.nome}` })),
  ]
  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1>Parada {p.ordem}</h1>
        <Link href={`/tour/${p.ordem}`} className="btn btn-sec" target="_blank">Ver no site</Link>
      </div>
      <EditorParada key={p.id} inicial={inicial} alvos={alvos} />
    </>
  )
}

export default function EditarParada({ params }: PageProps<'/admin/tour/[id]'>) {
  return (
    <div className="grid gap-6">
      <Migalha itens={[{ href: '/admin', rotulo: 'Painel' }, { href: '/admin/tour', rotulo: 'Tour' }]} />
      <Suspense fallback={<p className="text-suave">Carregando a parada…</p>}>
        <Formulario params={params} />
      </Suspense>
    </div>
  )
}
