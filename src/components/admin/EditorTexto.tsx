'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useRef, useState, useTransition } from 'react'
import type { ErroCampo } from '@/app/admin/plantas/acoes'
import { type DadosTexto, excluirTexto, salvarTexto } from '@/app/admin/textos/acoes'
import { CampoArea, CampoTexto, GrupoFicha, Repetidor, ResumoErros } from '@/components/admin/campos'
import { paraEndereco } from '@/lib/formulario-planta'

const hoje = () => new Date().toISOString().slice(0, 10)

export function EditorTexto({ inicial, chaveOriginal }: { inicial: DadosTexto; chaveOriginal: string | null }) {
  const router = useRouter()
  const [d, setD] = useState<DadosTexto>(inicial)
  const [erros, setErros] = useState<ErroCampo[]>([])
  const [aviso, setAviso] = useState('')
  const [confirmar, setConfirmar] = useState(false)
  const [salvando, iniciar] = useTransition()
  const enderecoManual = useRef(Boolean(chaveOriginal))

  const mudar = <K extends keyof DadosTexto>(k: K, v: DadosTexto[K]) => {
    setD((a) => ({ ...a, [k]: v, ...(k === 'titulo' && !enderecoManual.current ? { chave: paraEndereco(String(v)) } : {}) }))
    setAviso('')
  }
  const erro = (campo: string) => erros.filter((e) => e.campo === campo).map((e) => e.mensagem).join(' ') || undefined
  const atividade = d.atividade
  const mudarAtividade = (a: Partial<DadosTexto['atividade']>) => mudar('atividade', { ...atividade, ...a })

  function salvar() {
    iniciar(async () => {
      const r = await salvarTexto(d, chaveOriginal)
      if (!r.ok) {
        setErros(r.erros)
        requestAnimationFrame(() => document.getElementById('resumo-erros')?.focus())
        return
      }
      setErros([])
      setAviso('Salvo. O site mostra a nova versão em alguns segundos.')
      if (r.chave !== chaveOriginal) router.replace(`/admin/textos/${r.chave}`)
      else router.refresh()
    })
  }

  function excluir() {
    iniciar(async () => {
      const r = await excluirTexto(chaveOriginal!)
      if (r.ok) router.replace('/admin/textos')
      else setErros([{ campo: 'geral', mensagem: r.mensagem ?? 'Não foi possível excluir.' }])
    })
  }

  return (
    <form className="grid gap-6" noValidate onSubmit={(e) => { e.preventDefault(); salvar() }}>
      <ResumoErros erros={erros} />

      <GrupoFicha titulo="Apresentação">
        <div className="grid gap-4 md:grid-cols-2">
          <CampoTexto id="titulo" rotulo="Título" obrigatorio valor={d.titulo} mudar={(v) => mudar('titulo', v)} erro={erro('titulo')} />
          <CampoTexto
            id="chave"
            rotulo="Endereço"
            obrigatorio
            dica={`O tema ficará em /sentidos/${d.chave || '…'}`}
            valor={d.chave}
            mudar={(v) => { enderecoManual.current = true; mudar('chave', paraEndereco(v) + (v.endsWith('-') ? '-' : '')) }}
            erro={erro('chave')}
          />
        </div>
        <CampoArea id="resumo" rotulo="Resumo" obrigatorio dica="Uma frase que aparece na lista de temas e abaixo do título." valor={d.resumo} mudar={(v) => mudar('resumo', v)} erro={erro('resumo')} linhas={2} />
        <label className="flex items-start gap-3">
          <input type="checkbox" className="mt-1 size-5 accent-[var(--azul)]" checked={d.exemplo} onChange={(e) => mudar('exemplo', e.target.checked)} />
          <span><span className="font-bold">Texto provisório</span><span className="nota block">Mostra o aviso de texto aguardando revisão da Psicologia.</span></span>
        </label>
      </GrupoFicha>

      <GrupoFicha titulo="Texto" descricao="Linguagem acessível e frases curtas. Para separar parágrafos, deixe uma linha em branco.">
        {erro('secoes') && <p className="text-sm font-bold">⚠ {erro('secoes')}</p>}
        <Repetidor
          itens={d.secoes}
          mudar={(v) => mudar('secoes', v)}
          novo={() => ({ titulo: '', texto: '' })}
          rotuloAdicionar="Adicionar seção"
          rotuloItem={(i) => `Seção ${i + 1}`}
          render={(s, alterar, i) => (
            <div id={`secao-${i}`} tabIndex={-1} className="grid gap-3">
              <CampoTexto id={`secao-titulo-${i}`} rotulo="Subtítulo" valor={s.titulo} mudar={(titulo) => alterar({ ...s, titulo })} erro={erro(`secao-${i}`)} />
              <CampoArea id={`secao-texto-${i}`} rotulo="Texto" valor={s.texto} mudar={(texto) => alterar({ ...s, texto })} linhas={6} />
            </div>
          )}
        />
      </GrupoFicha>

      <GrupoFicha titulo="Atividade guiada" descricao="Passo a passo com cronômetro opcional. Ninguém é apressado: ao fim do tempo, a pessoa decide quando seguir.">
        <label className="flex items-center gap-3">
          <input type="checkbox" className="size-5 accent-[var(--azul)]" checked={d.temAtividade} onChange={(e) => mudar('temAtividade', e.target.checked)} />
          <span className="font-bold">Este tema tem atividade</span>
        </label>
        {d.temAtividade && (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              <CampoTexto id="atividade-titulo" rotulo="Nome da atividade" obrigatorio valor={atividade.titulo} mudar={(titulo) => mudarAtividade({ titulo })} erro={erro('atividade-titulo')} />
              <CampoTexto id="atividade-intro" rotulo="Introdução" dica="O que a pessoa precisa antes de começar." valor={atividade.introducao} mudar={(introducao) => mudarAtividade({ introducao })} />
            </div>
            <div id="passos" tabIndex={-1} className="grid gap-2">
              <p className="font-bold">Passos</p>
              {erro('passos') && <p className="text-sm font-bold">⚠ {erro('passos')}</p>}
              <Repetidor
                itens={atividade.passos}
                mudar={(passos) => mudarAtividade({ passos })}
                novo={() => ({ texto: '', segundos: '30' })}
                rotuloAdicionar="Adicionar passo"
                rotuloItem={(i) => `Passo ${i + 1}`}
                render={(p, alterar, i) => (
                  <div id={`passo-${i}`} tabIndex={-1} className="grid gap-3 sm:grid-cols-[1fr_10rem]">
                    <CampoArea id={`passo-texto-${i}`} rotulo="Instrução" valor={p.texto} mudar={(texto) => alterar({ ...p, texto })} erro={erro(`passo-${i}`)} linhas={2} />
                    <CampoTexto id={`passo-tempo-${i}`} rotulo="Tempo (segundos)" tipo="number" dica="Vazio: sem cronômetro." valor={p.segundos} mudar={(segundos) => alterar({ ...p, segundos })} />
                  </div>
                )}
              />
            </div>
          </>
        )}
      </GrupoFicha>

      <GrupoFicha titulo="Pergunta para reflexão" descricao="Pergunta aberta, sem resposta certa. As respostas chegam anônimas ao painel.">
        <CampoTexto id="pergunta" rotulo="Pergunta" dica="Opcional. Ex.: Que lembrança um aroma já trouxe de volta para você?" valor={d.pergunta} mudar={(v) => mudar('pergunta', v)} />
      </GrupoFicha>

      <GrupoFicha titulo="Fontes">
        <Repetidor
          itens={d.fontes}
          mudar={(v) => mudar('fontes', v)}
          novo={() => ({ titulo: '', url: '', consultadoEm: hoje() })}
          rotuloAdicionar="Adicionar fonte"
          rotuloItem={(i) => `Fonte ${i + 1}`}
          render={(f, alterar, i) => (
            <div id={`fonte-${i}`} tabIndex={-1} className="grid gap-3">
              <CampoArea id={`fonte-titulo-${i}`} rotulo="Referência" valor={f.titulo} mudar={(titulo) => alterar({ ...f, titulo })} erro={erro(`fonte-${i}`)} linhas={2} />
              <div className="grid gap-3 sm:grid-cols-[1fr_12rem]">
                <CampoTexto id={`fonte-url-${i}`} rotulo="Link" tipo="url" placeholder="https://" valor={f.url ?? ''} mudar={(url) => alterar({ ...f, url })} />
                <CampoTexto id={`fonte-data-${i}`} rotulo="Consultado em" tipo="date" valor={f.consultadoEm ?? ''} mudar={(consultadoEm) => alterar({ ...f, consultadoEm })} />
              </div>
            </div>
          )}
        />
      </GrupoFicha>

      <div className="sticky bottom-0 z-20 -mx-4 grid gap-2 border-t border-linha bg-superficie px-4 py-3 pb-[max(.75rem,env(safe-area-inset-bottom))] sm:mx-0 sm:rounded-t-md sm:border-x">
        <p role="status" className="text-sm font-bold empty:hidden">{aviso}</p>
        <div className="flex flex-wrap items-center gap-2">
          <button type="submit" className="btn" disabled={salvando}>{salvando ? 'Salvando…' : 'Salvar'}</button>
          {chaveOriginal && <Link href={`/sentidos/${chaveOriginal}`} className="btn btn-sec" target="_blank">Ver no site</Link>}
          {chaveOriginal && !confirmar && <button type="button" className="ml-auto min-h-11 px-2 text-sm text-suave underline" onClick={() => setConfirmar(true)}>Excluir tema</button>}
          {confirmar && (
            <span className="ml-auto flex flex-wrap items-center gap-2">
              <span className="text-sm font-bold">Excluir este tema?</span>
              <button type="button" className="btn btn-sec !min-h-9 !py-1 text-sm" onClick={excluir}>Sim, excluir</button>
              <button type="button" className="btn btn-sec !min-h-9 !py-1 text-sm" onClick={() => setConfirmar(false)}>Cancelar</button>
            </span>
          )}
        </div>
      </div>
    </form>
  )
}
