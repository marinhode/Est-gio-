'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Icone } from '@/components/Icone'
import type { PassoAtividade } from '@/lib/tipos'

type Estado = 'inicio' | 'rodando' | 'pausado' | 'tempo-esgotado' | 'livre' | 'fim'

function mmss(s: number) {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

function duracaoTotal(passos: PassoAtividade[]) {
  const s = passos.reduce((t, p) => t + (p.segundos ?? 0), 0)
  return s < 60 ? `${s} segundos` : `cerca de ${Math.round(s / 60)} min`
}

/**
 * Atividade passo a passo com cronômetro opcional por passo.
 * Sem JavaScript, continua legível como lista numerada.
 * Ao fim do tempo, não avança sozinha: a pessoa decide quando seguir.
 */
export function AtividadeGuiada({
  titulo,
  introducao,
  passos,
}: {
  titulo: string
  introducao: string
  passos: PassoAtividade[]
}) {
  const [estado, setEstado] = useState<Estado>('inicio')
  const [atual, setAtual] = useState(0)
  const [restante, setRestante] = useState(0)
  const [aviso, setAviso] = useState('')

  const passo = passos[atual]
  const total = passo?.segundos ?? 0

  useEffect(() => {
    if (estado !== 'rodando') return
    const id = setInterval(() => {
      setRestante((r) => {
        if (r <= 1) {
          setEstado('tempo-esgotado')
          setAviso('Tempo concluído. Siga para o próximo passo quando quiser.')
          return 0
        }
        return r - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [estado])

  function irPara(i: number) {
    if (i >= passos.length) {
      setEstado('fim')
      setAviso('Atividade concluída.')
      return
    }
    const p = passos[i]
    setAtual(i)
    setRestante(p.segundos ?? 0)
    setEstado(p.segundos ? 'rodando' : 'livre')
    setAviso(`Passo ${i + 1} de ${passos.length}. ${p.texto}`)
  }

  const emAndamento = estado !== 'inicio' && estado !== 'fim'
  const progresso = total ? ((total - restante) / total) * 100 : 0

  return (
    <section aria-labelledby="t-atividade" className="grid gap-4 rounded-md border-2 border-lavanda bg-superficie p-5 sm:p-6">
      <header className="grid gap-1">
        <p className="c-sinta flex items-center gap-2 text-sm font-bold">
          <Icone nome="aroma" className="size-4" />
          Experimente ({duracaoTotal(passos)})
        </p>
        <h2 id="t-atividade" className="bloco-titulo !text-[1.5rem]">{titulo}</h2>
        <p className="text-suave">{introducao}</p>
      </header>

      <ol className="grid gap-2">
        {passos.map((p, i) => {
          const feito = estado === 'fim' || (emAndamento && i < atual)
          const agora = emAndamento && i === atual
          return (
            <li
              key={i}
              aria-current={agora ? 'step' : undefined}
              className={`grid grid-cols-[2rem_1fr] gap-2 rounded px-2 py-2 ${
                agora ? 'bg-[color-mix(in_srgb,var(--lavanda)_12%,transparent)]' : ''
              } ${emAndamento && !agora ? 'text-suave' : ''}`}
            >
              <span
                aria-hidden="true"
                className={`grid size-7 place-items-center rounded-full border-2 text-sm font-bold ${
                  feito ? 'border-lavanda bg-lavanda text-sobre-azul' : 'border-lavanda c-sinta'
                }`}
              >
                {feito ? '✓' : i + 1}
              </span>
              <div className="grid gap-2">
                <p className={agora ? 'text-lg font-bold text-tinta' : ''}>
                  {feito && <span className="sr-only">Concluído: </span>}
                  {p.texto}
                  {p.segundos && !agora && <span className="nota"> ({mmss(p.segundos)})</span>}
                </p>
                {agora && total > 0 && (
                  <div className="grid gap-1">
                    <div className="h-2 overflow-hidden rounded-full bg-linha" aria-hidden="true">
                      <div className="barra-tempo h-full bg-lavanda" style={{ width: `${progresso}%` }} />
                    </div>
                    <p className="text-sm tabular-nums">
                      <span className="sr-only">Tempo restante: </span>
                      {estado === 'tempo-esgotado' ? 'Tempo concluído' : mmss(restante)}
                    </p>
                  </div>
                )}
              </div>
            </li>
          )
        })}
      </ol>

      <div className="flex flex-wrap items-center gap-2">
        {estado === 'inicio' && (
          <button type="button" className="btn btn-lavanda" onClick={() => irPara(0)}>
            Começar
          </button>
        )}
        {emAndamento && (
          <>
            <button type="button" className="btn btn-lavanda" onClick={() => irPara(atual + 1)}>
              {atual === passos.length - 1 ? 'Concluir' : 'Próximo passo'}
            </button>
            {estado === 'rodando' && (
              <button type="button" className="btn btn-sec btn-sec-lavanda" onClick={() => setEstado('pausado')}>
                Pausar
              </button>
            )}
            {estado === 'pausado' && (
              <button type="button" className="btn btn-sec btn-sec-lavanda" onClick={() => setEstado('rodando')}>
                Continuar
              </button>
            )}
            {atual > 0 && (
              <button type="button" className="btn btn-sec btn-sec-lavanda" onClick={() => irPara(atual - 1)}>
                Voltar
              </button>
            )}
          </>
        )}
        {estado === 'fim' && (
          <>
            <p className="c-sinta w-full font-bold">Obrigado por participar. Cada pessoa vive essa experiência de um jeito.</p>
            <Link href="/sentidos/diario" className="btn btn-lavanda">
              Registrar no diário
            </Link>
            <button type="button" className="btn btn-sec btn-sec-lavanda" onClick={() => setEstado('inicio')}>
              Fazer de novo
            </button>
          </>
        )}
      </div>

      <p className="sr-only" aria-live="polite">
        {aviso}
      </p>
    </section>
  )
}
