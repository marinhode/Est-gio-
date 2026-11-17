# Laboratório Sensorial Interativo — Conceito

Documento construído por partes. Cada parte só avança após aprovação.

| Parte | Tema | Status |
|---|---|---|
| 1 | Visão e proposta | ✅ Aprovada |
| 2 | Públicos e personas | ✅ Aprovada |
| 3 | Jornadas | ✅ Aprovada |
| 4 | Arquitetura da informação | ✅ Aprovada |
| 5 | Identidade e tom | 🟡 Em discussão |
| 6 | Escopo final | ⏳ |

---

## Parte 1 — Visão e proposta

### Em uma frase
> Uma plataforma que transforma a horta do Laboratório Sensorial numa experiência de descoberta: cada planta é uma porta para os sentidos, para a ciência e para a convivência entre os cursos.

### O problema que resolve
- A horta física só ensina quem está lá e com alguém explicando.
- O conhecimento de Psicologia, Biomedicina e Farmácia sobre a mesma planta fica separado.
- Sobre plantas medicinais circula muita informação sem fonte e com promessas exageradas.

### Ideia central — "Uma planta, três caminhos"
Em qualquer ponto do sistema (QR, mapa, tour, catálogo), a planta se abre em:
- 🌱 **Conheça a planta**: botânica, cultivo, história
- 👃 **Explore a experiência sensorial**: aromas, texturas, memória, perguntas sem resposta certa
- 🔬 **Descubra o que a ciência pesquisa**: evidência, com o nível de confiança sempre visível

### Princípios
1. **Presencial primeiro, digital complementa.** O sistema convida a tocar, cheirar e observar, e não substitui a horta.
2. **Honestidade científica.** Cada informação mostra se é uso popular, evidência, uso reconhecido ou hipótese.
3. **Não existe sensação certa.** As respostas pessoais são acolhidas e nunca corrigidas.
4. **Acessível desde o início.** WCAG 2.2 faz parte do projeto, não é uma etapa final.
5. **Pouco e funcionando.** Menos recursos, todos sólidos.

---

## Parte 2 — Públicos e personas

| Persona | Contexto | Quer | Precisa |
|---|---|---|---|
| **Ana**, 20, estudante de outro curso | Passa pela horta e escaneia um QR | Saber rapidamente o que é a planta, achar algo curioso | Página curta, rápida, leitura em 30 s com opção de aprofundar |
| **Prof. Carlos**, professor de escola | Prepara a visita e usa o tour em sala | Roteiro pronto, quiz para a turma, conteúdo confiável | Tour guiado, jogos em grupo, linguagem para crianças e adolescentes |
| **Dona Lúcia**, 62, assistida da clínica de Psicologia | Atividade sensorial acompanhada | Viver a experiência, falar das lembranças | Letra grande, alto contraste, poucos cliques, áudio, nenhuma linguagem clínica |
| **Rafael**, 23, estudante cego de Farmácia | Estuda com leitor de tela | O mesmo conteúdo que os outros | Teclado, texto alternativo, versão em lista do tour |
| **Júlia**, aluna de Psicologia, editora | Cadastra e revisa fichas | Editar sem chamar o desenvolvedor | Painel simples, campos guiados, registro de revisor e data |

### Decisão
**Mobile-first, com o QR na horta como porta principal.** O tour vem em segundo lugar, como experiência mais rica para quem acessa de casa ou da sala. A página da planta é a peça central: se ela funcionar bem para a Ana no celular, o resto se constrói a partir dela.

---

## Parte 3 — Jornadas

### Jornada 1 — Ana escaneia o QR (a principal)
1. Vê a placa do canteiro com o QR e o nome da planta, e aponta a câmera.
2. Abre a **página da planta**: foto, nome popular, nome científico e uma frase de impacto.
3. Logo abaixo, os **3 caminhos** em botões grandes: 🌱 Conheça · 👃 Sinta · 🔬 Ciência.
4. Em 👃 recebe um convite: *"Esfregue uma folha entre os dedos. Que lembrança esse aroma traz?"* Pode responder em texto livre ou pular.
5. No fim, *"Plantas vizinhas neste canteiro"* e link para o mapa.

**Exige:** URL curta e estável por planta (`/p/hortela`), página leve, sem login, resposta anônima.

### Jornada 2 — Prof. Carlos conduz o tour em sala
1. Abre a plataforma no projetor e escolhe **Tour virtual**.
2. Percorre as 5 paradas: Boas-vindas → Horta → Sensorial → Ciência → Descubra e participe.
3. Em cada parada, foto com marcadores: canteiro → planta → modal dos 3 caminhos.
4. Ouve a narração ou lê a legenda.
5. Termina no **quiz final** com a turma.

**Exige:** avançar, voltar e voltar ao mapa; áudio com transcrição; quiz em grupo, sem login.

### Jornada 3 — Dona Lúcia na atividade sensorial
1. A psicóloga abre a **Experiência sensorial** no tablet.
2. Escolhe uma atividade (ex.: "Memória olfativa") e entrega o tablet.
3. Instrução curta em letra grande, botão de áudio, uma pergunta por vez.
4. Responde por voz à psicóloga ou toca em opções ("Me lembra minha infância", "Me acalma", "Não me lembra nada") ou texto livre.
5. Nenhuma tela mostra certo/errado. Ao final: *"Obrigado por compartilhar"*.

**Exige:** leitura ampliada e alto contraste, áudio, perguntas sem gabarito.

### Jornada 4 — Rafael estuda com leitor de tela
1. Chega pela busca do **Catálogo** e digita "camomila".
2. Navega pela ficha pelos títulos (H2/H3).
3. No tour, escolhe **"Ver tour em lista"**.
4. Níveis de evidência anunciados como texto, não só por cor.

**Exige:** HTML semântico, tour com versão alternativa, cor nunca como única informação.

### Jornada 5 — Júlia atualiza uma ficha
1. Entra em `/admin` com e-mail e senha.
2. Plantas → Hortelã. Formulário segue as **10 seções** da ficha padrão.
3. Edita texto curto e ampliado, sobe foto (alt obrigatório), adiciona fonte.
4. Marca a revisão: nome e data registrados automaticamente.
5. Salva como **rascunho** ou **publica**. URL e QR não mudam.

**Exige:** campos obrigatórios, rascunho/publicado, "validado por" + área e data automáticos.

### Decisões
1. **Visitante sem login.** Visitantes não criam conta em nenhum momento. Quiz, pergunta sensorial e diário são anônimos; progresso (trilhas) fica só no aparelho.
2. **Respostas sensoriais salvas de forma anônima**, para a Psicologia ver dados agregados (atende o "painel de acompanhamento", 4.2).
3. **Sem papéis nem fluxo de aprovação.** Cada ficha registra "validado por", a área (Botânica, Psicologia, Biomedicina, Farmácia) e a data, atendendo a exigência de validação por área (3.3).
4. **Painel de conteúdo com login só para a equipe editorial** (psicóloga). E-mail e senha via Supabase Auth, conta criada manualmente, sem página de cadastro.

### Ajustes após leitura do documento de orientações
- **Tour é o diferencial avaliado** (seção 5). O QR continua sendo a entrada principal de uso, mas o tour recebe mais tempo e acabamento.
- **"Estações" ≠ "paradas".** Estações são as 6 seções da plataforma; paradas são as 5 etapas do tour.
- **Obrigatórios que estavam como opcionais:** pelo menos uma pergunta interativa por ficha; espaço para diário sensorial e atenção plena; caminhos no mapa.

---

## Parte 4 — Arquitetura da informação

### Mapa do site
| Rota | O que é | Origem no documento |
|---|---|---|
| `/` | Início: o laboratório, objetivos, cursos, atalhos para as 6 estações, convite para visitar | 4.1 |
| `/tour` · `/tour/[1-5]` | **Estação 1, Tour:** 5 paradas com foto, marcadores, áudio e legenda | 2, 5 |
| `/tour/lista` | Versão acessível do tour, sem depender de imagem | 5.2 |
| `/mapa` | Mapa da horta: canteiros, caminhos e plantas (também é o "voltar ao mapa" do tour) | 4.1, 5.2 |
| `/plantas` | **Estação 2, Enciclopédia:** busca e filtros (categoria, característica, canteiro) | 2, 4.1 |
| `/plantas/[slug]` | Ficha da planta | 3.1, 4.1 |
| `/p/[slug]` | Endereço curto do QR: redireciona para a ficha e conta o acesso | 4.1, 4.2 |
| `/sentidos` | **Estação 3, Experiências sensoriais:** os 7 conteúdos de Psicologia | 2, 3.2 |
| `/sentidos/diario` | Diário sensorial (anônimo, salvo no aparelho) | 3.2 |
| `/ciencia` | **Estação 4, Ciência:** textos gerais; Biomedicina e Farmácia no próximo semestre | 2 |
| `/jogos` | **Estação 5, Jogos:** quiz, mitos e verdades, associação folha ↔ espécie | 2, 4.1 |
| `/comunidade` | **Estação 6, Comunidade (área acadêmica):** projetos, vídeos, pesquisas, produtos | 2, 4.1 |
| `/acessibilidade` | Declaração de acessibilidade e atalhos | 4.1 |
| `/admin` | Painel de conteúdo (login) | 4.1 |

### Ficha da planta: a página central
1. **Topo:** foto, nome popular e científico, canteiro (com link para o mapa), frase de impacto e apresentação curta.
2. **Barra dos 3 caminhos** (fica fixa ao rolar): 🌱 Conheça · 👃 Sinta · 🔬 Ciência.
3. **🌱 Conheça:** 01 Identificação, 02 Conhecendo a planta, 03 Cultivo, 04 História e cultura.
4. **👃 Sinta:** 05 Experiência sensorial com a **pergunta interativa**, 06 Psicologia e bem-estar.
5. **🔬 Ciência:** usos com selo de evidência (popular, evidência, reconhecido, hipótese); 07, 08 e 09 aparecem como "Em preparação pela equipe de Biomedicina e Farmácia".
6. **Rodapé:** 10 Fontes, "validado por" com área e data, aviso fixo para questões clínicas, plantas do mesmo canteiro.

Cada seção mostra o texto curto e um botão "Ler mais" para a explicação ampliada (3.3).

### Navegação
- Cabeçalho com as 6 estações; no celular, botão de menu.
- Nomes curtos no menu: **Tour · Plantas · Sentidos · Ciência · Jogos · Comunidade**.
- No tour, clicar em uma planta abre o **modal dos 3 caminhos**, e cada caminho leva à seção correspondente da ficha.

### Decisões
- 3 caminhos numa **página única com âncoras** (não abas), por acessibilidade e busca.
- **Estação Ciência fica visível** com textos gerais e aviso "em construção no próximo semestre" (demonstra expansão futura).
- Nomes do menu aprovados: Tour · Plantas · Sentidos · Ciência · Jogos · Comunidade.

---

## Parte 5 — Identidade e tom (rascunho, em discussão)

### Nome
**Laboratório Sensorial Interativo**, o nome do documento. Sem marca nova.

### Tom de voz
- Fala com "você", frases curtas, convida mais do que explica: "Esfregue uma folha. O que você sente?"
- Curiosidade antes de definição: começa pela pergunta ou pelo fato surpreendente.
- Nunca corrige uma sensação, nunca promete efeito.

| Evitar | Usar |
|---|---|
| "A camomila trata a ansiedade" | "Uso popular: chá calmante. O que a ciência pesquisa: ver evidências" |
| "Comprovado cientificamente" | O selo do nível de evidência |
| "Paciente", "terapia", "sintoma" | "Participante", "atividade", "sensação" |
| "Resposta errada!" (no quiz) | "Quase! Veja por quê…" |

### Visual
- **Cor principal: azul UniCatólica** (#23409A). Faixa do topo com o logo, botões e links, para o usuário reconhecer a instituição ao abrir. O azul-claro da marca (#0095DA) aparece só em detalhes decorativos (contraste insuficiente para texto).
- **Cores da horta em segundo plano**, uma por caminho: 🌱 Conheça verde-folha · 👃 Sinta lavanda · 🔬 Ciência azul-ciência (azul-claro da marca escurecido). Destaque em amarelo-camomila, sempre atrás de texto escuro.
- **Conceito de herbário:** fundo cor de papel, ilustração botânica de apoio, foto real como protagonista e **etiqueta de herbário** no fim da ficha (família, espécie, canteiro, validado por, data).
- **Tipografia:** Young Serif nos títulos; Atkinson Hyperlegible no texto (criada para baixa visão); nomes científicos sempre em itálico.
- **Selos de evidência:** ícone + texto + cor, nunca só cor (hipótese com borda tracejada).
- Prévia navegável: [identidade/previa.html](identidade/previa.html)

### Acessibilidade como identidade (WCAG 2.2 AA)
- Texto base de 18 px; botões e alvos de toque com no mínimo 44 px.
- Botão **"Aa"** fixo: aumentar texto e alto contraste (persona Dona Lúcia), lembrado no aparelho.
- Foco do teclado sempre visível; link "pular para o conteúdo".
- Todo áudio e vídeo com legenda ou transcrição.
- Animações desligadas para quem pede menos movimento no sistema.
- `lang="pt-BR"`, títulos hierárquicos, imagens com texto alternativo obrigatório no painel.
