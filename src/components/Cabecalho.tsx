'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { CONTRASTE, LETRA, usePreferencia } from '@/lib/preferencias'

export function Cabecalho() {
  const caminho = usePathname()
  // O painel fica associado à página em que foi aberto: ao navegar, fecha sozinho.
  const [aberto, setAberto] = useState<{ painel: 'leitura'; em: string } | null>(null)
  const painel = aberto?.em === caminho ? aberto.painel : null
  const setPainel = (p: 'leitura' | null) => setAberto(p ? { painel: p, em: caminho } : null)
  const [letra, alternarLetra] = usePreferencia(LETRA)
  const [contraste, alternarContraste] = usePreferencia(CONTRASTE)

  // Fecha os painéis com a tecla Esc
  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setAberto(null)
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [])

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

        <div className="ml-auto flex flex-wrap gap-2">
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

    </header>
  )
}
