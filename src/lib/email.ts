import { SITE } from "@/lib/content";

type LeadEmail = {
  nom: string;
  tel: string;
  email: string;
  type: string;
  message: string;
};

export type SendResult = { sent: boolean; status: number; detail: string };

const esc = (s: string) =>
  s.replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" })[c] ?? c);

/**
 * Envoi transactionnel via l'API Brevo. Ne lève jamais : renvoie un statut.
 * Env requis : BREVO_API_KEY (+ BREVO_SENDER_EMAIL fourni par l'appelant).
 */
async function postBrevo(payload: object): Promise<SendResult> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) return { sent: false, status: 0, detail: "env BREVO_API_KEY manquant" };

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const t = await res.text();
    console.error("[brevo] échec envoi:", res.status, t.slice(0, 300));
    return { sent: false, status: res.status, detail: t.slice(0, 200) };
  }
  return { sent: true, status: res.status, detail: "ok" };
}

/**
 * Notifie l'artisan d'un nouveau devis (destinataire LEAD_NOTIFY_EMAIL).
 * Env : BREVO_API_KEY (secret) + BREVO_SENDER_EMAIL (expéditeur sur le domaine
 * vérifié Brevo). Ne bloque jamais le formulaire (le devis est déjà en base).
 */
export async function sendLeadEmail(lead: LeadEmail): Promise<SendResult> {
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  const to = process.env.LEAD_NOTIFY_EMAIL || "contact.gauvrit@gmail.com";
  if (!senderEmail) return { sent: false, status: 0, detail: "env BREVO_SENDER_EMAIL manquant" };

  const html = `
    <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:auto">
      <h2 style="color:#2B2B2E;margin:0 0 4px">Nouvelle demande de devis</h2>
      <p style="color:#B87333;font-size:13px;letter-spacing:.04em;margin:0 0 16px">Artisans de France</p>
      <table style="font-size:15px;border-collapse:collapse;width:100%">
        <tr><td style="padding:6px 14px 6px 0;color:#6B7280;width:120px">Nom</td><td><strong>${esc(lead.nom)}</strong></td></tr>
        <tr><td style="padding:6px 14px 6px 0;color:#6B7280">Téléphone</td><td><a href="tel:${esc(lead.tel)}" style="color:#9A5C26">${esc(lead.tel)}</a></td></tr>
        <tr><td style="padding:6px 14px 6px 0;color:#6B7280">E-mail</td><td>${lead.email ? `<a href="mailto:${esc(lead.email)}" style="color:#9A5C26">${esc(lead.email)}</a>` : "—"}</td></tr>
        <tr><td style="padding:6px 14px 6px 0;color:#6B7280">Type de projet</td><td>${esc(lead.type)}</td></tr>
      </table>
      <p style="font-size:15px;color:#2B2B2E;white-space:pre-wrap;border-left:3px solid #B87333;padding:4px 0 4px 14px;margin:16px 0">${esc(lead.message)}</p>
      <p style="font-size:12px;color:#9AA0A8">Reçu depuis artisansdefrancetravaux.fr</p>
    </div>`;

  return postBrevo({
    sender: { name: "Artisans de France — Site", email: senderEmail },
    to: [{ email: to }],
    replyTo: lead.email ? { email: lead.email, name: lead.nom } : { email: senderEmail },
    subject: `Nouveau devis — ${lead.type} — ${lead.nom}`,
    htmlContent: html,
  });
}

/**
 * Accusé de réception envoyé AU CLIENT (uniquement si une adresse e-mail a été
 * fournie). Ton chaleureux, artisan direct (« nous »). Aucune mention de
 * garantie/assurance, pas d'urgence 24h/24 — horaires Lun–Sam 8h–19h.
 */
export async function sendClientAck(lead: LeadEmail): Promise<SendResult> {
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  if (!senderEmail) return { sent: false, status: 0, detail: "env BREVO_SENDER_EMAIL manquant" };
  if (!lead.email) return { sent: false, status: 0, detail: "client sans e-mail" };

  const prenom = esc(lead.nom.split(/\s+/)[0] || lead.nom);
  const html = `
    <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:auto;color:#2B2B2E">
      <p style="color:#B87333;font-size:12px;letter-spacing:.12em;text-transform:uppercase;margin:0 0 8px">Artisans de France</p>
      <h2 style="margin:0 0 16px;font-size:21px;line-height:1.3">Bonjour ${prenom}, votre demande est bien arrivée</h2>
      <p style="font-size:15px;line-height:1.65;margin:0 0 14px">
        Merci de votre confiance. Nous avons bien reçu votre demande de devis et nous revenons vers
        vous au plus vite, pendant nos horaires d'ouverture
        (<strong>du lundi au samedi, 8h&nbsp;–&nbsp;19h</strong>).
      </p>
      <p style="font-size:15px;line-height:1.65;margin:0 0 8px">Récapitulatif de votre demande :</p>
      <table style="font-size:15px;border-collapse:collapse;width:100%;margin:0 0 18px">
        <tr><td style="padding:6px 14px 6px 0;color:#6B7280;width:110px;vertical-align:top">Projet</td><td><strong>${esc(lead.type)}</strong></td></tr>
        <tr><td style="padding:6px 14px 6px 0;color:#6B7280;vertical-align:top">Votre message</td><td style="white-space:pre-wrap">${esc(lead.message)}</td></tr>
      </table>
      <p style="font-size:15px;line-height:1.65;margin:0 0 16px">
        Une question d'ici là ? Appelez-nous directement au
        <a href="tel:${SITE.phoneHref}" style="color:#9A5C26;font-weight:600;white-space:nowrap">${SITE.phoneDisplay}</a>.
      </p>
      <p style="font-size:15px;line-height:1.65;margin:0 0 2px">À très vite,</p>
      <p style="font-size:15px;line-height:1.65;margin:0">Willy — <strong>Artisans de France</strong></p>
      <hr style="border:none;border-top:1px solid #E7E2D9;margin:22px 0 12px" />
      <p style="font-size:12px;color:#9AA0A8;line-height:1.6;margin:0">
        Plomberie · Électricité · Climatisation air/air · Peinture · Aménagement extérieur · Nettoyage<br/>
        ${SITE.phoneDisplay} · ${SITE.email} · artisansdefrancetravaux.fr
      </p>
    </div>`;

  return postBrevo({
    sender: { name: "Artisans de France", email: senderEmail },
    to: [{ email: lead.email, name: lead.nom }],
    replyTo: { email: SITE.email, name: "Artisans de France" },
    subject: "Nous avons bien reçu votre demande — Artisans de France",
    htmlContent: html,
  });
}
