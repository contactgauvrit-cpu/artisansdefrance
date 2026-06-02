import Link from "next/link";

export function Breadcrumb({ items }: { items: { name: string; path: string }[] }) {
  return (
    <nav className="wrap breadcrumb" aria-label="Fil d'ariane">
      {items.map((it, i) => {
        const last = i === items.length - 1;
        return (
          <span key={it.path} style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
            {last ? (
              <span aria-current="page">{it.name}</span>
            ) : (
              <Link href={it.path}>{it.name}</Link>
            )}
            {!last && <span className="sep">›</span>}
          </span>
        );
      })}
    </nav>
  );
}
