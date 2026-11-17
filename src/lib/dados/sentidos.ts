import type { TemaSensorial } from '@/lib/tipos'

/**
 * Conteúdos de Psicologia da estação Sentidos (orientação 3.2).
 * Rascunho escrito pela Engenharia para estruturar a estação.
 * Todos com `exemplo: true` até a revisão da equipe de Psicologia.
 * Regras: linguagem acessível, sem promessa terapêutica, nenhuma
 * sensação tratada como certa ou universal.
 */

const consulta = '2026-11-17'

export const temas: TemaSensorial[] = [
  {
    slug: 'o-que-sao',
    titulo: 'O que são experiências sensoriais?',
    resumo: 'Como os sentidos captam o mundo e como o cérebro transforma isso em percepção.',
    secoes: [
      {
        titulo: 'Sentir e perceber',
        texto: [
          'Os órgãos dos sentidos captam estímulos: luz, sons, moléculas no ar, pressão na pele. Isso é a sensação.',
          'O cérebro organiza esses sinais e dá sentido a eles, usando o que você já viveu, o que espera e o que está prestando atenção. Isso é a percepção.',
          'Por isso, duas pessoas diante da mesma folha podem perceber coisas diferentes. As duas estão certas.',
        ],
      },
      {
        titulo: 'Mais do que cinco sentidos',
        texto: [
          'Além de visão, audição, olfato, paladar e tato, o corpo percebe a própria posição (propriocepção), o equilíbrio e sinais internos, como fome e batimentos do coração (interocepção).',
        ],
      },
      {
        titulo: 'Atenção: o filtro',
        texto: [
          'Recebemos muito mais estímulos do que conseguimos notar. A atenção escolhe o que chega à consciência. Quando você decide cheirar uma folha com calma, está treinando esse filtro.',
        ],
      },
    ],
    experimente: {
      titulo: 'Um sentido de cada vez',
      introducao: 'Escolha uma planta da horta, ou qualquer planta perto de você.',
      passos: [
        { texto: 'Olhe para ela e repare em três detalhes que você não tinha notado.', segundos: 30 },
        { texto: 'Feche os olhos e toque uma folha. Ela é lisa, áspera, macia, fria?', segundos: 30 },
        { texto: 'Esfregue a folha de leve e aproxime do nariz.', segundos: 30 },
        { texto: 'Abra os olhos. Qual sentido trouxe mais informação?' },
      ],
    },
    pergunta: 'Qual sentido você mais usa no dia a dia sem perceber?',
    fontes: [
      { titulo: 'Goldstein, E. B. Sensação e Percepção. São Paulo: Cengage Learning.', consultadoEm: consulta },
    ],
    exemplo: true,
  },
  {
    slug: 'natureza',
    titulo: 'A natureza e a experiência humana',
    resumo: 'O que a pesquisa diz sobre o contato com ambientes naturais e a atenção.',
    secoes: [
      {
        titulo: 'Atenção que descansa',
        texto: [
          'Tarefas como estudar ou trabalhar exigem atenção dirigida, aquela que precisa de esforço para se manter. Ela se cansa.',
          'A Teoria da Restauração da Atenção, proposta por Rachel e Stephen Kaplan, sugere que ambientes naturais prendem a atenção de forma suave, sem esforço, e isso ajudaria a atenção dirigida a se recuperar.',
        ],
      },
      {
        titulo: 'O que a pesquisa diz, e o que não diz',
        texto: [
          'Muitas pessoas relatam se sentir mais tranquilas depois de um tempo em contato com plantas e áreas verdes. Estudos investigam esse efeito, com resultados que variam conforme a pessoa, o lugar e o tempo de exposição.',
          'Isso não transforma a horta em tratamento. Ela é um espaço de convivência, observação e aprendizado.',
        ],
      },
    ],
    experimente: {
      titulo: 'Cinco minutos na horta',
      introducao: 'Se estiver no laboratório, sente perto de um canteiro. Se não, escolha uma janela com vista para o verde.',
      passos: [
        { texto: 'Deixe o celular de lado e apenas observe o movimento das folhas.', segundos: 60 },
        { texto: 'Repare nos sons ao redor. Quais são da natureza e quais não são?', segundos: 60 },
        { texto: 'Perceba como você se sente agora, sem julgar.' },
      ],
    },
    pergunta: 'Existe algum lugar com plantas que faz parte das suas memórias?',
    fontes: [
      {
        titulo: 'Kaplan, S. (1995). The restorative benefits of nature: Toward an integrative framework. Journal of Environmental Psychology, 15(3), 169–182.',
        url: 'https://doi.org/10.1016/0272-4944(95)90001-2',
        consultadoEm: consulta,
      },
    ],
    exemplo: true,
  },
  {
    slug: 'memoria-olfativa',
    titulo: 'Memória olfativa',
    resumo: 'Por que um cheiro pode trazer de volta uma lembrança antiga em um segundo.',
    secoes: [
      {
        titulo: 'Um atalho no cérebro',
        texto: [
          'O olfato tem um caminho curto até regiões do cérebro ligadas à emoção e à memória, como a amígdala e o hipocampo.',
          'Talvez por isso as lembranças trazidas por um cheiro costumam vir carregadas de emoção e, muitas vezes, são da infância.',
        ],
      },
      {
        titulo: 'Cada nariz, uma história',
        texto: [
          'O mesmo aroma pode lembrar a cozinha da avó para uma pessoa e um consultório para outra. A lembrança depende da história de cada um, não da planta.',
          'Algumas pessoas sentem cheiros com menos intensidade, ou não sentem. A experiência delas também faz parte da horta: tato, visão e som continuam disponíveis.',
        ],
      },
    ],
    experimente: {
      titulo: 'Caça às lembranças',
      introducao: 'Funciona com qualquer planta aromática: hortelã, alecrim, manjericão, capim-limão.',
      passos: [
        { texto: 'Esfregue uma folha entre os dedos e cheire por alguns segundos.', segundos: 20 },
        { texto: 'Feche os olhos e espere. Deixe vir qualquer imagem, lugar ou pessoa.', segundos: 40 },
        { texto: 'Se quiser, registre no diário sensorial o que apareceu.' },
      ],
    },
    pergunta: 'Que lembrança um aroma já trouxe de volta para você?',
    fontes: [
      {
        titulo: 'Herz, R. S. (2016). The role of odor-evoked memory in psychological and physiological health. Brain Sciences, 6(3), 22.',
        url: 'https://doi.org/10.3390/brainsci6030022',
        consultadoEm: consulta,
      },
      {
        titulo: 'Willander, J., & Larsson, M. (2006). Smell your way back to childhood: Autobiographical odor memory. Psychonomic Bulletin & Review, 13(2), 240–244.',
        url: 'https://doi.org/10.3758/BF03193837',
        consultadoEm: consulta,
      },
    ],
    exemplo: true,
  },
  {
    slug: 'cores-formas-texturas',
    titulo: 'Cores, formas e texturas',
    resumo: 'Observar e descrever: atividades para perceber detalhes e respeitar o olhar de cada um.',
    secoes: [
      {
        titulo: 'Ninguém vê a mesma cor',
        texto: [
          'A percepção da cor depende da luz, do fundo ao redor e dos olhos de quem vê. Uma parte das pessoas, principalmente homens, tem dificuldade em distinguir alguns tons, como verde e vermelho.',
          'Por isso, neste site, nenhuma informação é passada só pela cor.',
        ],
      },
      {
        titulo: 'Formas que se repetem',
        texto: [
          'Folhas opostas, em espiral, em roseta; bordas lisas ou serrilhadas. Repare como as formas se repetem em plantas da mesma família.',
        ],
      },
      {
        titulo: 'Palavras para o tato',
        texto: [
          'Aveludada, cerosa, áspera, pegajosa, crocante. Descrever uma textura em palavras é um exercício de atenção e de vocabulário.',
        ],
      },
    ],
    experimente: {
      titulo: 'Descreva para quem não vê',
      introducao: 'Em dupla: uma pessoa fica de olhos fechados, a outra descreve uma folha.',
      passos: [
        { texto: 'Descreva só a forma da folha, sem dizer o nome da planta.', segundos: 45 },
        { texto: 'Agora descreva a cor, comparando com coisas do dia a dia.', segundos: 45 },
        { texto: 'Entregue a folha. A outra pessoa confere pelo tato se reconhece a descrição.' },
      ],
    },
    pergunta: 'Como você descreveria a textura da última folha que tocou?',
    fontes: [
      { titulo: 'Goldstein, E. B. Sensação e Percepção. São Paulo: Cengage Learning.', consultadoEm: consulta },
    ],
    exemplo: true,
  },
  {
    slug: 'atencao-plena',
    titulo: 'Atenção plena',
    resumo: 'Exercícios breves de observação consciente, guiados passo a passo.',
    secoes: [
      {
        titulo: 'O que é',
        texto: [
          'Atenção plena é prestar atenção ao momento presente de propósito, com curiosidade e sem julgar o que aparece.',
          'Os exercícios desta página são educativos e curtos. Eles não substituem acompanhamento psicológico. Se algo desconfortável surgir, você pode parar a qualquer momento.',
        ],
      },
    ],
    experimente: {
      titulo: 'Uma folha, três minutos',
      introducao: 'Segure uma folha na mão, ou olhe para uma planta perto de você. O cronômetro guia cada passo.',
      passos: [
        { texto: 'Respire normalmente e apenas olhe para a folha, como se fosse a primeira vez.', segundos: 45 },
        { texto: 'Acompanhe com os olhos as nervuras, do centro até a borda.', segundos: 45 },
        { texto: 'Feche os olhos e sinta o peso e a temperatura da folha na mão.', segundos: 45 },
        { texto: 'Aproxime do nariz. Perceba o aroma, ou a ausência dele.', segundos: 45 },
        { texto: 'Abra os olhos. Note como você está agora. Não há resposta certa.' },
      ],
    },
    pergunta: 'O que você percebeu na folha que não tinha notado antes?',
    fontes: [
      {
        titulo: 'Kabat-Zinn, J. (2003). Mindfulness-based interventions in context: Past, present, and future. Clinical Psychology: Science and Practice, 10(2), 144–156.',
        url: 'https://doi.org/10.1093/clipsy.bpg016',
        consultadoEm: consulta,
      },
    ],
    exemplo: true,
  },
]

export function obterTema(slug: string) {
  return temas.find((t) => t.slug === slug) ?? null
}
