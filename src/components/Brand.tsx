import Image from "next/image";

/** Lockup logo : coq cuivre + wordmark "Artisans / DE FRANCE" (tricolore réservé au wordmark). */
export function Brand({
  href = "#top",
  ariaLabel = "Artisans de France — accueil",
  priority = false,
}: {
  href?: string;
  ariaLabel?: string;
  priority?: boolean;
}) {
  return (
    <a href={href} className="brand" aria-label={ariaLabel}>
      <Image
        src="/assets/coq-metal.png"
        alt="Logo Artisans de France — coq gaulois"
        className="coq"
        width={466}
        height={510}
        priority={priority}
      />
      <span className="lockup">
        <span className="script">Artisans</span>
        <span className="defr">
          <span className="n">DE&nbsp;</span>
          <span className="b">FR</span>
          <span className="r">ANCE</span>
        </span>
      </span>
    </a>
  );
}
