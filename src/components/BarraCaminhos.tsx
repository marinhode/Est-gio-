'use client'

import { useEffect, useState } from 'react'
import { Icone, type NomeIcone } from '@/components/Icone'

const CAMINHOS: { id: string; rotulo: string; icone: NomeIcone }[] = [
  { id: 'conheca', rotulo: 'Conheça', icone: 'folha' },
  { id: 'sinta', rotulo: 'Sinta', icone: 'aroma' },
  { id: 'ciencia', rotulo: 'Ciência', icone: 'frasco' },
]

/** Barra fixa dos três caminhos da ficha: acende, na cor do caminho, a parte que está na tela. */
export function BarraCaminhos() {
  const [ativo, setAtivo] = useState<string | null>(null)

  useEffect(() => {
    const secoes = CAMINHOS.map((c) => document.getElementById(c.id)).filter((s): s is HTMLElement => Boolean(s))
    const obs = new IntersectionObserver(
      (entradas) => entradas.forEach((e) => e.isIntersecting && setAtivo(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' }, // a faixa no meio da tela é a atual
    )
    secoes.forEach((s) => obs.observe(s))
    return () => obs.disconnect()
  }, [])

  return (
    <nav aria-label="Três caminhos desta planta" className="caminhos-ficha">
      <ul className="largura grid grid-cols-3">
        {CAMINHOS.map((c) => (
          <li key={c.id}>
            <a href={`#${c.id}`} data-caminho={c.id} aria-current={ativo === c.id ? 'location' : undefined} className="caminho-aba" draggable={false}>
              <Icone nome={c.icone} />
              {c.rotulo}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
