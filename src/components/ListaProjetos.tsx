'use client'

import { useState } from 'react'
import type { Projeto } from '@/lib/tipos'

/** Projetos com filtro por curso. O filtro é uma linha de botões, como a barra de estações. */
export function ListaProjetos({ projetos }: { projetos: Projeto[] }) {
  const cursos = [...new Set(projetos.map((p) => p.curso))]
  const [curso, setCurso] = useState<string | null>(null)
  const visiveis = curso ? projetos.filter((p) => p.curso === curso) : projetos

  return (
    <div className="grid gap-6">
      {cursos.length > 1 && (
        <div role="group" aria-label="Filtrar por curso" className="flex flex-wrap gap-2">
          {[null, ...cursos].map((c) => (
            <button key={c ?? 'todos'} type="button" className="chip" aria-pressed={curso === c} onClick={() => setCurso(c)} data-ativo={curso === c}>
              {c ?? 'Todos os cursos'}
            </button>
          ))}
        </div>
      )}
      <p className="sr-only" aria-live="polite">{visiveis.length} projeto(s){curso ? ` de ${curso}` : ''}</p>
      <ul className="grid gap-5 md:grid-cols-2">
        {visiveis.map((p) => (
          <li key={p.id} className="grid content-start gap-3 rounded-md border border-linha bg-superficie p-6">
            <p className="flex flex-wrap items-center gap-2 text-sm">
              <span className="selo selo-evidencia_cientifica !text-xs">{p.tipo}</span>
              <span className="font-bold">{p.curso}</span>
              {p.ano && <span className="text-suave">{p.ano}</span>}
            </p>
            <h2 className="bloco-titulo">{p.titulo}</h2>
            <p className="text-suave">{p.descricao}</p>
            {p.link && (
              <p>
                <a href={p.link}>Acessar o projeto<span className="sr-only">: {p.titulo}</span></a>
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
