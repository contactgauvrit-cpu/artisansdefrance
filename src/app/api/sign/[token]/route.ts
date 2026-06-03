import { NextResponse } from "next/server";
import { getSupabaseService } from "@/lib/supabase";
import { sendSignatureNotif } from "@/lib/email";
import { eur, dateFr } from "@/lib/admin-content";

export const dynamic = "force-dynamic";

export async function POST(req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const db = getSupabaseService();
  if (!db) return NextResponse.json({ error: "db" }, { status: 500 });

  let b: { signataire_nom?: string; signature_png?: string; accord?: boolean };
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  if (!b?.accord || !b?.signature_png) return NextResponse.json({ error: "accord_requis" }, { status: 422 });

  const { data: doc } = await db
    .from("documents")
    .select("*")
    .eq("public_token", token)
    .eq("type", "devis")
    .maybeSingle();
  if (!doc) return NextResponse.json({ error: "introuvable" }, { status: 404 });
  if (doc.statut === "signe") return NextResponse.json({ ok: true, already: true });

  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || null;
  const ua = req.headers.get("user-agent") || null;
  const when = new Date().toISOString();

  const { error } = await db
    .from("documents")
    .update({
      statut: "signe",
      signe_at: when,
      signataire_nom: b.signataire_nom ?? null,
      signature_png: b.signature_png,
      signer_ip: ip,
      signer_ua: ua,
    })
    .eq("id", doc.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  try {
    await sendSignatureNotif({
      numero: doc.numero,
      signataire: b.signataire_nom || "le client",
      total: eur(doc.total),
      when: dateFr(when),
    });
  } catch {
    /* notif best-effort */
  }
  return NextResponse.json({ ok: true });
}
