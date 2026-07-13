import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { sendLeadEmail, sendClientAck } from "@/lib/email";

type Lead = {
  nom?: string;
  tel?: string;
  email?: string;
  code_postal?: string;
  type?: string;
  message?: string;
};

/**
 * Réception des demandes de devis du formulaire.
 * 1) validation 2) insertion Supabase (si configuré) 3) notification e-mail Brevo
 * (si configuré). L'échec d'e-mail ne fait pas échouer le formulaire.
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
  const code_postal = (body.code_postal ?? "").trim();
  const type = (body.type ?? "").trim();
  const message = (body.message ?? "").trim();

  const telOk = /^(\+33|0)\d{9}$/.test(tel.replace(/[\s.\-]/g, ""));
  const emailOk = !email || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);

  if (!nom || !telOk || !type || !message || !emailOk) {
    return NextResponse.json({ ok: false, error: "validation" }, { status: 422 });
  }

  // 2) Persistance Supabase
  const supabase = getSupabase();
  if (supabase) {
    const base = { nom, tel, email: email || null, type, message, source: "site" };
    let { error } = await supabase.from("leads").insert({ ...base, code_postal: code_postal || null });
    if (error && /code_postal|column|schema cache/i.test(error.message)) {
      // colonne code_postal pas encore ajoutée en base : on enregistre le lead sans, pour ne rien perdre
      ({ error } = await supabase.from("leads").insert(base));
    }
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

  // 3) Notifications e-mail (Brevo) — n'échouent jamais le formulaire (devis déjà en base)
  const lead = { nom, tel, email, code_postal, type, message };
  let emailRes = { sent: false, status: 0, detail: "" };
  let ackRes = { sent: false, status: 0, detail: "" };
  try {
    emailRes = await sendLeadEmail(lead); // notification artisan
  } catch (e) {
    console.error("[lead] erreur e-mail artisan:", (e as Error).message);
  }
  try {
    ackRes = await sendClientAck(lead); // accusé de réception client (si e-mail fourni)
  } catch (e) {
    console.error("[lead] erreur e-mail client:", (e as Error).message);
  }

  return NextResponse.json({ ok: true, emailed: emailRes.sent, ack: ackRes.sent });
}
