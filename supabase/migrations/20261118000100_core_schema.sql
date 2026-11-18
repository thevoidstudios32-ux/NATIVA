-- ════════════════════════════════════════════════════════════════════
-- NATIVA — Esquema principal (Etapa 2)
-- Tabelas, tipos, índices, gatilhos e políticas RLS.
-- ════════════════════════════════════════════════════════════════════

create extension if not exists pg_trgm with schema extensions;
create extension if not exists unaccent with schema extensions;

-- ─────────────────────────── Tipos ───────────────────────────
create type public.organism_category as enum
  ('aves', 'mamiferos', 'repteis', 'anfibios', 'insetos', 'plantas', 'outros');
create type public.record_visibility as enum ('private', 'public');
create type public.identification_status as enum ('pending', 'suggested', 'confirmed');
create type public.suggestion_status as enum ('pending', 'accepted', 'rejected');
create type public.report_status as enum ('open', 'reviewing', 'resolved', 'dismissed');

-- Atualiza updated_at automaticamente
create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end $$;

-- ─────────────────────────── profiles ───────────────────────────
create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  username    text not null,
  full_name   text not null default '',
  avatar_url  text,
  bio         text check (char_length(bio) <= 600),
  is_public   boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  constraint username_format check (username ~ '^[a-z0-9_]{3,30}$'),
  constraint full_name_len check (char_length(full_name) <= 120)
);
create unique index profiles_username_key on public.profiles (lower(username));
create trigger profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();

-- Cria o perfil automaticamente quando uma conta é criada no Supabase Auth.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  base text;
  candidate text;
begin
  base := lower(regexp_replace(split_part(new.email, '@', 1), '[^a-zA-Z0-9_]', '', 'g'));
  if char_length(base) < 3 then base := 'observador'; end if;
  base := left(base, 24);
  loop
    candidate := base || '_' || substr(md5(random()::text), 1, 4);
    exit when not exists (select 1 from public.profiles p where lower(p.username) = candidate);
  end loop;
  insert into public.profiles (id, username, full_name)
  values (new.id, candidate, left(coalesce(new.raw_user_meta_data ->> 'full_name', ''), 120));
  return new;
end $$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─────────────────────────── species (catálogo) ───────────────────────────
create table public.species (
  id                    uuid primary key default gen_random_uuid(),
  slug                  text not null unique check (slug ~ '^[a-z0-9-]+$'),
  common_name           text not null,
  scientific_name       text not null,
  category              public.organism_category not null,
  family                text,
  description           text,
  habitat               text,
  diet                  text,
  distribution          text,
  physical_traits       text,
  behavior              text,
  conservation_status   text,          -- ex.: categoria IUCN, conforme fonte citada
  is_sensitive          boolean not null default false,  -- protege localização (coordenadas mais grosseiras)
  image_url             text,
  image_credit          text,
  scientific_references jsonb not null default '[]'::jsonb,  -- [{ "title": "...", "url": "..." }]
  external_ids          jsonb not null default '{}'::jsonb,  -- futuras integrações: { "gbif": 123, "inaturalist": 456 }
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  constraint scientific_references_is_array check (jsonb_typeof(scientific_references) = 'array')
);
create unique index species_scientific_name_key on public.species (lower(scientific_name));
create index species_category_idx on public.species (category);
create index species_common_trgm on public.species using gin (common_name extensions.gin_trgm_ops);
create index species_scientific_trgm on public.species using gin (scientific_name extensions.gin_trgm_ops);
create trigger species_touch before update on public.species
  for each row execute function public.touch_updated_at();

-- ─────────────────────────── observations ───────────────────────────
create table public.observations (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  species_id            uuid references public.species (id) on delete set null,
  species_guess         text check (char_length(species_guess) <= 160), -- nome livre quando não está no catálogo
  category              public.organism_category not null,
  title                 text not null default '' check (char_length(title) <= 160),
  description           text check (char_length(description) <= 5000),
  observation_date      date,
  observation_time      time,
  habitat               text check (char_length(habitat) <= 500),
  behavior              text check (char_length(behavior) <= 2000),
  notes                 text check (char_length(notes) <= 5000),
  custom_attributes     jsonb not null default '{}'::jsonb,
  location_label        text check (char_length(location_label) <= 160), -- região aproximada (texto)
  public_latitude       numeric(7, 3),   -- SEMPRE aproximada; calculada pelo banco
  public_longitude      numeric(7, 3),
  visibility            public.record_visibility not null default 'private',
  is_draft              boolean not null default false,
  identification_status public.identification_status not null default 'pending',
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  constraint custom_attributes_is_object check (jsonb_typeof(custom_attributes) = 'object'),
  constraint observation_date_not_future check (observation_date is null or observation_date <= current_date + 1)
);
create index observations_user_idx on public.observations (user_id, observation_date desc nulls last, created_at desc);
create index observations_public_idx on public.observations (created_at desc)
  where visibility = 'public' and is_draft = false;
create index observations_species_idx on public.observations (species_id);
create index observations_category_idx on public.observations (category);
create index observations_public_geo_idx on public.observations (public_latitude, public_longitude)
  where visibility = 'public' and is_draft = false and public_latitude is not null;

-- ─────────────── Localização exata (estrutura protegida) ───────────────
-- Coordenadas exatas ficam em tabela separada, legível SOMENTE pelo autor.
create table public.observation_locations (
  observation_id  uuid primary key references public.observations (id) on delete cascade,
  user_id         uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  latitude        double precision not null check (latitude between -90 and 90),
  longitude       double precision not null check (longitude between -180 and 180),
  accuracy_m      real check (accuracy_m >= 0),
  source          text not null default 'manual' check (source in ('gps', 'manual')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index observation_locations_user_idx on public.observation_locations (user_id);
create trigger observation_locations_touch before update on public.observation_locations
  for each row execute function public.touch_updated_at();

-- Arredonda coordenadas: ~1,1 km (2 casas) ou ~11 km (1 casa) para espécies sensíveis.
create or replace function public.approximate_coordinate(value double precision, sensitive boolean)
returns numeric language sql immutable set search_path = '' as $$
  select round(value::numeric, case when sensitive then 1 else 2 end)
$$;

-- Antes de gravar uma observação: recalcula as coordenadas públicas a partir da tabela protegida,
-- ignorando qualquer valor enviado pelo cliente, e impede troca de autor.
create or replace function public.observations_before_write()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  loc record;
  sensitive boolean := false;
begin
  if tg_op = 'UPDATE' then
    new.user_id := old.user_id;
    new.created_at := old.created_at;
  end if;
  new.updated_at := now();

  if new.species_id is not null then
    select s.is_sensitive into sensitive from public.species s where s.id = new.species_id;
  end if;

  select l.latitude, l.longitude into loc
  from public.observation_locations l where l.observation_id = new.id;

  if found then
    new.public_latitude  := public.approximate_coordinate(loc.latitude, coalesce(sensitive, false));
    new.public_longitude := public.approximate_coordinate(loc.longitude, coalesce(sensitive, false));
  else
    new.public_latitude := null;
    new.public_longitude := null;
  end if;
  return new;
end $$;

create trigger observations_before_write before insert or update on public.observations
  for each row execute function public.observations_before_write();

-- Ao alterar a localização exata: garante autoria e atualiza a coordenada pública.
create or replace function public.observation_locations_sync()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if tg_op in ('INSERT', 'UPDATE') then
    if not exists (
      select 1 from public.observations o where o.id = new.observation_id and o.user_id = new.user_id
    ) then
      raise exception 'Localização não pertence ao autor da observação';
    end if;
    update public.observations set updated_at = now() where id = new.observation_id;
    return new;
  else
    update public.observations set updated_at = now() where id = old.observation_id;
    return old;
  end if;
end $$;

create trigger observation_locations_sync after insert or update or delete on public.observation_locations
  for each row execute function public.observation_locations_sync();

-- ─────────────────────────── observation_media ───────────────────────────
create table public.observation_media (
  id              uuid primary key default gen_random_uuid(),
  observation_id  uuid not null references public.observations (id) on delete cascade,
  user_id         uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  storage_path    text not null unique,
  media_type      text not null default 'image' check (media_type in ('image')),
  width           int,
  height          int,
  position        smallint not null default 0,
  created_at      timestamptz not null default now()
);
create index observation_media_obs_idx on public.observation_media (observation_id, position);
create index observation_media_user_idx on public.observation_media (user_id);

-- ─────────────────────────── collections ───────────────────────────
create table public.collections (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  name        text not null check (char_length(name) between 1 and 120),
  description text check (char_length(description) <= 2000),
  visibility  public.record_visibility not null default 'private',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index collections_user_idx on public.collections (user_id, created_at desc);
create trigger collections_touch before update on public.collections
  for each row execute function public.touch_updated_at();

create table public.collection_observations (
  collection_id  uuid not null references public.collections (id) on delete cascade,
  observation_id uuid not null references public.observations (id) on delete cascade,
  added_at       timestamptz not null default now(),
  primary key (collection_id, observation_id)
);
create index collection_observations_obs_idx on public.collection_observations (observation_id);

-- ─────────────────────────── identification_suggestions ───────────────────────────
create table public.identification_suggestions (
  id                   uuid primary key default gen_random_uuid(),
  observation_id       uuid not null references public.observations (id) on delete cascade,
  suggested_species_id uuid not null references public.species (id) on delete cascade,
  suggested_by         uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  comment              text check (char_length(comment) <= 1000),
  status               public.suggestion_status not null default 'pending',
  created_at           timestamptz not null default now(),
  unique (observation_id, suggested_species_id, suggested_by)
);
create index identification_suggestions_obs_idx on public.identification_suggestions (observation_id);
create index identification_suggestions_by_idx on public.identification_suggestions (suggested_by);
create index identification_suggestions_species_idx on public.identification_suggestions (suggested_species_id);

-- ─────────────────────────── reports ───────────────────────────
create table public.reports (
  id             uuid primary key default gen_random_uuid(),
  reporter_id    uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  observation_id uuid not null references public.observations (id) on delete cascade,
  reason         text not null check (reason in ('inappropriate', 'spam', 'wrong_location', 'sensitive_species', 'copyright', 'other')),
  description    text check (char_length(description) <= 2000),
  status         public.report_status not null default 'open',
  created_at     timestamptz not null default now(),
  unique (reporter_id, observation_id)
);
create index reports_obs_idx on public.reports (observation_id);

-- ════════════════════════════ RLS ════════════════════════════
alter table public.profiles                   enable row level security;
alter table public.species                    enable row level security;
alter table public.observations               enable row level security;
alter table public.observation_locations      enable row level security;
alter table public.observation_media          enable row level security;
alter table public.collections                enable row level security;
alter table public.collection_observations    enable row level security;
alter table public.identification_suggestions enable row level security;
alter table public.reports                    enable row level security;

-- profiles: perfis públicos são visíveis a todos; o próprio perfil sempre visível e editável.
create policy "profiles: ver públicos ou o próprio" on public.profiles
  for select using (is_public or id = (select auth.uid()));
create policy "profiles: editar o próprio" on public.profiles
  for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));
-- (inserção apenas pelo gatilho handle_new_user; exclusão em cascata com a conta)

-- species: leitura pública; escrita apenas por administração (service role / painel).
create policy "species: leitura pública" on public.species for select using (true);

-- observations: públicas e publicadas para todos; o autor vê e gerencia tudo que é seu.
create policy "observations: ver públicas ou próprias" on public.observations
  for select using (
    (visibility = 'public' and is_draft = false) or user_id = (select auth.uid())
  );
create policy "observations: criar as próprias" on public.observations
  for insert to authenticated with check (user_id = (select auth.uid()));
create policy "observations: editar as próprias" on public.observations
  for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "observations: excluir as próprias" on public.observations
  for delete to authenticated using (user_id = (select auth.uid()));

-- observation_locations: SOMENTE o autor (nenhum acesso público).
create policy "locations: somente o autor" on public.observation_locations
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- observation_media: segue a visibilidade da observação.
create policy "media: ver se a observação é visível" on public.observation_media
  for select using (
    user_id = (select auth.uid())
    or exists (
      select 1 from public.observations o
      where o.id = observation_id and o.visibility = 'public' and o.is_draft = false
    )
  );
create policy "media: autor adiciona" on public.observation_media
  for insert to authenticated with check (
    user_id = (select auth.uid())
    and exists (select 1 from public.observations o where o.id = observation_id and o.user_id = (select auth.uid()))
  );
create policy "media: autor edita" on public.observation_media
  for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "media: autor exclui" on public.observation_media
  for delete to authenticated using (user_id = (select auth.uid()));

-- collections
create policy "collections: ver públicas ou próprias" on public.collections
  for select using (visibility = 'public' or user_id = (select auth.uid()));
create policy "collections: criar as próprias" on public.collections
  for insert to authenticated with check (user_id = (select auth.uid()));
create policy "collections: editar as próprias" on public.collections
  for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "collections: excluir as próprias" on public.collections
  for delete to authenticated using (user_id = (select auth.uid()));

-- collection_observations: visível se a coleção for visível; o dono da coleção gerencia,
-- podendo incluir observações próprias ou públicas.
create policy "collection_obs: ver se a coleção é visível" on public.collection_observations
  for select using (
    exists (
      select 1 from public.collections c
      where c.id = collection_id and (c.visibility = 'public' or c.user_id = (select auth.uid()))
    )
  );
create policy "collection_obs: dono adiciona" on public.collection_observations
  for insert to authenticated with check (
    exists (select 1 from public.collections c where c.id = collection_id and c.user_id = (select auth.uid()))
    and exists (
      select 1 from public.observations o
      where o.id = observation_id
        and (o.user_id = (select auth.uid()) or (o.visibility = 'public' and o.is_draft = false))
    )
  );
create policy "collection_obs: dono remove" on public.collection_observations
  for delete to authenticated using (
    exists (select 1 from public.collections c where c.id = collection_id and c.user_id = (select auth.uid()))
  );

-- identification_suggestions
create policy "suggestions: ver se a observação é visível" on public.identification_suggestions
  for select using (
    exists (
      select 1 from public.observations o
      where o.id = observation_id
        and ((o.visibility = 'public' and o.is_draft = false) or o.user_id = (select auth.uid()))
    )
  );
create policy "suggestions: sugerir em observações públicas" on public.identification_suggestions
  for insert to authenticated with check (
    suggested_by = (select auth.uid())
    and status = 'pending'
    and exists (
      select 1 from public.observations o
      where o.id = observation_id and o.visibility = 'public' and o.is_draft = false
        and o.user_id <> (select auth.uid())
    )
  );
create policy "suggestions: autor da observação avalia" on public.identification_suggestions
  for update to authenticated using (
    exists (select 1 from public.observations o where o.id = observation_id and o.user_id = (select auth.uid()))
  ) with check (
    exists (select 1 from public.observations o where o.id = observation_id and o.user_id = (select auth.uid()))
  );
create policy "suggestions: quem sugeriu remove pendente" on public.identification_suggestions
  for delete to authenticated using (suggested_by = (select auth.uid()) and status = 'pending');

-- Impede que o avaliador altere outros campos além do status.
create or replace function public.suggestions_lock_fields()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.observation_id := old.observation_id;
  new.suggested_species_id := old.suggested_species_id;
  new.suggested_by := old.suggested_by;
  new.comment := old.comment;
  new.created_at := old.created_at;
  return new;
end $$;
create trigger suggestions_lock_fields before update on public.identification_suggestions
  for each row execute function public.suggestions_lock_fields();

-- reports: quem denuncia vê as próprias denúncias; moderação via painel.
create policy "reports: criar" on public.reports
  for insert to authenticated with check (
    reporter_id = (select auth.uid()) and status = 'open'
    and exists (
      select 1 from public.observations o
      where o.id = observation_id and o.visibility = 'public' and o.is_draft = false
    )
  );
create policy "reports: ver as próprias" on public.reports
  for select to authenticated using (reporter_id = (select auth.uid()));

-- ════════════════════════════ Funções de consulta ════════════════════════════
-- Estatísticas do usuário autenticado (calculadas sobre dados reais).
create or replace function public.my_stats()
returns table (observations bigint, species bigint, photos bigint, drafts bigint)
language sql stable security invoker set search_path = '' as $$
  select
    (select count(*) from public.observations o where o.user_id = auth.uid() and not o.is_draft),
    (select count(distinct o.species_id) from public.observations o
       where o.user_id = auth.uid() and not o.is_draft and o.species_id is not null),
    (select count(*) from public.observation_media m where m.user_id = auth.uid()),
    (select count(*) from public.observations o where o.user_id = auth.uid() and o.is_draft)
$$;

-- Verifica disponibilidade de nome de usuário sem expor perfis privados.
create or replace function public.username_available(candidate text)
returns boolean language sql stable security definer set search_path = '' as $$
  select candidate ~ '^[a-z0-9_]{3,30}$'
     and not exists (
       select 1 from public.profiles p
       where lower(p.username) = lower(candidate) and p.id <> coalesce(auth.uid(), '00000000-0000-0000-0000-000000000000'::uuid)
     )
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.observations_before_write() from public, anon, authenticated;
revoke execute on function public.observation_locations_sync() from public, anon, authenticated;
revoke execute on function public.my_stats() from anon;
grant execute on function public.my_stats() to authenticated;
grant execute on function public.username_available(text) to anon, authenticated;
