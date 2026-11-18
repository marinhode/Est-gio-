import type { Metadata } from 'next'
import Link from 'next/link'
import { Icone } from '@/components/Icone'
import { listarParadas } from '@/lib/conteudo'

export const metadata: Metadata = {
  title: 'Tour virtual',
  description: 'Uma visita guiada ao Laboratório Sensorial em cinco paradas, com fotos, narração e as plantas de cada canteiro.',
}

export default async function Tour() {
  const paradas = await listarParadas()
  return (
    <div className="largura gutter grid gap-10 py-12">
      <header className="leitura grid gap-4">
        <p className="flex items-center gap-2 font-bold text-azul"><Icone nome="tour" />Estação Tour</p>
        <h1 className="text-[2.3rem] sm:text-[2.8rem]">Tour virtual pelo laboratório</h1>
        <p className="text-lg">
          Uma visita guiada em {paradas.length} paradas. Em cada uma, toque nos pontos destacados para conhecer canteiros e plantas.
        </p>
        <div className="flex flex-wrap gap-3">
          {paradas[0] && <Link href={`/tour/${paradas[0].ordem}`} transitionTypes={['nav-forward']} className="btn"><Icone nome="tour" />Começar o tour</Link>}
          <Link href="/tour/lista" className="btn btn-sec">Ver o tour em lista</Link>
        </div>
        <p className="nota">A versão em lista traz o mesmo conteúdo sem depender de imagens, para leitores de tela ou conexões lentas.</p>
      </header>
      <ol className="grid gap-3 md:grid-cols-5">
        {paradas.map((p) => (
          <li key={p.id}>
            <Link href={`/tour/${p.ordem}`} transitionTypes={['nav-forward']} className="group grid h-full content-start gap-1 rounded-md border border-linha bg-superficie p-4 text-tinta no-underline hover:border-azul">
              <span className="font-titulo text-3xl text-azul">{p.ordem}</span>
              <span className="font-bold group-hover:underline">{p.titulo}</span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  )
}
