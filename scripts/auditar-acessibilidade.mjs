/**
 * Auditoria automática de acessibilidade (axe-core, regras WCAG 2.2 A/AA + boas práticas).
 * Percorre as páginas nos temas claro e escuro, com e sem alto contraste, incluindo
 * estados interativos (jogo respondido, atividade em andamento).
 *
 * Uso: com o site rodando (npm run build && npm start), execute
 *   BASE=http://localhost:3000 npm run a11y
 * Requer o Playwright com Chromium instalado na máquina.
 */
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
// require (e não import) para achar também um Playwright instalado globalmente
const { chromium } = require('playwright')
const axe = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8')
const BASE = process.env.BASE || 'http://localhost:3000'
const REGRAS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice']

const rotas = [
  '/', '/sentidos', '/sentidos/memoria-olfativa', '/sentidos/atencao-plena', '/sentidos/diario',
  '/jogos', '/jogos/mitos-e-verdades', '/tour', '/plantas', '/ciencia', '/comunidade', '/mapa', '/acessibilidade',
  '/admin/entrar', '/plantas/hortela', '/tour/3', '/tour/lista',
]

// Estados interativos que também precisam ser verificados
const acoes = {
  '/jogos/mitos-e-verdades': async (p) => {
    await p.click('button:has-text("Jogar")')
    await p.click('button.alternativa >> nth=1')
  },
  '/sentidos/atencao-plena': (p) => p.click('button:has-text("Começar")'),
  '/acessibilidade': (p) => p.click('button[role="switch"] >> nth=0'),
  '/tour/3': (p) => p.click('button.chip:has-text("Hortelã")'),
  '/plantas': (p) => p.fill('#busca', 'hortelã'),
}

const navegador = await chromium.launch()
let falhas = 0

for (const tema of ['light', 'dark']) {
  for (const contraste of [false, true]) {
    const ctx = await navegador.newContext({ viewport: { width: 390, height: 844 }, colorScheme: tema })
    if (contraste) await ctx.addInitScript(() => localStorage.setItem('ls-contraste', '1'))
    for (const rota of rotas) {
      const p = await ctx.newPage()
      await p.goto(BASE + rota)
      await p.waitForTimeout(250)
      await acoes[rota]?.(p)
      await p.waitForTimeout(700) // espera as animações terminarem antes de medir contraste
      await p.addScriptTag({ content: axe })
      const { violations } = await p.evaluate((regras) => window.axe.run(document, { runOnly: { type: 'tag', values: regras } }), REGRAS)
      for (const v of violations) {
        falhas++
        console.log(`[${tema}${contraste ? ' + alto contraste' : ''}] ${rota} · ${v.impact} · ${v.id}: ${v.help}`)
        for (const n of v.nodes.slice(0, 3)) console.log('   ', n.target.join(' '))
      }
      await p.close()
    }
    await ctx.close()
  }
}

await navegador.close()
console.log(falhas ? `${falhas} falha(s) encontrada(s)` : `Nenhuma falha encontrada em ${rotas.length} páginas × 4 modos`)
process.exit(falhas ? 1 : 0)
