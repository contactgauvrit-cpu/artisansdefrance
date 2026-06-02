"use client";

import { useState } from "react";
import { GALLERY } from "@/lib/content";
import { ImageSlot } from "./ImageSlot";
import { IconCompare } from "@/lib/icons";
import { stagger } from "@/lib/anim";

function BeforeAfter({ g, index }: { g: (typeof GALLERY)[number]; index: number }) {
  const [v, setV] = useState(50);
  return (
    <div className="ba reveal-mask" style={stagger(index)}>
      <div className="ba-before">
        <ImageSlot label={g.before} />
      </div>
      <div className="ba-after" style={{ clipPath: `inset(0 0 0 ${v}%)` }}>
        <ImageSlot label={g.after} />
      </div>
      <span className="tag before">Avant</span>
      <span className="tag after">Après</span>
      <div className="ba-line" style={{ left: `${v}%` }} />
      <div className="ba-handle" style={{ left: `${v}%` }}>
        <IconCompare width={18} height={18} />
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={v}
        onChange={(e) => setV(Number(e.target.value))}
        aria-label={`Comparer avant et après — ${g.title}`}
      />
      <div className="cap">{g.title}</div>
    </div>
  );
}

export function Realisations() {
  return (
    <section className="section center" id="realisations">
      <div className="wrap">
        <div className="section-head reveal">
          <span className="eyebrow center">Nos réalisations</span>
          <h2>
            Avant / après : <em>le travail parle</em>
          </h2>
          <p className="lede" style={{ marginInline: "auto" }}>
            Glissez le curseur pour découvrir la transformation. Quelques chantiers réalisés par
            nos équipes en Vienne.
          </p>
        </div>
        <div className="gallery" id="gallery">
          {GALLERY.map((g, i) => (
            <BeforeAfter key={g.id} g={g} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
