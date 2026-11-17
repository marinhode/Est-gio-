'use client'

import { CONTRASTE, LETRA, usePreferencia } from '@/lib/preferencias'

/** Os mesmos ajustes do botão Aa, em formato de interruptores, para a página de acessibilidade. */
export function AjustesLeitura() {
  const [letra, alternarLetra] = usePreferencia(LETRA)
  const [contraste, alternarContraste] = usePreferencia(CONTRASTE)

  const itens = [
    { id: 'aj-letra', rotulo: 'Letra maior', descricao: 'Aumenta todo o texto do site em cerca de 20%.', ativo: letra, alternar: alternarLetra },
    { id: 'aj-contraste', rotulo: 'Alto contraste', descricao: 'Texto preto sobre fundo branco e cores mais fortes.', ativo: contraste, alternar: alternarContraste },
  ]

  return (
    <ul className="grid gap-3">
      {itens.map((i) => (
        <li key={i.id} className="flex items-center justify-between gap-4 rounded-md border border-linha bg-superficie p-4">
          <span className="grid gap-0.5">
            <span id={i.id} className="font-bold">{i.rotulo}</span>
            <span className="nota">{i.descricao}</span>
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={i.ativo}
            aria-labelledby={i.id}
            onClick={i.alternar}
            className="interruptor"
          >
            <span className="sr-only">{i.ativo ? 'Ligado' : 'Desligado'}</span>
          </button>
        </li>
      ))}
    </ul>
  )
}
