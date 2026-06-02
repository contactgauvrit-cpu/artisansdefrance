import { HOME_FAQ } from "@/lib/content";

export function HomeFaq() {
  return (
    <section className="section center" id="faq">
      <div className="wrap">
        <div className="section-head reveal">
          <span className="eyebrow center">Questions fréquentes</span>
          <h2>
            On répond à <em>vos questions</em>
          </h2>
        </div>
        <div
          className="faq-list reveal"
          style={{ maxWidth: 820, marginInline: "auto", textAlign: "left" }}
        >
          {HOME_FAQ.map((f, i) => (
            <div className="faq-item" key={i}>
              <h3>{f.q}</h3>
              <p>{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
