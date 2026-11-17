# Laboratório Sensorial Interativo · UniCatólica

Plataforma educativa da horta do Laboratório Sensorial: plantas, experiências sensoriais e ciência.

## Documentação
- [docs/requisitos.md](docs/requisitos.md): requisitos do documento de orientações ([PDF](docs/referencia/orientacoes.pdf))
- [docs/conceito.md](docs/conceito.md): conceito aprovado (visão, personas, jornadas, arquitetura, identidade, escopo)
- [docs/identidade/previa.html](docs/identidade/previa.html): prévia da identidade visual
- [supabase/schema.sql](supabase/schema.sql) e [supabase/editores.sql](supabase/editores.sql): banco de dados (aplicar nessa ordem)

## Tecnologia
Next.js 16 (App Router, Cache Components) · TypeScript · Tailwind CSS 4 · Supabase · Vercel

## Rodar localmente
```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de produção
npm run lint
npm run a11y     # auditoria de acessibilidade (axe-core, WCAG 2.2 AA), com o site rodando
```

Enquanto o Supabase não estiver ligado, o site usa o conteúdo de exemplo de `src/lib/dados/exemplo.ts`.
Toda leitura de conteúdo passa por `src/lib/conteudo.ts`.

## Estrutura
```
src/app/            páginas (uma pasta por estação)
src/components/     cabeçalho, rodapé, ícones, ilustrações
src/lib/tipos.ts    modelo de dados
src/lib/conteudo.ts acesso ao conteúdo (cache + invalidação pelo painel)
```
