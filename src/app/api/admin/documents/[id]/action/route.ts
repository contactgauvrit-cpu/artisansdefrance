import { NextResponse } from "next/server";
import { getAdminUser, getSupabaseService } from "@/lib/supabase";
import { makeNumero, DEFAULT_CONDITIONS_FACTURE } from "@/lib/admin-content";

export const dynamic = "force-dynamic";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getAdminUser())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await params;
  const db = getSupabaseService();
  if (!db) return NextResponse.json({ error: "db" }, { status: 500 });

  const { action } = (await req.json().catch(() => ({}))) as { action?: string };
  const { data: doc } = await db.from("documents").select("*").eq("id", id).maybeSingle();
  if (!doc) return NextResponse.json({ error: "introuvable" }, { status: 404 });

  if (action === "paye") {
    await db.from("documents").update({ statut: "paye", paye_at: new Date().toISOString() }).eq("id", id);
    return NextResponse.json({ ok: true });
  }
  if (action === "annule") {
    await db.from("documents").update({ statut: "annule" }).eq("id", id);
    return NextResponse.json({ ok: true });
  }
  if (action === "convert" && doc.type === "devis") {
    const year = new Date().getFullYear();
    const { count } = await db
      .from("documents")
      .select("*", { count: "exact", head: true })
      .eq("type", "facture")
      .like("numero", `FAC-${year}-%`);
    const numero = makeNumero("facture", year, count ?? 0);
    const { data: fac, error } = await db
      .from("documents")
      .insert({
        type: "facture",
        numero,
        client_id: doc.client_id,
        client_snapshot: doc.client_snapshot,
        statut: "brouillon",
        objet: doc.objet,
        message: doc.message,
        lignes: doc.lignes,
        total: doc.total,
        acompte_pct: doc.acompte_pct,
        conditions: DEFAULT_CONDITIONS_FACTURE,
        devis_source_id: doc.id,
      })
      .select("id")
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, id: fac?.id });
  }
  return NextResponse.json({ error: "action_inconnue" }, { status: 400 });
}
