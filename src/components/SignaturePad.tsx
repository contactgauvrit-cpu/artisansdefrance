"use client";

import { useEffect, useRef, useState } from "react";
import SignaturePadLib from "signature_pad";

export function SignaturePad({ token }: { token: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const padRef = useRef<SignaturePadLib | null>(null);
  const [nom, setNom] = useState("");
  const [accord, setAccord] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    padRef.current = new SignaturePadLib(c, { penColor: "#2B2B2E", backgroundColor: "#fff" });
    const resize = () => {
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      const data = padRef.current?.toData();
      c.width = c.offsetWidth * ratio;
      c.height = c.offsetHeight * ratio;
      c.getContext("2d")?.scale(ratio, ratio);
      padRef.current?.clear();
      if (data) padRef.current?.fromData(data);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  async function submit() {
    setErr("");
    if (!accord) return setErr("Veuillez cocher « Bon pour accord ».");
    if (!padRef.current || padRef.current.isEmpty()) return setErr("Merci de signer dans le cadre.");
    setBusy(true);
    const png = padRef.current.toDataURL("image/png");
    const r = await fetch(`/api/sign/${token}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ signataire_nom: nom.trim(), signature_png: png, accord: true }),
    });
    setBusy(false);
    if (!r.ok) {
      setErr("Échec de l'enregistrement, réessayez.");
      return;
    }
    setDone(true);
    setTimeout(() => location.reload(), 1400);
  }

  if (done) return <div className="docsign-done">Merci ! Votre devis est signé. ✅</div>;

  return (
    <div className="docsign">
      <h2>Signer le devis</h2>
      <p className="muted">Bon pour accord — signez ci-dessous avec votre doigt ou la souris.</p>
      <label className="docsign-nom">
        Votre nom
        <input value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Nom et prénom" />
      </label>
      <div className="docsign-pad">
        <canvas ref={canvasRef} />
        <button type="button" className="docsign-clear" onClick={() => padRef.current?.clear()}>
          Effacer
        </button>
      </div>
      <label className="docsign-accord">
        <input type="checkbox" checked={accord} onChange={(e) => setAccord(e.target.checked)} />
        Je reconnais avoir pris connaissance du devis et je l&apos;accepte (bon pour accord).
      </label>
      {err && <p className="admin-err">{err}</p>}
      <button className="btn btn-primary" onClick={submit} disabled={busy} type="button">
        {busy ? "Enregistrement…" : "Signer et accepter le devis"}
      </button>
    </div>
  );
}
