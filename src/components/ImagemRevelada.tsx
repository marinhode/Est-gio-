'use client'

import Image, { type ImageProps } from 'next/image'
import { useCallback, useState } from 'react'

/**
 * next/image que entra com fade e um zoom leve ao terminar de carregar.
 * Se a foto já estava no cache (carregou antes do React), aparece direto, sem ficar invisível.
 */
export function ImagemRevelada({ className = '', onLoad, alt, ...props }: ImageProps) {
  const [carregada, setCarregada] = useState(false)
  const verificar = useCallback((img: HTMLImageElement | null) => {
    if (img?.complete && img.naturalWidth > 0) setCarregada(true)
  }, [])
  return (
    <Image
      {...props}
      alt={alt}
      ref={verificar}
      className={`revela ${className}`}
      data-carregada={carregada}
      onLoad={(e) => {
        setCarregada(true)
        onLoad?.(e)
      }}
    />
  )
}
