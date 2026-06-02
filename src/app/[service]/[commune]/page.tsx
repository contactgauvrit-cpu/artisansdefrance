import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { LocalCTA } from "@/components/LocalCTA";
import { ServiceTiles } from "@/components/ServiceTiles";
import { SERVICES, SITE } from "@/lib/content";
import { serviceBySlug, serviceMeta } from "@/lib/services-meta";
import { buildServiceCommune } from "@/lib/page-content";
import { communeBySlug, deptByCode, deptName, neighbors, ssgCommunes } from "@/lib/communes";
import { breadcrumbJsonLd, faqPageJsonLd, jsonLdScript, serviceJsonLd } from "@/lib/schema";
import { IconArrow, IconPhone } from "@/lib/icons";

type Props = { params: Promise<{ service: string; commune: string }> };

export const dynamicParams = true; // communes hors SSG → ISR
export const revalidate = 86400;

export function generateStaticParams() {
  const communes = ssgCommunes(); // Tier 1 ∪ communes prioritaires (Vendée)
  const params: { service: string; commune: string }[] = [];
  for (const s of SERVICES) for (const c of communes) params.push({ service: s.slug, commune: c.slug });
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { service: ss, commune: cs } = await params;
  const service = serviceBySlug(ss);
  const commune = communeBySlug(cs);
  if (!service || !commune) return {};
  const c = buildServiceCommune(service, commune);
  const path = `/${ss}/${cs}`;
  return {
    title: { absolute: c.title },
    description: c.description,
    alternates: { canonical: path },
    openGraph: { title: c.title, description: c.description, url: path, type: "website" },
  };
}

export default async function ServiceCommunePage({ params }: Props) {
  const { service: ss, commune: cs } = await params;
  const service = serviceBySlug(ss);
  const commune = communeBySlug(cs);
  if (!service || !commune) notFound();

  const meta = serviceMeta(ss);
  const c = buildServiceCommune(service, commune);
  const dn = deptName(commune.dept);
  const dept = deptByCode(commune.dept)!;
  const sl = service.title.toLowerCase();
  const path = `/${ss}/${cs}`;
  const nbs = neighbors(commune, 8);
  const crumbs = [
    { name: "Accueil", path: "/" },
    { name: service.title, path: `/${ss}` },
    { name: commune.nom, path },
  ];

  return (
    <>
      <Header />
      <main id="top">
        <Breadcrumb items={crumbs} />

        {/* En-tête : H1 + accroche + CTA above-the-fold */}
        <section className="wrap page-head">
          <span className="eyebrow">
            {service.title} · {dn} ({commune.dept})
          </span>
          <h1>
            {meta.h1Trade} à <em>{commune.nom}</em>{" "}
            <span style={{ color: "var(--gray-2)" }}>({commune.cp})</span>
          </h1>
          <p className="lede">
            Des artisans locaux de confiance pour tous vos travaux de {sl} à {commune.nom} et ses
            alentours.
          </p>
          <div className="hero-cta">
            <a href="/#contact" className="btn btn-primary">
              Demander un devis gratuit
              <IconArrow />
            </a>
            <a href={`tel:${SITE.phoneHref}`} className="btn btn-ghost">
              <IconPhone />
              {SITE.phoneDisplay}
            </a>
          </div>
        </section>

        {/* Intro localisée */}
        <section className="wrap section-tight">
          <div className="prose-local">
            {c.intro.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            {c.localContext.map((p, i) => (
              <p key={`lc${i}`} className="muted">
                {p}
              </p>
            ))}
          </div>
        </section>

        {/* Prestations */}
        <section className="wrap section-tight">
          <h2 className="block-title">
            Nos prestations de <em>{sl}</em> à {commune.nom}
          </h2>
          <ul className="prestations two" style={{ maxWidth: 880 }}>
            {c.prestations.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </section>

        {/* Réassurance */}
        <section className="wrap section-tight">
          <h2 className="block-title">
            Pourquoi choisir nos artisans en <em>{dn}</em> ({commune.dept}) ?
          </h2>
          <ul className="prestations" style={{ maxWidth: 760 }}>
            {c.reasons.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </section>

        {/* Zone d'intervention autour de la ville (maillage local) */}
        <section className="wrap section-tight">
          <h2 className="block-title">
            Zone d&apos;intervention autour de <em>{commune.nom}</em>
          </h2>
          <p className="prose-local" style={{ marginBottom: 16 }}>
            Nous intervenons à {commune.nom} et dans les communes voisines :
          </p>
          <div className="link-cloud">
            {nbs.map((n) => (
              <Link key={n.code} href={`/${ss}/${n.slug}`} className="chip">
                {meta.h1Trade} à {n.nom}
              </Link>
            ))}
            <Link href={`/${ss}`} className="chip" style={{ borderStyle: "dashed" }}>
              Toutes les communes →
            </Link>
            <Link href={`/zone/${dept.slug}`} className="chip" style={{ borderStyle: "dashed" }}>
              {dn} ({commune.dept}) →
            </Link>
          </div>
        </section>

        {/* FAQ locale */}
        <section className="wrap section-tight">
          <h2 className="block-title">
            Questions <em>fréquentes</em> — {meta.h1Trade.toLowerCase()} à {commune.nom}
          </h2>
          <div className="faq-list">
            {c.faq.map((f, i) => (
              <div className="faq-item" key={i}>
                <h3>{f.q}</h3>
                <p>{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="wrap section-tight">
          <LocalCTA commune={commune.nom} />
        </section>

        {/* Autres services dans la même commune */}
        <section className="wrap section-tight">
          <h2 className="block-title">
            Nos autres services à <em>{commune.nom}</em>
          </h2>
          <ServiceTiles excludeSlug={ss} communeSlug={cs} />
        </section>
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(
            serviceJsonLd({
              serviceName: `${meta.h1Trade} à ${commune.nom}`,
              communeNom: commune.nom,
              region: dn,
              postalCode: commune.cp,
              url: `${SITE.url}${path}`,
              description: c.description,
            }),
            faqPageJsonLd(c.faq),
            breadcrumbJsonLd(crumbs)
          ),
        }}
      />
    </>
  );
}
