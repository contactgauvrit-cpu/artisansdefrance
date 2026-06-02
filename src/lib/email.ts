type LeadEmail = {
  nom: string;
  tel: string;
  email: string;
  type: string;
  message: string;
};

const esc = (s: string) =>
  s.replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" })[c] ?? c);

/**
 * Notifie un nouveau devis par e-mail via l'API Brevo (transactionnel).
 * Env : BREVO_API_KEY (secret) + BREVO_SENDER_EMAIL (expéditeur sur le domaine
 * vérifié Brevo). Destinataire : LEAD_NOTIFY_EMAIL (défaut contact.gauvrit@gmail.com).
 * Ne lève jamais : si non configuré ou en échec, on log seulement (le devis est
 * déjà enregistré côté Supabase).
 */
export async function sendLeadEmail(lead: LeadEmail): Promise<boolean> {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  const to = process.env.LEAD_NOTIFY_EMAIL || "contact.gauvrit@gmail.com";
  if (!apiKey || !senderEmail) return false; // non configuré → on saute

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

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      sender: { name: "Artisans de France — Site", email: senderEmail },
      to: [{ email: to }],
      replyTo: lead.email ? { email: lead.email, name: lead.nom } : { email: senderEmail },
      subject: `Nouveau devis — ${lead.type} — ${lead.nom}`,
      htmlContent: html,
    }),
  });

  if (!res.ok) {
    const t = await res.text();
    console.error("[brevo] échec envoi:", res.status, t.slice(0, 300));
    return false;
  }
  return true;
}
