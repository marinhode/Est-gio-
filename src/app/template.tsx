import { ViewTransition } from 'react'

/**
 * O template é remontado a cada navegação: o conteúdo antigo sai e o novo entra animado.
 * Links marcados com transitionTypes 'nav-forward' ou 'nav-back' deslizam na direção do percurso;
 * os demais usam a entrada padrão (sobe suavemente). Cabeçalho e barra de estações ficam parados.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition
      enter={{ 'nav-forward': 'nav-forward', 'nav-back': 'nav-back', default: 'pagina-entra' }}
      exit={{ 'nav-forward': 'nav-forward', 'nav-back': 'nav-back', default: 'pagina-sai' }}
      default="none"
    >
      <div>{children}</div>
    </ViewTransition>
  )
}
