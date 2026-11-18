-- ════════════════════════════════════════════════════════════════════
-- NATIVA — Supabase Storage (Etapa 2)
--   observations : PRIVADO. Acesso por URL assinada temporária.
--                  Caminho: {user_id}/{observation_id}/{arquivo}
--   avatars      : público para leitura. Caminho: {user_id}/{arquivo}
--   species      : público para leitura; escrita somente pela administração.
-- ════════════════════════════════════════════════════════════════════

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('observations', 'observations', false, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']),
  ('avatars',      'avatars',      true,  2097152,  array['image/jpeg', 'image/png', 'image/webp']),
  ('species',      'species',      true,  5242880,  array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- ── observations (privado) ──
-- Leitura: o autor, ou qualquer pessoa se a foto pertencer a uma observação pública publicada.
create policy "obs-photos: leitura" on storage.objects for select using (
  bucket_id = 'observations'
  and (
    (storage.foldername(name))[1] = (select auth.uid())::text
    or exists (
      select 1
      from public.observation_media m
      join public.observations o on o.id = m.observation_id
      where m.storage_path = storage.objects.name
        and o.visibility = 'public' and o.is_draft = false
    )
  )
);
create policy "obs-photos: autor envia" on storage.objects for insert to authenticated with check (
  bucket_id = 'observations' and (storage.foldername(name))[1] = (select auth.uid())::text
);
create policy "obs-photos: autor atualiza" on storage.objects for update to authenticated using (
  bucket_id = 'observations' and (storage.foldername(name))[1] = (select auth.uid())::text
);
create policy "obs-photos: autor exclui" on storage.objects for delete to authenticated using (
  bucket_id = 'observations' and (storage.foldername(name))[1] = (select auth.uid())::text
);

-- ── avatars (público para leitura via URL pública; escrita só na própria pasta) ──
create policy "avatars: dono lista" on storage.objects for select to authenticated using (
  bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text
);
create policy "avatars: dono envia" on storage.objects for insert to authenticated with check (
  bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text
);
create policy "avatars: dono atualiza" on storage.objects for update to authenticated using (
  bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text
);
create policy "avatars: dono exclui" on storage.objects for delete to authenticated using (
  bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text
);
-- (bucket 'species': sem políticas de escrita para usuários; leitura pela URL pública do bucket)
