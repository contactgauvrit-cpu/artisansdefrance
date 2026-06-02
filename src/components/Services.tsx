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
            Plomberie, électricité, climatisation, peinture, aménagement extérieur ou nettoyage :
            nous intervenons sur l&apos;ensemble de vos projets, en direct et près de chez vous.
          </p>
        </div>

        <div className="services-grid" id="servicesGrid">
          {SERVICES.map((s, i) => (
            <Link className="scard reveal" style={stagger(i)} key={s.slug} href={`/${s.slug}`}>
              <div className="ic">{serviceIcons[s.icon]}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              <span className="more">
                Découvrir
                <IconArrow />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
