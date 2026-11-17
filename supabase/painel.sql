-- Ajustes para o painel de edição. Aplicar depois de schema.sql e editores.sql.
begin;

-- Jogos passam a ter cadastro próprio (antes: só um tipo fixo por pergunta)
create table public.jogos (
  slug      text primary key check (slug ~ '^[a-z0-9-]+$'),
  titulo    text not null,
  descricao text not null default '',
  tipo      text not null check (tipo in ('quiz', 'mitos_verdades')),
  ordem     int  not null default 0,
  publicado boolean not null default true,
  exemplo   boolean not null default false
);
alter table public.quiz_perguntas drop constraint quiz_perguntas_jogo_check;
alter table public.quiz_perguntas
  add constraint quiz_perguntas_jogo_fk foreign key (jogo) references public.jogos(slug) on delete cascade on update cascade,
  add column fonte_titulo text,
  add column fonte_url text;

-- Textos das estações guardam a estrutura completa (seções, atividade, pergunta, fontes)
alter table public.textos
  add column estacao text not null default 'sentidos',
  add column resumo text not null default '',
  add column dados jsonb not null default '{}',
  add column ordem int not null default 0,
  add column exemplo boolean not null default false;

alter table public.projetos add column publicado boolean not null default true;

alter table public.jogos enable row level security;
create policy leitura_publica on public.jogos for select using (publicado or public.eh_editor());
create policy equipe_escreve on public.jogos for all to authenticated using (public.eh_editor()) with check (public.eh_editor());

-- Fotos e mídias: leitura pública, envio só por editores
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('midias', 'midias', true, 5242880, array['image/jpeg', 'image/png', 'image/webp']);
create policy midias_editor_envia on storage.objects for insert to authenticated with check (bucket_id = 'midias' and public.eh_editor());
create policy midias_editor_altera on storage.objects for update to authenticated using (bucket_id = 'midias' and public.eh_editor());
create policy midias_editor_apaga on storage.objects for delete to authenticated using (bucket_id = 'midias' and public.eh_editor());

commit;

-- Apagar arquivos exige também leitura (o armazenamento localiza o objeto antes de remover)
create policy midias_editor_le on storage.objects for select to authenticated using (bucket_id = 'midias' and public.eh_editor());
