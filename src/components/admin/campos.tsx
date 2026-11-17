'use client'

import type { ReactNode } from 'react'
import type { Secao } from '@/lib/tipos'

/** Peças de formulário do painel: rótulo sempre visível, dica e erro ligados ao campo. */

type Base = { id: string; rotulo: string; dica?: string; erro?: string; obrigatorio?: boolean }

function Rotulo({ id, rotulo, obrigatorio }: Pick<Base, 'id' | 'rotulo' | 'obrigatorio'>) {
  return (
    <label htmlFor={id} className="font-bold">
      {rotulo}
      {obrigatorio && <span className="font-normal text-suave"> (obrigatório)</span>}
    </label>
  )
}

function Rodape({ id, dica, erro }: Pick<Base, 'id' | 'dica' | 'erro'>) {
  return (
    <>
      {dica && <p id={`${id}-dica`} className="nota">{dica}</p>}
      {erro && <p id={`${id}-erro`} className="text-sm font-bold">⚠ {erro}</p>}
    </>
  )
}

const descritores = (id: string, dica?: string, erro?: string) =>
  [dica && `${id}-dica`, erro && `${id}-erro`].filter(Boolean).join(' ') || undefined

export function CampoTexto({ id, rotulo, dica, erro, obrigatorio, valor, mudar, tipo = 'text', ...resto }: Base & {
  valor: string
  mudar: (v: string) => void
  tipo?: string
  placeholder?: string
  maxLength?: number
  className?: string
}) {
  return (
    <div className="grid gap-1">
      <Rotulo id={id} rotulo={rotulo} obrigatorio={obrigatorio} />
      <input
        id={id}
        type={tipo}
        className={`campo ${erro ? '!border-tinta !border-2' : ''}`}
        value={valor}
        onChange={(e) => mudar(e.target.value)}
        aria-invalid={erro ? true : undefined}
        aria-describedby={descritores(id, dica, erro)}
        {...resto}
      />
      <Rodape id={id} dica={dica} erro={erro} />
    </div>
  )
}

export function CampoArea({ id, rotulo, dica, erro, obrigatorio, valor, mudar, linhas = 3 }: Base & {
  valor: string
  mudar: (v: string) => void
  linhas?: number
}) {
  return (
    <div className="grid gap-1">
      <Rotulo id={id} rotulo={rotulo} obrigatorio={obrigatorio} />
      <textarea
        id={id}
        rows={linhas}
        className={`campo !min-h-0 ${erro ? '!border-tinta !border-2' : ''}`}
        value={valor}
        onChange={(e) => mudar(e.target.value)}
        aria-invalid={erro ? true : undefined}
        aria-describedby={descritores(id, dica, erro)}
      />
      <Rodape id={id} dica={dica} erro={erro} />
    </div>
  )
}

/** Uma seção da ficha: texto curto (leitura rápida) e explicação ampliada (orientação 3.3). */
export function CampoSecao({ id, secao, mudar, erro, obrigatorio = true }: {
  id: string
  secao: Secao
  mudar: (s: Secao) => void
  erro?: string
  obrigatorio?: boolean
}) {
  return (
    <div className="grid gap-3">
      <CampoArea
        id={id}
        rotulo="Texto curto"
        dica="Leitura rápida, de uma a três frases."
        obrigatorio={obrigatorio}
        erro={erro}
        valor={secao.curto}
        mudar={(curto) => mudar({ ...secao, curto })}
      />
      <CampoArea
        id={`${id}-ampliado`}
        rotulo="Explicação ampliada"
        dica="Opcional. Aparece no botão Ler mais, para quem quer aprofundar."
        valor={secao.ampliado ?? ''}
        mudar={(ampliado) => mudar({ ...secao, ampliado })}
        linhas={4}
      />
    </div>
  )
}

/** Grupo numerado da ficha padrão (01 a 10): a numeração é a do documento de orientações. */
export function GrupoFicha({ numero, titulo, descricao, children }: { numero?: string; titulo: string; descricao?: string; children: ReactNode }) {
  const id = `grupo-${titulo.toLowerCase().normalize('NFD').replace(/[^a-z0-9]+/g, '-')}`
  return (
    <section aria-labelledby={id} className="grid gap-4 rounded-md border border-linha bg-superficie p-5 sm:p-6">
      <header className="grid gap-1">
        <h2 id={id} className="flex items-baseline gap-3 text-[1.35rem]">
          {numero && <span className="font-texto text-base font-bold text-azul tabular-nums">{numero}</span>}
          {titulo}
        </h2>
        {descricao && <p className="nota">{descricao}</p>}
      </header>
      {children}
    </section>
  )
}

/** Lista que cresce: adicionar, remover e reordenar itens. */
export function Repetidor<T>({ itens, mudar, novo, rotuloAdicionar, render, rotuloItem }: {
  itens: T[]
  mudar: (itens: T[]) => void
  novo: () => T
  rotuloAdicionar: string
  rotuloItem: (i: number) => string
  render: (item: T, alterar: (t: T) => void, i: number) => ReactNode
}) {
  const alterar = (i: number, t: T) => mudar(itens.map((x, j) => (j === i ? t : x)))
  const mover = (i: number, d: number) => {
    const j = i + d
    if (j < 0 || j >= itens.length) return
    const copia = [...itens]
    ;[copia[i], copia[j]] = [copia[j], copia[i]]
    mudar(copia)
  }
  return (
    <div className="grid gap-3">
      {itens.map((item, i) => (
        <fieldset key={i} className="grid gap-3 rounded border border-linha p-4">
          <legend className="px-1 text-sm font-bold text-suave">{rotuloItem(i)}</legend>
          {render(item, (t) => alterar(i, t), i)}
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn btn-sec !min-h-9 !px-3 !py-1 text-sm" onClick={() => mover(i, -1)} disabled={i === 0} aria-label={`Subir ${rotuloItem(i)}`}>
              Subir
            </button>
            <button type="button" className="btn btn-sec !min-h-9 !px-3 !py-1 text-sm" onClick={() => mover(i, 1)} disabled={i === itens.length - 1} aria-label={`Descer ${rotuloItem(i)}`}>
              Descer
            </button>
            <button type="button" className="btn btn-sec !min-h-9 !px-3 !py-1 text-sm" onClick={() => mudar(itens.filter((_, j) => j !== i))} aria-label={`Remover ${rotuloItem(i)}`}>
              Remover
            </button>
          </div>
        </fieldset>
      ))}
      <button type="button" className="btn btn-sec justify-self-start" onClick={() => mudar([...itens, novo()])}>
        + {rotuloAdicionar}
      </button>
    </div>
  )
}

/** Resumo de erros no topo do formulário, com links que levam a cada campo. */
export function ResumoErros({ erros }: { erros: { campo: string; mensagem: string }[] }) {
  if (!erros.length) return null
  return (
    <div role="alert" tabIndex={-1} id="resumo-erros" className="grid gap-2 rounded-md border-2 border-tinta bg-superficie p-5">
      <p className="font-titulo text-xl">Falta corrigir {erros.length === 1 ? '1 item' : `${erros.length} itens`}</p>
      <ul className="grid list-disc gap-1 pl-5">
        {erros.map((e, i) => (
          <li key={i}>
            <a href={`#${e.campo}`}>{e.mensagem}</a>
          </li>
        ))}
      </ul>
    </div>
  )
}
