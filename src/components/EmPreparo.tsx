import Link from 'next/link'
import { Icone, type NomeIcone } from '@/components/Icone'

/** Estado provisório de uma estação enquanto ela é construída. */
export function EmPreparo({ titulo, descricao, icone }: { titulo: string; descricao: string; icone: NomeIcone }) {
  return (
    <div className="largura gutter grid gap-5 py-12">
      <h1 className="flex items-center gap-3">
        <Icone nome={icone} className="size-8 text-azul" />
        {titulo}
      </h1>
      <p className="leitura text-lg">{descricao}</p>
      <p className="nota leitura">Esta estação está em construção e entra nas próximas etapas do projeto.</p>
      <p>
        <Link href="/" className="btn btn-sec">Voltar ao início</Link>
      </p>
    </div>
  )
}
