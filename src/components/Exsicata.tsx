import { ImagemRevelada } from '@/components/ImagemRevelada'
import { RamoBotanico } from '@/components/RamoBotanico'
import type { Canteiro, Planta } from '@/lib/tipos'

/** "LSI 0004": número de tombo no formato dos herbários (sigla da coleção + número). */
export const tombo = (n?: number) => (n ? `LSI ${String(n).padStart(4, '0')}` : 'LSI sem número')

/**
 * A planta apresentada como exsicata: o espécime preso à folha de herbário por fitas,
 * com a etiqueta da coleção no canto. Na versão "mini" (catálogo), a etiqueta resume.
 */
export function Exsicata({ planta, canteiro, mini = false, prioridade = false }: {
  planta: Planta
  canteiro?: Canteiro | null
  mini?: boolean
  prioridade?: boolean
}) {
  return (
    <figure className={`exsicata ${mini ? 'exsicata-mini' : ''}`}>
      <div className="exsicata-especime">
        <span className="fita fita-a" aria-hidden="true" />
        <span className="fita fita-b" aria-hidden="true" />
        {planta.imagem ? (
          <ImagemRevelada
            src={planta.imagem.src}
            alt={mini ? '' : planta.imagem.alt}
            fill
            sizes={mini ? '(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw' : '(min-width: 768px) 45vw, 92vw'}
            className="object-cover"
            priority={prioridade}
          />
        ) : (
          <RamoBotanico className="exsicata-ramo" semente={planta.slug} />
        )}
      </div>
      <figcaption className="etiqueta-herbario">
        <span className="etiqueta-tombo">{tombo(planta.tombo)}</span>
        {mini ? (
          <>
            <span className="etiqueta-nome">{planta.nomePopular}</span>
            <em>{planta.nomeCientifico}</em>
          </>
        ) : (
          <>
            <em className="etiqueta-especie">
              {planta.nomeCientifico}
              {planta.autorTaxon && <span className="not-italic"> {planta.autorTaxon}</span>}
            </em>
            <span>{planta.familia}</span>
            <span>{canteiro ? `Canteiro ${canteiro.numero}, ${canteiro.nome.toLowerCase()}` : 'Canteiro a definir'}</span>
            <span className="etiqueta-colecao">Herbário do Laboratório Sensorial, UniCatólica</span>
          </>
        )}
        {planta.imagem?.credito && !mini && <span className="etiqueta-colecao">{planta.imagem.credito}</span>}
      </figcaption>
    </figure>
  )
}
