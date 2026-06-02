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
import { communeBySlug, deptByCode, deptName, neighbors, tier1 } from "@/lib/communes";
import { breadcrumbJsonLd, faqPageJsonLd, jsonLdScript, serviceJsonLd } from "@/lib/schema";

type Props = { params: Promise<{ service: string; commune: string }> };

export const dynamicParams = true; // communes hors Tier 1 → ISR
export const revalidate = 86400;

export function generateStaticParams() {
  const communes = tier1();
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
    title: c.title,
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
        <section className="wrap page-head">
          <span className="eyebrow">
            {service.title} · {dn} ({commune.dept})
          </span>
          <h1>
            {meta.h1Trade} à <em>{commune.nom}</em>{" "}
            <span style={{ color: "var(--gray-2)" }}>({commune.dept})</span>
          </h1>
        </section>

        <section className="wrap section-tight">
          <div className="split">
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
            <div className="card-soft">
              <h3>Nos prestations de {service.title.toLowerCase()}</h3>
              <ul className="prestations">
                {c.prestations.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="wrap section-tight">
          <h2 className="block-title">
            Faire appel à un {meta.metier} <em>à {commune.nom}</em>
          </h2>
          <ul className="prestations" style={{ maxWidth: 760 }}>
            {c.reasons.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </section>

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

        <section className="wrap section-tight">
          <h2 className="block-title">
            {meta.h1Trade} dans les <em>communes voisines</em>
          </h2>
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
              areaName: commune.nom,
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
