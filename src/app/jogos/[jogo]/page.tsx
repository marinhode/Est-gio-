import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AvisoExemplo } from '@/components/AvisoExemplo'
import { Icone } from '@/components/Icone'
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
      <header className="leitura grid gap-4">
        <nav aria-label="Você está em">
          <Link href="/jogos" className="inline-flex min-h-11 items-center gap-2 font-bold no-underline hover:underline">
            <Icone nome="jogos" className="size-4" />
            Jogos e desafios
          </Link>
        </nav>
        <h1 className="text-[2.1rem] sm:text-[2.6rem]">{jogo.titulo}</h1>
        <p className="text-lg">{jogo.descricao}</p>
        {jogo.exemplo && <AvisoExemplo />}
      </header>
      <div className="max-w-3xl">
        <JogoInterativo jogo={jogo} />
      </div>
    </div>
  )
}
