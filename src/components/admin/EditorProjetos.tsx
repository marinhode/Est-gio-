'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { type DadosProjeto, excluirProjeto, salvarProjeto } from '@/app/admin/projetos/acoes'
import { CampoArea, CampoTexto } from '@/components/admin/campos'
import { CURSOS, TIPOS } from '@/lib/formulario-projeto'

type Item = DadosProjeto & { chave: string }

function Selecao({ id, rotulo, valor, opcoes, mudar }: { id: string; rotulo: string; valor: string; opcoes: string[]; mudar: (v: string) => void }) {
  return (
    <div className="grid content-start gap-1">
      <label htmlFor={id} className="font-bold">{rotulo}</label>
      <select id={id} className="campo" value={valor} onChange={(e) => mudar(e.target.value)}>
        {opcoes.map((o) => (<option key={o}>{o}</option>))}
      </select>
    </div>
  )
}

export function EditorProjetos({ inicial }: { inicial: DadosProjeto[] }) {
  const router = useRouter()
  const [itens, setItens] = useState<Item[]>(inicial.map((p) => ({ ...p, chave: String(p.id) })))
  const [mensagem, setMensagem] = useState<Record<string, string>>({})
  const [confirmar, setConfirmar] = useState<string | null>(null)
  const [ocupado, iniciar] = useTransition()

  const alterar = (chave: string, c: Partial<Item>) => setItens((ls) => ls.map((l) => (l.chave === chave ? { ...l, ...c } : l)))
  const avisar = (chave: string, texto: string) => setMensagem((m) => ({ ...m, [chave]: texto }))

  function novo() {
    const chave = `novo-${Date.now()}`
    setItens([{ chave, id: null, curso: CURSOS[0], tipo: TIPOS[0], titulo: '', descricao: '', link: '', ano: String(new Date().getFullYear()), publicado: true }, ...itens])
    requestAnimationFrame(() => document.getElementById(`titulo-${chave}`)?.focus())
  }

  function salvar(item: Item) {
    iniciar(async () => {
      const r = await salvarProjeto(item)
      avisar(item.chave, r.mensagem)
      if (r.ok) {
        alterar(item.chave, { id: r.id })
        router.refresh()
      }
    })
  }

  function excluir(item: Item) {
    setConfirmar(null)
    if (!item.id) {
      setItens((ls) => ls.filter((l) => l.chave !== item.chave))
      return
    }
    iniciar(async () => {
      const r = await excluirProjeto(item.id!)
      if (r.ok) setItens((ls) => ls.filter((l) => l.chave !== item.chave))
      else avisar(item.chave, r.mensagem)
    })
  }

  return (
    <div className="grid gap-4">
      <button type="button" className="btn justify-self-start" onClick={novo}>+ Novo projeto</button>
      {itens.length === 0 && <p className="rounded-md border border-dashed border-linha p-6 text-suave">Nenhum projeto cadastrado. Os projetos aparecem na estação Comunidade.</p>}
      {itens.map((p) => (
        <fieldset key={p.chave} className="grid gap-3 rounded-md border border-linha bg-superficie p-5">
          <legend className="px-1 font-titulo text-lg">{p.id ? p.titulo || 'Projeto' : 'Novo projeto'}</legend>
          <CampoTexto id={`titulo-${p.chave}`} rotulo="Título" obrigatorio valor={p.titulo} mudar={(v) => alterar(p.chave, { titulo: v })} />
          <div className="grid gap-3 sm:grid-cols-3">
            <Selecao id={`curso-${p.chave}`} rotulo="Curso" valor={p.curso} opcoes={CURSOS} mudar={(v) => alterar(p.chave, { curso: v })} />
            <Selecao id={`tipo-${p.chave}`} rotulo="Tipo" valor={p.tipo} opcoes={TIPOS} mudar={(v) => alterar(p.chave, { tipo: v })} />
            <CampoTexto id={`ano-${p.chave}`} rotulo="Ano" tipo="number" valor={p.ano} mudar={(v) => alterar(p.chave, { ano: v })} />
          </div>
          <CampoArea id={`descricao-${p.chave}`} rotulo="Descrição" obrigatorio dica="Duas ou três frases sobre o que foi feito e o que foi descoberto." valor={p.descricao} mudar={(v) => alterar(p.chave, { descricao: v })} />
          <CampoTexto id={`link-${p.chave}`} rotulo="Link" tipo="url" placeholder="https://" dica="Opcional: artigo, vídeo, apresentação ou repositório." valor={p.link} mudar={(v) => alterar(p.chave, { link: v })} />
          <label className="flex items-center gap-3">
            <input type="checkbox" className="size-5 accent-[var(--azul)]" checked={p.publicado} onChange={(e) => alterar(p.chave, { publicado: e.target.checked })} />
            <span className="font-bold">Publicado na estação Comunidade</span>
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" className="btn" disabled={ocupado} onClick={() => salvar(p)}>Salvar</button>
            <p role="status" className="text-sm font-bold">{mensagem[p.chave]}</p>
            {confirmar === p.chave ? (
              <span className="ml-auto flex flex-wrap items-center gap-2">
                <span className="text-sm font-bold">Excluir este projeto?</span>
                <button type="button" className="btn btn-sec !min-h-9 !py-1 text-sm" onClick={() => excluir(p)}>Sim, excluir</button>
                <button type="button" className="btn btn-sec !min-h-9 !py-1 text-sm" onClick={() => setConfirmar(null)}>Cancelar</button>
              </span>
            ) : (
              <button type="button" className="ml-auto min-h-11 px-2 text-sm text-suave underline" onClick={() => setConfirmar(p.chave)}>Excluir</button>
            )}
          </div>
        </fieldset>
      ))}
    </div>
  )
}
