import { ViewTransition } from 'react'

/** Elemento compartilhado entre páginas: a foto do catálogo "voa" até a ficha. */
export function Compartilhado({ nome, children }: { nome: string; children: React.ReactNode }) {
  return (
    <ViewTransition name={nome} share="morph" default="none">
      {children}
    </ViewTransition>
  )
}
