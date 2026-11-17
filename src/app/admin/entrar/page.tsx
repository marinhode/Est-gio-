import type { Metadata } from 'next'
import { Suspense } from 'react'
import { FormularioLogin } from '@/components/FormularioLogin'
import { Icone } from '@/components/Icone'

export const metadata: Metadata = { title: 'Entrar no painel' }

const mensagens: Record<string, string> = {
  saiu: 'Você saiu do painel.',
  'sem-acesso': 'Esta conta não tem acesso ao painel. Fale com a coordenação do laboratório.',
}

async function Aviso({ searchParams }: { searchParams: PageProps<'/admin/entrar'>['searchParams'] }) {
  const motivo = (await searchParams).motivo
  const texto = typeof motivo === 'string' ? mensagens[motivo] : undefined
  return texto ? <p role="status" className="rounded border border-linha bg-superficie px-3 py-2">{texto}</p> : null
}

export default function Entrar({ searchParams }: PageProps<'/admin/entrar'>) {
  return (
    <div className="mx-auto grid max-w-md gap-6">
      <header className="grid gap-2">
        <p className="flex items-center gap-2 font-bold text-azul">
          <Icone nome="livro" />
          Painel de conteúdo
        </p>
        <h1>Entrar</h1>
        <p className="text-suave">Área da equipe que cadastra e revisa o conteúdo do laboratório.</p>
      </header>
      <Suspense>
        <Aviso searchParams={searchParams} />
      </Suspense>
      <div className="rounded-md border border-linha bg-superficie p-6">
        <FormularioLogin />
      </div>
      <p className="nota">Não há cadastro aberto. O acesso é criado pela coordenação do laboratório.</p>
    </div>
  )
}
