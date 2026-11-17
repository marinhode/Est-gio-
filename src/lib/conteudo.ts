import { cacheTag } from 'next/cache'
import { canteiros, plantas } from '@/lib/dados/exemplo'
import type { Canteiro, Planta } from '@/lib/tipos'

/**
 * Ponto único de leitura do conteúdo.
 * Hoje lê os dados de exemplo; quando o Supabase estiver ligado,
 * só estas funções mudam. As páginas não precisam saber de onde vem.
 * O painel invalida o cache com updateTag('conteudo') ao salvar.
 */

export async function listarPlantas(): Promise<Planta[]> {
  'use cache'
  cacheTag('conteudo')
  return plantas
    .filter((p) => p.publicado)
    .sort((a, b) => a.nomePopular.localeCompare(b.nomePopular, 'pt-BR'))
}

export async function obterPlanta(slug: string): Promise<Planta | null> {
  'use cache'
  cacheTag('conteudo')
  return plantas.find((p) => p.slug === slug && p.publicado) ?? null
}

export async function listarCanteiros(): Promise<Canteiro[]> {
  'use cache'
  cacheTag('conteudo')
  return [...canteiros].sort((a, b) => a.numero - b.numero)
}

export async function obterCanteiro(id: string): Promise<Canteiro | null> {
  'use cache'
  cacheTag('conteudo')
  return canteiros.find((c) => c.id === id) ?? null
}
