# Laboratório Sensorial Interativo — Conceito

Documento construído por partes. Cada parte só avança após aprovação.

| Parte | Tema | Status |
|---|---|---|
| 1 | Visão e proposta | ✅ Aprovada |
| 2 | Públicos e personas | ✅ Aprovada |
| 3 | Jornadas | 🟡 Em discussão |
| 4 | Arquitetura da informação | ⏳ |
| 5 | Identidade e tom | ⏳ |
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

## Parte 3 — Jornadas (rascunho, em discussão)

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

**Exige:** login só para editores, campos obrigatórios, rascunho/publicado, revisor e data automáticos.

### Decisões pendentes
1. **Visitante sem login em tudo?** Sugestão: sim. Quiz e pergunta sensorial anônimos; progresso salvo só no aparelho.
2. **Respostas sensoriais ficam salvas?** Sugestão: sim, anônimas, para a Psicologia ver respostas agregadas.
3. **Papéis de edição:** editor + revisor, ou um papel só?
