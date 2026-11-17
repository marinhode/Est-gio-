'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Icone, type NomeIcone } from '@/components/Icone'
import { estacoes } from '@/lib/estacoes'

const itens: { href: string; rotulo: string; icone: NomeIcone }[] = [
  ...estacoes.map((e) => ({ href: e.href, rotulo: e.menu, icone: e.icone })),
  { href: '/mapa', rotulo: 'Mapa', icone: 'mapa' },
]

/**
 * Barra das estações: uma linha só, arrastável para o lado no celular,
 * presa ao topo enquanto a página rola.
 */
export function BarraEstacoes() {
  const caminho = usePathname()
  const trilho = useRef<HTMLUListElement>(null)
  const [bordas, setBordas] = useState({ inicio: true, fim: false })

  const atual = (href: string) => caminho === href || caminho.startsWith(href + '/')

  // Mostra o degradê só do lado em que ainda há opções escondidas
  const medir = () => {
    const el = trilho.current
    if (!el) return
    setBordas({
      inicio: el.scrollLeft <= 2,
      fim: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2,
    })
  }

  // Traz a estação atual para dentro da área visível
  useEffect(() => {
    const el = trilho.current
    const ativo = el?.querySelector<HTMLElement>('[aria-current="page"]')
    if (el && ativo) {
      const alvo = ativo.offsetLeft - (el.clientWidth - ativo.offsetWidth) / 2
      el.scrollTo({ left: Math.max(0, alvo), behavior: 'instant' as ScrollBehavior })
    }
    medir()
  }, [caminho])

  useEffect(() => {
    window.addEventListener('resize', medir)
    return () => window.removeEventListener('resize', medir)
  }, [])

  return (
    <nav aria-label="Estações" className="barra-estacoes">
      <div className="largura relative">
        <ul ref={trilho} onScroll={medir} className="trilho gutter">
          {itens.map((i) => {
            const ativo = atual(i.href)
            return (
              <li key={i.href}>
                <Link href={i.href} className="chip" aria-current={ativo ? 'page' : undefined}>
                  <Icone nome={i.icone} className="size-[1.1em]" />
                  {i.rotulo}
                </Link>
              </li>
            )
          })}
        </ul>
        <span aria-hidden="true" className="sombra sombra-inicio" data-visivel={!bordas.inicio} />
        <span aria-hidden="true" className="sombra sombra-fim" data-visivel={!bordas.fim} />
      </div>
    </nav>
  )
}
