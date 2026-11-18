import { headers } from 'next/headers'
import Link from 'next/link'
import QRCode from 'qrcode'
import { Suspense } from 'react'
import type { Canteiro, Planta } from '@/lib/tipos'

/** QR real da placa, apontando para o endereço curto no domínio acessado. */
async function QrDaPlaca({ slug }: { slug: string }) {
  const h = await headers()
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'localhost:3000'
  const protocolo = h.get('x-forwarded-proto') ?? (host.startsWith('localhost') ? 'http' : 'https')
  const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? `${protocolo}://${host}`
  const svg = await QRCode.toString(`${base}/p/${slug}`, { type: 'svg', margin: 0, errorCorrectionLevel: 'M', color: { dark: '#000000', light: '#ffffff' } })
  return <div className="placa-qr-img" dangerouslySetInnerHTML={{ __html: svg }} />
}

/**
 * A placa fincada no canteiro, como o visitante a encontra na horta:
 * chapa esmaltada com nome, nome científico e QR Code, presa a uma estaca.
 */
export function PlacaCanteiro({ planta, canteiro }: { planta: Planta; canteiro: Canteiro | null }) {
  return (
    <div className="placa-cena">
      <Link href={`/plantas/${planta.slug}`} transitionTypes={['nav-forward']} className="placa-chapa">
        {canteiro && <span className="placa-numero" aria-hidden="true">{canteiro.numero}</span>}
        <span className="placa-colecao">Laboratório Sensorial</span>
        <span className="placa-nome-popular">{planta.nomePopular}</span>
        <em className="placa-nome-cientifico">{planta.nomeCientifico}</em>
        <span className="placa-codigo" aria-hidden="true">
          <Suspense fallback={<span className="placa-qr-img placa-qr-vazio" />}>
            <QrDaPlaca slug={planta.slug} />
          </Suspense>
        </span>
        <span className="placa-instrucao">Aponte a câmera do celular</span>
        <span className="sr-only">, ou toque para abrir a ficha</span>
      </Link>
      <span className="placa-estaca" aria-hidden="true" />
      <span className="placa-solo" aria-hidden="true" />
    </div>
  )
}
