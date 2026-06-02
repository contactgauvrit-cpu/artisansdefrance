import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { SITE } from "@/lib/content";

export const metadata: Metadata = {
  title: { absolute: "Mentions légales — Artisans de France" },
  description:
    "Mentions légales d'Artisans de France, entreprise multiservice du bâtiment en Vienne (86) : éditeur, hébergeur, propriété intellectuelle.",
  alternates: { canonical: "/mentions-legales" },
};

export default function MentionsLegales() {
  const crumbs = [
    { name: "Accueil", path: "/" },
    { name: "Mentions légales", path: "/mentions-legales" },
  ];
  return (
    <>
      <Header />
      <main id="top">
        <Breadcrumb items={crumbs} />
        <section className="wrap page-head">
          <span className="eyebrow">Informations légales</span>
          <h1>
            Mentions <em>légales</em>
          </h1>
        </section>

        <section className="wrap section-tight">
          <div className="prose-local">
            <h2 className="block-title">Éditeur du site</h2>
            <p>
              <strong>{SITE.name}</strong> — entreprise multiservice du bâtiment.
              <br />
              Forme juridique : {SITE.legalForm}
              <br />
              SIREN : {SITE.siren}
              <br />
              Siège social : {SITE.address}, {SITE.postalCode} {SITE.legalCity}, {SITE.region},
              France
              <br />
              Téléphone : <a href={`tel:${SITE.phoneHref}`}>{SITE.phoneDisplay}</a> · E-mail :{" "}
              <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
              <br />
              Directeur de la publication : {SITE.director}
            </p>

            <h2 className="block-title">Hébergement</h2>
            <p>
              Ce site est hébergé par <strong>Vercel Inc.</strong>, 340 S Lemon Ave #4133, Walnut,
              CA 91789, États-Unis — vercel.com.
            </p>

            <h2 className="block-title">Propriété intellectuelle</h2>
            <p>
              L'ensemble de ce site (textes, visuels, logo « coq », structure) est la propriété
              d'{SITE.name}, sauf mention contraire. Toute reproduction, même partielle, sans
              autorisation écrite préalable est interdite.
            </p>

            <h2 className="block-title">Responsabilité</h2>
            <p>
              Les informations publiées sont fournies à titre indicatif. {SITE.name} s'efforce de
              les tenir exactes et à jour, sans toutefois pouvoir en certifier l'exhaustivité.
            </p>

            <h2 className="block-title">Données personnelles</h2>
            <p>
              Les données transmises via le formulaire de devis sont traitées conformément à notre{" "}
              <Link href="/politique-de-confidentialite">politique de confidentialité</Link>.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
