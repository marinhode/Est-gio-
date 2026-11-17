import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AtividadeGuiada } from '@/components/AtividadeGuiada'
import { AvisoExemplo } from '@/components/AvisoExemplo'
import { Icone } from '@/components/Icone'
import { PerguntaReflexiva } from '@/components/PerguntaReflexiva'
import { obterTema, temas } from '@/lib/dados/sentidos'

export function generateStaticParams() {
  return temas.map((t) => ({ tema: t.slug }))
}

export async function generateMetadata({ params }: PageProps<'/sentidos/[tema]'>): Promise<Metadata> {
  const tema = obterTema((await params).tema)
  return tema ? { title: tema.titulo, description: tema.resumo } : {}
}

export default async function Tema({ params }: PageProps<'/sentidos/[tema]'>) {
  const tema = obterTema((await params).tema)
  if (!tema) notFound()

  const i = temas.findIndex((t) => t.slug === tema.slug)
  const proximo = temas[(i + 1) % temas.length]

  return (
    <article className="largura gutter grid gap-10 py-10">
      <header className="leitura grid gap-4">
        <nav aria-label="Você está em">
          <Link href="/sentidos" className="c-sinta inline-flex min-h-11 items-center gap-2 font-bold no-underline hover:underline">
            <Icone nome="aroma" className="size-4" />
            Experiências sensoriais
          </Link>
        </nav>
        <h1 className="text-[2.1rem] sm:text-[2.6rem]">{tema.titulo}</h1>
        <p className="text-lg">{tema.resumo}</p>
        {tema.exemplo && <AvisoExemplo />}
      </header>

      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]">
        <div className="leitura grid gap-8">
          {tema.secoes.map((s) => (
            <section key={s.titulo} className="grid gap-3">
              <h2 className="text-[1.45rem]">{s.titulo}</h2>
              {s.texto.map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))}
            </section>
          ))}
          {tema.pergunta && <PerguntaReflexiva pergunta={tema.pergunta} sobre={tema.titulo} />}
        </div>

        {tema.experimente && (
          <div className="lg:sticky lg:top-24">
            <AtividadeGuiada {...tema.experimente} />
          </div>
        )}
      </div>

      <footer className="grid gap-8 border-t border-linha pt-8">
        {tema.fontes.length > 0 && (
          <section aria-labelledby="t-fontes" className="leitura grid gap-2">
            <h2 id="t-fontes" className="text-[1.15rem]">Fontes</h2>
            <ul className="grid gap-2 text-sm">
              {tema.fontes.map((f) => (
                <li key={f.titulo}>
                  {f.url ? <a href={f.url}>{f.titulo}</a> : f.titulo}
                  {f.consultadoEm && (
                    <span className="text-suave"> Consultado em {f.consultadoEm.split('-').reverse().join('/')}.</span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}
        <Link href={`/sentidos/${proximo.slug}`} className="group grid max-w-md gap-1 text-tinta no-underline">
          <span className="nota">Próximo tema</span>
          <span className="flex items-center gap-2 font-titulo text-xl text-lavanda group-hover:underline">
            {proximo.titulo}
            <Icone nome="seta" />
          </span>
        </Link>
      </footer>
    </article>
  )
}
