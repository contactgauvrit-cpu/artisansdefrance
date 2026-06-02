import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { SITE } from "@/lib/content";

export const alt = "Artisans de France — Création & Rénovation en Vienne (86)";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Image OpenGraph / Twitter de partage — générée en code (aucune API externe).
 * Marque : crème + cuivre + coq + wordmark.
 */
export default async function OpengraphImage() {
  const coq = await readFile(join(process.cwd(), "public/assets/coq-metal.png"));
  const coqSrc = `data:image/png;base64,${coq.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#FAF8F5",
          padding: "70px 80px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* filet cuivre en haut */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: 12,
            backgroundImage: "linear-gradient(90deg,#E3AC7E,#B87333,#7C4D1C)",
          }}
        />

        {/* en-tête : coq + wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={coqSrc} width={86} height={94} alt="" />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 40, fontWeight: 700, color: "#2B2B2E", letterSpacing: -1 }}>
              Artisans de France
            </div>
            <div style={{ fontSize: 17, color: "#B87333", letterSpacing: 6, marginTop: 6 }}>
              CRÉATION • RÉNOVATION
            </div>
          </div>
        </div>

        {/* accroche */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              fontSize: 62,
              fontWeight: 700,
              color: "#2B2B2E",
              lineHeight: 1.05,
              letterSpacing: -2,
              maxWidth: 1000,
            }}
          >
            Tous vos travaux, du sol au plafond, par des artisans français
          </div>
          <div style={{ fontSize: 27, color: "#6B7280", maxWidth: 1010 }}>
            Plomberie · Électricité · Climatisation · Peinture · Extérieur · Nettoyage — Vienne
            (86), Deux-Sèvres (79), Maine-et-Loire (49), Vendée (85)
          </div>
        </div>

        {/* pied : CTA + téléphone */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              backgroundColor: "#B87333",
              color: "#ffffff",
              fontSize: 24,
              fontWeight: 600,
              padding: "14px 30px",
              borderRadius: 999,
            }}
          >
            Devis gratuit
          </div>
          <div style={{ fontSize: 23, color: "#2B2B2E" }}>{SITE.phoneDisplay}</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
