'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState, useSyncExternalStore } from 'react'
import { Icone } from '@/components/Icone'
import { estacoes } from '@/lib/estacoes'

type Preferencia = { atributo: 'data-letra' | 'data-contraste'; valor: string; chave: string }
const LETRA: Preferencia = { atributo: 'data-letra', valor: 'grande', chave: 'ls-letra' }
const CONTRASTE: Preferencia = { atributo: 'data-contraste', valor: 'alto', chave: 'ls-contraste' }

/** Lê a preferência direto do <html>, que o script do layout já ajustou antes da pintura. */
function usePreferencia(p: Preferencia) {
  const ativo = useSyncExternalStore(
    (avisar) => {
      const obs = new MutationObserver(avisar)
      obs.observe(document.documentElement, { attributes: true, attributeFilter: [p.atributo] })
      return () => obs.disconnect()
    },
    () => document.documentElement.getAttribute(p.atributo) === p.valor,
    () => false,
  )
  const alternar = () => {
    const ligar = !ativo
    if (ligar) document.documentElement.setAttribute(p.atributo, p.valor)
    else document.documentElement.removeAttribute(p.atributo)
    try {
      localStorage.setItem(p.chave, ligar ? '1' : '0')
    } catch {}
  }
  return [ativo, alternar] as const
}

export function Cabecalho() {
  const caminho = usePathname()
  // O painel aberto fica associado à página em que foi aberto: ao navegar, fecha sozinho.
  const [aberto, setAberto] = useState<{ painel: 'menu' | 'leitura'; em: string } | null>(null)
  const painel = aberto?.em === caminho ? aberto.painel : null
  const setPainel = (p: 'menu' | 'leitura' | null) => setAberto(p ? { painel: p, em: caminho } : null)
  const [letra, alternarLetra] = usePreferencia(LETRA)
  const [contraste, alternarContraste] = usePreferencia(CONTRASTE)

  // Fecha os painéis com a tecla Esc
  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setAberto(null)
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [])

  const atual = (href: string) => caminho === href || caminho.startsWith(href + '/')

  return (
    <header className="faixa">
      <div className="largura gutter flex flex-wrap items-center gap-x-5 gap-y-3 py-3">
        <Link href="/" className="flex items-center gap-3 no-underline" aria-label="Laboratório Sensorial Interativo, página inicial">
          <span className="logo-placa">
            <Image src="/logo-unicatolica.png" alt="UniCatólica" width={720} height={188} className="w-28 sm:w-32" priority />
          </span>
          <span className="hidden font-titulo text-[1.05rem] leading-tight sm:block">
            Laboratório Sensorial
            <br />
            Interativo
          </span>
        </Link>

        <nav aria-label="Estações" className="nav-estacoes ml-auto hidden xl:block">
          <ul className="flex gap-5">
            {estacoes.map((e) => (
              <li key={e.href}>
                <Link href={e.href} aria-current={atual(e.href) ? 'page' : undefined}>
                  {e.menu}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex flex-wrap gap-2 xl:ml-0">
          <button
            type="button"
            className="botao-faixa"
            aria-expanded={painel === 'leitura'}
            aria-controls="painel-leitura"
            onClick={() => setPainel(painel === 'leitura' ? null : 'leitura')}
          >
            <span className="aa" aria-hidden="true">Aa</span>
            <span className="sr-only">Ajustes de leitura</span>
          </button>
          <button
            type="button"
            className="botao-faixa xl:hidden"
            aria-expanded={painel === 'menu'}
            aria-controls="painel-menu"
            onClick={() => setPainel(painel === 'menu' ? null : 'menu')}
          >
            <Icone nome={painel === 'menu' ? 'fechar' : 'menu'} />
            Menu
          </button>
        </div>
      </div>

      <div id="painel-leitura" hidden={painel !== 'leitura'} className="largura gutter pb-4">
        <div role="group" aria-label="Ajustes de leitura" className="flex flex-wrap gap-2">
          <button type="button" className="botao-faixa" aria-pressed={letra} onClick={alternarLetra}>
            Letra maior
          </button>
          <button type="button" className="botao-faixa" aria-pressed={contraste} onClick={alternarContraste}>
            Alto contraste
          </button>
        </div>
        <p className="mt-2 text-sm opacity-90">A escolha fica salva neste aparelho.</p>
      </div>

      <nav id="painel-menu" aria-label="Estações" hidden={painel !== 'menu'} className="nav-estacoes largura gutter pb-4 xl:hidden">
        <ul className="grid gap-1 sm:grid-cols-2">
          {estacoes.map((e) => (
            <li key={e.href}>
              <Link href={e.href} aria-current={atual(e.href) ? 'page' : undefined}>
                <Icone nome={e.icone} />
                {e.titulo}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/mapa" aria-current={atual('/mapa') ? 'page' : undefined}>
              <Icone nome="mapa" />
              Mapa da horta
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}
