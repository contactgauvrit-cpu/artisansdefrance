import { NextResponse } from "next/server";

type Lead = {
  nom?: string;
  tel?: string;
  email?: string;
  type?: string;
  message?: string;
};

/**
 * Réception des demandes de devis du formulaire.
 * Aujourd'hui : validation serveur + log (visible dans les logs Vercel).
 * TODO(Supabase) : persister dans la table `leads` (voir bloc commenté).
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

  // TODO(Supabase) — décommenter une fois le projet Supabase configuré :
  //
  //   import { createClient } from "@supabase/supabase-js";
  //   const supabase = createClient(
  //     process.env.SUPABASE_URL!,
  //     process.env.SUPABASE_SERVICE_ROLE_KEY!
  //   );
  //   const { error } = await supabase.from("leads").insert({
  //     nom, tel, email, type, message, source: "home",
  //   });
  //   if (error) return NextResponse.json({ ok: false, error: "db" }, { status: 500 });

  console.log("[lead]", {
    nom,
    tel,
    email,
    type,
    message: message.slice(0, 200),
  });

  return NextResponse.json({ ok: true });
}
