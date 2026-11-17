-- Endurecimento: só editores autorizados escrevem (não basta estar logado).
-- Aplicado em 17/11/2026, depois de schema.sql.
begin;

create table public.editores (
  user_id   uuid primary key references auth.users(id) on delete cascade,
  nome      text not null,
  area      text,
  criado_em timestamptz not null default now()
);
alter table public.editores enable row level security; -- sem políticas: invisível pela API

create or replace function public.eh_editor() returns boolean
language sql stable security definer set search_path = ''
as $$ select exists (select 1 from public.editores where user_id = (select auth.uid())) $$;

-- Troca "qualquer usuário logado" por "editor autorizado"
do $$
declare t text;
begin
  foreach t in array array['canteiros','plantas','usos','validacoes','midias','tour_paradas','tour_marcadores','quiz_perguntas','projetos','textos'] loop
    execute format('drop policy equipe_escreve on public.%I', t);
    execute format('create policy equipe_escreve on public.%I for all to authenticated using (public.eh_editor()) with check (public.eh_editor())', t);
  end loop;
  foreach t in array array['respostas','eventos'] loop
    execute format('drop policy equipe_le on public.%I', t);
    execute format('create policy equipe_le on public.%I for select to authenticated using (public.eh_editor())', t);
  end loop;
end $$;

drop policy leitura_publica on public.plantas;
create policy leitura_publica on public.plantas for select using (publicado or public.eh_editor());

commit;
