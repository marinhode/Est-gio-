'use client'

import { useActionState } from 'react'
import { entrar, type EstadoLogin } from '@/app/admin/acoes'

export function FormularioLogin() {
  const [estado, acao, enviando] = useActionState<EstadoLogin, FormData>(entrar, {})

  return (
    <form action={acao} className="grid gap-4" aria-describedby={estado.erro ? 'erro-login' : undefined}>
      <div className="grid gap-1">
        <label htmlFor="email" className="font-bold">E-mail</label>
        <input id="email" name="email" type="email" autoComplete="username" required className="campo" defaultValue={estado.email} />
      </div>
      <div className="grid gap-1">
        <label htmlFor="senha" className="font-bold">Senha</label>
        <input id="senha" name="senha" type="password" autoComplete="current-password" required className="campo" />
      </div>
      {estado.erro && (
        <p id="erro-login" role="alert" className="rounded border-l-4 border-tinta bg-papel px-3 py-2 font-bold">
          {estado.erro}
        </p>
      )}
      <button type="submit" className="btn justify-self-start" disabled={enviando}>
        {enviando ? 'Entrando…' : 'Entrar'}
      </button>
    </form>
  )
}
