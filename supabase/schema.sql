-- ============================================================
-- Artisans de France — schéma Supabase
-- À exécuter dans Supabase : SQL Editor → coller → Run.
-- ============================================================

-- Table des demandes de devis (leads)
create table if not exists public.leads (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  nom         text not null,
  tel         text not null,
  email       text,
  type        text not null,
  message     text not null,
  source      text default 'site',
  commune     text,
  service     text
);

-- Sécurité au niveau des lignes (RLS)
alter table public.leads enable row level security;

-- Le formulaire public (rôle "anon") peut UNIQUEMENT insérer — jamais lire.
-- => même si la clé anon est publique, personne ne peut consulter les leads.
drop policy if exists "anon_insert_leads" on public.leads;
create policy "anon_insert_leads"
  on public.leads
  for insert
  to anon
  with check (true);

-- La lecture des leads se fait via le dashboard Supabase (ou le rôle service_role).
-- Index pour trier par date facilement :
create index if not exists leads_created_at_idx on public.leads (created_at desc);
