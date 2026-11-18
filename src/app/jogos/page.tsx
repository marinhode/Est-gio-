import type { Metadata } from 'next'
import Link from 'next/link'
import { Icone } from '@/components/Icone'
import { listarJogos } from '@/lib/conteudo'

export const metadata: Metadata = {
  title: 'Jogos e desafios',
  description: 'Quiz e mitos e verdades sobre sentidos, plantas e bem-estar, com explicações fundamentadas.',
}

const emBreve = [
  { titulo: 'Plantas da horta', texto: 'Um quiz sobre as espécies dos canteiros.' },
  { titulo: 'Que folha é essa?', texto: 'Associe cada folha à sua planta pela forma e pela textura.' },
]

export default async function Jogos() {
  const jogos = await listarJogos()
  return (
    <div className="largura gutter grid gap-12 py-12">
      <header className="grid gap-4">
        <p className="flex items-center gap-2 font-bold text-azul">
          <Icone nome="jogos" />
          Estação Jogos
        </p>
        <h1 className="text-[2.3rem] sm:text-[2.8rem]">Jogos e desafios</h1>
        <p className="leitura text-lg">
          Teste o que você sabe e descubra o porquê de cada resposta. Dá para jogar sozinho ou projetar para a turma.
        </p>
      </header>

      <ul className="grid gap-5 md:grid-cols-2">
        {jogos.map((j) => (
          <li key={j.slug}>
            <Link
              href={`/jogos/${j.slug}`}
              transitionTypes={['nav-forward']}
              className="group grid h-full content-start gap-3 rounded-md border-2 border-linha bg-superficie p-6 text-tinta no-underline hover:border-azul"
            >
              <span className="nota">
                {j.perguntas.length} {j.tipo === 'mitos_verdades' ? 'afirmações' : 'perguntas'}
              </span>
              <span className="font-titulo text-[1.6rem] leading-tight text-azul group-hover:underline">{j.titulo}</span>
              <span className="text-suave">{j.descricao}</span>
              <span className="mt-1 flex items-center gap-2 font-bold text-azul">
                Jogar
                <Icone nome="seta" />
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <section aria-labelledby="t-breve" className="grid gap-4">
        <h2 id="t-breve" className="text-[1.35rem]">Em preparo</h2>
        <p className="nota leitura">Estes jogos dependem da lista de plantas da horta e entram quando os canteiros estiverem definidos.</p>
        <ul className="grid gap-x-8 sm:grid-cols-2">
          {emBreve.map((j) => (
            <li key={j.titulo} className="grid gap-1 border-t border-dashed border-linha py-4">
              <span className="font-titulo text-lg">{j.titulo}</span>
              <span className="text-suave">{j.texto}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
