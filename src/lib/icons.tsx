/* ============================================================
   Icônes (portées 1:1 depuis le prototype). viewBox 24x24,
   taille pilotée par le CSS. fill/stroke = currentColor.
   ============================================================ */
import * as React from "react";

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/* ---- Icônes des 8 services (clé = Service.icon) ---- */
export const serviceIcons: Record<string, React.ReactNode> = {
  plomberie: (
    <svg viewBox="0 0 24 24" strokeWidth={1.7} {...stroke}>
      <path d="M9 3v6a3 3 0 0 0 3 3 3 3 0 0 0 3-3V3" />
      <path d="M7 3h4M13 3h4M12 12v5a4 4 0 0 0 4 4h2" />
      <circle cx="20" cy="20" r="1.4" />
    </svg>
  ),
  electricite: (
    <svg viewBox="0 0 24 24" strokeWidth={1.7} {...stroke}>
      <path d="M13 2 4 14h7l-1 8 9-12h-7z" />
    </svg>
  ),
  clim: (
    <svg viewBox="0 0 24 24" strokeWidth={1.7} {...stroke}>
      <rect x="2" y="4" width="20" height="9" rx="2" />
      <path d="M6 17v1a2 2 0 0 0 2 2M18 17v1a2 2 0 0 1-2 2M12 17v3" />
      <path d="M6 8h4M6 10.5h2" />
    </svg>
  ),
  renovation: (
    <svg viewBox="0 0 24 24" strokeWidth={1.7} {...stroke}>
      <path d="m3 21 3-1 11-11-2-2L4 18z" />
      <path d="m14 7 3-3 3 3-3 3" />
      <path d="M14.5 5.5 18 9" />
    </svg>
  ),
  amenagement: (
    <svg viewBox="0 0 24 24" strokeWidth={1.7} {...stroke}>
      <path d="M3 21V8l9-5 9 5v13" />
      <path d="M3 21h18M9 21v-6h6v6" />
    </svg>
  ),
  peinture: (
    <svg viewBox="0 0 24 24" strokeWidth={1.7} {...stroke}>
      <rect x="3" y="3" width="18" height="7" rx="1.5" />
      <path d="M16 10v3a2 2 0 0 1-2 2h-2v3" />
      <rect x="9" y="18" width="4" height="4" rx="1" />
    </svg>
  ),
  exterieur: (
    <svg viewBox="0 0 24 24" strokeWidth={1.7} {...stroke}>
      <path d="M12 2a6 6 0 0 0-6 6c0 4 6 9 6 9s6-5 6-9a6 6 0 0 0-6-6z" />
      <path d="M12 22v-4M9 20h6" />
    </svg>
  ),
  piscine: (
    <svg viewBox="0 0 24 24" strokeWidth={1.7} {...stroke}>
      <path d="M2 18c2 0 2 1.5 4 1.5S8 18 10 18s2 1.5 4 1.5S16 18 18 18s2 1.5 4 1.5" />
      <path d="M2 13c2 0 2 1.5 4 1.5S8 13 10 13M7 11V5a2 2 0 0 1 4 0M17 11V5a2 2 0 0 0-4 0" />
    </svg>
  ),
};

/* ---- Icônes "Pourquoi nous" (01 → 05) ---- */
export const whyIcons: React.ReactNode[] = [
  (
    <svg viewBox="0 0 24 24" strokeWidth={1.7} {...stroke}>
      <path d="M12 2 4 5v6c0 5 3.5 8 8 11 4.5-3 8-6 8-11V5z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  (
    <svg viewBox="0 0 24 24" strokeWidth={1.7} {...stroke}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6M9 15l2 2 4-4" />
    </svg>
  ),
  (
    <svg viewBox="0 0 24 24" strokeWidth={1.7} {...stroke}>
      <circle cx="9" cy="7" r="4" />
      <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
      <path d="M17 11l2 2 4-4" />
    </svg>
  ),
  (
    <svg viewBox="0 0 24 24" strokeWidth={1.7} {...stroke}>
      <path d="m3 11 18-5v12L3 13z" />
      <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
    </svg>
  ),
  (
    <svg viewBox="0 0 24 24" strokeWidth={1.7} {...stroke}>
      <path d="M12 2 4 5v6c0 5 3.5 8 8 11 4.5-3 8-6 8-11V5z" />
      <circle cx="12" cy="11" r="2.5" />
    </svg>
  ),
];

/* ---- Icônes utilitaires ---- */
export const IconPhone = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" strokeWidth={1.8} {...stroke} {...p}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);
export const IconMail = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" strokeWidth={1.8} {...stroke} {...p}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-10 6L2 7" />
  </svg>
);
export const IconMapPin = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" strokeWidth={1.8} {...stroke} {...p}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
export const IconClock = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" strokeWidth={1.8} {...stroke} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);
export const IconFileCheck = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" strokeWidth={1.8} {...stroke} {...p}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6M9 15l2 2 4-4" />
  </svg>
);
export const IconUsers = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" strokeWidth={1.8} {...stroke} {...p}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
  </svg>
);
export const IconArrow = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" strokeWidth={2.2} {...stroke} {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
export const IconCheck = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" strokeWidth={2.4} {...stroke} {...p}>
    <path d="M20 6L9 17l-5-5" />
  </svg>
);
export const IconCompare = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" strokeWidth={2.2} {...stroke} {...p}>
    <path d="M8 7l-4 5 4 5M16 7l4 5-4 5" />
  </svg>
);
export const IconCamera = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" strokeWidth={1.6} {...stroke} {...p}>
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);
export const IconStar = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="m12 2 3 6.6 7.2.7-5.4 4.8 1.6 7.1L12 17.6 5.6 21.2l1.6-7.1L1.8 9.3 9 8.6z" />
  </svg>
);

/* ---- Réseaux sociaux ---- */
export const IconFacebook = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
export const IconInstagram = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...p}>
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
  </svg>
);
export const IconGoogle = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M12 11v2.8h4a3.9 3.9 0 0 1-4 2.9 4.7 4.7 0 0 1 0-9.4 4.3 4.3 0 0 1 2.9 1.1l2-2A7.2 7.2 0 0 0 12 4.6a7.4 7.4 0 1 0 7.3 8.6c.1-.6.1-1.2.1-1.8z" />
  </svg>
);
