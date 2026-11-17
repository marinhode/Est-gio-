import type { DadosTexto } from '@/app/admin/textos/acoes'
import type { TemaSensorial } from '@/lib/tipos'

export function textoVazio(): DadosTexto {
  return {
    chave: '', titulo: '', resumo: '', secoes: [{ titulo: '', texto: '' }], temAtividade: true,
    atividade: { titulo: '', introducao: '', passos: [{ texto: '', segundos: '30' }] }, pergunta: '', fontes: [], exemplo: false,
  }
}

export function temaParaFormulario(t: TemaSensorial): DadosTexto {
  return {
    chave: t.slug, titulo: t.titulo, resumo: t.resumo,
    secoes: t.secoes.map((s) => ({ titulo: s.titulo, texto: s.texto.join('\n\n') })),
    temAtividade: Boolean(t.experimente),
    atividade: t.experimente
      ? { titulo: t.experimente.titulo, introducao: t.experimente.introducao, passos: t.experimente.passos.map((p) => ({ texto: p.texto, segundos: p.segundos ? String(p.segundos) : '' })) }
      : { titulo: '', introducao: '', passos: [{ texto: '', segundos: '30' }] },
    pergunta: t.pergunta ?? '', fontes: t.fontes, exemplo: t.exemplo,
  }
}
