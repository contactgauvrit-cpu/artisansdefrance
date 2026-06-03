"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { eur, dateFr, STATUT_LABEL, type ClientSnapshot, type DocStatut } from "@/lib/admin-content";

export type DocRow = {
  id: string;
  type: "devis" | "facture";
  numero: string;
  statut: DocStatut;
  total: number;
  created_at: string;
  client_snapshot: ClientSnapshot;
};

const clientName = (c: ClientSnapshot = {}) =>
  (c.est_entreprise && c.raison_sociale ? c.raison_sociale : `${c.prenom ?? ""} ${c.nom ?? ""}`.trim()) || "—";

/** minuscule + sans accents, pour une recherche tolérante. */
const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export function DocsExplorer({ docs }: { docs: DocRow[] }) {
  const [q, setQ] = useState("");
  const term = norm(q.trim());

  const filtered = useMemo(() => {
    if (!term) return docs;
    return docs.filter((d) => {
      const c = d.client_snapshot ?? {};
      const hay = norm(
        [clientName(c), d.numero, d.type === "devis" ? "devis" : "facture", c.email, c.ville, c.tel]
          .filter(Boolean)
          .join(" ")
      );
      return hay.includes(term);
    });
  }, [docs, term]);

  return (
    <div className="admin-explorer">
      <input
        type="search"
        className="admin-search"
        placeholder="🔍  Rechercher un client, un n° (DEV-… / FAC-…)…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        autoComplete="off"
        aria-label="Rechercher un client ou un document"
      />

      {docs.length === 0 ? (
        <div className="admin-card">
          <p className="muted">Aucun document pour l&apos;instant.</p>
          <Link href="/admin/documents/nouveau" className="btn btn-primary admin-btn-sm">
            Créer ton premier devis
          </Link>
        </div>
      ) : filtered.length === 0 ? (
        <div className="admin-card">
          <p className="muted">Aucun résultat pour « {q} ».</p>
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
          {filtered.map((d) => (
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
          {term && (
            <div className="admin-explorer-count muted">
              {filtered.length} résultat{filtered.length > 1 ? "s" : ""} sur {docs.length}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
