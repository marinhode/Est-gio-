import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AvisoExemplo } from '@/components/AvisoExemplo'
import { CenaTour } from '@/components/CenaTour'
import { Icone } from '@/components/Icone'
import { listarParadas } from '@/lib/conteudo'

export async function generateStaticParams() {
  return (await listarParadas()).map((p) => ({ ordem: String(p.ordem) }))
}

async function obter(params: PageProps<'/tour/[ordem]'>['params']) {
  const { ordem } = await params
  const paradas = await listarParadas()
  const i = paradas.findIndex((p) => String(p.ordem) === ordem)
  return { paradas, i, parada: paradas[i] }
}

export async function generateMetadata({ params }: PageProps<'/tour/[ordem]'>): Promise<Metadata> {
  const { parada } = await obter(params)
  return parada ? { title: `Tour: ${parada.titulo}` } : {}
}

export default async function Parada({ params }: PageProps<'/tour/[ordem]'>) {
  const { paradas, i, parada } = await obter(params)
  if (!parada) notFound()
  const anterior = paradas[i - 1]
  const proxima = paradas[i + 1]
  const ultima = !proxima

  return (
    <div className="largura gutter grid gap-6 py-8">
      {/* Progresso: a ordem das paradas é o próprio percurso */}
      <nav aria-label="Paradas do tour">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <ol className="trilha">
            {paradas.map((p) => {
              const estado = p.id === parada.id ? 'atual' : p.ordem < parada.ordem ? 'feito' : 'adiante'
              return (
                <li key={p.id} data-estado={estado}>
                  <Link
                    href={`/tour/${p.ordem}`}
                    transitionTypes={p.ordem < parada.ordem ? ['nav-back'] : ['nav-forward']}
                    aria-current={estado === 'atual' ? 'step' : undefined}
                    aria-label={`Parada ${p.ordem}: ${p.titulo}`}
                    className="marco"
                  >
                    <span className="marco-num">{p.ordem}</span>
                  </Link>
                </li>
              )
            })}
          </ol>
          <Link href="/tour/lista" className="inline-flex min-h-11 items-center text-sm">Ver em lista</Link>
        </div>
      </nav>

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <CenaTour key={parada.id} parada={parada} />
        <div className="grid gap-5">
          <div className="grid gap-2">
            <p className="nota">Parada {parada.ordem} de {paradas.length}</p>
            <h1 className="text-[2.1rem] sm:text-[2.5rem]">{parada.titulo}</h1>
          </div>
          <p className="text-lg">{parada.texto}</p>
          {parada.exemplo && <AvisoExemplo />}
          {parada.audio && (
            <div className="grid gap-2 rounded-md border border-linha bg-superficie p-4">
              <p className="font-bold">Ouça a narração</p>
              <audio controls preload="none" src={parada.audio.src} className="w-full">
                Seu navegador não toca áudio. Leia a transcrição abaixo.
              </audio>
              <details>
                <summary className="inline-flex min-h-11 cursor-pointer items-center font-bold text-azul">Ler a transcrição</summary>
                <p>{parada.audio.transcricao}</p>
              </details>
            </div>
          )}
          {ultima && (
            <div className="grid gap-2">
              <Link href="/jogos" className="btn"><Icone nome="jogos" />Fazer o quiz final</Link>
              <Link href="/comunidade" className="btn btn-sec">Conhecer os projetos dos estudantes</Link>
              <Link href="/mapa" className="btn btn-sec"><Icone nome="mapa" />Planejar a visita presencial</Link>
            </div>
          )}
        </div>
      </div>

      <nav aria-label="Navegar pelo tour" className="flex flex-wrap items-center gap-3 border-t border-linha pt-5">
        {anterior ? <Link href={`/tour/${anterior.ordem}`} transitionTypes={['nav-back']} className="btn btn-sec">Parada anterior</Link> : <Link href="/tour" transitionTypes={['nav-back']} className="btn btn-sec">Início do tour</Link>}
        <Link href="/mapa" className="btn btn-sec"><Icone nome="mapa" />Mapa da horta</Link>
        {proxima && (
          <Link href={`/tour/${proxima.ordem}`} transitionTypes={['nav-forward']} className="btn ml-auto">
            Próxima parada: {proxima.titulo}
          </Link>
        )}
      </nav>
    </div>
  )
}
