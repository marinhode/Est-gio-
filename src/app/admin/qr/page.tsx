import { headers } from 'next/headers'
import QRCode from 'qrcode'
import { Suspense } from 'react'
import { BotaoImprimir } from '@/components/admin/BotaoImprimir'
import { Migalha } from '@/components/admin/Migalha'
import { canteirosDoPainel, plantasDoPainel } from '@/lib/admin'
import { exigirEditor } from '@/lib/auth'

/** Endereço público do site: variável de ambiente ou o próprio domínio acessado. */
async function enderecoDoSite() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')
  const h = await headers()
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'localhost:3000'
  const protocolo = h.get('x-forwarded-proto') ?? (host.startsWith('localhost') ? 'http' : 'https')
  return `${protocolo}://${host}`
}

async function Placas() {
  await exigirEditor()
  const [plantas, canteiros, site] = await Promise.all([plantasDoPainel(), canteirosDoPainel(), enderecoDoSite()])
  const publicadas = plantas.filter((p) => p.publicado)
  const placas = await Promise.all(
    publicadas.map(async (p) => {
      const url = `${site}/p/${p.slug}`
      const svg = await QRCode.toString(url, { type: 'svg', margin: 0, errorCorrectionLevel: 'M', color: { dark: '#000000', light: '#ffffff' } })
      return { planta: p, url, svg, canteiro: canteiros.find((c) => c.id === p.canteiroId) }
    }),
  )

  return (
    <>
      <p className="nota nao-imprimir">
        {placas.length} placas, uma para cada planta publicada. Os códigos apontam para <strong>{site}</strong>. Antes de imprimir de
        verdade, abra este painel pelo endereço definitivo do site, para os códigos usarem esse endereço.
      </p>
      <ul className="placas">
        {placas.map(({ planta, url, svg, canteiro }) => (
          <li key={planta.slug} className="placa">
            <p className="placa-lab">Laboratório Sensorial, UniCatólica</p>
            <p className="placa-nome">{planta.nomePopular}</p>
            <p className="placa-cientifico"><em>{planta.nomeCientifico}</em></p>
            {canteiro && <p className="placa-canteiro">Canteiro {canteiro.numero}</p>}
            <div className="placa-qr" role="img" aria-label={`QR Code para a ficha de ${planta.nomePopular}`} dangerouslySetInnerHTML={{ __html: svg }} />
            <p className="placa-convite">Aponte a câmera do celular e descubra esta planta com todos os sentidos</p>
            <p className="placa-url">{url.replace(/^https?:\/\//, '')}</p>
          </li>
        ))}
      </ul>
    </>
  )
}

export default function PaginaQr() {
  return (
    <div className="grid gap-6">
      <div className="nao-imprimir grid gap-4">
        <Migalha itens={[{ href: '/admin', rotulo: 'Painel' }]} />
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h1>Placas com QR Code</h1>
          <BotaoImprimir />
        </div>
      </div>
      <Suspense fallback={<p className="text-suave">Gerando as placas…</p>}>
        <Placas />
      </Suspense>
    </div>
  )
}
