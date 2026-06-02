import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { sendLeadEmail } from "@/lib/email";

type Lead = {
  nom?: string;
  tel?: string;
  email?: string;
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

  // 3) Notification e-mail (Brevo) — ne bloque pas le succès si échec
  let emailRes = { sent: false, status: 0, detail: "" };
  try {
    emailRes = await sendLeadEmail({ nom, tel, email, type, message });
  } catch (e) {
    emailRes = { sent: false, status: 0, detail: (e as Error).message.slice(0, 200) };
    console.error("[lead] erreur e-mail:", (e as Error).message);
  }

  // emailStatus/emailDetail = debug temporaire pour diagnostiquer Brevo
  return NextResponse.json({
    ok: true,
    emailed: emailRes.sent,
    emailStatus: emailRes.status,
    emailDetail: emailRes.detail,
  });
}
