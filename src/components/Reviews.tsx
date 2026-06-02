import { REVIEWS } from "@/lib/content";
import { IconStar } from "@/lib/icons";
import { stagger } from "@/lib/anim";

export function Reviews() {
  return (
    <section className="section center">
      <div className="wrap">
        <div className="section-head reveal">
          <span className="eyebrow center">Ils nous ont fait confiance</span>
          <h2>
            Ce que disent <em>nos clients</em>
          </h2>
        </div>
        <div className="reviews" id="reviews">
          {REVIEWS.map((r, i) => (
            <article className="review reveal" style={stagger(i)} key={r.nm}>
              <div className="stars">
                {Array.from({ length: 5 }).map((_, k) => (
                  <IconStar key={k} />
                ))}
              </div>
              <p>{r.txt}</p>
              <div className="who">
                <span className="av">{r.av}</span>
                <span>
                  <span className="nm">{r.nm}</span>
                  <span className="lc">{r.lc}</span>
                </span>
                <span className="g">Avis Google</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
