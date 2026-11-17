-- Laboratório Sensorial Interativo · esquema do banco (Supabase / Postgres)
-- Rodar no SQL Editor do Supabase. Espelha src/lib/tipos.ts.
-- Aplicado em 17/11/2026 no projeto hmmrthhwchefxwshpphl (us-east-1).
-- Regras de RLS testadas como visitante anônimo: lê só conteúdo publicado,
-- registra respostas sem conseguir lê-las, não escreve conteúdo.
--
-- Regras de acesso (RLS):
--   visitante (anon)       → lê só conteúdo publicado; pode registrar respostas e acessos
--   equipe (authenticated) → lê e escreve tudo; não existe cadastro público

create type nivel_evidencia as enum ('popular', 'evidencia_cientifica', 'uso_reconhecido', 'hipotese');
create type area_validacao as enum ('Botânica', 'Psicologia', 'Biomedicina', 'Farmácia');

create table canteiros (
  id          text primary key,
  numero      int  not null unique,
  nome        text not null,
  descricao   text not null default '',
  mapa_x      numeric, -- posição no mapa da horta (0–100)
  mapa_y      numeric
);

create table plantas (
  slug             text primary key check (slug ~ '^[a-z0-9-]+$'),
  nome_popular     text not null,
  nome_cientifico  text not null,
  autor_taxon      text,
  familia          text not null,
  canteiro_id      text references canteiros(id) on delete set null,
  categorias       text[] not null default '{}',
  caracteristicas  text[] not null default '{}',
  frase_impacto    text not null,
  resumo           text not null,
  imagem_url       text,
  imagem_alt       text,
  imagem_credito   text,
  -- seções da ficha: { "curto": "...", "ampliado": "..." }
  conhecendo   jsonb not null,
  cultivo      jsonb not null,
  historia     jsonb not null,
  experiencia  jsonb not null,
  atividade    text  not null,
  perguntas    text[] not null check (cardinality(perguntas) >= 1),
  psicologia   jsonb not null,
  biomedicina  jsonb, -- próximo semestre
  farmacia     jsonb, -- próximo semestre
  alertas      jsonb, -- próximo semestre
  fontes       jsonb not null default '[]',
  exemplo      boolean not null default false,
  publicado    boolean not null default false,
  atualizado_em timestamptz not null default now(),
  check (imagem_url is null or imagem_alt is not null) -- texto alternativo obrigatório
);

create table usos (
  id         bigint generated always as identity primary key,
  planta     text not null references plantas(slug) on delete cascade on update cascade,
  nivel      nivel_evidencia not null,
  texto      text not null,
  ordem      int  not null default 0
);

create table validacoes (
  id         bigint generated always as identity primary key,
  planta     text not null references plantas(slug) on delete cascade on update cascade,
  nome       text not null,
  area       area_validacao not null,
  data       date not null default current_date
);

create table midias (
  id         bigint generated always as identity primary key,
  planta     text references plantas(slug) on delete cascade on update cascade,
  tipo       text not null check (tipo in ('foto', 'audio', 'video')),
  url        text not null,
  descricao  text not null, -- alt da foto ou transcrição/legenda do áudio e vídeo
  ordem      int  not null default 0
);

create table tour_paradas (
  id         bigint generated always as identity primary key,
  ordem      int  not null unique,
  titulo     text not null,
  texto      text not null,
  imagem_url text,
  imagem_alt text,
  audio_url  text,
  transcricao text,
  check (imagem_url is null or imagem_alt is not null),
  check (audio_url is null or transcricao is not null)
);

create table tour_marcadores (
  id         bigint generated always as identity primary key,
  parada_id  bigint not null references tour_paradas(id) on delete cascade,
  x          numeric not null check (x between 0 and 100), -- % da largura da foto
  y          numeric not null check (y between 0 and 100),
  rotulo     text not null,
  planta     text references plantas(slug) on delete cascade on update cascade,
  canteiro_id text references canteiros(id) on delete cascade
);

create table quiz_perguntas (
  id         bigint generated always as identity primary key,
  jogo       text not null check (jogo in ('quiz', 'mitos_verdades', 'associacao')),
  enunciado  text not null,
  opcoes     text[] not null,
  correta    int  not null,
  feedback   text not null, -- explicação mostrada após responder, com fundamento
  planta     text references plantas(slug) on delete set null on update cascade,
  ordem      int  not null default 0
);

create table projetos (
  id         bigint generated always as identity primary key,
  curso      text not null,
  tipo       text not null, -- pesquisa, produto, vídeo, extensão
  titulo     text not null,
  descricao  text not null,
  link       text,
  ano        int
);

create table textos (
  -- conteúdos editoriais das estações (ex.: 'sentidos/memoria-olfativa')
  chave      text primary key,
  titulo     text not null,
  corpo      text not null,
  atualizado_em timestamptz not null default now()
);

-- Respostas anônimas às perguntas sensoriais (sem IP, sem identificação)
create table respostas (
  id         bigint generated always as identity primary key,
  planta     text references plantas(slug) on delete set null on update cascade,
  pergunta   text not null,
  resposta   text not null check (char_length(resposta) between 1 and 500),
  criado_em  timestamptz not null default now()
);

-- Acessos agregáveis para o painel de acompanhamento
create table eventos (
  id         bigint generated always as identity primary key,
  tipo       text not null check (tipo in ('qr', 'tour', 'quiz_concluido', 'resposta')),
  alvo       text,
  criado_em  timestamptz not null default now()
);

-- ───────────── Segurança (RLS) ─────────────
alter table canteiros       enable row level security;
alter table plantas         enable row level security;
alter table usos            enable row level security;
alter table validacoes      enable row level security;
alter table midias          enable row level security;
alter table tour_paradas    enable row level security;
alter table tour_marcadores enable row level security;
alter table quiz_perguntas  enable row level security;
alter table projetos        enable row level security;
alter table textos          enable row level security;
alter table respostas       enable row level security;
alter table eventos         enable row level security;

-- Leitura pública do conteúdo
create policy leitura_publica on canteiros       for select using (true);
create policy leitura_publica on plantas         for select using (publicado or auth.role() = 'authenticated');
create policy leitura_publica on usos            for select using (true);
create policy leitura_publica on validacoes      for select using (true);
create policy leitura_publica on midias          for select using (true);
create policy leitura_publica on tour_paradas    for select using (true);
create policy leitura_publica on tour_marcadores for select using (true);
create policy leitura_publica on quiz_perguntas  for select using (true);
create policy leitura_publica on projetos        for select using (true);
create policy leitura_publica on textos          for select using (true);

-- Equipe editorial escreve tudo
create policy equipe_escreve on canteiros       for all to authenticated using (true) with check (true);
create policy equipe_escreve on plantas         for all to authenticated using (true) with check (true);
create policy equipe_escreve on usos            for all to authenticated using (true) with check (true);
create policy equipe_escreve on validacoes      for all to authenticated using (true) with check (true);
create policy equipe_escreve on midias          for all to authenticated using (true) with check (true);
create policy equipe_escreve on tour_paradas    for all to authenticated using (true) with check (true);
create policy equipe_escreve on tour_marcadores for all to authenticated using (true) with check (true);
create policy equipe_escreve on quiz_perguntas  for all to authenticated using (true) with check (true);
create policy equipe_escreve on projetos        for all to authenticated using (true) with check (true);
create policy equipe_escreve on textos          for all to authenticated using (true) with check (true);

-- Visitante só insere respostas e eventos; só a equipe lê
create policy visitante_registra on respostas for insert to anon, authenticated with check (true);
create policy equipe_le          on respostas for select to authenticated using (true);
create policy visitante_registra on eventos   for insert to anon, authenticated with check (true);
create policy equipe_le          on eventos   for select to authenticated using (true);
