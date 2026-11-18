import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AvisoExemplo } from '@/components/AvisoExemplo'
import { Bloco } from '@/components/Bloco'
import { Icone } from '@/components/Icone'
import { ImagemRevelada } from '@/components/ImagemRevelada'
import { Compartilhado } from '@/components/Transicao'
import { PerguntaReflexiva } from '@/components/PerguntaReflexiva'
import { RamoBotanico } from '@/components/RamoBotanico'
import { TextoSecao } from '@/components/Secao'
import { Selo } from '@/components/Selo'
import { listarPlantas, obterCanteiro, obterPlanta } from '@/lib/conteudo'

export async function generateStaticParams() {
  return (await listarPlantas()).map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: PageProps<'/plantas/[slug]'>): Promise<Metadata> {
  const planta = await obterPlanta((await params).slug)
  return planta ? { title: planta.nomePopular, description: planta.fraseImpacto } : {}
}

const data = (iso: string) => iso.split('-').reverse().join('/')

export default async function Ficha({ params }: PageProps<'/plantas/[slug]'>) {
  const planta = await obterPlanta((await params).slug)
  if (!planta) notFound()
  const [canteiro, todas] = await Promise.all([obterCanteiro(planta.canteiroId), listarPlantas()])
  const vizinhas = todas.filter((p) => p.canteiroId && p.canteiroId === planta.canteiroId && p.slug !== planta.slug)
  const cienciaPreparo = !planta.biomedicina && !planta.farmacia && !planta.alertas

  return (
    <article className="pb-8">
      {/* Abertura: o que a pessoa vê ao escanear o QR */}
      <header className="largura gutter grid gap-6 py-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-center md:py-12">
        <Compartilhado nome={`planta-${planta.slug}`}>
          <figure className="relative m-0 grid aspect-[4/3] place-items-center overflow-hidden rounded-md bg-[color-mix(in_srgb,var(--folha)_10%,var(--superficie))]">
            {planta.imagem ? (
              <ImagemRevelada src={planta.imagem.src} alt={planta.imagem.alt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" priority />
            ) : (
              <RamoBotanico className="h-3/4 w-auto" />
            )}
            {planta.imagem?.credito && <figcaption className="absolute right-2 bottom-2 rounded bg-superficie/90 px-2 py-0.5 text-xs">{planta.imagem.credito}</figcaption>}
          </figure>
        </Compartilhado>
        <div className="grid gap-4">
          <Link href="/plantas" transitionTypes={['nav-back']} className="inline-flex min-h-11 items-center gap-2 font-bold no-underline hover:underline">
            <Icone nome="livro" className="size-4" />
            Enciclopédia de plantas
          </Link>
          <div className="grid gap-1">
            <h1 className="text-[2.6rem] sm:text-[3.2rem]">{planta.nomePopular}</h1>
            <p className="text-lg text-suave">
              <em className="cientifico">{planta.nomeCientifico}</em>
              {planta.autorTaxon && ` ${planta.autorTaxon}`}, família {planta.familia}
            </p>
          </div>
          {canteiro && (
            <Link href={`/mapa#canteiro-${canteiro.numero}`} className="inline-flex min-h-11 items-center gap-2 font-bold text-folha no-underline hover:underline">
              <Icone nome="pino" className="size-5" />
              Canteiro {canteiro.numero}, {canteiro.nome.toLowerCase()}
            </Link>
          )}
          <p className="curiosidade text-lg">{planta.fraseImpacto}</p>
          <p className="text-lg">{planta.resumo}</p>
          {planta.exemplo && <AvisoExemplo />}
        </div>
      </header>

      {/* Os três caminhos */}
      <nav aria-label="Três caminhos desta planta" className="caminhos-ficha">
        <ul className="largura grid grid-cols-3">
          {[
            { href: '#conheca', rotulo: 'Conheça', icone: 'folha', cor: 'c-conheca' },
            { href: '#sinta', rotulo: 'Sinta', icone: 'aroma', cor: 'c-sinta' },
            { href: '#ciencia', rotulo: 'Ciência', icone: 'frasco', cor: 'c-ciencia' },
          ].map((c) => (
            <li key={c.href}>
              <a href={c.href} className={`${c.cor} flex min-h-14 flex-col items-center justify-center gap-0.5 border-b-4 border-transparent font-bold no-underline hover:border-current`}>
                <Icone nome={c.icone as 'folha'} />
                {c.rotulo}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="largura gutter grid gap-14 pt-10">
        <section id="conheca" aria-labelledby="t-conheca" className="secao-ficha grid gap-5">
          <h2 id="t-conheca" className="c-conheca flex items-center gap-2"><Icone nome="folha" className="size-7" />Conheça a planta</h2>
          <div className="grid items-start gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Bloco titulo="Como ela é" icone="folha" cor="text-folha"><TextoSecao secao={planta.conhecendo} sobre="como ela é" /></Bloco>
            <Bloco titulo="Cultivo e sustentabilidade" icone="folha" cor="text-folha"><TextoSecao secao={planta.cultivo} sobre="cultivo" /></Bloco>
            <Bloco titulo="História e cultura" icone="livro" cor="text-folha"><TextoSecao secao={planta.historia} sobre="história e cultura" /></Bloco>
          </div>
          {(planta.categorias.length > 0 || planta.caracteristicas.length > 0) && (
            <Bloco titulo="Características">
              <ul className="flex flex-wrap gap-2" aria-label="Categorias e características">
                {[...planta.categorias, ...planta.caracteristicas].map((t) => (
                  <li key={t} className="rounded-full border border-linha bg-papel px-3 py-1 text-sm">{t}</li>
                ))}
              </ul>
            </Bloco>
          )}
        </section>

        <section id="sinta" aria-labelledby="t-sinta" className="secao-ficha grid gap-6">
          <h2 id="t-sinta" className="c-sinta flex items-center gap-2"><Icone nome="aroma" className="size-7" />Explore a experiência sensorial</h2>
          <div className="grid items-start gap-4 md:grid-cols-2">
            <Bloco titulo="O que se percebe" icone="aroma" cor="text-lavanda"><TextoSecao secao={planta.experiencia} sobre="a experiência sensorial" /></Bloco>
            <div className="grid gap-2 rounded-[10px] border-2 border-lavanda bg-superficie p-5">
              <p className="c-sinta font-bold">Experimente</p>
              <p className="text-lg">{planta.atividade}</p>
            </div>
          </div>
          <div className="leitura grid gap-6">
            {planta.perguntas.map((p) => (
              <PerguntaReflexiva key={p} pergunta={p} sobre={planta.nomePopular} planta={planta.slug} />
            ))}
            <Bloco titulo="Psicologia e bem-estar" icone="pessoas" cor="text-lavanda"><TextoSecao secao={planta.psicologia} sobre="psicologia e bem-estar" /></Bloco>
          </div>
        </section>

        <section id="ciencia" aria-labelledby="t-ciencia" className="secao-ficha leitura grid gap-6">
          <h2 id="t-ciencia" className="c-ciencia flex items-center gap-2"><Icone nome="frasco" className="size-7" />Descubra o que a ciência pesquisa</h2>
          {planta.usos.length > 0 ? (
            <ul className="grid gap-3">
              {planta.usos.map((u) => (
                <li key={u.texto} className="bloco">
                  <Selo nivel={u.nivel} />
                  <p>{u.texto}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-suave">Ainda não há usos cadastrados para esta planta.</p>
          )}
          <p className="nota"><Link href="/ciencia">O que significa cada selo?</Link></p>
          {planta.biomedicina && <Bloco titulo="Biomedicina" icone="frasco" cor="text-ciencia"><TextoSecao secao={planta.biomedicina} sobre="biomedicina" /></Bloco>}
          {planta.farmacia && <Bloco titulo="Farmácia" icone="frasco" cor="text-ciencia"><TextoSecao secao={planta.farmacia} sobre="farmácia" /></Bloco>}
          {planta.alertas && (
            <div className="grid gap-2 rounded-md border-2 border-tinta p-4">
              <h3>Alertas de segurança</h3>
              <TextoSecao secao={planta.alertas} sobre="alertas de segurança" />
            </div>
          )}
          {cienciaPreparo && (
            <p className="rounded border-l-4 border-linha bg-superficie px-4 py-3 text-suave">
              Composição, usos farmacêuticos e alertas de segurança estão em preparação pelas equipes de Biomedicina e Farmácia.
            </p>
          )}
        </section>

        {/* Etiqueta de herbário */}
        <footer className="grid gap-8 md:grid-cols-2">
          <aside aria-labelledby="t-etiqueta" className="grid content-start gap-3 border-[1.5px] border-tinta p-5">
            <h2 id="t-etiqueta" className="border-b border-tinta pb-2 text-[1.1rem]">Herbário digital do Laboratório Sensorial</h2>
            <dl className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1.5 text-sm">
              <dt className="text-suave">Família</dt><dd>{planta.familia}</dd>
              <dt className="text-suave">Espécie</dt><dd><em>{planta.nomeCientifico}</em>{planta.autorTaxon && ` ${planta.autorTaxon}`}</dd>
              <dt className="text-suave">Localização</dt><dd>{canteiro ? `Canteiro ${canteiro.numero}` : 'A definir'}</dd>
              <dt className="text-suave">Validado por</dt>
              <dd>{planta.validacoes.length ? planta.validacoes.map((v) => `${v.nome} (${v.area}, ${data(v.data)})`).join('; ') : 'Aguardando validação'}</dd>
              <dt className="text-suave">Atualizado em</dt><dd>{data(planta.atualizadoEm)}</dd>
            </dl>
          </aside>
          <div className="grid content-start gap-4">
            {planta.fontes.length > 0 && (
              <section aria-labelledby="t-fontes" className="grid gap-2">
                <h2 id="t-fontes" className="text-[1.15rem]">Fontes</h2>
                <ul className="grid gap-2 text-sm">
                  {planta.fontes.map((f) => (
                    <li key={f.titulo}>
                      {f.url ? <a href={f.url}>{f.titulo}</a> : f.titulo}
                      {f.consultadoEm && <span className="text-suave"> Consultado em {data(f.consultadoEm)}.</span>}
                    </li>
                  ))}
                </ul>
              </section>
            )}
            <p className="nota">Conteúdo educativo. Dúvidas sobre saúde ou uso de plantas medicinais devem ser levadas a um profissional habilitado.</p>
          </div>
        </footer>

        {vizinhas.length > 0 && canteiro && (
          <section aria-labelledby="t-vizinhas" className="grid gap-4">
            <h2 id="t-vizinhas" className="text-[1.4rem]">Também no canteiro {canteiro.numero}</h2>
            <ul className="flex flex-wrap gap-3">
              {vizinhas.map((v) => (
                <li key={v.slug}><Link href={`/plantas/${v.slug}`} className="chip">{v.nomePopular}</Link></li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </article>
  )
}
