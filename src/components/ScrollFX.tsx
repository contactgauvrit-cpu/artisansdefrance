"use client";

import { useEffect } from "react";

/**
 * Effets de scroll sobres (transform/opacity uniquement — zéro CLS) :
 * - apparition au scroll (.reveal / .reveal-mask) via IntersectionObserver
 * - parallaxe discret sur la photo hero et le coq filigrane
 * Respecte prefers-reduced-motion. Progressive enhancement : sans JS,
 * `.anim` n'est jamais ajouté → tout le contenu reste visible (SSR/SEO).
 */
export function ScrollFX() {
  useEffect(() => {
    const motionOK = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!motionOK) return;

    const root = document.documentElement;
    root.classList.add("anim");

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            io.unobserve(en.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.1 }
    );
    document.querySelectorAll(".reveal, .reveal-mask").forEach((el) => io.observe(el));

    // Parallaxe discret : photo hero + coq filigrane (rAF-throttlé)
    const heroMedia = document.querySelector<HTMLElement>(".hero-media");
    const whyCoq = document.querySelector<HTMLElement>(".why-coq");
    const why = document.querySelector<HTMLElement>(".why");
    let ticking = false;
    const fx = () => {
      const y = window.scrollY;
      if (heroMedia && y < window.innerHeight * 1.5) {
        heroMedia.style.transform = `translate3d(0,${y * 0.05}px,0)`;
      }
      if (whyCoq && why) {
        const top = why.getBoundingClientRect().top;
        whyCoq.style.transform = `translate3d(0,${(window.innerHeight - top) * 0.05}px,0)`;
      }
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(fx);
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    fx();

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      root.classList.remove("anim");
    };
  }, []);

  return null;
}
