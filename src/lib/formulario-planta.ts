import type { DadosPlanta } from '@/app/admin/plantas/acoes'

/** Utilidades do formulário de planta, usadas no servidor e no navegador. */

export function paraEndereco(texto: string) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function plantaVazia(): DadosPlanta {
  const s = () => ({ curto: '', ampliado: '' })
  return {
    slug: '', nomePopular: '', nomeCientifico: '', autorTaxon: '', familia: '', canteiroId: '', categorias: [], caracteristicas: [],
    fraseImpacto: '', resumo: '', imagemUrl: '', imagemAlt: '', imagemCredito: '',
    conhecendo: s(), cultivo: s(), historia: s(), experiencia: s(), atividade: '', perguntas: [''], psicologia: s(),
    biomedicina: s(), farmacia: s(), alertas: s(), usos: [], fontes: [], validacoes: [], exemplo: false, publicado: false,
  }
}
