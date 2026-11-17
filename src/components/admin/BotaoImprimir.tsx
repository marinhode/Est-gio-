'use client'

export function BotaoImprimir() {
  return (
    <button type="button" className="btn" onClick={() => window.print()}>
      Imprimir placas
    </button>
  )
}
