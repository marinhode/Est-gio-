import type { Metadata } from 'next'
import { EmPreparo } from '@/components/EmPreparo'

export const metadata: Metadata = { title: 'Tour virtual' }

export default function Page() {
  return <EmPreparo titulo="Tour virtual" icone="tour" descricao="Percorra o laboratório em cinco paradas, com fotos, narração e as plantas de cada canteiro." />
}
