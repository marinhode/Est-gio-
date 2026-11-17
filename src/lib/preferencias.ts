'use client'

import { useSyncExternalStore } from 'react'

/** Ajustes de leitura (botão Aa): aplicados no <html> e salvos no aparelho. */
export type Preferencia = { atributo: 'data-letra' | 'data-contraste'; valor: string; chave: string }
export const LETRA: Preferencia = { atributo: 'data-letra', valor: 'grande', chave: 'ls-letra' }
export const CONTRASTE: Preferencia = { atributo: 'data-contraste', valor: 'alto', chave: 'ls-contraste' }

/** Lê a preferência direto do <html>, que o script do layout já ajustou antes da pintura. */
export function usePreferencia(p: Preferencia) {
  const ativo = useSyncExternalStore(
    (avisar) => {
      const obs = new MutationObserver(avisar)
      obs.observe(document.documentElement, { attributes: true, attributeFilter: [p.atributo] })
      return () => obs.disconnect()
    },
    () => document.documentElement.getAttribute(p.atributo) === p.valor,
    () => false,
  )
  const alternar = () => {
    const ligar = !ativo
    if (ligar) document.documentElement.setAttribute(p.atributo, p.valor)
    else document.documentElement.removeAttribute(p.atributo)
    try {
      localStorage.setItem(p.chave, ligar ? '1' : '0')
    } catch {}
  }
  return [ativo, alternar] as const
}
