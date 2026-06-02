import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

type Lead = {
  nom?: string;
  tel?: string;
  email?: string;
  type?: string;
  message?: string;
};

/**
 * Réception des demandes de devis du formulaire.
 * Si Supabase est configuré (env) → insertion dans la table `leads`.
 * Sinon → log serveur (le formulaire reste fonctionnel).
 */
export async function POST(req: Request) {
  let body: Lead;
  try {
    body = (await req.json()) as Lead;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const nom = (body.nom ?? "").trim();
  const tel = (body.tel ?? "").trim();
  const email = (body.email ?? "").trim();
  const type = (body.type ?? "").trim();
  const message = (body.message ?? "").trim();

  const telOk = /^(\+33|0)\d{9}$/.test(tel.replace(/[\s.\-]/g, ""));
  const emailOk = !email || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);

  if (!nom || !telOk || !type || !message || !emailOk) {
    return NextResponse.json({ ok: false, error: "validation" }, { status: 422 });
  }

  const supabase = getSupabase();
  if (supabase) {
    const { error } = await supabase
      .from("leads")
      .insert({ nom, tel, email: email || null, type, message, source: "site" });
    if (error) {
      console.error("[lead] erreur Supabase:", error.message);
      return NextResponse.json({ ok: false, error: "db" }, { status: 500 });
    }
  } else {
    console.log("[lead] (Supabase non configuré)", {
      nom,
      tel,
      email,
      type,
      message: message.slice(0, 200),
    });
  }

  return NextResponse.json({ ok: true });
}
