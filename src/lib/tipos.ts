/** Modelo de dados do Laboratório Sensorial. Espelha supabase/schema.sql. */

/** Texto em duas camadas: leitura rápida e explicação ampliada (orientação 3.3). */
export type Secao = {
  curto: string
  ampliado?: string
}

/** Os quatro níveis que toda informação de uso precisa declarar (orientação 3.1). */
export type NivelEvidencia =
  | 'popular'
  | 'evidencia_cientifica'
  | 'uso_reconhecido'
  | 'hipotese'

export type Uso = {
  nivel: NivelEvidencia
  texto: string
}

export type Fonte = {
  titulo: string
  url?: string
  consultadoEm?: string // AAAA-MM-DD
}

export type Area = 'Botânica' | 'Psicologia' | 'Biomedicina' | 'Farmácia'

export type Validacao = {
  nome: string
  area: Area
  data: string // AAAA-MM-DD
}

export type Imagem = {
  src: string
  alt: string
  credito?: string
}

export type Canteiro = {
  id: string
  numero: number
  nome: string
  descricao: string
}

export type Planta = {
  slug: string
  nomePopular: string
  nomeCientifico: string
  autorTaxon?: string
  familia: string
  canteiroId: string
  categorias: string[]
  caracteristicas: string[]
  fraseImpacto: string
  resumo: string
  imagem?: Imagem

  // 🌱 Conheça (seções 02, 03, 04)
  conhecendo: Secao
  cultivo: Secao
  historia: Secao

  // 👃 Sinta (seções 05, 06)
  experiencia: Secao
  atividade: string
  perguntas: string[] // pelo menos uma (orientação 3.3)
  psicologia: Secao

  // 🔬 Ciência (seções 07, 08, 09 ficam para o próximo semestre)
  usos: Uso[]
  biomedicina?: Secao
  farmacia?: Secao
  alertas?: Secao

  // 10 Fontes e validação
  fontes: Fonte[]
  validacoes: Validacao[]
  atualizadoEm: string // AAAA-MM-DD

  /** Conteúdo provisório escrito pela Engenharia, aguardando a equipe de Psicologia. */
  exemplo: boolean
  publicado: boolean
}

/** Conteúdo editorial da estação Sentidos (orientação 3.2). */
export type PassoAtividade = {
  texto: string
  segundos?: number // passos com tempo mostram um cronômetro
}

export type TemaSensorial = {
  slug: string
  titulo: string
  resumo: string
  secoes: { titulo: string; texto: string[] }[]
  experimente?: { titulo: string; introducao: string; passos: PassoAtividade[] }
  pergunta?: string
  fontes: Fonte[]
  exemplo: boolean
}

/** Jogos e desafios (orientação 4.1): mesmo motor para quiz e mitos e verdades. */
export type PerguntaJogo = {
  enunciado: string
  opcoes: string[]
  correta: number // índice em `opcoes`
  feedback: string // explicação mostrada após responder, sempre fundamentada
  fonte?: Fonte
}

export type Jogo = {
  slug: string
  titulo: string
  descricao: string
  tipo: 'quiz' | 'mitos_verdades'
  perguntas: PerguntaJogo[]
  exemplo: boolean
}

/** Produção acadêmica dos cursos (estação Comunidade). */
export type Projeto = {
  id: number
  curso: string
  tipo: string
  titulo: string
  descricao: string
  link?: string
  ano?: number
  publicado: boolean
}

/** Tour virtual (orientação, seção 5). */
export type MarcadorTour = {
  id: number
  x: number // % da largura da foto
  y: number // % da altura da foto
  rotulo: string
  planta?: string
  canteiroNumero?: number
}

export type ParadaTour = {
  id: number
  ordem: number
  titulo: string
  texto: string
  imagem?: { src: string; alt: string }
  audio?: { src: string; transcricao: string }
  exemplo: boolean
  marcadores: MarcadorTour[]
}
