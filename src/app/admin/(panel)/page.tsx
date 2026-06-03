import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminUser, getSupabaseService } from "@/lib/supabase";
import { eur } from "@/lib/admin-content";
import { DocsExplorer, type DocRow } from "./DocsExplorer";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  if (!(await getAdminUser())) redirect("/admin/login");
  const db = getSupabaseService();

  if (!db) {
    return (
      <div className="admin-card">
        <h1>Configuration requise</h1>
        <p className="muted">
          Ajoute <code>SUPABASE_SERVICE_ROLE_KEY</code> (+ <code>NEXT_PUBLIC_SUPABASE_URL</code> /{" "}
          <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>) dans Vercel, et exécute le SQL des tables.
        </p>
      </div>
    );
  }

  const docs: DocRow[] =
    ((
      await db
        .from("documents")
        .select("id,type,numero,statut,total,created_at,client_snapshot,devis_source_id")
        .order("created_at", { ascending: false })
        .limit(300)
    ).data as DocRow[]) ?? [];

  const sum = (arr: DocRow[]) => arr.reduce((s, d) => s + (Number(d.total) || 0), 0);
  const devisASigner = docs.filter((d) => d.type === "devis" && d.statut === "envoye");
  const devisSignes = docs.filter((d) => d.type === "devis" && d.statut === "signe");
  const facturesAEncaisser = docs.filter((d) => d.type === "facture" && d.statut === "envoye");
  const facturesEncaissees = docs.filter((d) => d.type === "facture" && d.statut === "paye");
  // devis signés non encore convertis en facture (= réellement à facturer)
  const dejaFactures = new Set(
    docs
      .filter((d) => d.type === "facture" && d.statut !== "annule" && d.devis_source_id)
      .map((d) => d.devis_source_id)
  );
  const devisAFacturer = devisSignes.filter((d) => !dejaFactures.has(d.id));

  return (
    <>
      <div className="admin-head">
        <h1>Tableau de bord</h1>
        <Link href="/admin/documents/nouveau" className="btn btn-primary admin-btn-sm">
          + Nouveau document
        </Link>
      </div>

      <div className="admin-stats">
        <div className="admin-stat">
          <span className="admin-stat-n">{devisASigner.length}</span>
          <span className="admin-stat-l">En attente de signature</span>
          <span className="admin-stat-sub">{eur(sum(devisASigner))} · devis envoyés</span>
        </div>
        <div className="admin-stat">
          <span className="admin-stat-n">{devisSignes.length}</span>
          <span className="admin-stat-l">Devis signés</span>
          <span className="admin-stat-sub">{eur(sum(devisAFacturer))} à facturer</span>
        </div>
        <div className="admin-stat admin-stat-warn">
          <span className="admin-stat-n">{eur(sum(facturesAEncaisser))}</span>
          <span className="admin-stat-l">En attente de paiement</span>
          <span className="admin-stat-sub">
            {facturesAEncaisser.length} facture{facturesAEncaisser.length > 1 ? "s" : ""} envoyée
            {facturesAEncaisser.length > 1 ? "s" : ""}
          </span>
        </div>
        <div className="admin-stat admin-stat-ok">
          <span className="admin-stat-n">{eur(sum(facturesEncaissees))}</span>
          <span className="admin-stat-l">Encaissé</span>
          <span className="admin-stat-sub">
            {facturesEncaissees.length} facture{facturesEncaissees.length > 1 ? "s" : ""} payée
            {facturesEncaissees.length > 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <DocsExplorer docs={docs} />
    </>
  );
}
