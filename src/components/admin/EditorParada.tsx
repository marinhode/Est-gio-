'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import type { ErroCampo } from '@/app/admin/plantas/acoes'
import { type DadosParada, salvarParada } from '@/app/admin/tour/acoes'
import { CampoArea, CampoTexto, GrupoFicha, Repetidor, ResumoErros } from '@/components/admin/campos'
import { enviarArquivo } from '@/lib/upload'

type Opcao = { valor: string; rotulo: string }

function Envio({ rotulo, aceita, enviando, aoEscolher }: { rotulo: string; aceita: string; enviando: boolean; aoEscolher: (f: File) => void }) {
  return (
    <label className="btn btn-sec cursor-pointer justify-self-start has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-foco">
      {enviando ? 'Enviando…' : rotulo}
      <input type="file" accept={aceita} className="sr-only" disabled={enviando} onChange={(e) => { const f = e.target.files?.[0]; if (f) aoEscolher(f); e.target.value = '' }} />
    </label>
  )
}

export function EditorParada({ inicial, alvos }: { inicial: DadosParada; alvos: Opcao[] }) {
  const router = useRouter()
  const [d, setD] = useState<DadosParada>(inicial)
  const [erros, setErros] = useState<ErroCampo[]>([])
  const [aviso, setAviso] = useState('')
  const [enviando, setEnviando] = useState<'foto' | 'audio' | null>(null)
  const [selecionado, setSelecionado] = useState(0)
  const [salvando, iniciar] = useTransition()

  const mudar = <K extends keyof DadosParada>(k: K, v: DadosParada[K]) => { setD((a) => ({ ...a, [k]: v })); setAviso('') }
  const erro = (c: string) => erros.filter((e) => e.campo === c).map((e) => e.mensagem).join(' ') || undefined

  async function enviar(f: File, tipo: 'foto' | 'audio') {
    setEnviando(tipo)
    const r = tipo === 'foto'
      ? await enviarArquivo(f, `tour/parada-${d.id}`, ['image/jpeg', 'image/png', 'image/webp'], 5)
      : await enviarArquivo(f, `tour/narracao-${d.id}`, ['audio/mpeg', 'audio/mp4', 'audio/ogg', 'audio/wav'], 10)
    setEnviando(null)
    if ('erro' in r) setErros([{ campo: tipo, mensagem: r.erro }])
    else { mudar(tipo === 'foto' ? 'imagemUrl' : 'audioUrl', r.url); setErros([]) }
  }

  // Toque na foto posiciona o ponto selecionado
  function posicionar(e: React.MouseEvent<HTMLDivElement>) {
    if (!d.marcadores[selecionado]) return
    const r = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width) * 100
    const y = ((e.clientY - r.top) / r.height) * 100
    mudar('marcadores', d.marcadores.map((m, i) => (i === selecionado ? { ...m, x, y } : m)))
  }

  function salvar() {
    iniciar(async () => {
      const r = await salvarParada(d)
      if (!r.ok) { setErros(r.erros); requestAnimationFrame(() => document.getElementById('resumo-erros')?.focus()); return }
      setErros([]); setAviso('Parada salva. O site mostra a nova versão em alguns segundos.'); router.refresh()
    })
  }

  return (
    <form className="grid gap-6" noValidate onSubmit={(e) => { e.preventDefault(); salvar() }}>
      <ResumoErros erros={erros} />
      <GrupoFicha titulo="Texto da parada">
        <CampoTexto id="titulo" rotulo="Título" obrigatorio valor={d.titulo} mudar={(v) => mudar('titulo', v)} erro={erro('titulo')} />
        <CampoArea id="texto" rotulo="Texto" obrigatorio dica="Curto, como uma fala de guia: três a cinco frases." valor={d.texto} mudar={(v) => mudar('texto', v)} erro={erro('texto')} linhas={5} />
        <label className="flex items-start gap-3">
          <input type="checkbox" className="mt-1 size-5 accent-[var(--azul)]" checked={d.exemplo} onChange={(e) => mudar('exemplo', e.target.checked)} />
          <span><span className="font-bold">Texto provisório</span><span className="nota block">Mostra o aviso de texto aguardando revisão.</span></span>
        </label>
      </GrupoFicha>

      <GrupoFicha titulo="Foto e pontos de interesse" descricao="Escolha um ponto na lista e toque na foto para posicioná-lo. Sem foto, os pontos aparecem só como botões.">
        {d.imagemUrl ? (
          <div className="grid gap-3">
            <div className="relative aspect-[16/10] cursor-crosshair overflow-hidden rounded border border-linha" onClick={posicionar}>
              {/* eslint-disable-next-line @next/next/no-img-element -- prévia no painel */}
              <img src={d.imagemUrl} alt="" className="absolute inset-0 size-full object-cover" />
              {d.marcadores.map((m, i) => (
                <span key={i} aria-hidden="true" className={`absolute grid size-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-white text-sm font-bold ${i === selecionado ? 'bg-destaque text-sobre-destaque' : 'bg-azul text-sobre-azul'}`} style={{ left: `${m.x}%`, top: `${m.y}%` }}>
                  {i + 1}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <Envio rotulo="Trocar foto" aceita="image/jpeg,image/png,image/webp" enviando={enviando === 'foto'} aoEscolher={(f) => enviar(f, 'foto')} />
              <button type="button" className="btn btn-sec" onClick={() => mudar('imagemUrl', '')}>Remover foto</button>
            </div>
            <CampoArea id="imagemAlt" rotulo="Texto alternativo da foto" obrigatorio valor={d.imagemAlt} mudar={(v) => mudar('imagemAlt', v)} erro={erro('imagemAlt')} linhas={2} />
          </div>
        ) : (
          <Envio rotulo="Escolher foto" aceita="image/jpeg,image/png,image/webp" enviando={enviando === 'foto'} aoEscolher={(f) => enviar(f, 'foto')} />
        )}
        {erro('foto') && <p className="text-sm font-bold">⚠ {erro('foto')}</p>}

        <Repetidor
          itens={d.marcadores}
          mudar={(v) => mudar('marcadores', v)}
          novo={() => ({ x: 50, y: 50, rotulo: '', alvo: '' })}
          rotuloAdicionar="Adicionar ponto"
          rotuloItem={(i) => `Ponto ${i + 1}`}
          render={(m, alterar, i) => (
            <div id={`marcador-${i}`} tabIndex={-1} className="grid gap-3">
              {erro(`marcador-${i}`) && <p className="text-sm font-bold">⚠ {erro(`marcador-${i}`)}</p>}
              <div className="grid gap-3 sm:grid-cols-2">
                <CampoTexto id={`rotulo-${i}`} rotulo="Nome do ponto" valor={m.rotulo} mudar={(rotulo) => alterar({ ...m, rotulo })} />
                <div className="grid content-start gap-1">
                  <label htmlFor={`alvo-${i}`} className="font-bold">Leva para</label>
                  <select id={`alvo-${i}`} className="campo" value={m.alvo} onChange={(e) => alterar({ ...m, alvo: e.target.value })}>
                    <option value="">Escolha…</option>
                    {alvos.map((a) => (<option key={a.valor} value={a.valor}>{a.rotulo}</option>))}
                  </select>
                </div>
              </div>
              {d.imagemUrl && (
                <div className="flex flex-wrap items-end gap-3">
                  <button type="button" className={`btn ${selecionado === i ? '' : 'btn-sec'}`} aria-pressed={selecionado === i} onClick={() => setSelecionado(i)}>
                    {selecionado === i ? 'Toque na foto para posicionar' : 'Posicionar na foto'}
                  </button>
                  <CampoTexto id={`x-${i}`} rotulo="Horizontal (%)" tipo="number" valor={String(Math.round(m.x))} mudar={(v) => alterar({ ...m, x: Number(v) })} className="campo w-24" />
                  <CampoTexto id={`y-${i}`} rotulo="Vertical (%)" tipo="number" valor={String(Math.round(m.y))} mudar={(v) => alterar({ ...m, y: Number(v) })} className="campo w-24" />
                </div>
              )}
            </div>
          )}
        />
      </GrupoFicha>

      <GrupoFicha titulo="Narração" descricao="Opcional. Áudio em MP3, M4A, OGG ou WAV, até 10 MB, sempre com transcrição.">
        {d.audioUrl ? (
          <div className="grid gap-3">
            <audio controls src={d.audioUrl} className="w-full" />
            <button type="button" className="btn btn-sec justify-self-start" onClick={() => mudar('audioUrl', '')}>Remover áudio</button>
          </div>
        ) : (
          <Envio rotulo="Escolher áudio" aceita="audio/mpeg,audio/mp4,audio/ogg,audio/wav" enviando={enviando === 'audio'} aoEscolher={(f) => enviar(f, 'audio')} />
        )}
        {erro('audio') && <p className="text-sm font-bold">⚠ {erro('audio')}</p>}
        {d.audioUrl && <CampoArea id="transcricao" rotulo="Transcrição" obrigatorio valor={d.transcricao} mudar={(v) => mudar('transcricao', v)} erro={erro('transcricao')} linhas={5} />}
      </GrupoFicha>

      <div className="sticky bottom-0 z-20 -mx-4 grid gap-2 border-t border-linha bg-superficie px-4 py-3 pb-[max(.75rem,env(safe-area-inset-bottom))] sm:mx-0 sm:rounded-t-md sm:border-x">
        <p role="status" className="text-sm font-bold empty:hidden">{aviso}</p>
        <div className="flex flex-wrap gap-2">
          <button type="submit" className="btn" disabled={salvando || enviando !== null}>{salvando ? 'Salvando…' : 'Salvar parada'}</button>
        </div>
      </div>
    </form>
  )
}
