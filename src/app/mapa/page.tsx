import type { Metadata } from 'next'
import { EmPreparo } from '@/components/EmPreparo'

export const metadata: Metadata = { title: 'Mapa da horta' }

export default function Page() {
  return <EmPreparo titulo="Mapa da horta" icone="mapa" descricao="Os canteiros, os caminhos e onde fica cada planta." />
}
