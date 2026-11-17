import type { Metadata } from 'next'
import { EmPreparo } from '@/components/EmPreparo'

export const metadata: Metadata = { title: 'Comunidade e produção científica' }

export default function Page() {
  return <EmPreparo titulo="Comunidade e produção científica" icone="pessoas" descricao="Projetos, pesquisas, vídeos e produtos criados pelos estudantes." />
}
