import type { Metadata } from 'next'
import Link from 'next/link'
import { Icone } from '@/components/Icone'
import { listarParadas } from '@/lib/conteudo'

export const metadata: Metadata = {
  title: 'Tour em lista',
  description: 'O tour virtual do Laboratório Sensorial em formato de texto, sem depender de imagens.',
}

export default async function TourLista() {
  const paradas = await listarParadas()
  return (
    <div className="largura gutter grid gap-8 py-12">
      <header className="leitura grid gap-3">
        <Link href="/tour" className="inline-flex min-h-11 items-center gap-2 font-bold no-underline hover:underline"><Icone nome="tour" className="size-4" />Tour virtual</Link>
        <h1 className="text-[2.3rem]">Tour em lista</h1>
        <p className="text-lg">As mesmas paradas do tour, em texto. Cada ponto de interesse leva à ficha da planta ou ao canteiro no mapa.</p>
      </header>
      <ol className="leitura grid gap-8">
        {paradas.map((p) => (
          <li key={p.id} className="grid gap-3 border-t border-linha pt-6">
            <h2 className="flex items-baseline gap-3"><span className="font-texto text-base font-bold text-azul">Parada {p.ordem}</span>{p.titulo}</h2>
            <p>{p.texto}</p>
            {p.imagem && <p className="nota">Na foto: {p.imagem.alt}</p>}
            {p.audio && (
              <details>
                <summary className="inline-flex min-h-11 cursor-pointer items-center font-bold text-azul">Transcrição da narração</summary>
                <p>{p.audio.transcricao}</p>
              </details>
            )}
            {p.marcadores.length > 0 && (
              <div className="grid gap-2">
                <h3 className="text-base font-bold font-texto">Pontos de interesse</h3>
                <ul className="grid list-disc gap-1 pl-5">
                  {p.marcadores.map((m) => (
                    <li key={m.id}>
                      <Link href={m.planta ? `/plantas/${m.planta}` : m.canteiroNumero ? `/mapa#canteiro-${m.canteiroNumero}` : '/mapa'}>{m.rotulo}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ol>
    </div>
  )
}
