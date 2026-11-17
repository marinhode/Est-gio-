import type { Secao } from '@/lib/tipos'

/** Texto curto sempre visível; explicação ampliada em "Ler mais" (orientação 3.3). */
export function TextoSecao({ secao, sobre }: { secao: Secao; sobre: string }) {
  return (
    <div className="grid gap-2">
      <p>{secao.curto}</p>
      {secao.ampliado && (
        <details className="group">
          <summary className="inline-flex min-h-11 cursor-pointer items-center font-bold text-azul">
            <span className="group-open:hidden">Ler mais</span>
            <span className="hidden group-open:inline">Ler menos</span>
            <span className="sr-only"> sobre {sobre}</span>
          </summary>
          <p className="mt-1">{secao.ampliado}</p>
        </details>
      )}
    </div>
  )
}
