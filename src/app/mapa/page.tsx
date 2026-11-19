import type { Metadata } from 'next'
import Link from 'next/link'
import { listarCanteiros, listarPlantas } from '@/lib/conteudo'

export const metadata: Metadata = {
  title: 'Mapa da horta',
  description: 'Os canteiros da horta do Laboratório Sensorial, os caminhos entre eles e as plantas de cada um.',
}

// Planta baixa esquemática: canteiros em grade, separados por caminhos
const L = 220 // largura do canteiro
const A = 130 // altura do canteiro
const C = 46 // largura do caminho

export default async function Mapa() {
  const [canteiros, plantas] = await Promise.all([listarCanteiros(), listarPlantas()])
  const colunas = Math.min(3, Math.max(1, canteiros.length))
  const linhas = Math.ceil(canteiros.length / colunas)
  const largura = colunas * L + (colunas + 1) * C
  const altura = linhas * A + (linhas + 1) * C + 40
  const plantasDe = (id: string) => plantas.filter((p) => p.canteiroId === id)

  return (
    <div className="largura gutter grid gap-10 py-12">
      <header className="cabecalho-pagina">
        <h1 className="titulo-pagina">Onde fica cada planta</h1>
        <p className="subtitulo">Toque em um canteiro para ver as plantas que estão nele. A lista abaixo do mapa traz as mesmas informações em texto.</p>
      </header>

      {canteiros.length > 0 && (
        <figure className="m-0 grid gap-2">
          <div className="overflow-x-auto rounded-md border border-linha bg-superficie p-3">
            <svg viewBox={`0 0 ${largura} ${altura}`} className="mx-auto block w-full max-w-4xl min-w-[38rem]" aria-labelledby="t-mapa-svg" role="group">
              <title id="t-mapa-svg">Mapa esquemático da horta com {canteiros.length} canteiros</title>
              {/* Caminhos: o fundo entre os canteiros */}
              <rect x="0" y="0" width={largura} height={altura - 40} rx="14" fill="color-mix(in srgb, var(--linha) 55%, var(--superficie))" />
              {Array.from({ length: colunas + 1 }).map((_, i) => (
                <line key={`v${i}`} x1={i * (L + C) + C / 2} y1={C / 2} x2={i * (L + C) + C / 2} y2={altura - 40 - C / 2} stroke="var(--superficie)" strokeWidth="3" strokeDasharray="2 10" strokeLinecap="round" aria-hidden="true" />
              ))}
              {canteiros.map((c, i) => {
                const x = C + (i % colunas) * (L + C)
                const y = C + Math.floor(i / colunas) * (A + C)
                const n = plantasDe(c.id).length
                return (
                  <a key={c.id} href={`#canteiro-${c.numero}`} className="canteiro-svg">
                    <rect x={x} y={y} width={L} height={A} rx="10" />
                    <text x={x + 16} y={y + 34} className="canteiro-num">Canteiro {c.numero}</text>
                    <text x={x + 16} y={y + 64} className="canteiro-nome">{c.nome.length > 24 ? c.nome.slice(0, 23) + '…' : c.nome}</text>
                    <text x={x + 16} y={y + 92} className="canteiro-qtd">{n} {n === 1 ? 'planta' : 'plantas'}</text>
                  </a>
                )
              })}
              <text x={C} y={altura - 12} className="canteiro-qtd" aria-hidden="true">Entre os canteiros: caminhos</text>
            </svg>
          </div>
          <figcaption className="nota">
            <span className="sm:hidden">Arraste o mapa para o lado para ver todos os canteiros. </span>
            Mapa esquemático. A posição real dos canteiros e dos caminhos será ajustada a partir do croqui da horta.</figcaption>
        </figure>
      )}

      <section aria-labelledby="t-lista" className="grid gap-4">
        <h2 id="t-lista">Canteiros e plantas</h2>
        <ul className="grid gap-4 md:grid-cols-2">
          {canteiros.map((c) => (
            <li key={c.id} id={`canteiro-${c.numero}`} className="secao-ficha grid content-start gap-3 rounded-md border border-linha bg-superficie p-5">
              <h3 className="flex items-baseline gap-3">
                <span className="font-texto text-base font-bold text-folha">Canteiro {c.numero}</span>
                {c.nome}
              </h3>
              {c.descricao && <p className="text-suave">{c.descricao}</p>}
              {plantasDe(c.id).length ? (
                <ul className="flex flex-wrap gap-2">
                  {plantasDe(c.id).map((p) => (
                    <li key={p.slug}><Link href={`/plantas/${p.slug}`} className="chip">{p.nomePopular}</Link></li>
                  ))}
                </ul>
              ) : (
                <p className="nota">Nenhuma planta publicada neste canteiro.</p>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
