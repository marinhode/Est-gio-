import { Icone, type NomeIcone } from '@/components/Icone'
import type { NivelEvidencia } from '@/lib/tipos'

/** Os quatro níveis de evidência (orientação 3.1). Ícone + texto + cor, nunca só cor. */
export const NIVEIS: Record<NivelEvidencia, { rotulo: string; icone: NomeIcone }> = {
  popular: { rotulo: 'Uso popular', icone: 'fala' },
  hipotese: { rotulo: 'Hipótese de pesquisa', icone: 'lupa' },
  evidencia_cientifica: { rotulo: 'Evidência científica', icone: 'livro' },
  uso_reconhecido: { rotulo: 'Uso reconhecido', icone: 'ok' },
}

export function Selo({ nivel }: { nivel: NivelEvidencia }) {
  const n = NIVEIS[nivel]
  return (
    <span className={`selo selo-${nivel}`}>
      <Icone nome={n.icone} className="size-4" />
      {n.rotulo}
    </span>
  )
}
