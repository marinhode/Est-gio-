/** Fonte da carga inicial do banco (scripts/gerar-semente.ts). O site lê do Supabase, não deste arquivo. */
import type { Jogo } from '@/lib/tipos'

/**
 * Jogos que não dependem das plantas da horta.
 * Rascunho da Engenharia, marcado como exemplo até revisão da Psicologia.
 * Tom: "Quase! Veja por quê" em vez de "errado"; explicações com fonte.
 */

export const OPCOES_MITO = ['Mito', 'Verdade', 'Em parte'] as const
const [MITO, VERDADE, EM_PARTE] = [0, 1, 2]
const consulta = '2026-11-17'

export const jogos: Jogo[] = [
  {
    slug: 'mitos-e-verdades',
    titulo: 'Mitos e verdades',
    descricao: 'Aromaterapia, plantas e bem-estar: o que é mito, o que é verdade e o que é só em parte.',
    tipo: 'mitos_verdades',
    exemplo: true,
    perguntas: [
      {
        enunciado: 'Óleos essenciais são naturais, então não fazem mal.',
        opcoes: [...OPCOES_MITO],
        correta: MITO,
        feedback:
          'Natural não quer dizer inofensivo. Óleos essenciais são muito concentrados: podem irritar a pele e as vias respiratórias, e alguns são tóxicos se engolidos, especialmente por crianças e animais.',
      },
      {
        enunciado: 'Um cheiro pode trazer de volta lembranças muito antigas.',
        opcoes: [...OPCOES_MITO],
        correta: VERDADE,
        feedback:
          'Pesquisas mostram que lembranças trazidas por cheiros tendem a ser mais antigas, muitas vezes da infância, e mais carregadas de emoção do que as trazidas por palavras ou imagens.',
        fonte: {
          titulo: 'Willander, J., & Larsson, M. (2006). Smell your way back to childhood. Psychonomic Bulletin & Review, 13(2), 240–244.',
          url: 'https://doi.org/10.3758/BF03193837',
          consultadoEm: consulta,
        },
      },
      {
        enunciado: 'Aromaterapia cura ansiedade.',
        opcoes: [...OPCOES_MITO],
        correta: MITO,
        feedback:
          'Alguns estudos investigam se certos aromas ajudam no relaxamento, com resultados variados. Nenhum aroma substitui o cuidado de um profissional de saúde mental. Se a ansiedade atrapalha seu dia a dia, procure ajuda profissional.',
      },
      {
        enunciado: 'Chá de planta medicinal pode ser tomado à vontade, porque é natural.',
        opcoes: [...OPCOES_MITO],
        correta: MITO,
        feedback:
          'Plantas medicinais têm substâncias ativas. Podem causar efeitos indesejados e interagir com medicamentos. Publicações oficiais, como o Formulário de Fitoterápicos, indicam modo de preparo, quantidade e por quanto tempo usar.',
        fonte: {
          titulo: 'Anvisa. Formulário de Fitoterápicos da Farmacopeia Brasileira, 2ª ed.',
          url: 'https://www.gov.br/anvisa/pt-br/assuntos/farmacopeia/formulario-fitoterapico',
          consultadoEm: consulta,
        },
      },
      {
        enunciado: 'Duas pessoas podem sentir o mesmo cheiro de formas diferentes.',
        opcoes: [...OPCOES_MITO],
        correta: VERDADE,
        feedback:
          'Cada pessoa tem uma combinação própria de receptores olfativos. Um exemplo famoso é o coentro: para parte das pessoas, ele tem gosto e cheiro de sabão, e isso está ligado a uma variação genética.',
        fonte: {
          titulo: 'Eriksson, N. et al. (2012). A genetic variant near olfactory receptor genes influences cilantro preference. Flavour, 1, 22.',
          url: 'https://doi.org/10.1186/2044-7248-1-22',
          consultadoEm: consulta,
        },
      },
      {
        enunciado: 'Ficar um tempo perto de plantas e áreas verdes ajuda a recuperar a atenção.',
        opcoes: [...OPCOES_MITO],
        correta: EM_PARTE,
        feedback:
          'Há uma teoria conhecida, a da Restauração da Atenção, e estudos que apoiam essa ideia. Mas os resultados variam conforme a pessoa, o lugar e o tempo. É uma possibilidade estudada, não uma regra.',
        fonte: {
          titulo: 'Kaplan, S. (1995). The restorative benefits of nature. Journal of Environmental Psychology, 15(3), 169–182.',
          url: 'https://doi.org/10.1016/0272-4944(95)90001-2',
          consultadoEm: consulta,
        },
      },
      {
        enunciado: 'Toda planta que cresce numa horta pode ser comida ou usada em chá.',
        opcoes: [...OPCOES_MITO],
        correta: MITO,
        feedback:
          'Algumas plantas são tóxicas, e espécies diferentes podem ser muito parecidas. Por isso, na horta, nada deve ser provado sem orientação de um responsável.',
      },
      {
        enunciado: 'O ser humano tem só cinco sentidos.',
        opcoes: [...OPCOES_MITO],
        correta: MITO,
        feedback:
          'Além de visão, audição, olfato, paladar e tato, percebemos a posição do corpo (propriocepção), o equilíbrio e sinais internos como fome e batimentos do coração (interocepção).',
      },
      {
        enunciado: 'Cheirar grãos de café "limpa" o nariz entre um perfume e outro.',
        opcoes: [...OPCOES_MITO],
        correta: MITO,
        feedback:
          'É um costume comum em lojas de perfume, mas um estudo não encontrou vantagem do café sobre simplesmente cheirar o ar. Dar uma pausa costuma funcionar tão bem quanto.',
        fonte: {
          titulo: 'Grosofsky, A., Haupert, M. L., & Versteeg, S. W. (2011). An exploratory investigation of coffee and lemon scents and odor identification. Perceptual and Motor Skills, 112(2), 536–538.',
          consultadoEm: consulta,
        },
      },
      {
        enunciado: 'Existem pessoas que não sentem cheiro nenhum.',
        opcoes: [...OPCOES_MITO],
        correta: VERDADE,
        feedback:
          'A perda total do olfato se chama anosmia. Pode ser de nascença ou acontecer depois de infecções, como gripes, ou de lesões. Na horta, essas pessoas exploram com o tato, a visão e a audição.',
      },
    ],
  },
  {
    slug: 'sentidos-e-percepcao',
    titulo: 'Sentidos e percepção',
    descricao: 'Perguntas sobre os temas da estação Sentidos: memória, atenção e como percebemos o mundo.',
    tipo: 'quiz',
    exemplo: true,
    perguntas: [
      {
        enunciado: 'Qual é a diferença entre sensação e percepção?',
        opcoes: [
          'São a mesma coisa, com nomes diferentes',
          'Sensação é captar o estímulo; percepção é o cérebro dar sentido a ele',
          'Sensação é física; percepção só acontece na imaginação',
          'Percepção vem antes da sensação',
        ],
        correta: 1,
        feedback:
          'Os órgãos dos sentidos captam o estímulo (sensação). O cérebro organiza e interpreta esse sinal usando experiências, expectativas e atenção (percepção).',
      },
      {
        enunciado: 'Qual sentido tem o caminho mais curto até áreas do cérebro ligadas à emoção e à memória?',
        opcoes: ['Visão', 'Audição', 'Olfato', 'Tato'],
        correta: 2,
        feedback:
          'O olfato se liga de forma direta a regiões como a amígdala e o hipocampo. Isso ajuda a explicar por que cheiros trazem lembranças tão vivas.',
        fonte: {
          titulo: 'Herz, R. S. (2016). The role of odor-evoked memory in psychological and physiological health. Brain Sciences, 6(3), 22.',
          url: 'https://doi.org/10.3390/brainsci6030022',
          consultadoEm: consulta,
        },
      },
      {
        enunciado: 'Como se chama a percepção da posição do próprio corpo, mesmo de olhos fechados?',
        opcoes: ['Propriocepção', 'Sinestesia', 'Interocepção', 'Visão periférica'],
        correta: 0,
        feedback:
          'É a propriocepção que permite, por exemplo, encostar o dedo no nariz de olhos fechados. Interocepção é a percepção de sinais internos, como fome e batimentos do coração.',
      },
      {
        enunciado: 'O que melhor descreve a atenção plena?',
        opcoes: [
          'Esvaziar a mente de todos os pensamentos',
          'Prestar atenção ao momento presente, de propósito e sem julgar',
          'Fazer várias coisas ao mesmo tempo com eficiência',
          'Um tratamento que substitui a psicoterapia',
        ],
        correta: 1,
        feedback:
          'Não se trata de esvaziar a mente: pensamentos aparecem, e tudo bem. A ideia é notar o presente com curiosidade. Os exercícios da horta são educativos e não substituem acompanhamento psicológico.',
      },
      {
        enunciado: 'Por que este site nunca passa uma informação só pela cor?',
        opcoes: [
          'Para economizar tinta na impressão',
          'Porque as pessoas percebem as cores de formas diferentes, e algumas não distinguem certos tons',
          'Porque cores deixam o site mais lento',
          'É apenas uma escolha de estilo',
        ],
        correta: 1,
        feedback:
          'Parte das pessoas tem dificuldade em distinguir alguns tons, e quem usa leitor de tela não vê cores. Por isso os selos de evidência têm ícone, texto e cor juntos.',
      },
      {
        enunciado: 'Segundo a Teoria da Restauração da Atenção, ambientes naturais...',
        opcoes: [
          'Exigem muito esforço de concentração',
          'Prendem a atenção de forma suave, ajudando a atenção dirigida a descansar',
          'Curam a falta de atenção',
          'Não têm relação com a atenção',
        ],
        correta: 1,
        feedback:
          'A teoria propõe que a natureza atrai a atenção sem esforço, o que daria descanso à atenção que usamos para estudar e trabalhar. É uma proposta estudada, com resultados que variam.',
        fonte: {
          titulo: 'Kaplan, S. (1995). The restorative benefits of nature. Journal of Environmental Psychology, 15(3), 169–182.',
          url: 'https://doi.org/10.1016/0272-4944(95)90001-2',
          consultadoEm: consulta,
        },
      },
    ],
  },
]

export function obterJogo(slug: string) {
  return jogos.find((j) => j.slug === slug) ?? null
}
