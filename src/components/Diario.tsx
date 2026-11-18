'use client'

import Link from 'next/link'
import { useState } from 'react'
import { SENTIDOS, type Registro, type Sentido, useDiario } from '@/lib/diario'

const formatoData = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })

function comoTexto(r: Registro) {
  const linhas = [formatoData.format(new Date(r.criadoEm)) + (r.sobre ? `: ${r.sobre}` : '')]
  if (r.sentidos.length) linhas.push(`Sentidos: ${r.sentidos.join(', ')}`)
  if (r.observei) linhas.push(`Observei: ${r.observei}`)
  if (r.senti) linhas.push(`Senti: ${r.senti}`)
  if (r.descobri) linhas.push(`Descobri: ${r.descobri}`)
  if (r.pergunta) linhas.push(`${r.pergunta} ${r.resposta ?? ''}`)
  return linhas.join('\n')
}

export function Diario() {
  const { pronto, registros, adicionar, apagar } = useDiario()
  const [sobre, setSobre] = useState('')
  const [sentidos, setSentidos] = useState<Sentido[]>([])
  const [observei, setObservei] = useState('')
  const [senti, setSenti] = useState('')
  const [descobri, setDescobri] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [confirmando, setConfirmando] = useState<string | null>(null)

  const vazio = !observei.trim() && !senti.trim() && !descobri.trim()

  function guardar(e: React.FormEvent) {
    e.preventDefault()
    if (vazio) {
      setMensagem('Escreva em pelo menos um dos campos: o que observou, sentiu ou descobriu.')
      return
    }
    const ok = adicionar({
      sobre: sobre.trim() || undefined,
      sentidos,
      observei: observei.trim() || undefined,
      senti: senti.trim() || undefined,
      descobri: descobri.trim() || undefined,
    })
    if (!ok) {
      setMensagem('Não foi possível guardar: este navegador bloqueia o armazenamento. Tente fora da janela anônima.')
      return
    }
    setSobre('')
    setSentidos([])
    setObservei('')
    setSenti('')
    setDescobri('')
    setMensagem('Registro guardado.')
  }

  async function copiar() {
    const texto = ['Meu diário sensorial', ...registros.map(comoTexto)].join('\n\n')
    try {
      await navigator.clipboard.writeText(texto)
      setMensagem('Diário copiado. Cole onde quiser guardar.')
    } catch {
      setMensagem('Não foi possível copiar automaticamente neste navegador.')
    }
  }

  const alternar = (s: Sentido) => setSentidos((atual) => (atual.includes(s) ? atual.filter((x) => x !== s) : [...atual, s]))

  return (
    <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)]">
      {/* Novo registro */}
      <form onSubmit={guardar} className="grid gap-4 rounded-md border border-linha bg-superficie p-5 lg:sticky lg:top-24" noValidate>
        <h2 className="text-[1.35rem]">Novo registro</h2>

        <div className="grid gap-1">
          <label htmlFor="d-sobre" className="font-bold">Sobre o quê?</label>
          <input id="d-sobre" className="campo" value={sobre} onChange={(e) => setSobre(e.target.value)} placeholder="Uma planta, um canteiro, um momento" maxLength={80} />
        </div>

        <fieldset className="grid gap-2">
          <legend className="mb-1 font-bold">Sentidos que você usou</legend>
          <div className="flex flex-wrap gap-2">
            {SENTIDOS.map((s) => (
              <label key={s} className="chip cursor-pointer has-[:checked]:border-lavanda has-[:checked]:bg-lavanda has-[:checked]:text-sobre-azul has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-foco">
                <input type="checkbox" className="sr-only" checked={sentidos.includes(s)} onChange={() => alternar(s)} />
                {s}
              </label>
            ))}
          </div>
          <p className="nota">Não prove plantas sem orientação de um responsável pelo laboratório.</p>
        </fieldset>

        {(
          [
            ['d-observei', 'O que observei', observei, setObservei],
            ['d-senti', 'O que senti', senti, setSenti],
            ['d-descobri', 'O que descobri', descobri, setDescobri],
          ] as const
        ).map(([id, rotulo, valor, mudar]) => (
          <div key={id} className="grid gap-1">
            <label htmlFor={id} className="font-bold">{rotulo}</label>
            <textarea id={id} className="campo campo-pautado" rows={3} value={valor} onChange={(e) => mudar(e.target.value)} maxLength={600} />
          </div>
        ))}

        <button type="submit" className="btn btn-lavanda justify-self-start">Guardar registro</button>
        <p role="status" className="c-sinta font-bold empty:hidden">{mensagem}</p>
      </form>

      {/* Registros */}
      <section aria-labelledby="t-registros" className="grid gap-4">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 id="t-registros" className="text-[1.35rem]">
            Seus registros{pronto && registros.length > 0 && <span className="nota font-texto"> ({registros.length})</span>}
          </h2>
          {registros.length > 0 && (
            <button type="button" className="btn btn-sec btn-sec-lavanda" onClick={copiar}>Copiar o diário</button>
          )}
        </div>

        {pronto && registros.length === 0 && (
          <div className="grid gap-2 rounded-md border border-dashed border-linha p-6">
            <p className="font-titulo text-xl">Seu diário ainda está em branco</p>
            <p className="text-suave">
              Faça uma atividade, como a de <Link href="/sentidos/memoria-olfativa">memória olfativa</Link>, e registre aqui o que percebeu.
            </p>
          </div>
        )}

        <ol className="grid gap-4">
          {registros.map((r) => (
            <li key={r.id} className="folha-caderno">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-titulo text-lg">{r.sobre ?? (r.pergunta ? 'Pergunta para reflexão' : 'Registro')}</p>
                <time dateTime={r.criadoEm} className="nota">{formatoData.format(new Date(r.criadoEm))}</time>
              </div>
              {r.sentidos.length > 0 && (
                <ul className="flex flex-wrap gap-1.5" aria-label="Sentidos usados">
                  {r.sentidos.map((s) => (
                    <li key={s} className="selo c-sinta">{s}</li>
                  ))}
                </ul>
              )}
              <dl className="grid gap-2">
                {r.observei && (<div><dt className="nota">Observei</dt><dd>{r.observei}</dd></div>)}
                {r.senti && (<div><dt className="nota">Senti</dt><dd>{r.senti}</dd></div>)}
                {r.descobri && (<div><dt className="nota">Descobri</dt><dd>{r.descobri}</dd></div>)}
                {r.pergunta && (<div><dt className="nota">{r.pergunta}</dt><dd>{r.resposta}</dd></div>)}
              </dl>
              <div className="flex flex-wrap items-center gap-2">
                {confirmando === r.id ? (
                  <>
                    <span className="text-sm font-bold">Apagar este registro?</span>
                    <button type="button" className="btn btn-sec !min-h-9 !py-1 text-sm" onClick={() => { apagar(r.id); setConfirmando(null); setMensagem('Registro apagado.') }}>Sim, apagar</button>
                    <button type="button" className="btn btn-sec !min-h-9 !py-1 text-sm" onClick={() => setConfirmando(null)}>Cancelar</button>
                  </>
                ) : (
                  <button type="button" className="min-h-11 px-1 text-sm text-suave underline" onClick={() => setConfirmando(r.id)}>Apagar</button>
                )}
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}
