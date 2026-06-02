import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { LocalCTA } from "@/components/LocalCTA";
import { SERVICES } from "@/lib/content";
import { serviceMeta } from "@/lib/services-meta";
import { DEPTS, deptBySlug, tier1ByDept } from "@/lib/communes";
import { breadcrumbJsonLd, jsonLdScript } from "@/lib/schema";

type Props = { params: Promise<{ departement: string }> };

export const dynamicParams = false;
export const revalidate = 86400;

export function generateStaticParams() {
  return DEPTS.map((d) => ({ departement: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { departement } = await params;
  const dept = deptBySlug(departement);
  if (!dept) return {};
  const path = `/zone/${dept.slug}`;
  return {
    title: `Artisans en ${dept.nom} (${dept.code}) — Plomberie, électricité, rénovation | Artisans de France`,
    description: `Artisans de France intervient ${dept.en} (${dept.code}), à ${dept.prefecture} comme dans les communes alentour : plomberie, électricité, rénovation, peinture, piscine. Devis gratuit.`,
    alternates: { canonical: path },
    openGraph: { url: path, type: "website" },
  };
}

export default async function DeptHubPage({ params }: Props) {
  const { departement } = await params;
  const dept = deptBySlug(departement);
  if (!dept) notFound();
  const communes = tier1ByDept(dept.code);
  const crumbs = [
    { name: "Accueil", path: "/" },
    { name: "Zone d'intervention", path: "/zone" },
    { name: `${dept.nom} (${dept.code})`, path: `/zone/${dept.slug}` },
  ];

  return (
    <>
      <Header />
      <main id="top">
        <Breadcrumb items={crumbs} />
        <section className="wrap page-head">
          <span className="eyebrow">Zone d'intervention</span>
          <h1>
            Artisans en <em>{dept.nom}</em> ({dept.code})
          </h1>
        </section>

        <section className="wrap section-tight">
          <div className="prose-local">
            <p>
              Artisans de France intervient {dept.en} ({dept.code}) : à {dept.prefecture} comme
              dans les communes alentour. Plomberie, électricité, climatisation,
              rénovation, peinture, aménagement intérieur et extérieur, piscine : un seul
              interlocuteur pour l'ensemble de vos travaux. Choisissez votre commune et le service
              recherché.
            </p>
          </div>
        </section>

        <section className="wrap section-tight">
          <h2 className="block-title">
            Communes desservies en <em>{dept.nom}</em>
          </h2>
          <div>
            {communes.map((co) => (
              <div className="commune-block" key={co.code}>
                <div className="cb-head">
                  <span className="nm">{co.nom}</span>
                  <span className="pp">
                    {co.cp} · {co.pop.toLocaleString("fr-FR")} hab.
                  </span>
                </div>
                <div className="link-cloud">
                  {SERVICES.map((s) => (
                    <Link key={s.slug} href={`/${s.slug}/${co.slug}`} className="chip">
                      {serviceMeta(s.slug).h1Trade}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
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
