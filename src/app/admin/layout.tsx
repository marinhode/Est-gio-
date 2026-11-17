import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Painel',
  robots: { index: false, follow: false },
}

export default function LayoutAdmin({ children }: LayoutProps<'/admin'>) {
  return <div className="largura gutter py-10">{children}</div>
}
