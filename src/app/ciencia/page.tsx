import type { Metadata } from 'next'
import Link from 'next/link'
import { AvisoExemplo } from '@/components/AvisoExemplo'
import { Icone, type NomeIcone } from '@/components/Icone'
import { Selo } from '@/components/Selo'
import type { NivelEvidencia } from '@/lib/tipos'

export const metadata: Metadata = {
  title: 'Ciência e aplicações',
  description:
    'Como ler o que se diz sobre plantas: uso popular, hipótese, evidência e uso reconhecido. E como Psicologia, Biomedicina e Farmácia estudam a horta.',
}

const consulta = '17/11/2026'

/** Do saber popular ao uso reconhecido: a ordem é o próprio conteúdo. */
const caminho: { nivel: NivelEvidencia; significa: string; exemplo: string; naoSignifica: string }[] = [
  {
    nivel: 'popular',
    significa: 'Um uso passado de geração em geração, nas famílias e comunidades.',
    exemplo: '"Minha avó fazia chá de camomila para dormir."',
    naoSignifica: 'Não quer dizer que funciona, nem que não funciona. Ainda não foi testado com método científico.',
  },
  {
    nivel: 'hipotese',
    significa: 'Uma pergunta que pesquisadores estão investigando, a partir do uso popular ou de estudos iniciais.',
    exemplo: '"Será que o aroma do alecrim influencia a memória?"',
    naoSignifica: 'Não é conclusão. Os estudos ainda são poucos, pequenos ou têm resultados diferentes entre si.',
  },
  {
    nivel: 'evidencia_cientifica',
    significa: 'Há estudos publicados, feitos com método, que sustentam a informação.',
    exemplo: 'Pesquisas que repetem o teste em vários grupos e chegam a resultados parecidos.',
    naoSignifica: 'Não autoriza o uso por conta própria. Dose, forma de preparo e segurança ainda importam.',
  },
  {
    nivel: 'uso_reconhecido',
    significa: 'Um órgão oficial, como a Anvisa, reconhece o uso e define como preparar e por quanto tempo usar.',
    exemplo: 'Plantas que constam no Formulário de Fitoterápicos da Farmacopeia Brasileira.',
    naoSignifica: 'Não quer dizer que serve para todo mundo. Há contraindicações e interações com medicamentos.',
  },
]

const cursos: { curso: string; icone: NomeIcone; pergunta: string; estuda: string[]; disponivel: boolean; link?: string }[] = [
  {
    curso: 'Psicologia',
    icone: 'aroma',
    pergunta: 'O que essa planta desperta nas pessoas?',
    estuda: ['Percepção, atenção e memória', 'Emoções e bem-estar, sem promessa terapêutica', 'Atividades educativas e sensoriais'],
    disponivel: true,
    link: '/sentidos',
  },
  {
    curso: 'Biomedicina',
    icone: 'frasco',
    pergunta: 'Do que essa planta é feita?',
    estuda: ['Composição e substâncias conhecidas', 'Pesquisas disponíveis e seus limites', 'Métodos de análise em laboratório'],
    disponivel: false,
  },
  {
    curso: 'Farmácia',
    icone: 'livro',
    pergunta: 'Como ela pode ser usada com segurança?',
    estuda: [
      'Usos reconhecidos e partes utilizadas',
      'Formas de preparo, contraindicações e interações',
      'Controle de qualidade e desenvolvimento de produtos',
    ],
    disponivel: false,
  },
]

const metodos = [
  {
    titulo: 'Identificar a espécie certa',
    texto:
      'Plantas diferentes podem ter o mesmo nome popular, e espécies parecidas podem ser confundidas. Por isso a ciência usa o nome científico, e o controle de qualidade começa por confirmar que a planta é mesmo a que se diz.',
  },
  {
    titulo: 'Extrair',
    texto:
      'Para estudar o que há dentro da folha, é preciso separar suas substâncias. O óleo essencial de plantas aromáticas, por exemplo, costuma ser obtido por destilação com vapor de água.',
  },
  {
    titulo: 'Separar e analisar',
    texto:
      'Técnicas como a cromatografia separam as substâncias de uma mistura para identificar quais estão presentes e em que quantidade.',
  },
  {
    titulo: 'Testar com método',
    texto:
      'Um efeito só passa a ter evidência quando é testado com grupos de comparação, repetido e publicado, para que outros pesquisadores possam conferir.',
  },
]

const fontes = [
  {
    titulo: 'Anvisa. Formulário de Fitoterápicos da Farmacopeia Brasileira, 2ª edição.',
    url: 'https://www.gov.br/anvisa/pt-br/assuntos/farmacopeia/formulario-fitoterapico',
  },
  {
    titulo: 'Brasil. Política Nacional de Plantas Medicinais e Fitoterápicos (Decreto nº 5.813, de 22 de junho de 2006).',
    url: 'https://www.planalto.gov.br/ccivil_03/_ato2004-2006/2006/decreto/d5813.htm',
  },
  {
    titulo: 'Ministério da Saúde. Relação Nacional de Plantas Medicinais de Interesse ao SUS (RENISUS), 2009.',
  },
]

export default function Ciencia() {
  return (
    <div className="largura gutter grid gap-16 py-12">
      <header className="cabecalho-pagina">
        <h1 className="titulo-pagina">Ciência e aplicações</h1>
        <p className="subtitulo">
          Sobre plantas medicinais circula muita coisa: receitas de família, promessas na internet, pesquisas sérias. Esta
          estação ajuda a separar uma coisa da outra e mostra como os cursos estudam as plantas da horta.
        </p>
        <AvisoExemplo area="Biomedicina e Farmácia" />
      </header>

      {/* Do popular ao reconhecido */}
      <section aria-labelledby="t-caminho" className="grid gap-6">
        <div className="leitura grid gap-2">
          <h2 id="t-caminho">Do saber popular ao uso reconhecido</h2>
          <p className="subtitulo-secao">
            Toda informação de uso neste site leva um destes quatro selos. Eles mostram em que ponto do caminho aquela
            informação está.
          </p>
        </div>
        <ol className="grid gap-0">
          {caminho.map((c, i) => (
            <li key={c.nivel} className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-4">
              <div className="flex flex-col items-center" aria-hidden="true">
                <span className="grid size-10 place-items-center rounded-full border-2 border-ciencia font-bold text-ciencia">{i + 1}</span>
                {i < caminho.length - 1 && <span className="w-0.5 flex-1 bg-linha" />}
              </div>
              <div className={`bloco mb-4 !gap-3 ${i < caminho.length - 1 ? '' : 'mb-0'}`}>
                <div>
                  <Selo nivel={c.nivel} />
                </div>
                <p className="text-lg">{c.significa}</p>
                <p className="text-suave">{c.exemplo}</p>
                <p className="leitura rounded bg-papel px-4 py-2 text-sm">
                  <span className="font-bold">O que não significa: </span>
                  {c.naoSignifica}
                </p>
              </div>
            </li>
          ))}
        </ol>
        <p className="leitura">
          Quer testar? Em <Link href="/jogos/mitos-e-verdades">Mitos e verdades</Link>, você decide o que é mito, verdade ou
          verdade só em parte.
        </p>
      </section>

      {/* Três cursos */}
      <section aria-labelledby="t-cursos" className="grid gap-6">
        <div className="leitura grid gap-2">
          <h2 id="t-cursos">Uma planta, três olhares</h2>
          <p className="subtitulo-secao">Cada curso faz uma pergunta diferente sobre a mesma espécie.</p>
        </div>
        <ul className="grid gap-5 md:grid-cols-3">
          {cursos.map((c) => (
            <li key={c.curso} className={`grid content-start gap-3 rounded-md border bg-superficie p-5 ${c.disponivel ? 'border-linha' : 'border-dashed border-linha'}`}>
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2 font-titulo text-xl">
                  <Icone nome={c.icone} className="size-6 text-ciencia" />
                  {c.curso}
                </span>
                <span className={`selo ${c.disponivel ? 'selo-uso_reconhecido' : 'selo-popular'} !border-[1.5px] !text-xs`}>
                  {c.disponivel ? 'Disponível' : 'Próximo semestre'}
                </span>
              </div>
              <p className="font-bold">{c.pergunta}</p>
              <ul className="grid list-disc gap-1 pl-5 text-suave marker:text-ciencia">
                {c.estuda.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
              {c.link && (
                <Link href={c.link} className="mt-1 flex min-h-11 items-center gap-2 font-bold no-underline hover:underline">
                  Ir para a estação Sentidos
                </Link>
              )}
            </li>
          ))}
        </ul>
        <p className="nota leitura">
          A ficha de cada planta já tem espaço reservado para Biomedicina, Farmácia e Alertas de segurança. Quando as equipes
          entrarem, o conteúdo aparece sem mudar o sistema.
        </p>
      </section>

      {/* Como a ciência estuda */}
      <section aria-labelledby="t-metodos" className="grid gap-6">
        <div className="leitura grid gap-2">
          <h2 id="t-metodos">Como a ciência estuda uma planta</h2>
          <p className="subtitulo-secao">
            O aroma de uma hortelã vem de óleos guardados em glândulas minúsculas na superfície da folha. Plantas produzem
            substâncias assim para se defender e atrair polinizadores, e são elas que interessam aos laboratórios.
          </p>
        </div>
        <dl className="grid items-start gap-4 md:grid-cols-2">
          {metodos.map((m) => (
            <div key={m.titulo} className="bloco">
              <dt className="bloco-titulo">{m.titulo}</dt>
              <dd>{m.texto}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Segurança */}
      <section aria-labelledby="t-seguranca" className="grid gap-4 rounded-md bg-ciencia p-6 text-sobre-folha sm:p-8">
        <h2 id="t-seguranca">Natural não quer dizer inofensivo</h2>
        <ul className="leitura grid list-disc gap-2 pl-5">
          <li>Plantas medicinais têm substâncias ativas e podem causar efeitos indesejados.</li>
          <li>Algumas interagem com medicamentos, e nem toda planta é segura na gravidez ou para crianças.</li>
          <li>Nada da horta deve ser provado sem orientação de um responsável pelo laboratório.</li>
          <li>Dúvidas sobre saúde ou tratamento devem ser levadas a um profissional habilitado.</li>
        </ul>
      </section>

      {/* No Brasil */}
      <section aria-labelledby="t-brasil" className="bloco leitura">
        <h2 id="t-brasil" className="bloco-titulo !text-[1.5rem]">Plantas medicinais no Brasil</h2>
        <p>
          Desde 2006, o Brasil tem uma Política Nacional de Plantas Medicinais e Fitoterápicos, que busca garantir o uso
          seguro dessas plantas e valorizar o conhecimento tradicional. O Ministério da Saúde mantém uma lista de espécies
          de interesse para o SUS, a RENISUS, e a Anvisa publica o Formulário de Fitoterápicos, com modo de preparo e
          cuidados de cada planta reconhecida.
        </p>
      </section>

      <footer className="leitura grid gap-2 border-t border-linha pt-8">
        <h2 className="bloco-titulo">Fontes</h2>
        <ul className="grid gap-2 text-sm">
          {fontes.map((f) => (
            <li key={f.titulo}>
              {f.url ? <a href={f.url}>{f.titulo}</a> : f.titulo} <span className="text-suave">Consultado em {consulta}.</span>
            </li>
          ))}
        </ul>
      </footer>
    </div>
  )
}
