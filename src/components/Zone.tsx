import Link from "next/link";
import { DEPARTEMENTS } from "@/lib/content";
import { deptByCode } from "@/lib/communes";

export function Zone() {
  return (
    <section className="section" id="zone">
      <div className="wrap zone-grid">
        <div className="zone-map reveal" id="zoneMap">
          <svg
            viewBox="0 0 360 320"
            role="img"
            aria-label="Carte schématique : Vienne, Deux-Sèvres, Maine-et-Loire et Vendée"
          >
            {/* littoral atlantique (Vendée) */}
            <g stroke="#D9C3AE" strokeWidth="2" fill="none" strokeLinecap="round" opacity=".8">
              <path d="M40 120 q10 12 0 24 t0 24 t0 24 t0 24" />
              <path d="M28 150 q9 11 0 22 t0 22 t0 22" />
            </g>
            {/* région (4 départements) */}
            <path
              d="M168 26 C224 22 258 54 286 84 C314 110 314 150 292 176 C312 206 288 246 250 256 C214 290 156 298 120 280 C90 290 62 270 68 238 C50 210 56 172 82 156 C74 116 102 74 138 70 C144 44 154 30 168 26 Z"
              fill="#F6ECE1"
              stroke="#E7D2BC"
              strokeWidth="2"
            />
            {/* limites internes discrètes */}
            <g stroke="#E7D2BC" strokeWidth="1.4" fill="none" opacity=".7">
              <path d="M188 60 C176 110 196 150 232 168" />
              <path d="M150 150 C170 180 168 220 150 256" />
            </g>
            <g style={{ fontFamily: "var(--mono)" }} fontSize="10.5" fill="#6B7280">
              {/* Maine-et-Loire 49 (nord) */}
              <g>
                <circle cx="206" cy="70" r="5.5" fill="#B87333" />
                <text x="206" y="58" textAnchor="middle">
                  Angers · 49
                </text>
              </g>
              {/* Vienne 86 (est) — siège */}
              <g>
                <circle cx="286" cy="150" r="9" fill="#B87333" />
                <circle cx="286" cy="150" r="3.4" fill="#fff" />
                <text x="286" y="176" textAnchor="middle" fill="#2B2B2E" fontWeight="600">
                  Poitiers · 86
                </text>
              </g>
              {/* Deux-Sèvres 79 (centre) */}
              <g>
                <circle cx="168" cy="206" r="5.5" fill="#B87333" />
                <text x="168" y="226" textAnchor="middle">
                  Niort · 79
                </text>
              </g>
              {/* Vendée 85 (ouest) */}
              <g>
                <circle cx="100" cy="178" r="5.5" fill="#B87333" />
                <text x="100" y="166" textAnchor="middle">
                  La Roche · 85
                </text>
              </g>
            </g>
            <text
              x="300"
              y="300"
              textAnchor="end"
              style={{ fontFamily: "var(--mono)" }}
              fontSize="10.5"
              letterSpacing="1.5"
              fill="#B87333"
            >
              4 DÉPARTEMENTS
            </text>
          </svg>
        </div>

        <div>
          <span className="eyebrow">Zone d&apos;intervention</span>
          <h2 style={{ fontSize: "clamp(30px,4.4vw,46px)", margin: "16px 0 22px" }}>
            La Vendée <em>et tout le secteur</em>
          </h2>
          <p className="lede" style={{ marginBottom: "26px" }}>
            Nous intervenons en Vendée (85) et sur tout le secteur — Deux-Sèvres (79),
            Maine-et-Loire (49) et Vienne (86) — au plus près de chez vous, pour tous vos travaux.
          </p>
          <div className="dept-grid reveal" id="deptGrid">
            {DEPARTEMENTS.map((d) => {
              const slug = deptByCode(d.num)?.slug;
              const star = d.num === "85";
              const inner = (
                <>
                  <div className="dept-head">
                    <span className="dept-num">{d.num}</span>
                    <span className="dept-nom">{d.nom}</span>
                    {star && <span className="dept-badge">★ Zone phare</span>}
                  </div>
                  <p className="dept-villes">{d.villes.join(" · ")}</p>
                </>
              );
              return slug ? (
                <Link
                  className={`dept${star ? " dept--star" : ""}`}
                  href={`/zone/${slug}`}
                  key={d.num}
                  style={{ display: "block" }}
                >
                  {inner}
                </Link>
              ) : (
                <div className="dept" key={d.num}>
                  {inner}
                </div>
              );
            })}
          </div>
          <p className="zone-note reveal">
            Votre commune n&apos;est pas dans la liste ? Contactez-nous, nous étudions chaque
            demande dans ces quatre départements.
          </p>
        </div>
      </div>
    </section>
  );
}
