import Image from "next/image";
import Link from "next/link";
import { AIRTON_VISUALS } from "@/lib/airton";
import { IconArrow } from "@/lib/icons";

const POINTS = [
  "Rafraîchit l'été, chauffe l'hiver",
  "Classe A++ / A+",
  "Pilotage WiFi (SmartLife)",
  "Marque française",
];

/** Bloc accueil : mise en avant saisonnière de la climatisation réversible Airton. */
export function ClimaHome() {
  return (
    <section className="section" id="climatisation-accueil">
      <div className="wrap">
        <div className="clima-band reveal">
          <div className="clima-band-media">
            <Image
              src={AIRTON_VISUALS.lead.src}
              alt={AIRTON_VISUALS.lead.alt}
              fill
              sizes="(max-width:880px) 100vw, 480px"
              style={{ objectFit: "cover" }}
            />
            <span className="clima-tag">Préparez l&apos;été</span>
          </div>
          <div className="clima-band-text">
            <span className="eyebrow">Climatisation · Airton</span>
            <h2>
              La <em>climatisation réversible Airton</em>, prête avant les fortes chaleurs
            </h2>
            <p>
              Marque française, pompe à chaleur air-air : un seul équipement qui rafraîchit l&apos;été
              et chauffe l&apos;hiver. On dimensionne, on pose, on met en service — et on anticipe pour
              que vous soyez au frais dès les premiers pics de chaleur.
            </p>
            <ul className="clima-points">
              {POINTS.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            <div className="hero-cta">
              <Link href="/climatisation" className="btn btn-primary">
                Découvrir la climatisation
                <IconArrow />
              </Link>
              <a href="#contact" className="btn btn-ghost">
                Devis gratuit
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
