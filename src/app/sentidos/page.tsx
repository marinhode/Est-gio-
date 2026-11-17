import type { Metadata } from 'next'
import { EmPreparo } from '@/components/EmPreparo'

export const metadata: Metadata = { title: 'Experiências sensoriais' }

export default function Page() {
  return <EmPreparo titulo="Experiências sensoriais" icone="aroma" descricao="Aromas, texturas, cores e memória. Atividades para fazer na horta ou em casa." />
}
