import type { DadosJogo, DadosPergunta } from '@/app/admin/jogos/acoes'

/** Alternativas fixas do jogo Mitos e verdades. */
export const OPCOES_MITO = ['Mito', 'Verdade', 'Em parte']

export const perguntaVazia = (tipo: DadosJogo['tipo']): DadosPergunta => ({
  enunciado: '',
  opcoes: tipo === 'mitos_verdades' ? [...OPCOES_MITO] : ['', ''],
  correta: 0,
  feedback: '',
  fonteTitulo: '',
  fonteUrl: '',
})

export function jogoVazio(): DadosJogo {
  return { slug: '', titulo: '', descricao: '', tipo: 'quiz', publicado: false, exemplo: false, perguntas: [perguntaVazia('quiz')] }
}
