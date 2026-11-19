import type { Metadata, Viewport } from 'next'
import { Atkinson_Hyperlegible_Next, Young_Serif } from 'next/font/google'
import { Suspense } from 'react'
import { BarraEstacoes, BarraEstacoesBase } from '@/components/BarraEstacoes'
import { Cabecalho, CabecalhoBase } from '@/components/Cabecalho'
import { Rodape } from '@/components/Rodape'
import './globals.css'

// Só o subconjunto 'latin': cobre todos os acentos e o ç do português
const fonteTexto = Atkinson_Hyperlegible_Next({
  subsets: ['latin'],
  style: 'normal',
  variable: '--fonte-texto',
  fallback: ['Segoe UI', 'system-ui', 'sans-serif'],
  adjustFontFallback: false,
})

// Itálico só aparece nos nomes científicos: carrega quando usado, sem preload
const fonteItalico = Atkinson_Hyperlegible_Next({
  subsets: ['latin'],
  style: 'italic',
  variable: '--fonte-italico',
  preload: false,
  fallback: ['Segoe UI', 'system-ui', 'sans-serif'],
  adjustFontFallback: false,
})

const fonteTitulo = Young_Serif({
  subsets: ['latin'],
  weight: '400',
  variable: '--fonte-titulo',
})

export const metadata: Metadata = {
  title: {
    default: 'Laboratório Sensorial Interativo, UniCatólica',
    template: '%s, Laboratório Sensorial',
  },
  description:
    'Plataforma educativa da horta do Laboratório Sensorial da UniCatólica: plantas, experiências sensoriais e ciência.',
}

export const viewport: Viewport = {
  themeColor: '#23409A',
}

/** Aplica as preferências de leitura salvas antes da primeira pintura (sem piscar). */
const preferencias = `(function(){try{var d=document.documentElement;if(localStorage.getItem("ls-letra")==="1")d.setAttribute("data-letra","grande");if(localStorage.getItem("ls-contraste")==="1")d.setAttribute("data-contraste","alto")}catch(e){}})()`

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="pt-BR" className={`${fonteTexto.variable} ${fonteItalico.variable} ${fonteTitulo.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: preferencias }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <a href="#conteudo" className="pular">
          Pular para o conteúdo
        </a>
        <Suspense fallback={<CabecalhoBase caminho="" />}>
          <Cabecalho />
        </Suspense>
        <Suspense fallback={<BarraEstacoesBase caminho="" />}>
          <BarraEstacoes />
        </Suspense>
        <main id="conteudo" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <Rodape />
      </body>
    </html>
  )
}
