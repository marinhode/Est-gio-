import Link from 'next/link'

export function Rodape() {
  return (
    <footer className="mt-20 border-t border-linha bg-superficie">
      <div className="largura gutter grid gap-6 py-10 md:grid-cols-[2fr_1fr]">
        <div className="grid gap-3">
          <p className="font-titulo text-lg">Laboratório Sensorial Interativo</p>
          <p className="nota leitura">
            Um projeto da UniCatólica com os cursos de Psicologia, Biomedicina, Farmácia e Engenharia de Software.
          </p>
          <p className="nota leitura">
            Este conteúdo é educativo. Dúvidas sobre saúde ou uso de plantas medicinais devem ser levadas a um profissional habilitado.
          </p>
        </div>
        <ul className="grid content-start gap-2">
          <li><Link href="/mapa">Mapa da horta</Link></li>
          <li><Link href="/acessibilidade">Acessibilidade</Link></li>
        </ul>
      </div>
    </footer>
  )
}
