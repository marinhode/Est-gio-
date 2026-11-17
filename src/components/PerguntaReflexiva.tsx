'use client'

import Link from 'next/link'
import { useId, useState } from 'react'
import { useDiario } from '@/lib/diario'

/**
 * Pergunta aberta, sem resposta certa (orientação 3.2).
 * A resposta vai para o diário sensorial, que fica só no aparelho.
 */
export function PerguntaReflexiva({ pergunta, sobre }: { pergunta: string; sobre: string }) {
  const id = useId()
  const { adicionar } = useDiario()
  const [texto, setTexto] = useState('')
  const [resultado, setResultado] = useState<'guardado' | 'pulado' | 'erro' | null>(null)

  function guardar(e: React.FormEvent) {
    e.preventDefault()
    if (!texto.trim()) return
    const ok = adicionar({ sobre, sentidos: [], pergunta, resposta: texto.trim() })
    setResultado(ok ? 'guardado' : 'erro')
    if (ok) setTexto('')
  }

  return (
    <form onSubmit={guardar} className="grid gap-3 rounded-md border-2 border-lavanda p-5">
      <label htmlFor={id} className="font-titulo text-[1.3rem] leading-snug">
        {pergunta}
      </label>
      <textarea
        id={id}
        className="campo"
        value={texto}
        onChange={(e) => {
          setTexto(e.target.value)
          setResultado(null)
        }}
        maxLength={500}
        placeholder="Escreva o que vier à cabeça. Pode ser uma palavra só."
      />
      <div className="flex flex-wrap gap-2">
        <button type="submit" className="btn btn-lavanda" disabled={!texto.trim()}>
          Guardar no meu diário
        </button>
        <button type="button" className="btn btn-sec btn-sec-lavanda" onClick={() => setResultado('pulado')}>
          Pular
        </button>
      </div>
      <p role="status" className="c-sinta font-bold">
        {resultado === 'guardado' && (
          <>
            Guardado. Só você vê o seu diário. <Link href="/sentidos/diario">Abrir o diário</Link>
          </>
        )}
        {resultado === 'pulado' && 'Tudo bem. Você pode voltar a esta pergunta quando quiser.'}
        {resultado === 'erro' && 'Não foi possível guardar: este navegador bloqueia o armazenamento. Tente fora da janela anônima.'}
      </p>
    </form>
  )
}
