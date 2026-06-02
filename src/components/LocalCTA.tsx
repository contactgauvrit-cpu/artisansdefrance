import Link from "next/link";
import { SITE } from "@/lib/content";
import { IconArrow, IconPhone } from "@/lib/icons";

export function LocalCTA({ commune }: { commune?: string }) {
  return (
    <div className="local-cta">
      <div>
        <h2>
          {commune
            ? `Un projet de travaux à ${commune} ?`
            : "Un projet de travaux ?"}{" "}
          Demandez votre devis gratuit.
        </h2>
        <p className="sub">Réponse sous 24 h • Visite et devis sans engagement</p>
      </div>
      <div className="lc-actions">
        <a href={`tel:${SITE.phoneHref}`} className="lc-tel">
          <IconPhone />
          {SITE.phoneDisplay}
        </a>
        <Link href="/#contact" className="btn btn-on-copper">
          Devis gratuit
          <IconArrow />
        </Link>
      </div>
    </div>
  );
}
