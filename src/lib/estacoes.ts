import type { NomeIcone } from '@/components/Icone'

/** As 6 estações da plataforma (orientação, seção 2). */
export type Estacao = {
  href: '/tour' | '/plantas' | '/sentidos' | '/ciencia' | '/jogos' | '/comunidade'
  menu: string
  icone: NomeIcone
}

export const estacoes: Estacao[] = [
  {
    href: '/tour',
    menu: 'Tour',
    icone: 'tour',
  },
  {
    href: '/plantas',
    menu: 'Plantas',
    icone: 'livro',
  },
  {
    href: '/sentidos',
    menu: 'Sentidos',
    icone: 'aroma',
  },
  {
    href: '/ciencia',
    menu: 'Ciência',
    icone: 'frasco',
  },
  {
    href: '/jogos',
    menu: 'Jogos',
    icone: 'jogos',
  },
  {
    href: '/comunidade',
    menu: 'Comunidade',
    icone: 'pessoas',
  },
]
