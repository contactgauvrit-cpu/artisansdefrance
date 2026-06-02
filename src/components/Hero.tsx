import Image from "next/image";
import { ImageSlot } from "./ImageSlot";
import { stagger } from "@/lib/anim";
import {
  IconArrow,
  IconClock,
  IconFileCheck,
  IconMapPin,
  IconUsers,
} from "@/lib/icons";

const REASSURE: { icon: React.ReactNode; t: string; s: string }[] = [
  { icon: <IconFileCheck />, t: "Devis gratuit", s: "Sans engagement" },
  { icon: <IconUsers />, t: "Interlocuteur unique", s: "Un seul contact" },
  { icon: <IconMapPin />, t: "Artisans locaux", s: "Basés en Vienne" },
  { icon: <IconClock />, t: "Intervention rapide", s: "Réponse sous 24 h" },
];

export function Hero() {
  return (
    <section className="hero">
      <div className="wrap hero-grid">
        <div className="hero-text reveal">
          <span className="eyebrow">Artisans français — Vienne (86)</span>
          <h1>
            Tous vos travaux, du sol au plafond, par des <em>artisans français</em> en Vienne
          </h1>
          <p className="lede">
            De la fuite d&apos;eau à la rénovation complète, une équipe d&apos;artisans locaux
            qualifiés réalise vos projets à Poitiers et dans toute la Vienne. Un seul
            interlocuteur, un travail soigné, des délais tenus.
          </p>
          <div className="hero-cta">
            <a href="#contact" className="btn btn-primary">
              Devis gratuit
              <IconArrow />
            </a>
            <a href="#realisations" className="btn btn-ghost">
              Voir nos réalisations
            </a>
          </div>
        </div>

        <div className="hero-media">
          <ImageSlot
            src="/assets/realisations/salle-de-bain.jpg"
            alt="Salle de bain rénovée par Artisans de France : douche, vasque sur plan en bois et carrelage"
            label="Salle de bain rénovée"
            priority
            sizes="(max-width:980px) 100vw, 42vw"
          />
          <div className="hero-badge">
            <Image
              src="/assets/coq-metal.png"
              alt="Logo Artisans de France — coq gaulois"
              className="coq"
              width={466}
              height={510}
            />
            <div>
              <div className="t">Artisans de France</div>
              <div className="s">Création • Rénovation en Vienne</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bandeau réassurance */}
      <div className="reassure">
        <div className="wrap reassure-in">
          {REASSURE.map((it, i) => (
            <div className="item reveal" style={stagger(i)} key={it.t}>
              {it.icon}
              <div>
                <div className="t">{it.t}</div>
                <div className="s">{it.s}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
