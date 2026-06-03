import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminUser, getSupabaseService } from "@/lib/supabase";
import { eur, dateFr, STATUT_LABEL, type ClientSnapshot, type DocStatut } from "@/lib/admin-content";

export const dynamic = "force-dynamic";

type Row = {
  id: string;
  type: "devis" | "facture";
  numero: string;
  statut: DocStatut;
  total: number;
  acompte_pct: number;
  created_at: string;
  client_snapshot: ClientSnapshot;
  signe_at: string | null;
};

const clientName = (c: ClientSnapshot = {}) =>
  c.est_entreprise && c.raison_sociale ? c.raison_sociale : `${c.prenom ?? ""} ${c.nom ?? ""}`.trim() || "—";

export default async function Dashboard() {
  if (!(await getAdminUser())) redirect("/admin/login");
  const db = getSupabaseService();
  const docs: Row[] = db
    ? ((
        await db
          .from("documents")
          .select("id,type,numero,statut,total,acompte_pct,created_at,client_snapshot,signe_at")
          .order("created_at", { ascending: false })
          .limit(150)
      ).data as Row[]) ?? []
    : [];

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

  const signes = docs.filter((d) => d.type === "devis" && d.statut === "signe");
  const caSigne = signes.reduce((s, d) => s + Number(d.total), 0);
  const enAttente = docs.filter((d) => d.statut === "envoye").length;

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
          <span className="admin-stat-n">{docs.length}</span>
          <span className="admin-stat-l">Documents</span>
        </div>
        <div className="admin-stat">
          <span className="admin-stat-n">{signes.length}</span>
          <span className="admin-stat-l">Devis signés</span>
        </div>
        <div className="admin-stat">
          <span className="admin-stat-n">{enAttente}</span>
          <span className="admin-stat-l">En attente de signature</span>
        </div>
        <div className="admin-stat">
          <span className="admin-stat-n">{eur(caSigne)}</span>
          <span className="admin-stat-l">Signé (devis)</span>
        </div>
      </div>

      {docs.length === 0 ? (
        <div className="admin-card">
          <p className="muted">Aucun document pour l'instant.</p>
          <Link href="/admin/documents/nouveau" className="btn btn-primary admin-btn-sm">
            Créer ton premier devis
          </Link>
        </div>
      ) : (
        <div className="admin-table">
          <div className="admin-tr admin-th">
            <span>Document</span>
            <span>Client</span>
            <span>Date</span>
            <span>Montant</span>
            <span>Statut</span>
          </div>
          {docs.map((d) => (
            <Link key={d.id} href={`/admin/documents/${d.id}`} className="admin-tr admin-row">
              <span>
                <em className={`admin-type admin-type-${d.type}`}>{d.type === "devis" ? "Devis" : "Facture"}</em>{" "}
                {d.numero}
              </span>
              <span>{clientName(d.client_snapshot)}</span>
              <span className="muted">{dateFr(d.created_at)}</span>
              <span>{eur(d.total)}</span>
              <span>
                <em className={`admin-badge admin-badge-${d.statut}`}>{STATUT_LABEL[d.statut]}</em>
              </span>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
