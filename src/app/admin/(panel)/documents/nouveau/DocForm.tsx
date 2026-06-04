"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  docTotal,
  eur,
  DEFAULT_CONDITIONS_DEVIS,
  DEFAULT_CONDITIONS_FACTURE,
  type Ligne,
} from "@/lib/admin-content";

export type ClientLite = {
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
};

const empty = {
  nom: "",
  prenom: "",
  email: "",
  tel: "",
  adresse: "",
  cp: "",
  ville: "",
  est_entreprise: false,
  raison_sociale: "",
  siret: "",
};

export function DocForm({ clients }: { clients: ClientLite[] }) {
  const router = useRouter();
  const [type, setType] = useState<"devis" | "facture">("devis");
  const [clientId, setClientId] = useState("");
  const [client, setClient] = useState({ ...empty });
  const [saveClient, setSaveClient] = useState(true);
  const [objet, setObjet] = useState("");
  const [message, setMessage] = useState("");
  const [acompte, setAcompte] = useState(50);
  const [conditions, setConditions] = useState(DEFAULT_CONDITIONS_DEVIS);
  const [editedCond, setEditedCond] = useState(false);
  const [lignes, setLignes] = useState<Ligne[]>([{ designation: "", quantite: 1, prix_unitaire: 0 }]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const total = useMemo(() => docTotal(lignes), [lignes]);

  function switchType(t: "devis" | "facture") {
    setType(t);
    if (!editedCond) setConditions(t === "devis" ? DEFAULT_CONDITIONS_DEVIS : DEFAULT_CONDITIONS_FACTURE);
  }
  function pickClient(id: string) {
    setClientId(id);
    const c = clients.find((x) => x.id === id);
    if (c)
      setClient({
        nom: c.nom ?? "",
        prenom: c.prenom ?? "",
        email: c.email ?? "",
        tel: c.tel ?? "",
        adresse: c.adresse ?? "",
        cp: c.cp ?? "",
        ville: c.ville ?? "",
        est_entreprise: c.est_entreprise,
        raison_sociale: c.raison_sociale ?? "",
        siret: c.siret ?? "",
      });
    else setClient({ ...empty });
  }
  const setLigne = (i: number, k: keyof Ligne, v: string) =>
    setLignes((ls) => ls.map((l, j) => (j === i ? { ...l, [k]: k === "designation" ? v : Number(v) } : l)));
  const addLigne = () => setLignes((ls) => [...ls, { designation: "", quantite: 1, prix_unitaire: 0 }]);
  const delLigne = (i: number) => setLignes((ls) => (ls.length > 1 ? ls.filter((_, j) => j !== i) : ls));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    if (!client.nom.trim()) return setErr("Le nom du client est requis.");
    if (!lignes.some((l) => l.designation.trim())) return setErr("Ajoute au moins une ligne.");
    setBusy(true);
    const res = await fetch("/api/admin/documents", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        type,
        client,
        client_id: clientId || null,
        save_client: saveClient,
        objet,
        message,
        conditions,
        acompte_pct: acompte,
        lignes: lignes.filter((l) => l.designation.trim()),
      }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) return setErr(data.error || "Erreur lors de la création.");
    router.push(`/admin/documents/${data.id}`);
  }

  return (
    <form className="admin-form" onSubmit={submit}>
      <div className="admin-seg">
        <button type="button" className={type === "devis" ? "on" : ""} onClick={() => switchType("devis")}>
          Devis
        </button>
        <button type="button" className={type === "facture" ? "on" : ""} onClick={() => switchType("facture")}>
          Facture
        </button>
      </div>

      <fieldset className="admin-card">
        <legend>Client</legend>
        {clients.length > 0 && (
          <label>
            Client existant
            <select value={clientId} onChange={(e) => pickClient(e.target.value)}>
              <option value="">— Nouveau client —</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.est_entreprise && c.raison_sociale ? c.raison_sociale : `${c.prenom ?? ""} ${c.nom}`}
                </option>
              ))}
            </select>
          </label>
        )}
        <label className="admin-check">
          <input
            type="checkbox"
            checked={client.est_entreprise}
            onChange={(e) => setClient({ ...client, est_entreprise: e.target.checked })}
          />
          C'est une entreprise
        </label>
        <div className="admin-grid2">
          <label>
            Prénom
            <input value={client.prenom} onChange={(e) => setClient({ ...client, prenom: e.target.value })} />
          </label>
          <label>
            Nom *
            <input value={client.nom} onChange={(e) => setClient({ ...client, nom: e.target.value })} required />
          </label>
        </div>
        {client.est_entreprise && (
          <div className="admin-grid2">
            <label>
              Raison sociale
              <input
                value={client.raison_sociale}
                onChange={(e) => setClient({ ...client, raison_sociale: e.target.value })}
              />
            </label>
            <label>
              SIRET
              <input value={client.siret} onChange={(e) => setClient({ ...client, siret: e.target.value })} />
            </label>
          </div>
        )}
        <div className="admin-grid2">
          <label>
            E-mail
            <input
              type="email"
              value={client.email}
              onChange={(e) => setClient({ ...client, email: e.target.value })}
            />
          </label>
          <label>
            Téléphone
            <input value={client.tel} onChange={(e) => setClient({ ...client, tel: e.target.value })} />
          </label>
        </div>
        <label>
          Adresse
          <input value={client.adresse} onChange={(e) => setClient({ ...client, adresse: e.target.value })} />
        </label>
        <div className="admin-grid2">
          <label>
            Code postal
            <input value={client.cp} onChange={(e) => setClient({ ...client, cp: e.target.value })} />
          </label>
          <label>
            Ville
            <input value={client.ville} onChange={(e) => setClient({ ...client, ville: e.target.value })} />
          </label>
        </div>
        <label className="admin-check">
          <input type="checkbox" checked={saveClient} onChange={(e) => setSaveClient(e.target.checked)} />
          Enregistrer ce client
        </label>
      </fieldset>

      <fieldset className="admin-card">
        <legend>Détail</legend>
        <label>
          Objet
          <input
            value={objet}
            onChange={(e) => setObjet(e.target.value)}
            placeholder="Ex. Rénovation salle de bain"
          />
        </label>
        <label>
          Message / précisions (optionnel)
          <textarea
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Note libre affichée sur le document : planning, ce qui est inclus / exclu, accès au chantier…"
          />
        </label>
        <div className="admin-lignes">
          <div className="admin-ligne admin-ligne-h">
            <span>Désignation</span>
            <span>Qté</span>
            <span>P.U. (€)</span>
            <span>Total</span>
            <span></span>
          </div>
          {lignes.map((l, i) => (
            <div className="admin-ligne" key={i}>
              <input
                value={l.designation}
                onChange={(e) => setLigne(i, "designation", e.target.value)}
                placeholder="Prestation / fourniture"
              />
              <input
                type="number"
                min="0"
                step="0.01"
                value={l.quantite}
                onChange={(e) => setLigne(i, "quantite", e.target.value)}
              />
              <input
                type="number"
                min="0"
                step="0.01"
                value={l.prix_unitaire}
                onChange={(e) => setLigne(i, "prix_unitaire", e.target.value)}
              />
              <span className="admin-ligne-tot">{eur((l.quantite || 0) * (l.prix_unitaire || 0))}</span>
              <button type="button" className="admin-del" onClick={() => delLigne(i)} aria-label="Supprimer">
                ✕
              </button>
            </div>
          ))}
        </div>
        <button type="button" className="btn btn-ghost admin-btn-sm" onClick={addLigne}>
          + Ajouter une ligne
        </button>
        <div className="admin-total">
          Total (net de TVA) : <strong>{eur(total)}</strong>
        </div>
        {type === "devis" && (
          <label>
            Acompte à la commande (%)
            <input
              type="number"
              min="0"
              max="100"
              value={acompte}
              onChange={(e) => setAcompte(Number(e.target.value))}
            />
          </label>
        )}
        <label>
          Conditions / mentions
          <textarea
            rows={3}
            value={conditions}
            onChange={(e) => {
              setConditions(e.target.value);
              setEditedCond(true);
            }}
          />
        </label>
      </fieldset>

      {err && <p className="admin-err">{err}</p>}
      <button className="btn btn-primary" type="submit" disabled={busy}>
        {busy ? "Création…" : `Créer le ${type}`}
      </button>
    </form>
  );
}
