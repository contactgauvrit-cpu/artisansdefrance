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
 * En-tête de marque (coq + nom) pour les e-mails. Construit en table avec
 * vertical-align pour rester aligné dans tous les clients (Gmail, Apple Mail,
 * Outlook). Le logo est servi en absolu depuis le site (chargé à l'ouverture).
 */
const brandHeader = () => `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 20px"><tr>
      <td style="padding-right:11px;vertical-align:middle">
        <img src="${SITE.url}/assets/coq-metal.png" alt="Artisans de France" width="42" height="46" style="display:block;border:0;width:42px;height:auto" />
      </td>
      <td style="vertical-align:middle">
        <div style="font-family:Georgia,'Times New Roman',serif;font-size:19px;font-weight:700;color:#2B2B2E;line-height:1.1">Artisans de France</div>
        <div style="font-family:Inter,Arial,sans-serif;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#B87333;margin-top:3px">Création · Rénovation</div>
      </td>
    </tr></table>`;

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
      ${brandHeader()}
      <h2 style="color:#2B2B2E;margin:0 0 14px">Nouvelle demande de devis</h2>
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
      ${brandHeader()}
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

/* ============================================================
   ADMIN — envoi de devis/facture au client + notif signature
   ============================================================ */

/** Envoie le devis/facture au client avec un lien de consultation/signature. */
export async function sendDocumentEmail(opts: {
  to: string;
  clientName: string;
  type: "devis" | "facture";
  numero: string;
  total: string;
  link: string;
  note?: string;
}): Promise<SendResult> {
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  if (!senderEmail) return { sent: false, status: 0, detail: "env BREVO_SENDER_EMAIL manquant" };
  const estDevis = opts.type === "devis";
  const prenom = esc(opts.clientName.split(/\s+/)[0] || opts.clientName);
  const cta = estDevis ? "Consulter et signer mon devis" : "Consulter ma facture";
  const html = `
    <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:auto;color:#2B2B2E">
      ${brandHeader()}
      <h2 style="margin:0 0 14px;font-size:21px;line-height:1.3">Bonjour ${prenom}, voici votre ${estDevis ? "devis" : "facture"}</h2>
      ${opts.note ? `<p style="font-size:15px;line-height:1.65;margin:0 0 14px">${esc(opts.note).replace(/\r?\n/g, "<br>")}</p>` : ""}
      <p style="font-size:15px;line-height:1.65;margin:0 0 14px">
        Vous trouverez ci-dessous votre <strong>${estDevis ? "devis" : "facture"} n° ${esc(opts.numero)}</strong>
        d'un montant de <strong>${esc(opts.total)}</strong>.
        ${estDevis ? "Pour l'accepter, il vous suffit de le consulter et de le signer en ligne (c'est immédiat)." : ""}
      </p>
      <p style="margin:18px 0">
        <a href="${esc(opts.link)}" style="background:#B87333;color:#fff;text-decoration:none;font-weight:600;padding:13px 22px;border-radius:10px;display:inline-block">${cta}</a>
      </p>
      <p style="font-size:13px;color:#9AA0A8;margin:14px 0 0">Ou copiez ce lien : ${esc(opts.link)}</p>
      <hr style="border:none;border-top:1px solid #E7E2D9;margin:22px 0 12px" />
      <p style="font-size:12px;color:#9AA0A8;line-height:1.6;margin:0">
        Artisans de France · ${SITE.phoneDisplay} · ${SITE.email} · artisansdefrancetravaux.fr
      </p>
    </div>`;
  return postBrevo({
    sender: { name: "Artisans de France", email: senderEmail },
    to: [{ email: opts.to, name: opts.clientName }],
    replyTo: { email: SITE.email, name: "Artisans de France" },
    subject: `Votre ${estDevis ? "devis" : "facture"} n° ${opts.numero} — Artisans de France`,
    htmlContent: html,
  });
}

/** Notifie l'artisan qu'un devis a été signé. */
export async function sendSignatureNotif(opts: {
  numero: string;
  signataire: string;
  total: string;
  when: string;
}): Promise<SendResult> {
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  const to = process.env.LEAD_NOTIFY_EMAIL || "contact.gauvrit@gmail.com";
  if (!senderEmail) return { sent: false, status: 0, detail: "env BREVO_SENDER_EMAIL manquant" };
  const html = `
    <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:auto;color:#2B2B2E">
      ${brandHeader()}
      <h2 style="margin:0 0 14px">✅ Devis signé</h2>
      <p style="font-size:15px;line-height:1.6">
        Le devis <strong>n° ${esc(opts.numero)}</strong> (${esc(opts.total)}) a été
        <strong>signé</strong> par ${esc(opts.signataire)} le ${esc(opts.when)}.
      </p>
      <p style="font-size:13px;color:#9AA0A8">Retrouve le détail (acompte, signature) dans ton espace admin.</p>
    </div>`;
  return postBrevo({
    sender: { name: "Artisans de France — Site", email: senderEmail },
    to: [{ email: to }],
    subject: `✅ Devis n° ${opts.numero} signé par ${opts.signataire}`,
    htmlContent: html,
  });
}

/** Remerciement AU CLIENT après signature, avec le PDF du devis signé en pièce jointe. */
export async function sendClientSignedCopy(opts: {
  to: string;
  clientName: string;
  numero: string;
  total: string;
  pdfBase64: string;
}): Promise<SendResult> {
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  if (!senderEmail) return { sent: false, status: 0, detail: "env BREVO_SENDER_EMAIL manquant" };
  if (!opts.to) return { sent: false, status: 0, detail: "client sans e-mail" };
  const prenom = esc(opts.clientName.split(/\s+/)[0] || opts.clientName);
  const html = `
    <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:auto;color:#2B2B2E">
      ${brandHeader()}
      <h2 style="margin:0 0 14px;font-size:21px;line-height:1.3">Merci ${prenom}, votre devis est signé ✅</h2>
      <p style="font-size:15px;line-height:1.65;margin:0 0 14px">
        Nous vous confirmons la bonne signature de votre <strong>devis n° ${esc(opts.numero)}</strong>
        d'un montant de <strong>${esc(opts.total)}</strong>. Vous le trouverez <strong>signé, en pièce
        jointe</strong> (PDF) — à conserver.
      </p>
      <p style="font-size:15px;line-height:1.65;margin:0 0 14px">
        Nous revenons vers vous pour planifier l'intervention. Pour lancer les travaux, l'acompte peut
        être réglé par virement (coordonnées bancaires en bas du devis).
      </p>
      <p style="font-size:15px;line-height:1.65;margin:0 0 2px">À très vite,</p>
      <p style="font-size:15px;line-height:1.65;margin:0">Willy — <strong>Artisans de France</strong></p>
      <hr style="border:none;border-top:1px solid #E7E2D9;margin:22px 0 12px" />
      <p style="font-size:12px;color:#9AA0A8;line-height:1.6;margin:0">
        ${SITE.phoneDisplay} · ${SITE.email} · artisansdefrancetravaux.fr
      </p>
    </div>`;
  return postBrevo({
    sender: { name: "Artisans de France", email: senderEmail },
    to: [{ email: opts.to, name: opts.clientName }],
    replyTo: { email: SITE.email, name: "Artisans de France" },
    subject: `Merci — votre devis n° ${opts.numero} est signé`,
    htmlContent: html,
    attachment: [{ content: opts.pdfBase64, name: `Devis-${opts.numero}-signe.pdf` }],
  });
}
