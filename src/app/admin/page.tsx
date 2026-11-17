import Link from 'next/link'
import { Suspense } from 'react'
import { sair } from '@/app/admin/acoes'
import { Icone, type NomeIcone } from '@/components/Icone'
import { exigirEditor } from '@/lib/auth'
import { clienteComSessao } from '@/lib/supabase/servidor'

const formatoData = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'America/Araguaina' })

async function contar(tabela: string, filtro?: [string, string]) {
  const supabase = await clienteComSessao()
  let q = supabase.from(tabela).select('*', { count: 'exact', head: true })
  if (filtro) q = q.eq(filtro[0], filtro[1])
  const { count } = await q
  return count ?? 0
}

async function Painel() {
  const editor = await exigirEditor()
  const supabase = await clienteComSessao()

  const [plantas, publicadas, respostas, qr, tour, quizzes, ultimas] = await Promise.all([
    contar('plantas'),
    contar('plantas', ['publicado', 'true']),
    contar('respostas'),
    contar('eventos', ['tipo', 'qr']),
    contar('eventos', ['tipo', 'tour']),
    contar('eventos', ['tipo', 'quiz_concluido']),
    supabase.from('respostas').select('id, pergunta, resposta, criado_em').order('criado_em', { ascending: false }).limit(8),
  ])

  const indicadores: { rotulo: string; valor: number; nota?: string }[] = [
    { rotulo: 'Plantas cadastradas', valor: plantas, nota: `${publicadas} publicadas` },
    { rotulo: 'Respostas sensoriais', valor: respostas },
    { rotulo: 'Acessos por QR Code', valor: qr },
    { rotulo: 'Visitas ao tour', valor: tour },
    { rotulo: 'Jogos concluídos', valor: quizzes },
  ]

  const conteudo: { titulo: string; icone: NomeIcone; href?: string }[] = [
    { titulo: 'Plantas e canteiros', icone: 'livro', href: '/admin/plantas' },
    { titulo: 'Paradas do tour', icone: 'tour' },
    { titulo: 'Perguntas dos jogos', icone: 'jogos', href: '/admin/jogos' },
    { titulo: 'Projetos acadêmicos', icone: 'pessoas', href: '/admin/projetos' },
    { titulo: 'Textos das estações', icone: 'aroma', href: '/admin/textos' },
  ]

  return (
    <div className="grid gap-12">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="grid gap-1">
          <p className="nota">Painel de conteúdo</p>
          <h1>Olá, {editor.nome}</h1>
        </div>
        <form action={sair}>
          <button type="submit" className="btn btn-sec">Sair</button>
        </form>
      </header>

      <section aria-labelledby="t-acompanhamento" className="grid gap-4">
        <h2 id="t-acompanhamento" className="text-[1.45rem]">Acompanhamento</h2>
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {indicadores.map((i) => (
            <div key={i.rotulo} className="grid content-start gap-1 rounded-md border border-linha bg-superficie p-4">
              <dt className="nota">{i.rotulo}</dt>
              <dd className="font-titulo text-[2.2rem] leading-none tabular-nums text-azul">{i.valor}</dd>
              {i.nota && <dd className="nota">{i.nota}</dd>}
            </div>
          ))}
        </dl>
        <p className="nota">Os números são agregados e anônimos: nenhum visitante é identificado.</p>
      </section>

      <section aria-labelledby="t-respostas" className="grid gap-4">
        <h2 id="t-respostas" className="text-[1.45rem]">Respostas mais recentes</h2>
        {ultimas.data && ultimas.data.length > 0 ? (
          <ul className="grid gap-3">
            {ultimas.data.map((r) => (
              <li key={r.id} className="grid gap-1 rounded-md border border-linha bg-superficie p-4">
                <p className="nota">{r.pergunta}</p>
                <p className="text-lg">{r.resposta}</p>
                <time dateTime={r.criado_em} className="nota">{formatoData.format(new Date(r.criado_em))}</time>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-md border border-dashed border-linha p-5 text-suave">
            Nenhuma resposta ainda. Elas aparecem aqui quando visitantes respondem às perguntas da estação Sentidos.
          </p>
        )}
      </section>

      <section aria-labelledby="t-conteudo" className="grid gap-4">
        <h2 id="t-conteudo" className="text-[1.45rem]">Conteúdo</h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {conteudo.map((c) => (
            <li key={c.titulo}>
              {c.href ? (
                <Link href={c.href} className="group flex h-full items-center gap-3 rounded-md border-2 border-linha bg-superficie p-4 text-tinta no-underline hover:border-azul">
                  <Icone nome={c.icone} className="size-6 text-azul" />
                  <span className="grid">
                    <span className="font-bold text-azul group-hover:underline">{c.titulo}</span>
                    <span className="nota">Cadastrar e editar</span>
                  </span>
                </Link>
              ) : (
                <div className="flex h-full items-center gap-3 rounded-md border border-dashed border-linha p-4">
                  <Icone nome={c.icone} className="size-6 text-suave" />
                  <span className="grid">
                    <span className="font-bold">{c.titulo}</span>
                    <span className="nota">Edição em construção</span>
                  </span>
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

export default function Admin() {
  return (
    <Suspense fallback={<p className="text-suave">Carregando o painel…</p>}>
      <Painel />
    </Suspense>
  )
}
