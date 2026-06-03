"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function DocActions({
  id,
  type,
  statut,
  publicLink,
}: {
  id: string;
  type: "devis" | "facture";
  statut: string;
  publicLink: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState("");
  const [msg, setMsg] = useState("");

  async function send() {
    setBusy("send");
    setMsg("");
    const r = await fetch(`/api/admin/documents/${id}/send`, { method: "POST" });
    const d = await r.json().catch(() => ({}));
    setBusy("");
    setMsg(
      d.ok
        ? "E-mail envoyé au client ✅"
        : d.error === "client_sans_email"
          ? "Le client n'a pas d'e-mail renseigné."
          : "Échec de l'envoi."
    );
    router.refresh();
  }

  async function action(a: "convert" | "paye" | "annule") {
    setBusy(a);
    setMsg("");
    const r = await fetch(`/api/admin/documents/${id}/action`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: a }),
    });
    const d = await r.json().catch(() => ({}));
    setBusy("");
    if (a === "convert" && d.id) {
      router.push(`/admin/documents/${d.id}`);
      return;
    }
    router.refresh();
  }

  function copy() {
    navigator.clipboard?.writeText(publicLink);
    setMsg("Lien copié ✅");
  }

  return (
    <div className="admin-actions">
      <a className="btn btn-ghost admin-btn-sm" href={`/api/admin/documents/${id}/pdf`} target="_blank" rel="noreferrer">
        Télécharger le PDF
      </a>
      <button className="btn btn-primary admin-btn-sm" onClick={send} disabled={!!busy}>
        {busy === "send" ? "Envoi…" : "Envoyer au client"}
      </button>
      <button className="btn btn-ghost admin-btn-sm" onClick={copy} type="button">
        Copier le lien
      </button>
      {type === "devis" && statut !== "annule" && (
        <button className="btn btn-ghost admin-btn-sm" onClick={() => action("convert")} disabled={!!busy}>
          {busy === "convert" ? "…" : "Convertir en facture"}
        </button>
      )}
      {statut !== "paye" && statut !== "annule" && (
        <button className="btn btn-ghost admin-btn-sm" onClick={() => action("paye")} disabled={!!busy}>
          Marquer payé
        </button>
      )}
      {msg && <span className="admin-msg">{msg}</span>}
    </div>
  );
}
