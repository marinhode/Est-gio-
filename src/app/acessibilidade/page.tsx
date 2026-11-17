import type { Metadata } from 'next'
import Link from 'next/link'
import { AjustesLeitura } from '@/components/AjustesLeitura'
import { Icone } from '@/components/Icone'

export const metadata: Metadata = {
  title: 'Acessibilidade',
  description: 'Como usar o Laboratório Sensorial com teclado, leitor de tela, letra maior e alto contraste.',
}

/** Atualizar a cada nova auditoria (ver docs/acessibilidade.md). */
const auditoria = {
  data: '17/11/2026',
  paginas: 17,
  combinacoes: 'tema claro, tema escuro e alto contraste',
  falhas: 0,
}

const teclas = [
  { tecla: 'Tab', acao: 'Vai para o próximo link, botão ou campo' },
  { tecla: 'Shift + Tab', acao: 'Volta para o item anterior' },
  { tecla: 'Enter', acao: 'Abre um link ou aciona um botão' },
  { tecla: 'Espaço', acao: 'Aciona botões e marca opções' },
  { tecla: 'Esc', acao: 'Fecha o painel de ajustes de leitura' },
]

const recursos = [
  {
    titulo: 'Leitores de tela',
    itens: [
      'Títulos organizados em níveis, para navegar pela estrutura da página.',
      'Regiões identificadas: cabeçalho, estações, conteúdo principal e rodapé.',
      'Atividades e jogos avisam cada passo, o tempo concluído e o resultado de cada resposta.',
      'Imagens com texto alternativo; ícones decorativos ficam ocultos para não poluir a leitura.',
    ],
  },
  {
    titulo: 'Cores e contraste',
    itens: [
      'Todo texto tem contraste de pelo menos 4,5:1 com o fundo, como pede a WCAG nível AA.',
      'Nenhuma informação depende só da cor: selos de evidência e respostas dos jogos também usam ícone e texto.',
      'O site acompanha o tema claro ou escuro do seu aparelho.',
    ],
  },
  {
    titulo: 'Movimento e tempo',
    itens: [
      'Se o seu aparelho pede menos movimento, as animações são desligadas.',
      'Nada avança sozinho: nas atividades com cronômetro, você decide quando seguir e pode pausar.',
    ],
  },
  {
    titulo: 'Toque e leitura',
    itens: [
      'Botões e links com área de toque de pelo menos 44 pixels.',
      'Texto base de 18 pixels, com a fonte Atkinson Hyperlegible Next, criada pelo Braille Institute para pessoas com baixa visão.',
      'Áudios e vídeos terão sempre transcrição ou legenda.',
    ],
  },
]

const limitacoes = [
  'O mapa da horta ainda é esquemático e as paradas do tour ainda não têm fotos. O tour já tem uma versão em lista, que não depende de imagens.',
  'Parte dos textos é provisória e ainda será revisada pelas equipes dos cursos.',
  'A verificação automática encontra só uma parte dos problemas. Uma revisão manual com teclado e leitor de tela está prevista antes da entrega.',
]

export default function Acessibilidade() {
  return (
    <div className="largura gutter grid gap-12 py-12">
      <header className="leitura grid gap-4">
        <p className="flex items-center gap-2 font-bold text-azul">
          <Icone nome="ok" />
          Acessibilidade
        </p>
        <h1 className="text-[2.3rem] sm:text-[2.8rem]">Um laboratório para todas as pessoas</h1>
        <p className="text-lg">
          A horta é para ser sentida de muitos jeitos, e o site também. Ele foi construído seguindo a WCAG 2.2, nível AA, a
          referência internacional de acessibilidade para a web, em computadores e celulares.
        </p>
      </header>

      <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)]">
        <div className="grid gap-12">
          {/* Ajustes */}
          <section aria-labelledby="t-ajustes" className="leitura grid gap-4">
            <h2 id="t-ajustes">Ajustes de leitura</h2>
            <p>
              Ligue aqui ou pelo botão <span className="font-titulo">Aa</span> no topo de qualquer página. A escolha fica salva
              neste aparelho.
            </p>
            <AjustesLeitura />
          </section>

          {/* Teclado */}
          <section aria-labelledby="t-teclado" className="leitura grid gap-4">
            <h2 id="t-teclado">Navegar pelo teclado</h2>
            <p>
              Todo o site funciona sem mouse. Ao apertar Tab pela primeira vez, aparece o link &quot;Pular para o
              conteúdo&quot;, que leva direto ao assunto da página.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <caption className="sr-only">Teclas e o que cada uma faz</caption>
                <thead>
                  <tr className="border-b-2 border-linha">
                    <th scope="col" className="py-2 pr-4">Tecla</th>
                    <th scope="col" className="py-2">O que faz</th>
                  </tr>
                </thead>
                <tbody>
                  {teclas.map((t) => (
                    <tr key={t.tecla} className="border-b border-linha align-top">
                      <td className="py-3 pr-4 whitespace-nowrap">
                        <kbd className="rounded border border-linha bg-superficie px-2 py-0.5 font-texto text-sm font-bold">{t.tecla}</kbd>
                      </td>
                      <td className="py-3">{t.acao}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Recursos */}
          <section aria-labelledby="t-recursos" className="leitura grid gap-6">
            <h2 id="t-recursos">O que o site oferece</h2>
            {recursos.map((r) => (
              <div key={r.titulo} className="grid gap-2">
                <h3>{r.titulo}</h3>
                <ul className="grid list-disc gap-1.5 pl-5 marker:text-azul">
                  {r.itens.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          {/* Limitações */}
          <section aria-labelledby="t-limites" className="leitura grid gap-3">
            <h2 id="t-limites">O que ainda falta</h2>
            <p>Preferimos ser claros sobre o que ainda não está pronto:</p>
            <ul className="grid list-disc gap-1.5 pl-5 marker:text-azul">
              {limitacoes.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </section>
        </div>

        {/* Verificação */}
        <aside aria-labelledby="t-verificacao" className="grid gap-3 rounded-md border-2 border-azul bg-superficie p-6 lg:sticky lg:top-24">
          <h2 id="t-verificacao" className="text-[1.3rem]">Última verificação</h2>
          <p className="font-titulo text-[2.6rem] leading-none text-azul">
            {auditoria.falhas === 0 ? 'Nenhuma falha' : `${auditoria.falhas} falhas`}
          </p>
          <p>
            encontrada pela ferramenta automática axe-core em {auditoria.paginas} páginas, nos modos {auditoria.combinacoes},
            seguindo as regras da WCAG 2.2 AA.
          </p>
          <p className="nota">Verificado em {auditoria.data}.</p>
        </aside>
      </div>

      <section aria-labelledby="t-barreira" className="leitura grid gap-3 border-t border-linha pt-8">
        <h2 id="t-barreira" className="text-[1.4rem]">Encontrou uma barreira?</h2>
        <p>
          Se alguma parte do site for difícil de usar, conte para a equipe do Laboratório Sensorial durante a sua visita.
          Toda dificuldade relatada ajuda a melhorar o laboratório para todos.
        </p>
        <p>
          <Link href="/">Voltar ao início</Link>
        </p>
      </section>
    </div>
  )
}
