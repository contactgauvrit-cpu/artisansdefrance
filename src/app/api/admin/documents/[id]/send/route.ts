import { NextResponse } from "next/server";
import { getAdminUser, getSupabaseService } from "@/lib/supabase";
import { sendDocumentEmail } from "@/lib/email";
import { eur, type ClientSnapshot } from "@/lib/admin-content";
import { SITE } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getAdminUser())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await params;
  const db = getSupabaseService();
  if (!db) return NextResponse.json({ error: "db" }, { status: 500 });

  const { data: doc } = await db.from("documents").select("*").eq("id", id).maybeSingle();
  if (!doc) return NextResponse.json({ error: "introuvable" }, { status: 404 });

  const c = (doc.client_snapshot ?? {}) as ClientSnapshot;
  if (!c.email) return NextResponse.json({ error: "client_sans_email" }, { status: 422 });

  const path = doc.type === "devis" ? "/devis/" : "/facture/";
  const link = `${SITE.url}${path}${doc.public_token}`;
  const clientName =
    c.est_entreprise && c.raison_sociale
      ? c.raison_sociale
      : `${c.prenom ?? ""} ${c.nom ?? ""}`.trim() || "client";

  const res = await sendDocumentEmail({
    to: c.email,
    clientName,
    type: doc.type,
    numero: doc.numero,
    total: eur(doc.total),
    link,
  });
  if (res.sent && doc.statut === "brouillon") {
    await db.from("documents").update({ statut: "envoye", envoye_at: new Date().toISOString() }).eq("id", id);
  }
  return NextResponse.json({ ok: res.sent, status: res.status, detail: res.detail });
}
