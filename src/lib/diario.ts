'use client'

import { useMemo, useSyncExternalStore } from 'react'

/**
 * Diário sensorial: fica só no aparelho do visitante (localStorage).
 * Nada é enviado ao servidor; a equipe do laboratório não tem acesso.
 */

export type Sentido = 'Visão' | 'Olfato' | 'Tato' | 'Audição'
export const SENTIDOS: Sentido[] = ['Visão', 'Olfato', 'Tato', 'Audição']

export type Registro = {
  id: string
  criadoEm: string // ISO
  sobre?: string
  sentidos: Sentido[]
  observei?: string
  senti?: string
  descobri?: string
  pergunta?: string
  resposta?: string
}

const CHAVE = 'ls-diario'
const EVENTO = 'ls-diario-mudou'

function lerBruto(): string | null {
  try {
    return localStorage.getItem(CHAVE)
  } catch {
    return null
  }
}

function gravar(registros: Registro[]): boolean {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(registros))
    window.dispatchEvent(new Event(EVENTO))
    return true
  } catch {
    return false
  }
}

function inscrever(avisar: () => void) {
  window.addEventListener(EVENTO, avisar)
  window.addEventListener('storage', avisar) // outras abas
  return () => {
    window.removeEventListener(EVENTO, avisar)
    window.removeEventListener('storage', avisar)
  }
}

function interpretar(bruto: string | null): Registro[] {
  if (!bruto) return []
  try {
    const dados = JSON.parse(bruto)
    return Array.isArray(dados) ? dados : []
  } catch {
    return []
  }
}

/** `pronto` é falso na renderização do servidor, quando o diário ainda não foi lido. */
export function useDiario() {
  const bruto = useSyncExternalStore(inscrever, lerBruto, () => undefined)
  const registros = useMemo(() => (bruto === undefined ? [] : interpretar(bruto)), [bruto])

  return {
    pronto: bruto !== undefined,
    registros,
    adicionar(r: Omit<Registro, 'id' | 'criadoEm'>) {
      const novo: Registro = { ...r, id: crypto.randomUUID(), criadoEm: new Date().toISOString() }
      return gravar([novo, ...interpretar(lerBruto())])
    },
    apagar(id: string) {
      return gravar(interpretar(lerBruto()).filter((r) => r.id !== id))
    },
  }
}
