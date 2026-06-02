import { REALISATIONS } from "@/lib/content";
import { ImageSlot } from "./ImageSlot";
import { stagger } from "@/lib/anim";

export function Realisations() {
  return (
    <section className="section center" id="realisations">
      <div className="wrap">
        <div className="section-head reveal">
          <span className="eyebrow center">Nos réalisations</span>
          <h2>
            Nos chantiers, <em>le travail parle</em>
          </h2>
          <p className="lede" style={{ marginInline: "auto" }}>
            Quelques chantiers réalisés par nos soins : plomberie, peinture, rénovation, terrasse,
            piscine et aménagement extérieur. Des photos réelles, pas des images de catalogue.
          </p>
        </div>
        <div className="gallery" id="gallery">
          {REALISATIONS.map((r, i) => (
            <figure className="rcard reveal-mask" style={stagger(i)} key={r.id}>
              <ImageSlot
                src={r.src}
                alt={r.alt}
                label={r.title}
                sizes="(max-width:700px) 100vw, (max-width:1040px) 50vw, 33vw"
              />
              <span className="rtag">{r.tag}</span>
              <figcaption className="cap">{r.title}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
