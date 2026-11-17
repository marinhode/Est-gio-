import type { Metadata } from 'next'
import { EmPreparo } from '@/components/EmPreparo'

export const metadata: Metadata = { title: 'Acessibilidade' }

export default function Page() {
  return <EmPreparo titulo="Acessibilidade" icone="ok" descricao="Como usar o site com teclado, leitor de tela, letra maior e alto contraste." />
}
