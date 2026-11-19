import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AvisoExemplo } from '@/components/AvisoExemplo'
import { JogoInterativo } from '@/components/JogoInterativo'
import { listarJogos, obterJogo } from '@/lib/conteudo'

export async function generateStaticParams() {
  return (await listarJogos()).map((j) => ({ jogo: j.slug }))
}

export async function generateMetadata({ params }: PageProps<'/jogos/[jogo]'>): Promise<Metadata> {
  const jogo = await obterJogo((await params).jogo)
  return jogo ? { title: jogo.titulo, description: jogo.descricao } : {}
}

export default async function PaginaJogo({ params }: PageProps<'/jogos/[jogo]'>) {
  const jogo = await obterJogo((await params).jogo)
  if (!jogo) notFound()

  return (
    <div className="largura gutter grid gap-8 py-10">
      <header className="cabecalho-pagina">
        <nav aria-label="Você está em">
          <Link href="/jogos" transitionTypes={['nav-back']} className="text-sm">
            Todos os jogos
          </Link>
        </nav>
        <h1 className="titulo-pagina">{jogo.titulo}</h1>
        <p className="subtitulo">{jogo.descricao}</p>
        {jogo.exemplo && <AvisoExemplo />}
      </header>
      <div className="max-w-3xl">
        <JogoInterativo jogo={jogo} />
      </div>
    </div>
  )
}
