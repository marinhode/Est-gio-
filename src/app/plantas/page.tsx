import type { Metadata } from 'next'
import { Catalogo } from '@/components/Catalogo'
import { Icone } from '@/components/Icone'
import { listarCanteiros, listarPlantas } from '@/lib/conteudo'

export const metadata: Metadata = {
  title: 'Enciclopédia de plantas',
  description: 'Todas as plantas da horta do Laboratório Sensorial: busque por nome, característica ou canteiro.',
}

export default async function Plantas() {
  const [plantas, canteiros] = await Promise.all([listarPlantas(), listarCanteiros()])
  return (
    <div className="largura gutter grid gap-8 py-12">
      <header className="leitura grid gap-4">
        <p className="flex items-center gap-2 font-bold text-azul"><Icone nome="livro" />Estação Plantas</p>
        <h1 className="text-[2.3rem] sm:text-[2.8rem]">Enciclopédia de plantas</h1>
        <p className="text-lg">Cada espécie da horta, com o que ela é, o que desperta nos sentidos e o que a ciência sabe sobre ela.</p>
      </header>
      <Catalogo plantas={plantas} canteiros={canteiros} />
    </div>
  )
}
