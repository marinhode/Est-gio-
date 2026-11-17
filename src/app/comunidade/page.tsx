import type { Metadata } from 'next'
import { Icone } from '@/components/Icone'
import { ListaProjetos } from '@/components/ListaProjetos'
import { listarProjetos } from '@/lib/conteudo'

export const metadata: Metadata = {
  title: 'Comunidade e produção científica',
  description: 'Pesquisas, produtos, vídeos e atividades de extensão dos cursos que fazem o Laboratório Sensorial.',
}

export default async function Comunidade() {
  const projetos = await listarProjetos()
  return (
    <div className="largura gutter grid gap-10 py-12">
      <header className="leitura grid gap-4">
        <p className="flex items-center gap-2 font-bold text-azul">
          <Icone nome="pessoas" />
          Estação Comunidade
        </p>
        <h1 className="text-[2.3rem] sm:text-[2.8rem]">Comunidade e produção científica</h1>
        <p className="text-lg">
          O que os estudantes de Psicologia, Biomedicina, Farmácia e Engenharia de Software criam a partir da horta:
          pesquisas, produtos, vídeos e atividades de extensão.
        </p>
      </header>
      {projetos.length ? (
        <ListaProjetos projetos={projetos} />
      ) : (
        <div className="leitura grid gap-2 rounded-md border border-dashed border-linha p-6">
          <p className="font-titulo text-xl">Os primeiros projetos estão a caminho</p>
          <p className="text-suave">Quando os cursos publicarem pesquisas, produtos e vídeos sobre a horta, eles aparecem aqui.</p>
        </div>
      )}
    </div>
  )
}
