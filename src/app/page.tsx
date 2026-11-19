import Link from 'next/link'
import { Icone } from '@/components/Icone'
import { PlacaCanteiro } from '@/components/PlacaCanteiro'
import { obterCanteiro, obterPlanta } from '@/lib/conteudo'

const caminhos = [
  {
    classe: 'c-conheca',
    icone: 'folha',
    titulo: 'Conheça a planta',
    texto: 'Como ela é, como se cultiva e que histórias carrega.',
  },
  {
    classe: 'c-sinta',
    icone: 'aroma',
    titulo: 'Explore a experiência sensorial',
    texto: 'Cheirar, tocar, observar e perceber o que isso desperta em você.',
  },
  {
    classe: 'c-ciencia',
    icone: 'frasco',
    titulo: 'Descubra o que a ciência pesquisa',
    texto: 'O que é uso popular, o que tem evidência e o que ainda é pergunta.',
  },
] as const

const cursos = [
  { nome: 'Psicologia', papel: 'Cuida das experiências sensoriais, das atividades e da organização dos textos.' },
  { nome: 'Biomedicina', papel: 'Vai estudar a composição das plantas e o que as pesquisas mostram.' },
  { nome: 'Farmácia', papel: 'Vai trazer os usos reconhecidos, os cuidados e o desenvolvimento de produtos.' },
  { nome: 'Engenharia de Software', papel: 'Constrói esta plataforma e o que conecta a horta ao celular.' },
]

export default async function Inicio() {
  const destaque = await obterPlanta('hortela')
  const canteiro = destaque ? await obterCanteiro(destaque.canteiroId) : null

  return (
    <>
      {/* Abertura */}
      <section className="largura gutter grid items-center gap-10 py-12 md:grid-cols-[1.25fr_1fr] md:py-16">
        <div className="grid gap-5">
          <h1 className="titulo-pagina">Uma horta para descobrir com todos os sentidos</h1>
          <p className="subtitulo">
            O Laboratório Sensorial reúne plantas, pessoas e ciência. Aqui você conhece cada espécie da horta, faz atividades
            de percepção e descobre o que a pesquisa sabe sobre ela, na visita presencial ou de onde estiver.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/tour" className="btn">
              <Icone nome="tour" />
              Começar o tour
            </Link>
            <Link href="/plantas" className="btn btn-sec">
              Ver as plantas
            </Link>
          </div>
        </div>

        {destaque && <PlacaCanteiro planta={destaque} canteiro={canteiro} />}
      </section>

      {/* Uma planta, três caminhos */}
      <section aria-labelledby="t-caminhos" className="border-y border-linha bg-superficie">
        <div className="largura gutter grid gap-8 py-12">
          <div className="grid gap-2">
            <h2 id="t-caminhos">Uma planta, três caminhos</h2>
            <p className="subtitulo-secao">
              Escaneie o QR Code de um canteiro ou escolha uma planta no site. Cada espécie se abre em três caminhos.
            </p>
          </div>
          <ul className="grid items-start gap-4 md:grid-cols-3">
            {caminhos.map((c) => (
              <li key={c.titulo} className="bloco !bg-papel">
                <Icone nome={c.icone} className={`size-8 ${c.classe}`} />
                <h3 className={c.classe}>{c.titulo}</h3>
                <p>{c.texto}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Cursos */}
      <section aria-labelledby="t-cursos" className="largura gutter grid gap-6 py-14">
        <div className="grid gap-2">
          <h2 id="t-cursos">Quem faz o laboratório</h2>
          <p className="subtitulo-secao">Quatro cursos olham para a mesma planta, cada um com suas perguntas.</p>
        </div>
        <dl className="grid items-start gap-4 sm:grid-cols-2">
          {cursos.map((c) => (
            <div key={c.nome} className="bloco !gap-1">
              <dt className="font-bold">{c.nome}</dt>
              <dd className="text-suave">{c.papel}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Convite presencial */}
      <section aria-labelledby="t-visite" className="largura gutter">
        <div className="grid gap-4 rounded-md bg-marca p-6 text-white sm:p-8 md:grid-cols-[1fr_auto] md:items-center">
          <div className="grid gap-2">
            <h2 id="t-visite">Venha sentir de perto</h2>
            <p className="leitura opacity-95">
              Nada substitui o cheiro de uma folha na mão. Cada canteiro tem uma placa com QR Code que abre a ficha da planta
              no seu celular.
            </p>
          </div>
          <Link
            href="/mapa"
            className="btn border-white bg-white text-marca focus-visible:outline-white"
          >
            <Icone nome="mapa" />
            Ver o mapa da horta
          </Link>
        </div>
      </section>
    </>
  )
}
