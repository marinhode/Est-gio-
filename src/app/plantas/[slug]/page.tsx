import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AvisoExemplo } from '@/components/AvisoExemplo'
import { BarraCaminhos } from '@/components/BarraCaminhos'
import { Bloco } from '@/components/Bloco'
import { Exsicata, tombo } from '@/components/Exsicata'
import { Icone } from '@/components/Icone'
import { Compartilhado } from '@/components/Transicao'
import { PerguntaReflexiva } from '@/components/PerguntaReflexiva'
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
      <header className="ficha-topo largura gutter py-8 md:py-14">
        <div className="ficha-titulo grid gap-2">
          <Link href="/plantas" transitionTypes={['nav-back']} className="justify-self-start text-sm">
            Todas as plantas
          </Link>
          <h1 className="titulo-planta">{planta.nomePopular}</h1>
          <p className="text-lg text-suave">
            <em className="cientifico">{planta.nomeCientifico}</em>, família {planta.familia}
          </p>
        </div>
        <div className="ficha-exsicata">
          <Compartilhado nome={`planta-${planta.slug}`}>
            <Exsicata planta={planta} canteiro={canteiro} prioridade />
          </Compartilhado>
        </div>
        <div className="ficha-detalhes grid content-start gap-5">
          {canteiro && (
            <Link href={`/mapa#canteiro-${canteiro.numero}`} className="inline-flex min-h-11 items-center gap-2 justify-self-start font-bold text-folha no-underline hover:underline">
              <Icone nome="pino" className="size-5" />
              Canteiro {canteiro.numero}, {canteiro.nome.toLowerCase()}
            </Link>
          )}
          <p className="curiosidade text-lg">{planta.fraseImpacto}</p>
          <p className="text-lg">{planta.resumo}</p>
          {planta.exemplo && <AvisoExemplo />}
        </div>
      </header>

      <BarraCaminhos />

      {/* Conheça: o que a planta é */}
      <section id="conheca" aria-labelledby="t-conheca" className="caminho-banda" data-caminho="conheca">
        <div className="largura gutter grid gap-6">
          <header className="caminho-cabeca">
            <span className="caminho-icone"><Icone nome="folha" className="size-8" /></span>
            <div>
              <h2 id="t-conheca">Conheça a planta</h2>
              <p>Como ela é, como se cultiva e que histórias carrega.</p>
            </div>
          </header>
          <div className="grid items-start gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Bloco titulo="Como ela é"><TextoSecao secao={planta.conhecendo} sobre="como ela é" /></Bloco>
            <Bloco titulo="Cultivo e sustentabilidade"><TextoSecao secao={planta.cultivo} sobre="cultivo" /></Bloco>
            <Bloco titulo="História e cultura"><TextoSecao secao={planta.historia} sobre="história e cultura" /></Bloco>
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
          <a href="#sinta" className="caminho-seguir" data-caminho="sinta">Seguir para: Explore a experiência sensorial</a>
        </div>
      </section>

      {/* Sinta: a experiência sensorial */}
      <section id="sinta" aria-labelledby="t-sinta" className="caminho-banda" data-caminho="sinta">
        <div className="largura gutter grid gap-6">
          <header className="caminho-cabeca">
            <span className="caminho-icone"><Icone nome="aroma" className="size-8" /></span>
            <div>
              <h2 id="t-sinta">Explore a experiência sensorial</h2>
              <p>Cheire, toque, observe. Aqui não existe resposta certa.</p>
            </div>
          </header>
          <div className="grid items-start gap-4 md:grid-cols-2">
            <Bloco titulo="O que se percebe"><TextoSecao secao={planta.experiencia} sobre="a experiência sensorial" /></Bloco>
            <div className="grid gap-2 rounded-[4px] border-2 border-lavanda bg-superficie p-5">
              <p className="c-sinta font-bold">Experimente</p>
              <p className="text-lg">{planta.atividade}</p>
            </div>
          </div>
          <div className="leitura grid gap-6">
            {planta.perguntas.map((p) => (
              <PerguntaReflexiva key={p} pergunta={p} sobre={planta.nomePopular} planta={planta.slug} />
            ))}
            <Bloco titulo="Psicologia e bem-estar"><TextoSecao secao={planta.psicologia} sobre="psicologia e bem-estar" /></Bloco>
          </div>
          <a href="#ciencia" className="caminho-seguir" data-caminho="ciencia">Seguir para: Descubra o que a ciência pesquisa</a>
        </div>
      </section>

      {/* Ciência: o que se sabe e com que nível de evidência */}
      <section id="ciencia" aria-labelledby="t-ciencia" className="caminho-banda" data-caminho="ciencia">
        <div className="largura gutter grid gap-6">
          <header className="caminho-cabeca">
            <span className="caminho-icone"><Icone nome="frasco" className="size-8" /></span>
            <div>
              <h2 id="t-ciencia">Descubra o que a ciência pesquisa</h2>
              <p>O que é uso popular, o que tem evidência e o que ainda é pergunta.</p>
            </div>
          </header>
          <div className="leitura grid gap-4">
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
            {planta.biomedicina && <Bloco titulo="Biomedicina"><TextoSecao secao={planta.biomedicina} sobre="biomedicina" /></Bloco>}
            {planta.farmacia && <Bloco titulo="Farmácia"><TextoSecao secao={planta.farmacia} sobre="farmácia" /></Bloco>}
            {planta.alertas && (
              <div className="grid gap-2 rounded-[4px] border-2 border-tinta bg-superficie p-4">
                <h3>Alertas de segurança</h3>
                <TextoSecao secao={planta.alertas} sobre="alertas de segurança" />
              </div>
            )}
            {cienciaPreparo && (
              <p className="rounded-[4px] bg-superficie px-4 py-3 text-suave">
                Composição, usos farmacêuticos e alertas de segurança estão em preparação pelas equipes de Biomedicina e Farmácia.
              </p>
            )}
          </div>
        </div>
      </section>

      <div className="largura gutter grid gap-14 pt-12">
        {/* Registro: quem validou, quando e com quais fontes */}
        <footer className="grid items-start gap-4 md:grid-cols-2">
          <Bloco titulo="Registro da ficha" nivel="h2">
            <dl className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1.5">
              <dt className="text-suave">Tombo</dt><dd className="tabular-nums">{tombo(planta.tombo)}</dd>
              <dt className="text-suave">Validado por</dt>
              <dd>{planta.validacoes.length ? planta.validacoes.map((v) => `${v.nome} (${v.area}, ${data(v.data)})`).join('; ') : 'Aguardando validação'}</dd>
              <dt className="text-suave">Atualizado em</dt><dd>{data(planta.atualizadoEm)}</dd>
            </dl>
            <p className="nota mt-2">Conteúdo educativo. Dúvidas sobre saúde ou uso de plantas medicinais devem ser levadas a um profissional habilitado.</p>
          </Bloco>
          {planta.fontes.length > 0 && (
            <Bloco titulo="Fontes" nivel="h2">
              <ul className="grid gap-2 text-sm">
                {planta.fontes.map((f) => (
                  <li key={f.titulo}>
                    {f.url ? <a href={f.url}>{f.titulo}</a> : f.titulo}
                    {f.consultadoEm && <span className="text-suave"> Consultado em {data(f.consultadoEm)}.</span>}
                  </li>
                ))}
              </ul>
            </Bloco>
          )}
        </footer>

        {vizinhas.length > 0 && canteiro && (
          <section aria-labelledby="t-vizinhas" className="grid gap-4">
            <h2 id="t-vizinhas" className="titulo-secao">Também no canteiro {canteiro.numero}</h2>
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
