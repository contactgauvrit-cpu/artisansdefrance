import Image from "next/image";
import Link from "next/link";
import { Brand } from "./Brand";
import { SERVICES, SITE } from "@/lib/content";
import { IconFacebook, IconGoogle, IconInstagram } from "@/lib/icons";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <Image
        src="/assets/coq-cream.png"
        alt=""
        aria-hidden="true"
        className="footer-coq"
        width={233}
        height={255}
      />
      <div className="wrap">
        <div className="footer-top">
          <div className="footer-about">
            <Brand href="/" ariaLabel="Artisans de France" />
            <p>
              Entreprise multiservice du bâtiment basée en Vienne. Création et rénovation, par des
              artisans français qualifiés. Devis gratuit, un seul interlocuteur.
            </p>
            <div className="socials">
              <a href="#" aria-label="Facebook">
                <IconFacebook />
              </a>
              <a href="#" aria-label="Instagram">
                <IconInstagram />
              </a>
              <a href="#" aria-label="Google">
                <IconGoogle />
              </a>
            </div>
          </div>
          <div className="footer-col">
            <h4>Services</h4>
            <ul id="footerServices">
              {SERVICES.map((s) => (
                <li key={s.slug}>
                  <Link href={`/${s.slug}`}>{s.title}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer-col">
            <h4>Zone</h4>
            <ul>
              <li><Link href="/zone/vienne-86">Vienne (86)</Link></li>
              <li><Link href="/zone/deux-sevres-79">Deux-Sèvres (79)</Link></li>
              <li><Link href="/zone/maine-et-loire-49">Maine-et-Loire (49)</Link></li>
              <li><Link href="/zone/vendee-85">Vendée (85)</Link></li>
              <li><Link href="/zone">Toute la zone d&apos;intervention</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            <ul>
              <li><a href={`tel:${SITE.phoneHref}`}>{SITE.phoneDisplay}</a></li>
              <li><a href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
              <li>Vienne (86) — Nouvelle-Aquitaine</li>
              <li><a href="/#contact">Demander un devis</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>{`© ${year} Artisans de France — Création & Rénovation. Tous droits réservés.`}</span>
          <span>
            {SITE.siren !== "000 000 000" && <>SIREN {SITE.siren} · </>}
            <Link href="/mentions-legales">Mentions légales</Link> ·{" "}
            <Link href="/politique-de-confidentialite">Politique de confidentialité</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
