'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { Icone } from '@/components/Icone'
import type { Jogo } from '@/lib/tipos'

type Modo = 'individual' | 'turma'
type Fase = 'inicio' | 'pergunta' | 'resposta' | 'fim'

/** "É mito." / "É verdade." / "É verdade só em parte." */
function veredito(opcao: string) {
  return opcao === 'Em parte' ? 'É verdade só em parte.' : `É ${opcao.toLowerCase()}.`
}

function mensagemFinal(acertos: number, total: number) {
  const taxa = acertos / total
  if (taxa === 1) return 'Você acertou tudo. Que tal desafiar outra pessoa?'
  if (taxa >= 0.7) return 'Muito bem! Você já conhece bastante sobre o tema.'
  if (taxa >= 0.4) return 'Bom começo. As explicações ajudam a ir mais longe.'
  return 'Toda descoberta começa com uma dúvida. Que tal tentar de novo?'
}

/**
 * Motor único para quiz e mitos e verdades.
 * Modo individual: escolhe, recebe explicação, soma pontos.
 * Modo turma: para projetar; a resposta só aparece ao clicar em "Revelar".
 */
export function JogoInterativo({ jogo }: { jogo: Jogo }) {
  const [modo, setModo] = useState<Modo>('individual')
  const [fase, setFase] = useState<Fase>('inicio')
  const [indice, setIndice] = useState(0)
  const [escolha, setEscolha] = useState<number | null>(null)
  const [acertos, setAcertos] = useState(0)
  const tituloPergunta = useRef<HTMLHeadingElement>(null)
  const tituloResposta = useRef<HTMLParagraphElement>(null)
  const tituloFim = useRef<HTMLHeadingElement>(null)

  const total = jogo.perguntas.length
  const pergunta = jogo.perguntas[indice]
  const mito = jogo.tipo === 'mitos_verdades'

  // Leva o foco para o que mudou, para teclado e leitor de tela acompanharem
  useEffect(() => {
    if (fase === 'pergunta') tituloPergunta.current?.focus()
    if (fase === 'resposta') tituloResposta.current?.focus()
    if (fase === 'fim') tituloFim.current?.focus()
  }, [fase, indice])

  function comecar(m: Modo) {
    setModo(m)
    setIndice(0)
    setAcertos(0)
    setEscolha(null)
    setFase('pergunta')
  }

  function responder(i: number | null) {
    setEscolha(i)
    if (i === pergunta.correta) setAcertos((a) => a + 1)
    setFase('resposta')
  }

  function seguir() {
    if (indice + 1 >= total) {
      setFase('fim')
      return
    }
    setIndice(indice + 1)
    setEscolha(null)
    setFase('pergunta')
  }

  if (fase === 'inicio') {
    return (
      <div className="grid gap-5 rounded-md border border-linha bg-superficie p-6">
        <p className="text-lg">
          {total} {mito ? 'afirmações' : 'perguntas'}.{' '}
          {mito ? 'Para cada uma, diga se é mito, verdade ou se é verdade só em parte.' : 'Escolha a alternativa que você acha certa.'}{' '}
          Depois de cada resposta, aparece uma explicação.
        </p>
        <div className="flex flex-wrap gap-3">
          <button type="button" className="btn" onClick={() => comecar('individual')}>
            Jogar
          </button>
          <button type="button" className="btn btn-sec" onClick={() => comecar('turma')}>
            <Icone nome="pessoas" />
            Jogar com a turma
          </button>
        </div>
        <p className="nota">
          No modo turma, a pergunta aparece em letras grandes para projetar. A turma discute e a resposta só aparece quando
          você clicar em &quot;Revelar resposta&quot;.
        </p>
      </div>
    )
  }

  if (fase === 'fim') {
    return (
      <div className="grid gap-5 rounded-md border border-linha bg-superficie p-6 sm:p-8">
        <h2 ref={tituloFim} tabIndex={-1} className="outline-none">
          {modo === 'individual' ? `Você acertou ${acertos} de ${total}` : 'Fim do jogo'}
        </h2>
        <p className="text-lg">
          {modo === 'individual' ? mensagemFinal(acertos, total) : 'Que tal perguntar à turma qual resposta mais surpreendeu?'}
        </p>
        <div className="flex flex-wrap gap-3">
          <button type="button" className="btn" onClick={() => comecar(modo)}>
            Jogar de novo
          </button>
          <Link href="/jogos" className="btn btn-sec">
            Outros jogos
          </Link>
          <Link href="/sentidos" className="btn btn-sec">
            Explorar os sentidos
          </Link>
        </div>
      </div>
    )
  }

  const respondida = fase === 'resposta'
  const acertou = escolha === pergunta.correta

  return (
    <div className={`grid gap-6 ${modo === 'turma' ? 'modo-turma' : ''}`}>
      {/* Progresso */}
      <div className="grid gap-2">
        <div className="flex flex-wrap items-baseline justify-between gap-2 text-sm">
          <span className="font-bold">
            {mito ? 'Afirmação' : 'Pergunta'} {indice + 1} de {total}
          </span>
          {modo === 'individual' && <span className="text-suave tabular-nums">{acertos} {acertos === 1 ? 'acerto' : 'acertos'}</span>}
          {modo === 'turma' && <span className="text-suave">Modo turma</span>}
        </div>
        <div className="flex gap-1" aria-hidden="true">
          {jogo.perguntas.map((_, i) => (
            <span key={i} className={`h-1.5 flex-1 rounded-full ${i < indice || (i === indice && respondida) ? 'bg-azul' : 'bg-linha'}`} />
          ))}
        </div>
      </div>

      <h2 ref={tituloPergunta} tabIndex={-1} className="enunciado outline-none">
        {mito ? <>&ldquo;{pergunta.enunciado}&rdquo;</> : pergunta.enunciado}
      </h2>

      {/* Alternativas */}
      <ul className={`grid gap-3 ${mito ? 'sm:grid-cols-3' : ''}`}>
        {pergunta.opcoes.map((op, i) => {
          const certa = respondida && i === pergunta.correta
          const errada = respondida && i === escolha && !acertou
          return (
            <li key={op}>
              <button
                type="button"
                className={`alternativa ${certa ? 'certa' : ''} ${errada ? 'errada' : ''}`}
                disabled={respondida || modo === 'turma'}
                aria-describedby={respondida ? 'feedback' : undefined}
                onClick={() => responder(i)}
              >
                <span className="flex-1">{op}</span>
                {certa && (
                  <span className="flex items-center gap-1 text-sm font-bold">
                    <Icone nome="ok" className="size-5" />
                    Resposta
                  </span>
                )}
                {errada && <span className="text-sm font-bold">Sua escolha</span>}
              </button>
            </li>
          )
        })}
      </ul>

      {modo === 'turma' && !respondida && (
        <button type="button" className="btn justify-self-start" onClick={() => responder(null)}>
          Revelar resposta
        </button>
      )}

      {/* Explicação */}
      {respondida && (
        <div id="feedback" className="grid gap-3 rounded-md border-l-4 border-azul bg-superficie p-5">
          <p ref={tituloResposta} tabIndex={-1} className="font-titulo text-[1.35rem] outline-none">
            {modo === 'turma'
              ? `Resposta: ${pergunta.opcoes[pergunta.correta]}`
              : acertou
                ? `Isso mesmo! ${mito ? veredito(pergunta.opcoes[pergunta.correta]) : ''}`
                : `Quase! ${mito ? veredito(pergunta.opcoes[pergunta.correta]) : 'Veja por quê.'}`}
          </p>
          <p className="leitura">{pergunta.feedback}</p>
          {pergunta.fonte && (
            <p className="nota">
              Fonte: {pergunta.fonte.url ? <a href={pergunta.fonte.url}>{pergunta.fonte.titulo}</a> : pergunta.fonte.titulo}
            </p>
          )}
          <button type="button" className="btn justify-self-start" onClick={seguir}>
            {indice + 1 >= total ? 'Ver resultado' : mito ? 'Próxima afirmação' : 'Próxima pergunta'}
            <Icone nome="seta" />
          </button>
        </div>
      )}
    </div>
  )
}
