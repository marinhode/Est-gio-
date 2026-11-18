'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { Icone } from '@/components/Icone'
import { ImagemRevelada } from '@/components/ImagemRevelada'
import { registrarEvento } from '@/lib/registro'
import type { MarcadorTour, ParadaTour } from '@/lib/tipos'

function Ponto({ m, i = 0, sobreFoto, abrir }: { m: MarcadorTour; i?: number; sobreFoto: boolean; abrir: (m: MarcadorTour) => void }) {
  const conteudo = (
    <>
      <span aria-hidden="true" className="marcador-alvo"><Icone nome={m.planta ? 'folha' : 'pino'} className="size-4" /></span>
      <span className={sobreFoto ? 'marcador-rotulo' : ''}>{m.rotulo}</span>
    </>
  )
  const classe = sobreFoto ? 'marcador' : 'chip'
  const estilo = sobreFoto ? ({ left: `${m.x}%`, top: `${m.y}%`, '--i': i } as React.CSSProperties) : undefined
  if (m.planta) {
    return (
      <button type="button" className={classe} style={estilo} onClick={() => abrir(m)} aria-haspopup="dialog">
        {conteudo}
      </button>
    )
  }
  return (
    <Link href={m.canteiroNumero ? `/mapa#canteiro-${m.canteiroNumero}` : '/mapa'} className={classe} style={estilo}>
      {conteudo}
    </Link>
  )
}

/**
 * Cena de uma parada do tour: foto com marcadores clicáveis (ou ilustração, enquanto não há foto).
 * Marcador de planta abre a janela dos três caminhos; marcador de canteiro leva ao mapa.
 * Os mesmos pontos aparecem também em lista, para quem não usa a imagem.
 */
export function CenaTour({ parada }: { parada: ParadaTour }) {
  const [aberto, setAberto] = useState<MarcadorTour | null>(null)
  const janela = useRef<HTMLDialogElement>(null)

  // Conta uma visita ao tour por sessão do navegador, ao abrir a primeira parada
  useEffect(() => {
    if (parada.ordem !== 1) return
    try {
      if (sessionStorage.getItem('ls-tour')) return
      sessionStorage.setItem('ls-tour', '1')
    } catch {}
    registrarEvento('tour').catch(() => {})
  }, [parada.ordem])

  function abrir(m: MarcadorTour) {
    setAberto(m)
    requestAnimationFrame(() => janela.current?.showModal())
  }

  return (
    <div className="grid gap-4">
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-md bg-[color-mix(in_srgb,var(--marca)_10%,var(--superficie))]">
        {parada.imagem ? (
          <>
            <ImagemRevelada src={parada.imagem.src} alt={parada.imagem.alt} fill sizes="(min-width: 1024px) 66vw, 100vw" className="object-cover" priority />
            {parada.marcadores.map((m, i) => (<Ponto key={m.id} m={m} i={i} sobreFoto abrir={abrir} />))}
          </>
        ) : (
          <div className="absolute inset-0 grid place-items-center gap-2 p-6 text-center" aria-hidden="true">
            <span className="font-titulo text-[5rem] leading-none text-azul opacity-30">{parada.ordem}</span>
            <span className="nota">A foto desta parada entra quando a horta for fotografada.</span>
          </div>
        )}
      </div>

      {parada.marcadores.length > 0 && (
        <div className="grid gap-2">
          <p className="font-bold">Pontos desta parada</p>
          <ul className="flex flex-wrap gap-2">
            {parada.marcadores.map((m) => (<li key={m.id}><Ponto m={m} sobreFoto={false} abrir={abrir} /></li>))}
          </ul>
        </div>
      )}

      <dialog ref={janela} className="janela" aria-labelledby="t-janela" onClose={() => setAberto(null)}>
        {aberto?.planta && (
          <div className="grid gap-4">
            <div className="flex items-start justify-between gap-4">
              <h2 id="t-janela" className="text-[1.6rem]">{aberto.rotulo}</h2>
              <button type="button" className="btn btn-sec !min-h-10 !px-3" onClick={() => janela.current?.close()}>
                <Icone nome="fechar" />
                <span className="sr-only">Fechar</span>
              </button>
            </div>
            <p className="text-suave">Escolha um caminho para conhecer esta planta.</p>
            <ul className="grid gap-2">
              {[
                { ancora: 'conheca', rotulo: 'Conheça a planta', icone: 'folha', cor: 'c-conheca' },
                { ancora: 'sinta', rotulo: 'Explore a experiência sensorial', icone: 'aroma', cor: 'c-sinta' },
                { ancora: 'ciencia', rotulo: 'Descubra o que a ciência pesquisa', icone: 'frasco', cor: 'c-ciencia' },
              ].map((c) => (
                <li key={c.ancora}>
                  <Link href={`/plantas/${aberto.planta}#${c.ancora}`} className={`alternativa ${c.cor} no-underline`}>
                    <Icone nome={c.icone as 'folha'} className="size-6" />
                    <span className="flex-1">{c.rotulo}</span>
                    <Icone nome="seta" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </dialog>
    </div>
  )
}
