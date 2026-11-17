/** Marca conteúdo provisório, ainda não validado pela área responsável. */
export function AvisoExemplo({ area = 'Psicologia' }: { area?: string }) {
  return (
    <p className="nota flex items-start gap-2 rounded border border-dashed border-linha px-3 py-2">
      <span aria-hidden="true">✎</span>
      <span>Texto provisório, aguardando revisão da equipe de {area}.</span>
    </p>
  )
}
