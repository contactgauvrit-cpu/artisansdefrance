import { NextResponse, type NextRequest } from "next/server";

/**
 * L'authentification de l'espace admin est entièrement assurée côté serveur :
 * - le layout `admin/(panel)/layout.tsx` fait `getAdminUser()` puis redirige,
 * - chaque route `/api/admin/*` revérifie `getAdminUser()`.
 *
 * Ce middleware ne fait donc AUCUN appel réseau (getUser) : l'appel Supabase en
 * Edge, avec le temps d'exécution très court du middleware, provoquait des
 * MIDDLEWARE_INVOCATION_TIMEOUT (504) quand l'auth répondait lentement.
 * Il se contente de laisser passer — la vérif se fait dans le layout (runtime
 * Node, budget de temps large et résilient).
 */
export function middleware(_req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
