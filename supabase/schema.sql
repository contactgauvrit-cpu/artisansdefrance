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

-- ============================================================
-- ESPACE ADMIN — clients + documents (devis & factures)
-- ============================================================

create table if not exists public.clients (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),
  nom            text not null,
  prenom         text,
  email          text,
  tel            text,
  adresse        text,
  cp             text,
  ville          text,
  est_entreprise boolean not null default false,
  raison_sociale text,
  siret          text,
  notes          text
);

create table if not exists public.documents (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  type            text not null check (type in ('devis','facture')),
  numero          text not null unique,
  client_id       uuid references public.clients(id) on delete set null,
  client_snapshot jsonb not null default '{}'::jsonb,
  statut          text not null default 'brouillon'
                    check (statut in ('brouillon','envoye','signe','refuse','paye','annule')),
  date_emission   date not null default current_date,
  date_validite   date,
  objet           text,
  message         text,
  lignes          jsonb not null default '[]'::jsonb,
  total           numeric(12,2) not null default 0,
  acompte_pct     int not null default 50,
  conditions      text,
  public_token    uuid not null default gen_random_uuid() unique,
  envoye_at       timestamptz,
  signe_at        timestamptz,
  signataire_nom  text,
  signature_png   text,
  signer_ip       text,
  signer_ua       text,
  paye_at         timestamptz,
  devis_source_id uuid references public.documents(id) on delete set null
);
-- Ajout incrémental pour les bases déjà créées : message/précisions libre sur le document
alter table public.documents add column if not exists message text;

create index if not exists documents_created_at_idx on public.documents (created_at desc);
create index if not exists documents_token_idx on public.documents (public_token);

-- RLS verrouillé : aucun accès anon/authenticated direct.
-- Tout passe par les routes serveur (clé service_role qui bypass le RLS),
-- après vérification de la session admin (Supabase Auth) ; la page publique de
-- signature passe par une route serveur filtrée par public_token.
alter table public.clients enable row level security;
alter table public.documents enable row level security;
-- (aucune policy => deny par défaut pour anon/authenticated ; service_role bypass le RLS)
