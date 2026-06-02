import Image from "next/image";
import { WHY } from "@/lib/content";
import { whyIcons } from "@/lib/icons";
import { stagger } from "@/lib/anim";

export function Why() {
  return (
    <section className="section why" id="apropos">
      <Image
        src="/assets/coq-cream.png"
        alt=""
        aria-hidden="true"
        className="why-coq"
        width={233}
        height={255}
      />
      <div className="wrap">
        <div className="section-head reveal">
          <span className="eyebrow">Pourquoi nous choisir</span>
          <h2>
            Le savoir-faire français, <em>près de chez vous</em>
          </h2>
          <p className="lede">
            Nous sommes une entreprise d&apos;artisans de la Vienne. Notre fierté : un travail
            bien fait, des chantiers propres et des clients qui nous recommandent.
          </p>
        </div>

        <div className="why-grid" id="whyGrid">
          {WHY.map((w, i) => (
            <div className="why-cell reveal" style={stagger(i)} key={w.n}>
              <div className="ic">{whyIcons[i]}</div>
              <div className="n">{w.n}</div>
              <h3>{w.title}</h3>
              <p>{w.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
