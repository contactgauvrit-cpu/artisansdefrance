import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { LocalCTA } from "@/components/LocalCTA";
import { ServiceTiles } from "@/components/ServiceTiles";
import { DEPTS, tier1ByDept } from "@/lib/communes";
import { breadcrumbJsonLd, jsonLdScript } from "@/lib/schema";

export const metadata: Metadata = {
  title:
    "Zone d'intervention — Vienne (86), Deux-Sèvres (79), Maine-et-Loire (49), Vendée (85)",
  description:
    "Artisans de France intervient en Vienne (86), Deux-Sèvres (79), Maine-et-Loire (49) et Vendée (85). Découvrez nos communes d'intervention et nos 8 services du bâtiment.",
  alternates: { canonical: "/zone" },
};

export default function ZonePage() {
  const crumbs = [
    { name: "Accueil", path: "/" },
    { name: "Zone d'intervention", path: "/zone" },
  ];
  return (
    <>
      <Header />
      <main id="top">
        <Breadcrumb items={crumbs} />
        <section className="wrap page-head">
          <span className="eyebrow">Zone d'intervention</span>
          <h1>
            Nos artisans en <em>Vienne et alentours</em>
          </h1>
        </section>

        <section className="wrap section-tight">
          <div className="prose-local">
            <p>
              Basés en Vienne, les Artisans de France interviennent sur quatre départements : la
              Vienne (86), les Deux-Sèvres (79), le Maine-et-Loire (49) et la Vendée (85).
              Sélectionnez votre département pour découvrir les communes desservies et accéder au
              service qui vous intéresse.
            </p>
          </div>
        </section>

        <section className="wrap section-tight">
          <div className="dept-hub-grid">
            {DEPTS.map((d) => (
              <Link
                key={d.code}
                href={`/zone/${d.slug}`}
                className="card-soft"
                style={{ display: "block" }}
              >
                <div className="dept-head">
                  <span className="dept-num">{d.code}</span>
                  <span className="dept-nom">{d.nom}</span>
                </div>
                <p className="dept-villes">
                  {tier1ByDept(d.code)
                    .slice(0, 6)
                    .map((c) => c.nom)
                    .join(" · ")}
                  …
                </p>
                <p
                  style={{
                    marginTop: 12,
                    color: "var(--copper)",
                    fontFamily: "var(--mono)",
                    fontSize: 12,
                    letterSpacing: ".1em",
                    textTransform: "uppercase",
                  }}
                >
                  Voir {d.le} →
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="wrap section-tight">
          <h2 className="block-title">
            Nos <em>services</em>
          </h2>
          <ServiceTiles />
        </section>

        <section className="wrap section-tight">
          <LocalCTA />
        </section>
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumbJsonLd(crumbs)) }}
      />
    </>
  );
}
