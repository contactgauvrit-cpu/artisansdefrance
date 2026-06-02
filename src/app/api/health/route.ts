import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Diagnostic de configuration (booléens uniquement — aucune valeur secrète exposée).
 * GET /api/health -> { supabase, brevo }
 */
export function GET() {
  return NextResponse.json({
    supabase: Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY),
    brevo: Boolean(process.env.BREVO_API_KEY && process.env.BREVO_SENDER_EMAIL),
    ts: new Date().toISOString(),
  });
}
