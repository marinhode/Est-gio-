import Link from 'next/link'

/** Caminho de volta dentro do painel. */
export function Migalha({ itens }: { itens: { href: string; rotulo: string }[] }) {
  return (
    <nav aria-label="Você está em" className="text-sm">
      <ol className="flex flex-wrap items-center gap-x-2">
        {itens.map((i, n) => (
          <li key={i.href} className="flex items-center gap-2">
            {n > 0 && <span aria-hidden="true" className="text-suave">/</span>}
            <Link href={i.href} className="inline-flex min-h-11 items-center">{i.rotulo}</Link>
          </li>
        ))}
      </ol>
    </nav>
  )
}
