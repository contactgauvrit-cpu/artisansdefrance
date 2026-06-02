import Link from "next/link";
import { SERVICES } from "@/lib/content";
import { serviceIcons, IconArrow } from "@/lib/icons";
import { stagger } from "@/lib/anim";

export function Services() {
  return (
    <section className="section center" id="services">
      <div className="wrap">
        <div className="section-head reveal">
          <span className="eyebrow center">Nos métiers</span>
          <h2>
            Un seul artisan pour <em>tous vos travaux</em>
          </h2>
          <p className="lede" style={{ marginInline: "auto" }}>
            Plomberie, électricité, rénovation ou aménagement extérieur : nos équipes
            interviennent sur l&apos;ensemble de vos projets, en intérieur comme en extérieur.
          </p>
        </div>

        <div className="services-grid" id="servicesGrid">
          {SERVICES.map((s, i) => (
            <article className="scard reveal" style={stagger(i)} key={s.slug}>
              <div className="ic">{serviceIcons[s.icon]}</div>
              <h3>
                <Link href={`/${s.slug}`}>{s.title}</Link>
              </h3>
              <p>{s.desc}</p>
              <a className="more" href="#contact">
                Demander un devis
                <IconArrow />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
