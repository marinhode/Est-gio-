import type { Metadata } from 'next'
import { EmPreparo } from '@/components/EmPreparo'

export const metadata: Metadata = { title: 'Ciência e aplicações' }

export default function Page() {
  return <EmPreparo titulo="Ciência e aplicações" icone="frasco" descricao="O que a pesquisa sabe sobre as plantas e como os cursos as estudam." />
}
