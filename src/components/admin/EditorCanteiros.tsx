'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { excluirCanteiro, salvarCanteiro } from '@/app/admin/canteiros/acoes'
import { CampoArea, CampoTexto } from '@/components/admin/campos'
import type { Canteiro } from '@/lib/tipos'

type Linha = Canteiro & { novo?: boolean }

export function EditorCanteiros({ inicial, contagem }: { inicial: Canteiro[]; contagem: Record<string, number> }) {
  const router = useRouter()
  const [linhas, setLinhas] = useState<Linha[]>(inicial)
  const [mensagem, setMensagem] = useState('')
  const [confirmar, setConfirmar] = useState<string | null>(null)
  const [ocupado, iniciar] = useTransition()

  const alterar = (id: string, c: Partial<Linha>) => setLinhas((ls) => ls.map((l) => (l.id === id ? { ...l, ...c } : l)))

  function adicionar() {
    const numero = Math.max(0, ...linhas.map((l) => l.numero)) + 1
    setLinhas([...linhas, { id: `c${Date.now().toString(36)}`, numero, nome: '', descricao: '', novo: true }])
  }

  function salvar(l: Linha) {
    iniciar(async () => {
      const r = await salvarCanteiro({ id: l.id, numero: l.numero, nome: l.nome, descricao: l.descricao }, Boolean(l.novo))
      setMensagem(r.mensagem)
      if (r.ok) {
        alterar(l.id, { novo: false })
        router.refresh()
      }
    })
  }

  function excluir(l: Linha) {
    if (l.novo) {
      setLinhas(linhas.filter((x) => x.id !== l.id))
      setConfirmar(null)
      return
    }
    iniciar(async () => {
      const r = await excluirCanteiro(l.id)
      setMensagem(r.mensagem)
      setConfirmar(null)
      if (r.ok) {
        setLinhas((ls) => ls.filter((x) => x.id !== l.id))
        router.refresh()
      }
    })
  }

  return (
    <div className="grid gap-4">
      <p role="status" className="font-bold empty:hidden">{mensagem}</p>
      {linhas.map((l) => (
        <fieldset key={l.id} className="grid gap-3 rounded-md border border-linha bg-superficie p-5">
          <legend className="px-1 font-titulo text-lg">{l.novo ? 'Novo canteiro' : `Canteiro ${l.numero}`}</legend>
          <div className="grid gap-3 sm:grid-cols-[8rem_1fr]">
            <CampoTexto id={`num-${l.id}`} rotulo="Número" tipo="number" valor={String(l.numero)} mudar={(v) => alterar(l.id, { numero: Number(v) })} />
            <CampoTexto id={`nome-${l.id}`} rotulo="Nome" obrigatorio valor={l.nome} mudar={(v) => alterar(l.id, { nome: v })} />
          </div>
          <CampoArea id={`desc-${l.id}`} rotulo="Descrição" valor={l.descricao} mudar={(v) => alterar(l.id, { descricao: v })} linhas={2} />
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" className="btn" disabled={ocupado} onClick={() => salvar(l)}>Salvar</button>
            {!l.novo && <span className="nota">{contagem[l.id] ?? 0} planta(s) neste canteiro</span>}
            {confirmar === l.id ? (
              <span className="ml-auto flex flex-wrap items-center gap-2">
                <span className="text-sm font-bold">Excluir este canteiro?</span>
                <button type="button" className="btn btn-sec !min-h-9 !py-1 text-sm" onClick={() => excluir(l)}>Sim, excluir</button>
                <button type="button" className="btn btn-sec !min-h-9 !py-1 text-sm" onClick={() => setConfirmar(null)}>Cancelar</button>
              </span>
            ) : (
              <button type="button" className="ml-auto min-h-11 px-2 text-sm text-suave underline" onClick={() => setConfirmar(l.id)}>Excluir</button>
            )}
          </div>
        </fieldset>
      ))}
      <button type="button" className="btn btn-sec justify-self-start" onClick={adicionar}>+ Novo canteiro</button>
    </div>
  )
}
