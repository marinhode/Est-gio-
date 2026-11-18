/**
 * Ilustração de apoio, no traço das pranchas de herbário: um ramo com folhas opostas.
 * Com `semente` (o endereço da planta), cada espécie ganha um ramo próprio e estável:
 * muda o número de pares de folhas, o formato delas, a curvatura do caule e se há botões de flor.
 */
function hash(texto: string) {
  let h = 2166136261
  for (let i = 0; i < texto.length; i++) h = Math.imul(h ^ texto.charCodeAt(i), 16777619)
  return h >>> 0
}

export function RamoBotanico({ className = '', semente = 'hortela' }: { className?: string; semente?: string }) {
  const h = hash(semente)
  const pares = 3 + (h % 3) // 3 a 5 pares
  const alongamento = 0.32 + ((h >> 3) % 5) * 0.06 // folha larga a estreita
  const curva = ((h >> 7) % 7) - 3 // caule inclinado para um lado ou outro
  const flores = (h >> 11) % 3 === 0
  const topo = 24
  const base = 214
  const passo = (base - topo - 20) / pares

  const folhas = Array.from({ length: pares }, (_, i) => {
    const y = base - 30 - i * passo
    const tamanho = 34 - i * (16 / pares)
    const angulo = 22 + i * 5
    const xCaule = 100 + curva * (1 - (y - topo) / (base - topo)) * 6
    return [
      { cx: xCaule - tamanho * 0.85, cy: y, rx: tamanho, ry: tamanho * alongamento, rot: -angulo },
      { cx: xCaule + tamanho * 0.85, cy: y - passo * 0.25, rx: tamanho, ry: tamanho * alongamento, rot: angulo },
    ]
  }).flat()

  const xTopo = 100 + curva * 6
  return (
    <svg viewBox="0 0 200 220" aria-hidden="true" focusable="false" className={className}>
      <path
        className="ramo-caule"
        d={`M100 ${base} C100 ${base - 60} ${100 + curva * 4} ${topo + 70} ${xTopo} ${topo}`}
        fill="none"
        stroke="var(--folha)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <g fill="color-mix(in srgb, var(--folha) 20%, transparent)" stroke="var(--folha)" strokeWidth="2">
        {folhas.map((f, i) => (
          // Folhas brotam de baixo para cima: o índice define o atraso da animação
          <g key={i} className="ramo-folha" style={{ '--i': Math.floor(i / 2) } as React.CSSProperties}>
            <ellipse cx={f.cx} cy={f.cy} rx={f.rx} ry={f.ry} transform={`rotate(${f.rot} ${f.cx} ${f.cy})`} />
          </g>
        ))}
        {flores &&
          [-9, 0, 9].map((dx, i) => (
            <g key={`flor-${i}`} className="ramo-folha" style={{ '--i': pares + i } as React.CSSProperties}>
              <circle cx={xTopo + dx} cy={topo + 4 - Math.abs(dx) * 0.4} r="5" fill="color-mix(in srgb, var(--lavanda) 30%, transparent)" stroke="var(--lavanda)" />
            </g>
          ))}
      </g>
    </svg>
  )
}
