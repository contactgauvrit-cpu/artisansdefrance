import { STEPS } from "@/lib/content";
import { stagger } from "@/lib/anim";

export function Steps() {
  return (
    <section className="section steps">
      <div className="wrap">
        <div className="section-head reveal">
          <span className="eyebrow">Comment ça se passe</span>
          <h2>
            Votre projet en <em>4 étapes simples</em>
          </h2>
        </div>
        <div className="steps-grid" id="stepsGrid">
          {STEPS.map((s, i) => (
            <div className="step reveal" style={stagger(i)} key={s.title}>
              <span className="bar" />
              <div className="num">0{i + 1}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
