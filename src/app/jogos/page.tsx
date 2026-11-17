import type { Metadata } from 'next'
import { EmPreparo } from '@/components/EmPreparo'

export const metadata: Metadata = { title: 'Jogos e desafios' }

export default function Page() {
  return <EmPreparo titulo="Jogos e desafios" icone="jogos" descricao="Quiz, mitos e verdades e outros desafios para testar o que você descobriu." />
}
