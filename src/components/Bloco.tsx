import type { ReactNode } from 'react'
import { Icone, type NomeIcone } from '@/components/Icone'

/**
 * Bloco de leitura: agrupa frases que formam uma mesma ideia, separadas das vizinhas
 * por fundo, borda e respiro. O título é opcional e usa o nível de cabeçalho informado.
 */
export function Bloco({
  titulo,
  icone,
  cor = 'text-azul',
  nivel = 'h3',
  children,
  className = '',
}: {
  titulo?: string
  icone?: NomeIcone
  cor?: string
  nivel?: 'h2' | 'h3' | 'h4'
  children: ReactNode
  className?: string
}) {
  const Titulo = nivel
  return (
    <div className={`bloco ${className}`}>
      {titulo && (
        <Titulo className="bloco-titulo">
          {icone && <Icone nome={icone} className={`size-5 ${cor}`} />}
          {titulo}
        </Titulo>
      )}
      {children}
    </div>
  )
}
