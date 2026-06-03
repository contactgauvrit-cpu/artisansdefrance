import { redirect, notFound } from "next/navigation";
/* eslint-disable @next/next/no-img-element */
import { getAdminUser, getSupabaseService } from "@/lib/supabase";
import {
  eur,
  dateFr,
  STATUT_LABEL,
  ligneTotal,
  type Ligne,
  type ClientSnapshot,
  type DocStatut,
} from "@/lib/admin-content";
import { SITE } from "@/lib/content";
import { DocActions } from "./DocActions";

export const dynamic = "force-dynamic";

export default async function DocDetail({ params }: { params: Promise<{ id: string }> }) {
  if (!(await getAdminUser())) redirect("/admin/login");
  const { id } = await params;
  const db = getSupabaseService();
  if (!db) redirect("/admin");
  const { data: doc } = await db.from("documents").select("*").eq("id", id).maybeSingle();
  if (!doc) notFound();

  const c = (doc.client_snapshot ?? {}) as ClientSnapshot;
  const lignes = (doc.lignes ?? []) as Ligne[];
  const statut = doc.statut as DocStatut;
  const path = doc.type === "devis" ? "/devis/" : "/facture/";
  const publicLink = `${SITE.url}${path}${doc.public_token}`;
  const acompte = Math.round(Number(doc.total) * doc.acompte_pct) / 100;
  const clientName =
    c.est_entreprise && c.raison_sociale ? c.raison_sociale : `${c.prenom ?? ""} ${c.nom ?? ""}`.trim();

  return (
    <>
      <div className="admin-head">
        <h1>
          <em className={`admin-type admin-type-${doc.type}`}>{doc.type === "devis" ? "Devis" : "Facture"}</em>{" "}
          {doc.numero}
        </h1>
        <em className={`admin-badge admin-badge-${statut}`}>{STATUT_LABEL[statut]}</em>
      </div>

      <DocActions id={doc.id} type={doc.type} statut={statut} publicLink={publicLink} />

      <div className="admin-card">
        <h3 className="admin-sub">Client</h3>
        <p>
          <strong>{clientName || "—"}</strong>
          <br />
          {c.adresse && (
            <>
              {c.adresse}, {c.cp} {c.ville}
              <br />
            </>
          )}
          <span className="muted">{[c.tel, c.email].filter(Boolean).join(" · ")}</span>
          {c.est_entreprise && c.siret && <span className="muted"> · SIRET {c.siret}</span>}
        </p>
      </div>

      <div className="admin-card">
        <h3 className="admin-sub">{doc.objet || "Détail"}</h3>
        <div className="admin-table">
          <div className="admin-tr admin-th admin-tr-lignes">
            <span>Désignation</span>
            <span>Qté</span>
            <span>P.U.</span>
            <span>Total</span>
          </div>
          {lignes.map((l, i) => (
            <div key={i} className="admin-tr admin-tr-lignes">
              <span>{l.designation}</span>
              <span className="muted">{l.quantite}</span>
              <span className="muted">{eur(l.prix_unitaire)}</span>
              <span>{eur(ligneTotal(l))}</span>
            </div>
          ))}
        </div>
        <p className="admin-total">
          Total (net de TVA) : <strong>{eur(doc.total)}</strong>
        </p>
        {doc.type === "devis" && doc.acompte_pct > 0 && (
          <p className="muted">
            Acompte {doc.acompte_pct}% à la commande : <strong>{eur(acompte)}</strong>
          </p>
        )}
        <p className="muted" style={{ fontSize: 13 }}>
          TVA non applicable, art. 293 B du CGI
        </p>
      </div>

      {statut === "signe" && (
        <div className="admin-card">
          <h3 className="admin-sub">Signature</h3>
          <p>
            Signé le <strong>{doc.signe_at ? dateFr(doc.signe_at) : "—"}</strong>
            {doc.signataire_nom ? ` par ${doc.signataire_nom}` : ""}
          </p>
          {doc.signature_png && (
            <img
              src={doc.signature_png}
              alt="Signature"
              style={{ maxWidth: 240, border: "1px solid #eee", borderRadius: 8, background: "#fff" }}
            />
          )}
          <p className="muted" style={{ fontSize: 12 }}>
            IP : {doc.signer_ip || "—"}
          </p>
        </div>
      )}

      <div className="admin-card">
        <h3 className="admin-sub">Lien client (consultation / signature)</h3>
        <p className="admin-link-box">{publicLink}</p>
      </div>
    </>
  );
}
