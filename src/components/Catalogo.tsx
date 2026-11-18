'use client'

import Link from 'next/link'
import { useDeferredValue, useState } from 'react'
import { ImagemRevelada } from '@/components/ImagemRevelada'
import { RamoBotanico } from '@/components/RamoBotanico'
import { Compartilhado } from '@/components/Transicao'
import type { Canteiro, Planta } from '@/lib/tipos'

const normalizar = (t: string) => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

/** Busca por nome popular, científico, família, categoria ou característica; filtros por categoria e canteiro. */
export function Catalogo({ plantas, canteiros }: { plantas: Planta[]; canteiros: Canteiro[] }) {
  const [busca, setBusca] = useState('')
  const [categoria, setCategoria] = useState<string | null>(null)
  const [canteiro, setCanteiro] = useState('')
  const termo = normalizar(useDeferredValue(busca).trim())
  const categorias = [...new Set(plantas.flatMap((p) => p.categorias))].sort((a, b) => a.localeCompare(b, 'pt-BR'))
  const nomeCanteiro = (id: string) => canteiros.find((c) => c.id === id)

  const visiveis = plantas.filter((p) => {
    if (categoria && !p.categorias.includes(categoria)) return false
    if (canteiro && p.canteiroId !== canteiro) return false
    if (!termo) return true
    return normalizar([p.nomePopular, p.nomeCientifico, p.familia, ...p.categorias, ...p.caracteristicas].join(' ')).includes(termo)
  })

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-[1fr_16rem]">
        <div className="grid gap-1">
          <label htmlFor="busca" className="font-bold">Buscar planta</label>
          <input id="busca" type="search" className="campo" placeholder="Nome, família ou característica, como aroma" value={busca} onChange={(e) => setBusca(e.target.value)} />
        </div>
        <div className="grid gap-1">
          <label htmlFor="filtro-canteiro" className="font-bold">Canteiro</label>
          <select id="filtro-canteiro" className="campo" value={canteiro} onChange={(e) => setCanteiro(e.target.value)}>
            <option value="">Todos os canteiros</option>
            {canteiros.map((c) => (<option key={c.id} value={c.id}>Canteiro {c.numero}: {c.nome}</option>))}
          </select>
        </div>
      </div>
      {categorias.length > 0 && (
        <div role="group" aria-label="Filtrar por categoria" className="flex flex-wrap gap-2">
          {[null, ...categorias].map((c) => (
            <button key={c ?? 'todas'} type="button" className="chip" aria-pressed={categoria === c} onClick={() => setCategoria(c)}>
              {c ?? 'Todas'}
            </button>
          ))}
        </div>
      )}
      <p aria-live="polite" className="nota">{visiveis.length === 1 ? '1 planta encontrada' : `${visiveis.length} plantas encontradas`}</p>
      {visiveis.length === 0 ? (
        <div className="grid gap-2 rounded-md border border-dashed border-linha p-6">
          <p className="font-titulo text-xl">Nenhuma planta com esses filtros</p>
          <button type="button" className="btn btn-sec justify-self-start" onClick={() => { setBusca(''); setCategoria(null); setCanteiro('') }}>Limpar a busca</button>
        </div>
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visiveis.map((p) => {
            const c = nomeCanteiro(p.canteiroId)
            return (
              <li key={p.slug}>
                <Link href={`/plantas/${p.slug}`} transitionTypes={['nav-forward']} className="cartao group grid h-full overflow-hidden rounded-md border border-linha bg-superficie text-tinta no-underline hover:border-azul">
                  <Compartilhado nome={`planta-${p.slug}`}>
                    <span className="cartao-foto relative grid aspect-[4/3] place-items-center overflow-hidden bg-[color-mix(in_srgb,var(--folha)_9%,var(--superficie))]">
                      {p.imagem ? (
                        <ImagemRevelada src={p.imagem.src} alt="" fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
                      ) : (
                        <RamoBotanico className="h-3/4 w-auto" />
                      )}
                    </span>
                  </Compartilhado>
                  <span className="grid content-start gap-1 p-4">
                    <span className="font-titulo text-xl text-azul group-hover:underline">{p.nomePopular}</span>
                    <em className="text-suave">{p.nomeCientifico}</em>
                    {c && <span className="text-sm font-bold text-folha">Canteiro {c.numero}</span>}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
