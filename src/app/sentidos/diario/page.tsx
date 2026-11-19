import type { Metadata } from 'next'
import Link from 'next/link'
import { Diario } from '@/components/Diario'

export const metadata: Metadata = {
  title: 'Diário sensorial',
  description: 'Registre o que você observou, sentiu ou descobriu na horta. Fica só no seu aparelho.',
}

export default function PaginaDiario() {
  return (
    <div className="largura gutter grid gap-8 py-10">
      <header className="cabecalho-pagina">
        <nav aria-label="Você está em">
          <Link href="/sentidos" transitionTypes={['nav-back']} className="text-sm">
            Experiências sensoriais
          </Link>
        </nav>
        <h1 className="titulo-pagina">Diário sensorial</h1>
        <p className="subtitulo">Anote o que você observou, sentiu ou descobriu. Não precisa escrever muito, nem escrever bonito.</p>
        <p className="nota">
          O diário fica guardado só neste aparelho e navegador. Ninguém mais tem acesso, nem a equipe do laboratório. Se limpar
          os dados do navegador, ele é apagado; use &quot;Copiar o diário&quot; para guardar uma cópia.
        </p>
      </header>
      <Diario />
    </div>
  )
}
