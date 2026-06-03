import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getAdminUser, getSupabaseService } from "@/lib/supabase";
import { eur, dateFr, STATUT_LABEL, type DocStatut } from "@/lib/admin-content";

export const dynamic = "force-dynamic";

type Client = {
  id: string;
  nom: string;
  prenom: string | null;
  email: string | null;
  tel: string | null;
  adresse: string | null;
  cp: string | null;
  ville: string | null;
  est_entreprise: boolean;
  raison_sociale: string | null;
  siret: string | null;
  notes: string | null;
};

type Doc = {
  id: string;
  type: "devis" | "facture";
  numero: string;
  statut: DocStatut;
  total: number;
  created_at: string;
  objet: string | null;
  devis_source_id: string | null;
};

export default async function ClientDetail({ params }: { params: Promise<{ id: string }> }) {
  if (!(await getAdminUser())) redirect("/admin/login");
  const { id } = await params;
  const db = getSupabaseService();
  if (!db) notFound();

  const { data: client } = await db.from("clients").select("*").eq("id", id).maybeSingle();
  if (!client) notFound();
  const c = client as Client;

  const docs: Doc[] =
    ((
      await db
        .from("documents")
        .select("id,type,numero,statut,total,created_at,objet,devis_source_id")
        .eq("client_id", id)
        .order("created_at", { ascending: false })
    ).data as Doc[]) ?? [];

  const name = c.est_entreprise && c.raison_sociale ? c.raison_sociale : `${c.prenom ?? ""} ${c.nom}`.trim();
  const sum = (a: Doc[]) => a.reduce((s, d) => s + (Number(d.total) || 0), 0);
  const devisSignes = docs.filter((d) => d.type === "devis" && d.statut === "signe");
  const encaissees = docs.filter((d) => d.type === "facture" && d.statut === "paye");
  const aEncaisser = docs.filter((d) => d.type === "facture" && d.statut === "envoye");
  const dejaFactures = new Set(
    docs.filter((d) => d.type === "facture" && d.statut !== "annule" && d.devis_source_id).map((d) => d.devis_source_id)
  );
  const aFacturer = devisSignes.filter((d) => !dejaFactures.has(d.id));
  const adresse = [c.adresse, [c.cp, c.ville].filter(Boolean).join(" ")].filter(Boolean).join(", ");

  return (
    <>
      <Link href="/admin/clients" className="admin-back muted">
        ← Tous les clients
      </Link>
      <div className="admin-head">
        <h1>{name || "Client"}</h1>
        <Link href="/admin/documents/nouveau" className="btn btn-primary admin-btn-sm">
          + Nouveau document
        </Link>
      </div>

      <div className="admin-card admin-client-coord">
        {c.est_entreprise && c.raison_sociale && (
          <div>
            <strong>{c.raison_sociale}</strong>
            {c.siret ? ` · SIRET ${c.siret}` : ""}
          </div>
        )}
        {c.est_entreprise && (c.prenom || c.nom) && (
          <div className="muted">{`${c.prenom ?? ""} ${c.nom}`.trim()}</div>
        )}
        {adresse && <div className="muted">{adresse}</div>}
        <div className="muted">{[c.tel, c.email].filter(Boolean).join(" · ") || "—"}</div>
        {c.notes && <p className="muted" style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>{c.notes}</p>}
      </div>

      <div className="admin-stats admin-stats-3">
        <div className="admin-stat">
          <span className="admin-stat-n">{eur(sum(aFacturer))}</span>
          <span className="admin-stat-l">À facturer</span>
          <span className="admin-stat-sub">
            {devisSignes.length} devis signé{devisSignes.length > 1 ? "s" : ""}
          </span>
        </div>
        <div className="admin-stat admin-stat-warn">
          <span className="admin-stat-n">{eur(sum(aEncaisser))}</span>
          <span className="admin-stat-l">En attente de paiement</span>
          <span className="admin-stat-sub">
            {aEncaisser.length} facture{aEncaisser.length > 1 ? "s" : ""}
          </span>
        </div>
        <div className="admin-stat admin-stat-ok">
          <span className="admin-stat-n">{eur(sum(encaissees))}</span>
          <span className="admin-stat-l">Encaissé</span>
          <span className="admin-stat-sub">
            {encaissees.length} facture{encaissees.length > 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {docs.length === 0 ? (
        <div className="admin-card">
          <p className="muted">Aucun document pour ce client.</p>
        </div>
      ) : (
        <div className="admin-table">
          <div className="admin-tr admin-th">
            <span>Document</span>
            <span>Objet</span>
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
              <span className="muted">{d.objet || "—"}</span>
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
