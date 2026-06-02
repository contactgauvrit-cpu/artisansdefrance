import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

/**
 * Client Supabase côté serveur. Renvoie null si les variables d'environnement
 * ne sont pas définies (le formulaire reste fonctionnel — voir api/lead).
 * Variables attendues : SUPABASE_URL + SUPABASE_ANON_KEY.
 */
export function getSupabase(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  if (!client) {
    client = createClient(url, key, { auth: { persistSession: false } });
  }
  return client;
}
