"use client";

import { useEffect, useState } from "react";
import { Brand } from "./Brand";
import { IconPhone } from "@/lib/icons";
import { SITE } from "@/lib/content";

const NAV: [string, string][] = [
  ["/#services", "Services"],
  ["/#realisations", "Réalisations"],
  ["/zone", "Zone d'intervention"],
  ["/#apropos", "À propos"],
  ["/#contact", "Contact"],
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header className={`header${scrolled ? " scrolled" : ""}`} id="header">
        <div className="wrap header-in">
          <Brand href="/" priority />

          <nav className="nav" aria-label="Navigation principale">
            {NAV.map(([href, label]) => (
              <a key={href} href={href}>
                {label}
              </a>
            ))}
          </nav>

          <div className="header-actions">
            <a href={`tel:${SITE.phoneHref}`} className="tel-link">
              <IconPhone />
              {SITE.phoneDisplay}
            </a>
            <a href="/#contact" className="btn btn-primary">
              Devis gratuit
            </a>
            <button
              className={`burger${open ? " open" : ""}`}
              id="burger"
              aria-label="Ouvrir le menu"
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>

      <nav
        className={`mobile-nav${open ? " open" : ""}`}
        id="mobileNav"
        aria-label="Menu mobile"
      >
        {NAV.map(([href, label]) => (
          <a key={href} href={href} onClick={() => setOpen(false)}>
            {label}
          </a>
        ))}
        <a href={`tel:${SITE.phoneHref}`} className="tel-link" onClick={() => setOpen(false)}>
          <IconPhone />
          {SITE.phoneDisplay}
        </a>
        <a href="/#contact" className="btn btn-primary" onClick={() => setOpen(false)}>
          Demander un devis gratuit
        </a>
      </nav>
    </>
  );
}
