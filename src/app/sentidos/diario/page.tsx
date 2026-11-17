import type { Metadata } from 'next'
import Link from 'next/link'
import { Diario } from '@/components/Diario'
import { Icone } from '@/components/Icone'

export const metadata: Metadata = {
  title: 'Diário sensorial',
  description: 'Registre o que você observou, sentiu ou descobriu na horta. Fica só no seu aparelho.',
}

export default function PaginaDiario() {
  return (
    <div className="largura gutter grid gap-8 py-10">
      <header className="leitura grid gap-4">
        <nav aria-label="Você está em">
          <Link href="/sentidos" className="c-sinta inline-flex min-h-11 items-center gap-2 font-bold no-underline hover:underline">
            <Icone nome="aroma" className="size-4" />
            Experiências sensoriais
          </Link>
        </nav>
        <h1 className="text-[2.1rem] sm:text-[2.6rem]">Diário sensorial</h1>
        <p className="text-lg">Anote o que você observou, sentiu ou descobriu. Não precisa escrever muito, nem escrever bonito.</p>
        <p className="nota">
          O diário fica guardado só neste aparelho e navegador. Ninguém mais tem acesso, nem a equipe do laboratório. Se limpar
          os dados do navegador, ele é apagado; use &quot;Copiar o diário&quot; para guardar uma cópia.
        </p>
      </header>
      <Diario />
    </div>
  )
}
