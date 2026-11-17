import type { Metadata } from 'next'
import { EmPreparo } from '@/components/EmPreparo'

export const metadata: Metadata = { title: 'Enciclopédia de plantas' }

export default function Page() {
  return <EmPreparo titulo="Enciclopédia de plantas" icone="livro" descricao="Busque qualquer espécie da horta por nome, característica ou canteiro." />
}
