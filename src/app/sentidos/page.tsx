import type { Metadata } from 'next'
import Link from 'next/link'
import { Icone } from '@/components/Icone'
import { listarTemas } from '@/lib/conteudo'

export const metadata: Metadata = {
  title: 'Experiências sensoriais',
  description: 'Aromas, texturas, cores, memória e atenção: conteúdos e atividades da Psicologia.',
}

function minutos(segundos: number) {
  return segundos < 60 ? `${segundos} s` : `${Math.round(segundos / 60)} min`
}

export default async function Sentidos() {
  const temas = await listarTemas()
  return (
    <div className="largura gutter grid gap-12 py-12">
      <header className="grid gap-4">
        <h1 className="text-[2.3rem] sm:text-[2.8rem]">Experiências sensoriais</h1>
        <p className="leitura text-lg">
          Cheirar, tocar, observar e perceber o que isso desperta. Aqui não existe sensação certa: cada pessoa sente de um
          jeito, e todas as respostas são bem-vindas.
        </p>
      </header>

      <section aria-labelledby="t-temas" className="grid gap-4">
        <h2 id="t-temas" className="sr-only">Temas</h2>
        <ul className="grid gap-x-8 md:grid-cols-2">
          {temas.map((t) => {
            const tempo = t.experimente?.passos.reduce((s, p) => s + (p.segundos ?? 0), 0) ?? 0
            return (
              <li key={t.slug} className="border-t border-linha">
                <Link href={`/sentidos/${t.slug}`} transitionTypes={['nav-forward']} className="group grid gap-1.5 py-5 text-tinta no-underline">
                  <span className="font-titulo text-[1.35rem] text-lavanda group-hover:underline">{t.titulo}</span>
                  <span className="text-suave">{t.resumo}</span>
                  {t.experimente && (
                    <span className="nota flex items-center gap-1.5">
                      <Icone nome="aroma" className="size-4 text-lavanda" />
                      Atividade de {minutos(tempo)}: {t.experimente.titulo.toLowerCase()}
                    </span>
                  )}
                </Link>
              </li>
            )
          })}
          <li className="border-t border-linha">
            <Link href="/jogos/mitos-e-verdades" className="group grid gap-1.5 py-5 text-tinta no-underline">
              <span className="font-titulo text-[1.35rem] text-lavanda group-hover:underline">Mitos e verdades</span>
              <span className="text-suave">Aromaterapia, plantas e bem-estar: teste o que você sabe, com respostas fundamentadas.</span>
              <span className="nota">Na estação Jogos</span>
            </Link>
          </li>
        </ul>
      </section>

      <section aria-labelledby="t-diario" className="capa-caderno">
        <div className="grid gap-2">
          <h2 id="t-diario">Diário sensorial</h2>
          <p className="leitura opacity-95">
            Um espaço só seu para anotar o que você observou, sentiu ou descobriu. Fica guardado neste aparelho e ninguém mais
            tem acesso.
          </p>
        </div>
        <Link href="/sentidos/diario" className="btn border-sobre-folha bg-sobre-folha text-lavanda">
          Abrir meu diário
        </Link>
      </section>
    </div>
  )
}
