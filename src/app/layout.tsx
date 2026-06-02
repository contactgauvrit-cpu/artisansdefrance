import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, JetBrains_Mono, Great_Vibes } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/content";
import {
  jsonLdScript,
  localBusinessJsonLd,
  organizationJsonLd,
  webSiteJsonLd,
} from "@/lib/schema";

const serif = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
  variable: "--font-serif",
});
const sans = Inter({ subsets: ["latin"], display: "swap", variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], display: "swap", variable: "--font-mono" });
const script = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-script",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Artisan tous travaux en Vendée & Vienne | Artisans de France",
    template: "%s | Artisans de France",
  },
  description:
    "Plomberie, électricité, climatisation, peinture et rénovation par des artisans français en Vendée, Vienne, Deux-Sèvres & Maine-et-Loire. Devis gratuit.",
  applicationName: SITE.name,
  authors: [{ name: SITE.name }],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: SITE.url,
    siteName: SITE.name,
    title: "Artisans de France — Tous vos travaux en Vendée & Vienne",
    description:
      "Tous vos travaux du sol au plafond par des artisans français. Devis gratuit en Vendée (85), Vienne (86), Deux-Sèvres (79) et Maine-et-Loire (49).",
  },
  twitter: {
    card: "summary_large_image",
    title: "Artisans de France — Tous vos travaux en Vendée & Vienne",
    description:
      "Tous vos travaux du sol au plafond par des artisans français en Vendée, Vienne et alentours. Devis gratuit.",
  },
};

export const viewport: Viewport = { themeColor: "#FAF8F5" };

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fr"
      className={`${serif.variable} ${sans.variable} ${mono.variable} ${script.variable}`}
    >
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLdScript(organizationJsonLd(), webSiteJsonLd(), localBusinessJsonLd()),
          }}
        />
      </body>
    </html>
  );
}
