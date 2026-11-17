import type { Canteiro, Planta } from '@/lib/tipos'

/**
 * Conteúdo provisório para desenvolver e demonstrar o sistema.
 * Todas as plantas têm `exemplo: true` e aparecem com o aviso
 * "Conteúdo de exemplo, aguardando validação" até a equipe de
 * Psicologia e as áreas responsáveis revisarem.
 */

export const canteiros: Canteiro[] = [
  {
    id: 'c1',
    numero: 1,
    nome: 'Aromáticas de sol',
    descricao: 'Plantas de folhas firmes e perfume forte, que pedem sol o dia todo.',
  },
  {
    id: 'c2',
    numero: 2,
    nome: 'Ervas de cozinha e chá',
    descricao: 'Folhas macias, usadas no tempero e em infusões caseiras.',
  },
  {
    id: 'c3',
    numero: 3,
    nome: 'Medicinais tradicionais',
    descricao: 'Espécies presentes na tradição popular e estudadas pela ciência.',
  },
]

const hoje = '2026-11-17'
const fonteMS = {
  titulo: 'Ministério da Saúde. Formulário de Fitoterápicos da Farmacopeia Brasileira, 2ª ed.',
  url: 'https://www.gov.br/anvisa/pt-br/assuntos/farmacopeia/formulario-fitoterapico',
  consultadoEm: hoje,
}

export const plantas: Planta[] = [
  {
    slug: 'hortela',
    nomePopular: 'Hortelã',
    nomeCientifico: 'Mentha spicata',
    autorTaxon: 'L.',
    familia: 'Lamiaceae',
    canteiroId: 'c2',
    categorias: ['Aromática', 'Chá', 'Tempero'],
    caracteristicas: ['Aroma refrescante', 'Folha serrilhada', 'Caule quadrado'],
    fraseImpacto:
      'O cheiro da hortelã fica guardado em glândulas minúsculas na superfície da folha. Quando você esfrega a folha, elas se rompem e o aroma sai.',
    resumo:
      'Erva rasteira que se espalha rápido pelo canteiro. Folhas com borda serrilhada e caule quadrado, marca da família das lamiáceas.',
    conhecendo: {
      curto: 'Folhas verde-vivo, opostas e com borda serrilhada. O caule tem quatro lados: passe o dedo e sinta as quinas.',
      ampliado:
        'As flores são pequenas, lilases ou brancas, reunidas em espigas no topo dos ramos. A planta é perene: renasce dos ramos rasteiros, chamados estolões, que correm sob a terra.',
    },
    cultivo: {
      curto: 'Gosta de sol pela manhã e solo sempre úmido. Cresce rápido e invade os vizinhos, por isso vive bem em vaso ou canteiro separado.',
      ampliado:
        'Para fazer mudas, corte um ramo de 10 cm e deixe em um copo com água até surgirem raízes. Colher as folhas com frequência estimula a planta a brotar de novo.',
    },
    historia: {
      curto: 'Usada como tempero e chá desde a Antiguidade, chegou ao Brasil com os colonizadores europeus.',
      ampliado:
        'No Brasil, é presença comum em quintais e entra em receitas como o quibe e sucos refrescantes. Existem dezenas de espécies e híbridos de hortelã, o que gera muita confusão de nomes populares.',
    },
    experiencia: {
      curto: 'O aroma muda de intensidade conforme a folha é tocada: inteira, quase não cheira; amassada, o cheiro é imediato.',
    },
    atividade:
      'Feche os olhos. Esfregue uma folha entre os dedos por alguns segundos e aproxime do nariz.',
    perguntas: [
      'Que lembrança esse aroma traz para você?',
      'Como você descreveria a textura dessa folha?',
    ],
    psicologia: {
      curto: 'Aromas conhecidos costumam trazer lembranças com muita rapidez. Isso acontece porque o olfato tem ligação direta com áreas do cérebro ligadas à memória e à emoção.',
    },
    usos: [
      { nivel: 'popular', texto: 'Chá depois das refeições, tradição em muitas famílias brasileiras.' },
      { nivel: 'hipotese', texto: 'Se o aroma de hortelã influencia a atenção. Há estudos pequenos, ainda sem conclusão.' },
    ],
    fontes: [fonteMS],
    validacoes: [],
    atualizadoEm: hoje,
    exemplo: true,
    publicado: true,
  },
  {
    slug: 'alecrim',
    nomePopular: 'Alecrim',
    nomeCientifico: 'Salvia rosmarinus',
    autorTaxon: 'Spenn.',
    familia: 'Lamiaceae',
    canteiroId: 'c1',
    categorias: ['Aromática', 'Tempero'],
    caracteristicas: ['Aroma resinoso', 'Folha em agulha', 'Arbusto lenhoso'],
    fraseImpacto:
      'Até 2017 o alecrim tinha outro nome científico, Rosmarinus officinalis. Estudos de DNA mostraram que ele é, na verdade, uma sálvia.',
    resumo:
      'Arbusto de folhas finas como agulhas, verde-escuras por cima e esbranquiçadas por baixo. Perfume forte que fica nos dedos.',
    conhecendo: {
      curto: 'Folhas estreitas, duras e com a borda virada para baixo. Os ramos ficam lenhosos com o tempo.',
      ampliado:
        'As flores, pequenas e azul-claras, atraem abelhas. A face de baixo da folha tem uma penugem branca que reduz a perda de água, adaptação ao clima seco do Mediterrâneo, de onde a planta vem.',
    },
    cultivo: {
      curto: 'Sol pleno e pouca água. Encharcar o solo é a forma mais comum de perder um pé de alecrim.',
      ampliado: 'Prefere solo arenoso e bem drenado. Multiplica-se por estacas de ramos semilenhosos.',
    },
    historia: {
      curto: 'Na Europa antiga, ramos de alecrim eram usados em casamentos e funerais como símbolo de lembrança.',
    },
    experiencia: {
      curto: 'A folha é áspera por cima e macia por baixo. O aroma aparece ao dobrar a folha ao meio.',
    },
    atividade: 'Passe a ponta dos dedos pela folha nos dois sentidos, de cima para baixo e de baixo para cima.',
    perguntas: ['Quais diferenças você percebe entre os dois lados da folha?'],
    psicologia: {
      curto: 'Comparar texturas de olhos fechados aumenta a atenção ao tato, um sentido que usamos o tempo todo sem perceber.',
    },
    usos: [
      { nivel: 'popular', texto: 'Tempero de carnes e batatas; banhos e defumações em práticas tradicionais.' },
      { nivel: 'hipotese', texto: 'Efeito do aroma sobre a memória. Os estudos existentes são pequenos e têm resultados variados.' },
    ],
    fontes: [fonteMS],
    validacoes: [],
    atualizadoEm: hoje,
    exemplo: true,
    publicado: true,
  },
  {
    slug: 'manjericao',
    nomePopular: 'Manjericão',
    nomeCientifico: 'Ocimum basilicum',
    autorTaxon: 'L.',
    familia: 'Lamiaceae',
    canteiroId: 'c2',
    categorias: ['Aromática', 'Tempero'],
    caracteristicas: ['Aroma doce', 'Folha lisa e brilhante', 'Ciclo curto'],
    fraseImpacto:
      'Existem mais de 60 variedades de manjericão. Algumas têm cheiro de limão, outras de canela ou de cravo.',
    resumo:
      'Erva de folhas grandes, lisas e brilhantes. Vive pouco, mas cresce rápido e perfuma o canteiro inteiro em dias quentes.',
    conhecendo: {
      curto: 'Folhas ovais, macias e um pouco côncavas. Flores brancas em espigas no topo.',
      ampliado:
        'É uma planta anual: completa o ciclo em alguns meses. Quando floresce, as folhas perdem sabor, por isso quem cultiva costuma cortar as flores.',
    },
    cultivo: {
      curto: 'Sol e calor. Regue sem encharcar e corte as pontas para a planta ficar cheia.',
    },
    historia: {
      curto: 'Vem da Ásia tropical. Na Itália virou base do molho pesto; na Índia, uma espécie próxima, o tulsi, é planta sagrada.',
    },
    experiencia: {
      curto: 'O cheiro é doce e muda ao longo do dia: costuma ficar mais intenso nas horas quentes.',
    },
    atividade: 'Cheire uma folha de manhã e outra à tarde. Se puder, compare.',
    perguntas: ['Esse aroma lembra algum lugar ou comida para você?'],
    psicologia: {
      curto: 'Cheiros ligados à comida costumam despertar lembranças de família e de casa. Cada pessoa tem as suas.',
    },
    usos: [
      { nivel: 'popular', texto: 'Tempero de molhos e saladas; chá caseiro.' },
    ],
    fontes: [fonteMS],
    validacoes: [],
    atualizadoEm: hoje,
    exemplo: true,
    publicado: true,
  },
  {
    slug: 'lavanda',
    nomePopular: 'Lavanda',
    nomeCientifico: 'Lavandula angustifolia',
    autorTaxon: 'Mill.',
    familia: 'Lamiaceae',
    canteiroId: 'c1',
    categorias: ['Aromática', 'Ornamental'],
    caracteristicas: ['Aroma floral', 'Flor roxa em espiga', 'Folha acinzentada'],
    fraseImpacto:
      'O nome lavanda vem do latim lavare, lavar. Os romanos perfumavam a água do banho com suas flores.',
    resumo:
      'Arbusto de folhas acinzentadas e flores roxas em espigas. O perfume está nas flores e também nas folhas.',
    conhecendo: {
      curto: 'Folhas estreitas, cobertas por pelos finos que dão a cor acinzentada. Flores pequenas e roxas, reunidas em espigas longas.',
    },
    cultivo: {
      curto: 'Sol pleno e solo seco. Em regiões muito quentes e úmidas, floresce menos.',
      ampliado: 'Pede poda leve depois da floração para não ficar com os ramos de baixo secos.',
    },
    historia: {
      curto: 'Cultivada há séculos no sul da França, onde campos inteiros de lavanda viraram cartão-postal.',
    },
    experiencia: {
      curto: 'Cor, textura e aroma juntos: a espiga roxa, a folha aveludada e o perfume que fica nas mãos.',
    },
    atividade: 'Observe a espiga de perto por um minuto. Conte quantas florzinhas você consegue ver.',
    perguntas: ['Como você descreveria essa cor para alguém que não pode vê-la?'],
    psicologia: {
      curto: 'Descrever uma cor em palavras exige atenção aos detalhes e mostra como cada pessoa percebe de um jeito.',
    },
    usos: [
      { nivel: 'popular', texto: 'Sachês perfumados em gavetas e travesseiros.' },
      { nivel: 'hipotese', texto: 'Se o aroma da lavanda ajuda no relaxamento. Há estudos, mas com métodos e resultados diferentes entre si.' },
    ],
    fontes: [fonteMS],
    validacoes: [],
    atualizadoEm: hoje,
    exemplo: true,
    publicado: true,
  },
  {
    slug: 'babosa',
    nomePopular: 'Babosa',
    nomeCientifico: 'Aloe vera',
    autorTaxon: '(L.) Burm.f.',
    familia: 'Asphodelaceae',
    canteiroId: 'c3',
    categorias: ['Medicinal tradicional', 'Suculenta'],
    caracteristicas: ['Folha carnuda', 'Gel transparente', 'Borda com espinhos'],
    fraseImpacto:
      'A folha da babosa guarda água em um gel transparente. É assim que ela sobrevive a longos períodos sem chuva.',
    resumo:
      'Suculenta de folhas grossas, com pequenos espinhos na borda. Por dentro, um gel transparente e pegajoso.',
    conhecendo: {
      curto: 'Folhas em roseta, grossas e cheias de gel. Espinhos macios na borda.',
      ampliado:
        'Entre a casca verde e o gel há uma camada de líquido amarelado, de cheiro e gosto fortes. Essa parte tem compostos diferentes do gel e exige cuidado.',
    },
    cultivo: {
      curto: 'Sol e pouca água. Regue só quando a terra estiver completamente seca.',
    },
    historia: {
      curto: 'Conhecida há milênios no norte da África e no Oriente Médio. No Brasil, é uma das plantas mais comuns em quintais.',
    },
    experiencia: {
      curto: 'Toque a folha por fora e veja como é firme e fria. Por dentro, o gel é escorregadio.',
    },
    atividade: 'Com a ajuda de um monitor, compare a casca e o gel de uma folha já cortada.',
    perguntas: ['Como você descreveria essa textura?'],
    psicologia: {
      curto: 'Texturas inesperadas provocam reações diferentes: curiosidade em uns, estranhamento em outros. Todas são válidas.',
    },
    usos: [
      { nivel: 'popular', texto: 'Gel aplicado na pele e no cabelo.' },
      { nivel: 'uso_reconhecido', texto: 'O gel aparece em publicações oficiais de fitoterapia para uso externo. Detalhes e limites serão preparados pela equipe de Farmácia.' },
    ],
    fontes: [fonteMS],
    validacoes: [],
    atualizadoEm: hoje,
    exemplo: true,
    publicado: true,
  },
  {
    slug: 'camomila',
    nomePopular: 'Camomila',
    nomeCientifico: 'Matricaria chamomilla',
    autorTaxon: 'L.',
    familia: 'Asteraceae',
    canteiroId: 'c3',
    categorias: ['Medicinal tradicional', 'Chá'],
    caracteristicas: ['Aroma adocicado', 'Flor como pequena margarida', 'Miolo oco'],
    fraseImpacto:
      'Corte uma flor de camomila ao meio: o miolo amarelo é oco. É assim que ela se diferencia de outras flores muito parecidas.',
    resumo:
      'Planta delicada de flores parecidas com pequenas margaridas: pétalas brancas e miolo amarelo em forma de cone.',
    conhecendo: {
      curto: 'Folhas muito recortadas, quase como fios. Flores pequenas com miolo amarelo saliente.',
      ampliado:
        'O que parece uma flor é, na verdade, um conjunto de dezenas de flores minúsculas, característica da família das asteráceas, a mesma do girassol.',
    },
    cultivo: {
      curto: 'Prefere clima ameno. Semeia-se direto no canteiro, cobrindo pouco as sementes.',
    },
    historia: {
      curto: 'Um dos chás mais tomados no mundo. No Sul do Brasil, o Paraná é grande produtor.',
    },
    experiencia: {
      curto: 'O aroma lembra maçã para muitas pessoas. Para outras, lembra feno ou mel.',
    },
    atividade: 'Cheire uma flor seca e uma fresca. Compare.',
    perguntas: ['Que lembrança esse aroma traz para você?'],
    psicologia: {
      curto: 'O hábito de preparar e tomar um chá pode ser um momento de pausa. O ritual em si já chama a atenção para o presente.',
    },
    usos: [
      { nivel: 'popular', texto: 'Chá calmante, especialmente à noite.' },
      { nivel: 'uso_reconhecido', texto: 'A infusão das flores consta no Formulário de Fitoterápicos da Farmacopeia Brasileira. Indicações e limites serão preparados pela equipe de Farmácia.' },
    ],
    fontes: [fonteMS],
    validacoes: [],
    atualizadoEm: hoje,
    exemplo: true,
    publicado: true,
  },
]
