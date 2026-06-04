import { NextResponse } from "next/server";
import { getSupabaseService } from "@/lib/supabase";
import { sendSignatureNotif, sendClientSignedCopy } from "@/lib/email";
import { buildDocumentPdf, type DocForPdf } from "@/lib/pdf";
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

  // Remerciement au client + PDF du devis signé en pièce jointe (best-effort)
  try {
    const c = doc.client_snapshot ?? {};
    const clientEmail: string | undefined = c.email;
    if (clientEmail) {
      const signedDoc = {
        ...doc,
        statut: "signe",
        signe_at: when,
        signataire_nom: b.signataire_nom ?? null,
        signature_png: b.signature_png,
      };
      const bytes = await buildDocumentPdf(signedDoc as DocForPdf);
      const pdfBase64 = Buffer.from(bytes).toString("base64");
      const clientName =
        (c.est_entreprise && c.raison_sociale
          ? c.raison_sociale
          : `${c.prenom ?? ""} ${c.nom ?? ""}`.trim()) || "client";
      await sendClientSignedCopy({
        to: clientEmail,
        clientName,
        numero: doc.numero,
        total: eur(doc.total),
        pdfBase64,
      });
    }
  } catch {
    /* copie client best-effort */
  }

  return NextResponse.json({ ok: true });
}
