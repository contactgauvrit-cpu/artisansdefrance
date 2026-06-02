import Image from "next/image";
import { AIRTON_RANGE, AIRTON_FEATURES, AIRTON_VISUALS } from "@/lib/airton";
import { SITE } from "@/lib/content";
import { IconArrow, IconPhone } from "@/lib/icons";

/** Bloc « gamme Airton » — affiché uniquement sur le hub /climatisation. */
export function AirtonGamme() {
  return (
    <section className="wrap section-tight airton-block">
      <span className="eyebrow">Climatisation Airton</span>
      <h2 className="block-title">
        La pompe à chaleur air-air <em>Airton</em>
      </h2>

      <div className="airton-lead">
        <div className="airton-lead-media">
          <Image
            src={AIRTON_VISUALS.lead.src}
            alt={AIRTON_VISUALS.lead.alt}
            fill
            sizes="(max-width:880px) 100vw, 50vw"
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="airton-lead-text prose-local">
          <p>
            Nous posons la <strong>climatisation réversible Airton</strong>, marque française
            spécialiste de la pompe à chaleur air-air. Un seul équipement pour{" "}
            <strong>rafraîchir l&apos;été et chauffer l&apos;hiver</strong>, piloté au degré près.
          </p>
          <ul className="airton-features">
            {AIRTON_FEATURES.map((f) => (
              <li key={f.t}>
                <strong>{f.t}</strong> — {f.d}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <h3 className="airton-sub">La gamme, du studio à la grande maison</h3>
      <div className="airton-range">
        {AIRTON_RANGE.map((r) => (
          <article className="airton-card" key={r.key}>
            <div className="airton-card-media">
              <Image
                src={r.img}
                alt={r.alt}
                fill
                sizes="(max-width:700px) 50vw, 25vw"
                style={{ objectFit: "contain" }}
              />
            </div>
            <h4>{r.name}</h4>
            <span className="airton-pieces">
              {r.pieces} · {r.surface}
            </span>
            <p>{r.desc}</p>
          </article>
        ))}
      </div>

      <div className="airton-strip">
        {AIRTON_VISUALS.strip.map((v) => (
          <div className="airton-strip-img" key={v.src}>
            <Image src={v.src} alt={v.alt} fill sizes="(max-width:700px) 100vw, 50vw" style={{ objectFit: "cover" }} />
          </div>
        ))}
      </div>

      <div className="hero-cta" style={{ marginTop: 26 }}>
        <a href="/#contact" className="btn btn-primary">
          Devis climatisation gratuit
          <IconArrow />
        </a>
        <a href={`tel:${SITE.phoneHref}`} className="btn btn-ghost">
          <IconPhone />
          {SITE.phoneDisplay}
        </a>
      </div>
    </section>
  );
}
