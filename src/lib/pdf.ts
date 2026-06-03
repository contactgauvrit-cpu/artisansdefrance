import { PDFDocument, StandardFonts, rgb, type PDFFont } from "pdf-lib";
import {
  EMETTEUR,
  RIB,
  TVA_MENTION,
  eur,
  dateFr,
  ligneTotal,
  docTotal,
  type Ligne,
  type ClientSnapshot,
  type DocType,
} from "./admin-content";
import { SITE } from "./content";

/** Garantit un texte encodable en WinAnsi (polices standard pdf-lib) — anti-crash. */
function winAnsiSafe(input: unknown): string {
  const str = String(input ?? "");
  let out = "";
  for (const ch of str) {
    const c = ch.codePointAt(0) ?? 32;
    if (c === 0x202f || c === 0x2009 || c === 0x200a || c === 0x2007 || c === 0x00a0) out += " ";
    else if (c === 0x2014 || c === 0x2013) out += "-";
    else if (c === 0x2018 || c === 0x2019) out += "'";
    else if (c === 0x201c || c === 0x201d) out += '"';
    else if (c === 0x2022) out += "·";
    else if (c <= 0xff || c === 0x20ac || c === 0x0152 || c === 0x0153) out += ch;
    else out += " ";
  }
  return out;
}

const COPPER = rgb(0.722, 0.451, 0.2);
const INK = rgb(0.169, 0.169, 0.18);
const GRAY = rgb(0.42, 0.45, 0.5);
const RULE = rgb(0.86, 0.86, 0.86);
const WASH = rgb(0.965, 0.925, 0.882);

/** Nettoie le texte pour l'encodage WinAnsi des polices standard (évite les crashs). */
const san = (s: unknown) =>
  String(s ?? "")
    .replace(/[     ]/g, " ")
    .replace(/[   ]/g, " ")
    .replace(/[—–]/g, "-")
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"');

export type DocForPdf = {
  type: DocType;
  numero: string;
  date_emission: string;
  date_validite?: string | null;
  objet?: string | null;
  lignes: Ligne[];
  total: number;
  acompte_pct: number;
  conditions?: string | null;
  client_snapshot: ClientSnapshot;
  signataire_nom?: string | null;
  signe_at?: string | null;
  signature_png?: string | null;
};

async function fetchLogo(): Promise<Uint8Array | null> {
  try {
    const r = await fetch(`${SITE.url}/assets/coq-metal.png`);
    if (!r.ok) return null;
    return new Uint8Array(await r.arrayBuffer());
  } catch {
    return null;
  }
}

export async function buildDocumentPdf(doc: DocForPdf): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595.28, 841.89]); // A4
  const reg = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const { width, height } = page.getSize();
  const M = 48;
  let y = height - M;

  const text = (
    s: unknown,
    x: number,
    yy: number,
    size = 10,
    font: PDFFont = reg,
    color = INK
  ) => page.drawText(winAnsiSafe(s), { x, y: yy, size, font, color });
  const right = (s: unknown, xRight: number, yy: number, size = 10, font: PDFFont = reg, color = INK) => {
    const str = winAnsiSafe(s);
    const w = font.widthOfTextAtSize(str, size);
    page.drawText(str, { x: xRight - w, y: yy, size, font, color });
  };

  // ---- En-tête : logo + émetteur (gauche), titre doc (droite) ----
  const logo = await fetchLogo();
  if (logo) {
    const img = await pdf.embedPng(logo);
    const h = 46;
    const w = (img.width / img.height) * h;
    page.drawImage(img, { x: M, y: y - h + 6, width: w, height: h });
    text(EMETTEUR.nom, M + w + 12, y - 8, 15, bold);
    text("Création • Rénovation", M + w + 12, y - 24, 9, reg, COPPER);
  } else {
    text(EMETTEUR.nom, M, y - 8, 15, bold);
  }

  const title = doc.type === "devis" ? "DEVIS" : "FACTURE";
  right(title, width - M, y - 4, 22, bold, COPPER);
  right(`N° ${doc.numero}`, width - M, y - 24, 10, bold);
  right(`Date : ${dateFr(doc.date_emission)}`, width - M, y - 38, 9, reg, GRAY);
  if (doc.type === "devis" && doc.date_validite)
    right(`Valable jusqu'au ${dateFr(doc.date_validite)}`, width - M, y - 50, 9, reg, GRAY);

  y -= 70;
  // émetteur (petites lignes)
  text(`${EMETTEUR.forme} — ${EMETTEUR.dirigeant}`, M, y, 8.5, reg, GRAY);
  text(`${EMETTEUR.adresse}, ${EMETTEUR.cp} ${EMETTEUR.ville}`, M, y - 11, 8.5, reg, GRAY);
  text(`SIREN ${EMETTEUR.siren} · ${EMETTEUR.tel} · ${EMETTEUR.email}`, M, y - 22, 8.5, reg, GRAY);

  y -= 44;
  page.drawLine({ start: { x: M, y }, end: { x: width - M, y }, thickness: 1, color: RULE });
  y -= 22;

  // ---- Client ----
  const c = doc.client_snapshot || {};
  text("CLIENT", M, y, 9, bold, COPPER);
  const cName = c.est_entreprise && c.raison_sociale ? c.raison_sociale : `${c.prenom ?? ""} ${c.nom ?? ""}`.trim();
  text(cName || "—", M, y - 16, 11, bold);
  let cy = y - 30;
  const cline = (s?: string) => {
    if (s) {
      text(s, M, cy, 9, reg, GRAY);
      cy -= 12;
    }
  };
  cline([c.adresse, [c.cp, c.ville].filter(Boolean).join(" ")].filter(Boolean).join(", "));
  cline([c.tel, c.email].filter(Boolean).join(" · "));
  if (c.est_entreprise && c.siret) cline(`SIRET ${c.siret}`);

  if (doc.objet) {
    cy -= 6;
    text("Objet : ", M, cy, 9, bold);
    text(doc.objet, M + reg.widthOfTextAtSize("Objet : ", 9) + 4, cy, 9, reg);
    cy -= 14;
  }
  y = cy - 14;

  // ---- Tableau des lignes ----
  const colDesc = M;
  const qteR = M + 318; // bord droit colonne Qté
  const puR = M + 410; // bord droit colonne P.U.
  const totR = width - M - 2; // bord droit colonne Total
  page.drawRectangle({ x: M, y: y - 4, width: width - 2 * M, height: 20, color: WASH });
  text("Désignation", colDesc + 6, y + 1, 9, bold);
  right("Qté", qteR, y + 1, 9, bold);
  right("P.U.", puR, y + 1, 9, bold);
  right("Total", totR, y + 1, 9, bold);
  y -= 22;

  for (const l of doc.lignes) {
    const desc = san(l.designation);
    // wrap simple de la désignation (largeur de la colonne)
    const lines = wrap(desc, 46);
    for (let i = 0; i < lines.length; i++) text(lines[i], colDesc + 6, y - i * 11, 9.5);
    right(String(l.quantite), qteR, y, 9.5, reg, GRAY);
    right(eur(l.prix_unitaire), puR, y, 9.5, reg, GRAY);
    right(eur(ligneTotal(l)), totR, y, 9.5, reg);
    y -= 11 * Math.max(1, lines.length) + 8;
    page.drawLine({ start: { x: M, y: y + 4 }, end: { x: width - M, y: y + 4 }, thickness: 0.5, color: RULE });
  }

  // ---- Totaux ----
  y -= 10;
  const total = doc.total ?? docTotal(doc.lignes);
  right("Total (net de TVA)", puR, y, 10, bold);
  right(eur(total), totR, y, 11, bold, COPPER);
  y -= 14;
  right(TVA_MENTION, totR, y, 8, reg, GRAY);
  y -= 18;
  if (doc.type === "devis" && doc.acompte_pct > 0) {
    const ac = Math.round(total * doc.acompte_pct) / 100;
    right(`Acompte ${doc.acompte_pct}% à la commande : ${eur(ac)}`, totR, y, 9.5, bold, INK);
    y -= 16;
  }

  // ---- Conditions + RIB ----
  y -= 8;
  if (doc.conditions) {
    text("Conditions", M, y, 9, bold, COPPER);
    y -= 13;
    for (const ln of wrap(san(doc.conditions), 95)) {
      text(ln, M, y, 8.5, reg, GRAY);
      y -= 11;
    }
    y -= 6;
  }
  if (RIB.iban) {
    text("Règlement par virement", M, y, 9, bold, COPPER);
    y -= 13;
    text(`Titulaire : ${RIB.titulaire}`, M, y, 8.5, reg, GRAY);
    y -= 11;
    text(`IBAN : ${RIB.iban}${RIB.bic ? "   BIC : " + RIB.bic : ""}`, M, y, 8.5, reg, GRAY);
    y -= 16;
  }

  // ---- Signature (devis signé) ----
  if (doc.signe_at && doc.signature_png) {
    try {
      const b64 = doc.signature_png.split(",").pop() ?? "";
      const sigImg = await pdf.embedPng(Uint8Array.from(Buffer.from(b64, "base64")));
      const sh = 50;
      const sw = Math.min(150, (sigImg.width / sigImg.height) * sh);
      text("Bon pour accord", M, y, 9, bold);
      page.drawImage(sigImg, { x: M, y: y - sh - 6, width: sw, height: sh });
      text(`Signé le ${dateFr(doc.signe_at)}${doc.signataire_nom ? " par " + doc.signataire_nom : ""}`, M, y - sh - 18, 8, reg, GRAY);
    } catch {
      /* signature illisible : on ignore */
    }
  }

  // ---- Pied légal ----
  const footer = `${EMETTEUR.nom} — ${EMETTEUR.forme} — ${EMETTEUR.adresse}, ${EMETTEUR.cp} ${EMETTEUR.ville} — SIREN ${EMETTEUR.siren} — ${TVA_MENTION} — ${EMETTEUR.site}`;
  const fw = reg.widthOfTextAtSize(winAnsiSafe(footer), 7);
  text(footer, Math.max(M, (width - fw) / 2), 30, 7, reg, GRAY);

  return pdf.save();
}

function wrap(s: string, max: number): string[] {
  const words = s.split(/\s+/);
  const out: string[] = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > max) {
      if (cur) out.push(cur);
      cur = w;
    } else cur = (cur + " " + w).trim();
  }
  if (cur) out.push(cur);
  return out.length ? out : [""];
}
