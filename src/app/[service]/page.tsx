import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { LocalCTA } from "@/components/LocalCTA";
import { ServiceTiles } from "@/components/ServiceTiles";
import { SERVICES } from "@/lib/content";
import { serviceBySlug, serviceMeta } from "@/lib/services-meta";
import { buildServiceHub } from "@/lib/page-content";
import { DEPTS, tier1ByDept } from "@/lib/communes";
import { breadcrumbJsonLd, jsonLdScript } from "@/lib/schema";

type Props = { params: Promise<{ service: string }> };

export const dynamicParams = false;
export const revalidate = 86400;

export function generateStaticParams() {
  return SERVICES.map((s) => ({ service: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { service: slug } = await params;
  const service = serviceBySlug(slug);
  if (!service) return {};
  const c = buildServiceHub(service);
  const path = `/${slug}`;
  return {
    title: { absolute: c.title },
    description: c.description,
    alternates: { canonical: path },
    openGraph: { title: c.title, description: c.description, url: path, type: "website" },
  };
}

export default async function ServiceHubPage({ params }: Props) {
  const { service: slug } = await params;
  const service = serviceBySlug(slug);
  if (!service) notFound();
  const meta = serviceMeta(slug);
  const c = buildServiceHub(service);
  const path = `/${slug}`;
  const crumbs = [
    { name: "Accueil", path: "/" },
    { name: service.title, path },
  ];

  return (
    <>
      <Header />
      <main id="top">
        <Breadcrumb items={crumbs} />
        <section className="wrap page-head">
          <span className="eyebrow">Nos métiers</span>
          <h1>
            {meta.h1Trade} <em>en Vienne et alentours</em>
          </h1>
        </section>

        <section className="wrap section-tight">
          <div className="split">
            <div className="prose-local">
              {c.intro.map((p, i) => (
                <p key={i} className={i ? "muted" : ""}>
                  {p}
                </p>
              ))}
            </div>
            <div className="card-soft">
              <h3>Nos prestations</h3>
              <ul className="prestations">
                {meta.prestations.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {(c.expertise?.length || c.highlights.length) ? (
          <section className="wrap section-tight">
            <h2 className="block-title">
              Notre savoir-faire en <em>{service.title.toLowerCase()}</em>
            </h2>
            {c.expertise && c.expertise.length > 0 && (
              <div
                className="prose-local"
                style={{ marginBottom: c.highlights.length ? 18 : 0 }}
              >
                {c.expertise.map((p, i) => (
                  <p key={i} className={i ? "muted" : ""}>
                    {p}
                  </p>
                ))}
              </div>
            )}
            {c.highlights.length > 0 && (
              <ul className="prestations two" style={{ maxWidth: 880 }}>
                {c.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            )}
          </section>
        ) : null}

        <section className="wrap section-tight">
          <h2 className="block-title">
            {service.title} <em>près de chez vous</em>
          </h2>
          {DEPTS.map((d) => (
            <div key={d.code} style={{ marginBottom: 22 }}>
              <div
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 12,
                  letterSpacing: ".12em",
                  textTransform: "uppercase",
                  color: "var(--copper)",
                  marginBottom: 12,
                }}
              >
                {d.nom} ({d.code})
              </div>
              <div className="link-cloud">
                {tier1ByDept(d.code).map((co) => (
                  <Link key={co.code} href={`/${slug}/${co.slug}`} className="chip">
                    {meta.h1Trade} à {co.nom}
                  </Link>
                ))}
                <Link href={`/zone/${d.slug}`} className="chip" style={{ borderStyle: "dashed" }}>
                  Voir {d.le} →
                </Link>
              </div>
            </div>
          ))}
        </section>

        <section className="wrap section-tight">
          <h2 className="block-title">
            Nos autres <em>services</em>
          </h2>
          <ServiceTiles excludeSlug={slug} />
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
