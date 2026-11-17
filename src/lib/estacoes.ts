import type { NomeIcone } from '@/components/Icone'

/** As 6 estações da plataforma (orientação, seção 2). */
export type Estacao = {
  href: '/tour' | '/plantas' | '/sentidos' | '/ciencia' | '/jogos' | '/comunidade'
  menu: string
  titulo: string
  descricao: string
  icone: NomeIcone
}

export const estacoes: Estacao[] = [
  {
    href: '/tour',
    menu: 'Tour',
    titulo: 'Tour virtual',
    descricao: 'Percorra o laboratório em cinco paradas, com fotos, narração e as plantas de cada canteiro.',
    icone: 'tour',
  },
  {
    href: '/plantas',
    menu: 'Plantas',
    titulo: 'Enciclopédia de plantas',
    descricao: 'Busque qualquer espécie da horta por nome, característica ou canteiro.',
    icone: 'livro',
  },
  {
    href: '/sentidos',
    menu: 'Sentidos',
    titulo: 'Experiências sensoriais',
    descricao: 'Aromas, texturas, cores e memória. Atividades para fazer na horta ou em casa.',
    icone: 'aroma',
  },
  {
    href: '/ciencia',
    menu: 'Ciência',
    titulo: 'Ciência e aplicações',
    descricao: 'O que a pesquisa sabe sobre as plantas e como os cursos as estudam.',
    icone: 'frasco',
  },
  {
    href: '/jogos',
    menu: 'Jogos',
    titulo: 'Jogos e desafios',
    descricao: 'Quiz, mitos e verdades e outros desafios para testar o que você descobriu.',
    icone: 'jogos',
  },
  {
    href: '/comunidade',
    menu: 'Comunidade',
    titulo: 'Comunidade e produção científica',
    descricao: 'Projetos, pesquisas, vídeos e produtos criados pelos estudantes.',
    icone: 'pessoas',
  },
]
