import { NextResponse } from "next/server";
import { getAdminUser, getSupabaseService } from "@/lib/supabase";
import { docTotal, makeNumero, parseSeq, type Ligne, type ClientSnapshot, type DocType } from "@/lib/admin-content";

export const dynamic = "force-dynamic";

type Body = {
  type: DocType;
  client: ClientSnapshot;
  client_id?: string | null;
  save_client?: boolean;
  lignes: Ligne[];
  objet?: string;
  message?: string;
  conditions?: string;
  acompte_pct?: number;
  date_validite?: string | null;
};

export async function POST(req: Request) {
  if (!(await getAdminUser())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const db = getSupabaseService();
  if (!db) return NextResponse.json({ error: "db" }, { status: 500 });

  let b: Body;
  try {
    b = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const type: DocType = b.type === "facture" ? "facture" : "devis";
  const lignes = (b.lignes ?? []).filter((l) => l && l.designation);
  if (!lignes.length) return NextResponse.json({ error: "lignes_vides" }, { status: 422 });
  const client = b.client ?? {};

  // 1) Client en mémoire (optionnel)
  let clientId = b.client_id ?? null;
  if (!clientId && b.save_client && client.nom) {
    const { data, error } = await db
      .from("clients")
      .insert({
        nom: client.nom,
        prenom: client.prenom ?? null,
        email: client.email ?? null,
        tel: client.tel ?? null,
        adresse: client.adresse ?? null,
        cp: client.cp ?? null,
        ville: client.ville ?? null,
        est_entreprise: !!client.est_entreprise,
        raison_sociale: client.raison_sociale ?? null,
        siret: client.siret ?? null,
      })
      .select("id")
      .single();
    if (!error && data) clientId = data.id;
  }

  // 2) Numéro chrono DEV/FAC-AAAA-NNNN
  const year = new Date().getFullYear();
  const prefix = type === "devis" ? "DEV" : "FAC";
  // Numéro basé sur le PLUS GRAND existant (+1) — robuste aux suppressions (sinon collision d'unicité)
  const { data: last } = await db
    .from("documents")
    .select("numero")
    .eq("type", type)
    .like("numero", `${prefix}-${year}-%`)
    .order("numero", { ascending: false })
    .limit(1)
    .maybeSingle();
  const numero = makeNumero(type, year, parseSeq(last?.numero));

  const total = docTotal(lignes);
  const validite =
    b.date_validite ??
    (type === "devis"
      ? new Date(Date.now() + 30 * 864e5).toISOString().slice(0, 10)
      : null);

  const { data, error } = await db
    .from("documents")
    .insert({
      type,
      numero,
      client_id: clientId,
      client_snapshot: client,
      statut: "brouillon",
      date_validite: validite,
      objet: b.objet ?? null,
      message: b.message ?? null,
      lignes,
      total,
      acompte_pct: typeof b.acompte_pct === "number" ? b.acompte_pct : 50,
      conditions: b.conditions ?? null,
    })
    .select("id, public_token, numero")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, ...data });
}
