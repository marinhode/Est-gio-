'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useRef, useState, useTransition } from 'react'
import { type DadosJogo, excluirJogo, salvarJogo } from '@/app/admin/jogos/acoes'
import type { ErroCampo } from '@/app/admin/plantas/acoes'
import { CampoArea, CampoTexto, GrupoFicha, Repetidor, ResumoErros } from '@/components/admin/campos'
import { OPCOES_MITO, perguntaVazia } from '@/lib/formulario-jogo'
import { paraEndereco } from '@/lib/formulario-planta'

export function EditorJogo({ inicial, slugOriginal }: { inicial: DadosJogo; slugOriginal: string | null }) {
  const router = useRouter()
  const [d, setD] = useState<DadosJogo>(inicial)
  const [erros, setErros] = useState<ErroCampo[]>([])
  const [aviso, setAviso] = useState('')
  const [confirmar, setConfirmar] = useState(false)
  const [salvando, iniciar] = useTransition()
  const enderecoManual = useRef(Boolean(slugOriginal))
  const mito = d.tipo === 'mitos_verdades'

  const mudar = <K extends keyof DadosJogo>(k: K, v: DadosJogo[K]) => {
    setD((a) => ({ ...a, [k]: v, ...(k === 'titulo' && !enderecoManual.current ? { slug: paraEndereco(String(v)) } : {}) }))
    setAviso('')
  }
  const erroDe = (campo: string) => erros.filter((e) => e.campo === campo).map((e) => e.mensagem).join(' ')

  function trocarTipo(tipo: DadosJogo['tipo']) {
    setD((a) => ({
      ...a,
      tipo,
      perguntas: a.perguntas.map((p) => (tipo === 'mitos_verdades' ? { ...p, opcoes: [...OPCOES_MITO], correta: Math.min(p.correta, 2) } : p)),
    }))
  }

  function salvar(publicar: boolean) {
    iniciar(async () => {
      const r = await salvarJogo({ ...d, publicado: publicar }, slugOriginal)
      if (!r.ok) {
        setErros(r.erros)
        requestAnimationFrame(() => document.getElementById('resumo-erros')?.focus())
        return
      }
      setErros([])
      setD((a) => ({ ...a, publicado: publicar }))
      setAviso(publicar ? 'Publicado. O jogo já aparece no site.' : 'Rascunho salvo. O jogo não aparece no site.')
      if (r.slug !== slugOriginal) router.replace(`/admin/jogos/${r.slug}`)
      else router.refresh()
    })
  }

  function excluir() {
    iniciar(async () => {
      const r = await excluirJogo(slugOriginal!)
      if (r.ok) router.replace('/admin/jogos')
      else setErros([{ campo: 'geral', mensagem: r.mensagem ?? 'Não foi possível excluir.' }])
    })
  }

  return (
    <form className="grid gap-6" noValidate onSubmit={(e) => { e.preventDefault(); salvar(d.publicado) }}>
      <ResumoErros erros={erros} />

      <GrupoFicha titulo="Sobre o jogo">
        <div className="grid gap-4 md:grid-cols-2">
          <CampoTexto id="titulo" rotulo="Título" obrigatorio valor={d.titulo} mudar={(v) => mudar('titulo', v)} erro={erroDe('titulo')} />
          <CampoTexto
            id="slug"
            rotulo="Endereço"
            obrigatorio
            dica={`O jogo ficará em /jogos/${d.slug || '…'}`}
            valor={d.slug}
            mudar={(v) => { enderecoManual.current = true; mudar('slug', paraEndereco(v) + (v.endsWith('-') ? '-' : '')) }}
            erro={erroDe('slug')}
          />
        </div>
        <CampoArea id="descricao" rotulo="Descrição" dica="Aparece na lista de jogos." valor={d.descricao} mudar={(v) => mudar('descricao', v)} linhas={2} />
        <fieldset className="grid gap-2">
          <legend className="mb-1 font-bold">Formato</legend>
          {([['quiz', 'Quiz', 'Alternativas livres, de 2 a 6 por pergunta.'], ['mitos_verdades', 'Mitos e verdades', 'Cada afirmação recebe Mito, Verdade ou Em parte.']] as const).map(([v, r, dica]) => (
            <label key={v} className="flex items-start gap-3">
              <input type="radio" name="tipo" className="mt-1 size-5 accent-[var(--azul)]" checked={d.tipo === v} onChange={() => trocarTipo(v)} />
              <span><span className="font-bold">{r}</span><span className="nota block">{dica}</span></span>
            </label>
          ))}
        </fieldset>
        <label className="flex items-start gap-3">
          <input type="checkbox" className="mt-1 size-5 accent-[var(--azul)]" checked={d.exemplo} onChange={(e) => mudar('exemplo', e.target.checked)} />
          <span><span className="font-bold">Conteúdo provisório</span><span className="nota block">Mostra o aviso de texto aguardando revisão.</span></span>
        </label>
      </GrupoFicha>

      <GrupoFicha titulo={mito ? 'Afirmações' : 'Perguntas'} descricao="A explicação aparece depois de cada resposta. Use o tom do laboratório: Quase! Veja por quê.">
        {erroDe('perguntas') && <p className="text-sm font-bold">⚠ {erroDe('perguntas')}</p>}
        <Repetidor
          itens={d.perguntas}
          mudar={(v) => mudar('perguntas', v)}
          novo={() => perguntaVazia(d.tipo)}
          rotuloAdicionar={mito ? 'Adicionar afirmação' : 'Adicionar pergunta'}
          rotuloItem={(i) => `${mito ? 'Afirmação' : 'Pergunta'} ${i + 1}`}
          render={(p, alterar, i) => (
            <div id={`pergunta-${i}`} tabIndex={-1} className="grid gap-3">
              {erroDe(`pergunta-${i}`) && <p className="text-sm font-bold">⚠ {erroDe(`pergunta-${i}`)}</p>}
              <CampoArea id={`enunciado-${i}`} rotulo={mito ? 'Afirmação' : 'Enunciado'} valor={p.enunciado} mudar={(enunciado) => alterar({ ...p, enunciado })} linhas={2} />
              <fieldset className="grid gap-2">
                <legend className="mb-1 font-bold">{mito ? 'Resposta certa' : 'Alternativas (marque a certa)'}</legend>
                {p.opcoes.map((op, j) => (
                  <div key={j} className="flex items-center gap-3">
                    <input
                      type="radio"
                      name={`correta-${i}`}
                      className="size-5 flex-none accent-[var(--azul)]"
                      checked={p.correta === j}
                      onChange={() => alterar({ ...p, correta: j })}
                      aria-label={`Marcar ${mito ? op : `alternativa ${j + 1}`} como resposta certa`}
                    />
                    {mito ? (
                      <span>{op}</span>
                    ) : (
                      <>
                        <input
                          className="campo flex-1"
                          value={op}
                          aria-label={`Alternativa ${j + 1}`}
                          onChange={(e) => alterar({ ...p, opcoes: p.opcoes.map((o, k) => (k === j ? e.target.value : o)) })}
                        />
                        {p.opcoes.length > 2 && (
                          <button
                            type="button"
                            className="btn btn-sec !min-h-9 !px-3 !py-1 text-sm"
                            aria-label={`Remover alternativa ${j + 1}`}
                            onClick={() => alterar({ ...p, opcoes: p.opcoes.filter((_, k) => k !== j), correta: p.correta === j ? 0 : p.correta > j ? p.correta - 1 : p.correta })}
                          >
                            Remover
                          </button>
                        )}
                      </>
                    )}
                  </div>
                ))}
                {!mito && p.opcoes.length < 6 && (
                  <button type="button" className="btn btn-sec justify-self-start !min-h-9 !py-1 text-sm" onClick={() => alterar({ ...p, opcoes: [...p.opcoes, ''] })}>
                    + Alternativa
                  </button>
                )}
              </fieldset>
              <CampoArea id={`feedback-${i}`} rotulo="Explicação" valor={p.feedback} mudar={(feedback) => alterar({ ...p, feedback })} linhas={3} />
              <div className="grid gap-3 md:grid-cols-2">
                <CampoTexto id={`fonte-${i}`} rotulo="Fonte" dica="Opcional. Referência que sustenta a explicação." valor={p.fonteTitulo} mudar={(fonteTitulo) => alterar({ ...p, fonteTitulo })} />
                <CampoTexto id={`fonte-url-${i}`} rotulo="Link da fonte" tipo="url" placeholder="https://" valor={p.fonteUrl} mudar={(fonteUrl) => alterar({ ...p, fonteUrl })} />
              </div>
            </div>
          )}
        />
      </GrupoFicha>

      <div className="sticky bottom-0 z-20 -mx-4 grid gap-2 border-t border-linha bg-superficie px-4 py-3 pb-[max(.75rem,env(safe-area-inset-bottom))] sm:mx-0 sm:rounded-t-md sm:border-x">
        <p role="status" className="text-sm font-bold empty:hidden">{aviso}</p>
        <div className="flex flex-wrap items-center gap-2">
          <span className={`selo !text-xs ${d.publicado ? 'selo-uso_reconhecido' : 'selo-popular'}`}>{d.publicado ? 'Publicado' : 'Rascunho'}</span>
          <button type="button" className="btn" disabled={salvando} onClick={() => salvar(true)}>{salvando ? 'Salvando…' : d.publicado ? 'Salvar alterações' : 'Publicar'}</button>
          <button type="button" className="btn btn-sec" disabled={salvando} onClick={() => salvar(false)}>{d.publicado ? 'Despublicar' : 'Salvar rascunho'}</button>
          {slugOriginal && d.publicado && <Link href={`/jogos/${slugOriginal}`} className="btn btn-sec" target="_blank">Jogar no site</Link>}
          {slugOriginal && !confirmar && <button type="button" className="ml-auto min-h-11 px-2 text-sm text-suave underline" onClick={() => setConfirmar(true)}>Excluir jogo</button>}
          {confirmar && (
            <span className="ml-auto flex flex-wrap items-center gap-2">
              <span className="text-sm font-bold">Excluir o jogo e todas as perguntas?</span>
              <button type="button" className="btn btn-sec !min-h-9 !py-1 text-sm" onClick={excluir}>Sim, excluir</button>
              <button type="button" className="btn btn-sec !min-h-9 !py-1 text-sm" onClick={() => setConfirmar(false)}>Cancelar</button>
            </span>
          )}
        </div>
      </div>
    </form>
  )
}
