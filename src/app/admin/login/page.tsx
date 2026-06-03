"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabaseBrowser } from "@/lib/supabase-browser";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    const supabase = supabaseBrowser();
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password: pw,
    });
    setLoading(false);
    if (error) {
      setErr("E-mail ou mot de passe incorrect.");
      return;
    }
    router.replace("/admin");
    router.refresh();
  }

  return (
    <div className="admin-login">
      <form className="admin-login-card" onSubmit={submit}>
        <Image src="/assets/coq-metal.png" alt="Artisans de France" width={48} height={53} />
        <h1>Espace admin</h1>
        <p className="muted">Artisans de France — devis &amp; factures</p>
        <label>
          E-mail
          <input
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Mot de passe
          <input
            type="password"
            autoComplete="current-password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            required
          />
        </label>
        {err && <p className="admin-err">{err}</p>}
        <button className="btn btn-primary" disabled={loading} type="submit">
          {loading ? "Connexion…" : "Se connecter"}
        </button>
      </form>
    </div>
  );
}
