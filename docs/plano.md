# Laboratório Sensorial Interativo — Plano de desenvolvimento

**Stack:** Next.js (App Router, TypeScript, Tailwind) + Supabase (Postgres, Auth, Storage) · deploy na Vercel
**Equipe:** 1 dev (Engenharia de Software) · conteúdo vindo de Psicologia
**Prazo:** 1 semana

## Escopo

### Obrigatório (seção 4.1 do documento)
| # | Funcionalidade | Como vamos fazer |
|---|---|---|
| 1 | Página inicial | Apresentação, objetivos, cursos, atalhos para as 6 estações |
| 2 | Mapa da horta | SVG clicável: canteiros → plantas |
| 3 | Tour virtual | 5 paradas com foto, marcadores clicáveis, áudio/vídeo, ← → e "voltar ao mapa"; versão em lista acessível |
| 4 | Catálogo | Busca por nome popular/científico, categoria, característica, canteiro |
| 5 | Ficha interativa | 10 seções; modal com 3 caminhos: *Conheça a planta / Experiência sensorial / O que a ciência pesquisa* |
| 6 | QR Codes | Rota `/p/[slug]` + página de impressão com QR de cada planta |
| 7 | Jogos e quizzes | Quiz, Mitos e verdades, associação folha ↔ espécie, com feedback |
| 8 | Painel de conteúdo | `/admin` com login Supabase: CRUD de plantas, canteiros, tour, quizzes, projetos; upload de mídia |
| 9 | Área acadêmica | Lista de projetos, pesquisas, produtos e vídeos |
| 10 | Acessibilidade | WCAG 2.2 AA: teclado, foco visível, contraste, alt, legendas, ARIA, `prefers-reduced-motion` |

### Se sobrar tempo (4.2)
- Perguntas sensoriais abertas / diário sensorial (respostas livres, sem "certo/errado")
- Trilhas de descoberta
- Painel de métricas (acessos por QR, visitas ao tour)
- Assistente de perguntas e respostas (fora do escopo desta semana)

## Modelo de dados (rascunho)
- `canteiros` (id, nome, descricao, posição no mapa)
- `plantas` (slug, nome_popular, nome_cientifico, familia, canteiro_id, categorias[], resumo, explicacao, + um campo por seção 02–10, fontes, revisado_por, atualizado_em, publicado)
  - Seções 07 Biomedicina, 08 Farmácia e 09 Alertas ficam no schema, mas vazias até o próximo semestre
  - Usos com nível de evidência: `popular | evidencia_cientifica | uso_reconhecido | hipotese`
- `midias` (planta_id, tipo foto/audio/video, url, alt/legenda)
- `perguntas_interativas` (planta_id, texto) + `respostas_visitantes` (anônimas)
- `tour_paradas` (ordem, titulo, texto, imagem, audio, video) + `tour_marcadores` (parada_id, x, y, planta_id)
- `quizzes` / `quiz_perguntas` (tipo: multipla, mito_verdade, associacao; feedback)
- `projetos_academicos` (curso, tipo, titulo, descricao, links)

## Cronograma
| Dia | Entrega |
|---|---|
| 1 | Setup Next.js + Supabase, schema, seed com ~6 plantas de exemplo, layout base acessível |
| 2 | Página inicial, catálogo com busca, ficha da planta, rota de QR |
| 3 | Mapa da horta + tour virtual |
| 4 | Painel admin (login, CRUD, upload) |
| 5 | Quizzes/jogos, área acadêmica, perguntas interativas |
| 6 | Revisão WCAG, responsividade, deploy na Vercel |
| 7 | Margem para bugs, carga de conteúdo real, preparo da apresentação |

## Regras de conteúdo que o sistema deve reforçar
- Distinguir uso popular, evidência científica, uso reconhecido e hipótese
- Toda ficha mostra fontes, data de atualização e responsável pela revisão
- Nenhuma promessa terapêutica; aviso fixo encaminhando dúvidas clínicas a profissionais
- Perguntas sensoriais aceitam qualquer resposta
