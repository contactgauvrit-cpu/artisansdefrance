import Link from "next/link";
import { SERVICES } from "@/lib/content";
import { serviceIcons } from "@/lib/icons";

/**
 * Grille des 8 services. Si communeSlug fourni → liens vers /[service]/[commune],
 * sinon vers les hubs /[service]. excludeSlug retire le service courant.
 */
export function ServiceTiles({
  excludeSlug,
  communeSlug,
}: {
  excludeSlug?: string;
  communeSlug?: string;
}) {
  const list = SERVICES.filter((s) => s.slug !== excludeSlug);
  return (
    <div className="svc-hublist">
      {list.map((s) => (
        <Link
          key={s.slug}
          href={communeSlug ? `/${s.slug}/${communeSlug}` : `/${s.slug}`}
          className="svc-tile"
        >
          <span className="ic">{serviceIcons[s.icon]}</span>
          <span className="nm">{s.title}</span>
        </Link>
      ))}
    </div>
  );
}
