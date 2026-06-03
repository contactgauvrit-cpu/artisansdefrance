import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY;

/** Admin autorisé (un seul utilisateur). */
export const ADMIN_EMAIL = "contact.gauvrit@gmail.com";

let anonClient: SupabaseClient | null = null;
/**
 * Client Supabase anon côté serveur (insert leads). Renvoie null si non configuré.
 */
export function getSupabase(): SupabaseClient | null {
  if (!URL || !ANON) return null;
  if (!anonClient) anonClient = createClient(URL, ANON, { auth: { persistSession: false } });
  return anonClient;
}

let serviceClient: SupabaseClient | null = null;
/**
 * Client service_role — SERVEUR UNIQUEMENT (bypass RLS) pour l'admin et la
 * signature publique (filtrée par token). Renvoie null si la clé manque.
 */
export function getSupabaseService(): SupabaseClient | null {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!URL || !key) return null;
  if (!serviceClient) serviceClient = createClient(URL, key, { auth: { persistSession: false } });
  return serviceClient;
}

/**
 * Client SSR lié aux cookies (session Supabase Auth) — server components / routes.
 * Sert à lire la session de l'admin (getUser).
 */
export async function getSupabaseServerAuth() {
  const cookieStore = await cookies();
  return createServerClient(URL ?? "", ANON ?? "", {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (toSet) => {
        try {
          toSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          /* appelé depuis un Server Component : ignoré (rafraîchi par le middleware) */
        }
      },
    },
  });
}

/** Vérifie qu'une session admin valide est présente. Renvoie l'utilisateur ou null. */
export async function getAdminUser() {
  if (!URL || !ANON) return null;
  const supabase = await getSupabaseServerAuth();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.email?.toLowerCase() !== ADMIN_EMAIL) return null;
  return user;
}
