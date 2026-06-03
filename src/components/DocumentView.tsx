import Image from "next/image";
import {
  EMETTEUR,
  RIB,
  TVA_MENTION,
  eur,
  dateFr,
  ligneTotal,
  type Ligne,
  type ClientSnapshot,
  type DocType,
} from "@/lib/admin-content";

export type PublicDoc = {
  type: DocType;
  numero: string;
  date_emission?: string | null;
  created_at: string;
  date_validite?: string | null;
  objet?: string | null;
  lignes: Ligne[];
  total: number;
  acompte_pct: number;
  conditions?: string | null;
  client_snapshot: ClientSnapshot;
  statut: string;
  signe_at?: string | null;
  signataire_nom?: string | null;
};

export function DocumentView({ doc }: { doc: PublicDoc }) {
  const c = doc.client_snapshot ?? {};
  const lignes = doc.lignes ?? [];
  const isDevis = doc.type === "devis";
  const acompte = Math.round(Number(doc.total) * doc.acompte_pct) / 100;
  const clientName =
    c.est_entreprise && c.raison_sociale ? c.raison_sociale : `${c.prenom ?? ""} ${c.nom ?? ""}`.trim();

  return (
    <article className="docview">
      <header className="docview-head">
        <div className="docview-brand">
          <Image src="/assets/coq-metal.png" alt="" width={40} height={44} />
          <div>
            <strong>{EMETTEUR.nom}</strong>
            <span>Création • Rénovation</span>
          </div>
        </div>
        <div className="docview-meta">
          <h1>{isDevis ? "Devis" : "Facture"}</h1>
          <span className="docview-num">N° {doc.numero}</span>
          <span className="muted">{dateFr(doc.date_emission || doc.created_at)}</span>
          {isDevis && doc.date_validite && (
            <span className="muted">Valable jusqu&apos;au {dateFr(doc.date_validite)}</span>
          )}
        </div>
      </header>

      <div className="docview-em muted">{EMETTEUR.forme}</div>

      <section className="docview-client">
        <h2>Client</h2>
        <strong>{clientName || "—"}</strong>
        {c.adresse && (
          <div>
            {c.adresse}, {c.cp} {c.ville}
          </div>
        )}
        <div className="muted">{[c.tel, c.email].filter(Boolean).join(" · ")}</div>
        {c.est_entreprise && c.siret && <div className="muted">SIRET {c.siret}</div>}
      </section>

      {doc.objet && (
        <p className="docview-objet">
          <strong>Objet :</strong> {doc.objet}
        </p>
      )}

      <table className="docview-table">
        <thead>
          <tr>
            <th>Désignation</th>
            <th>Qté</th>
            <th>P.U.</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {lignes.map((l, i) => (
            <tr key={i}>
              <td>{l.designation}</td>
              <td>{l.quantite}</td>
              <td>{eur(l.prix_unitaire)}</td>
              <td>{eur(ligneTotal(l))}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="docview-total">
        <span>Total (net de TVA)</span>
        <strong>{eur(doc.total)}</strong>
      </div>
      <div className="docview-tva muted">{TVA_MENTION}</div>

      {isDevis && doc.acompte_pct > 0 && (
        <div className="docview-acompte">
          Acompte {doc.acompte_pct}% à la commande : <strong>{eur(acompte)}</strong>
        </div>
      )}

      {doc.conditions && <p className="docview-cond muted">{doc.conditions}</p>}

      {RIB.iban && (
        <div className="docview-rib">
          <strong>Règlement par virement</strong>
          <div className="muted">
            Titulaire : {RIB.titulaire} · IBAN : {RIB.iban}
            {RIB.bic ? ` · BIC ${RIB.bic}` : ""}
          </div>
        </div>
      )}

      {doc.signe_at && (
        <div className="docview-signed">
          ✅ Signé le {dateFr(doc.signe_at)}
          {doc.signataire_nom ? ` par ${doc.signataire_nom}` : ""}
        </div>
      )}

      <footer className="docview-foot muted">
        {EMETTEUR.nom} — {EMETTEUR.forme} — {EMETTEUR.adresse}, {EMETTEUR.cp} {EMETTEUR.ville} — SIREN{" "}
        {EMETTEUR.siren} — {TVA_MENTION}
      </footer>
    </article>
  );
}
