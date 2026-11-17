import { type NextRequest, NextResponse } from 'next/server'
import { registrarEvento } from '@/lib/registro'

/**
 * Endereço curto impresso no QR Code das placas: /p/hortela.
 * Conta o acesso (anônimo) e leva para a ficha. Manter estável: placas impressas dependem dele.
 */
export async function GET(request: NextRequest, { params }: RouteContext<'/p/[slug]'>) {
  const { slug } = await params
  const limpo = slug.toLowerCase().replace(/[^a-z0-9-]/g, '')
  await registrarEvento('qr', limpo).catch(() => {})
  return NextResponse.redirect(new URL(`/plantas/${limpo}`, request.url), 307)
}
