/** Ilustração de apoio: ramo com folhas opostas, como nas pranchas de herbário. */
export function RamoBotanico({ className = '' }: { className?: string }) {
  const folhas = [
    [72, 178, 30, 13, -20], [128, 170, 30, 13, 22],
    [74, 132, 27, 12, -24], [126, 124, 27, 12, 26],
    [79, 88, 23, 10, -30], [123, 81, 23, 10, 30],
    [86, 50, 17, 8, -38], [117, 44, 17, 8, 38],
  ]
  return (
    <svg viewBox="0 0 200 220" aria-hidden="true" focusable="false" className={className}>
      <path className="ramo-caule" d="M100 215 C100 160 98 100 102 20" fill="none" stroke="var(--folha)" strokeWidth="2.5" strokeLinecap="round" />
      <g fill="color-mix(in srgb, var(--folha) 20%, transparent)" stroke="var(--folha)" strokeWidth="2">
        {folhas.map(([cx, cy, rx, ry, rot], i) => (
          // Folhas brotam de baixo para cima: o índice define o atraso da animação
          <g key={`${cx}-${cy}`} className="ramo-folha" style={{ '--i': Math.floor((folhas.length - 1 - i) / 2) } as React.CSSProperties}>
            <ellipse cx={cx} cy={cy} rx={rx} ry={ry} transform={`rotate(${rot} ${cx} ${cy})`} />
          </g>
        ))}
      </g>
    </svg>
  )
}
