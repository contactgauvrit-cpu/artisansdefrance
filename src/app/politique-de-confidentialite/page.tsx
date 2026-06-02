import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { SITE } from "@/lib/content";

export const metadata: Metadata = {
  title: { absolute: "Politique de confidentialité — Artisans de France" },
  description:
    "Comment Artisans de France collecte et traite vos données via le formulaire de devis (RGPD) : finalité, durée, droits et contact.",
  alternates: { canonical: "/politique-de-confidentialite" },
};

export default function Confidentialite() {
  const crumbs = [
    { name: "Accueil", path: "/" },
    { name: "Politique de confidentialité", path: "/politique-de-confidentialite" },
  ];
  return (
    <>
      <Header />
      <main id="top">
        <Breadcrumb items={crumbs} />
        <section className="wrap page-head">
          <span className="eyebrow">Vos données</span>
          <h1>
            Politique de <em>confidentialité</em>
          </h1>
        </section>

        <section className="wrap section-tight">
          <div className="prose-local">
            <p>
              {SITE.name} accorde de l'importance à la protection de vos données personnelles.
              Cette page explique quelles données nous collectons via ce site et comment elles sont
              utilisées.
            </p>

            <h2 className="block-title">Données collectées</h2>
            <p>
              Via le formulaire de demande de devis : votre <strong>nom</strong>, votre{" "}
              <strong>téléphone</strong>, votre <strong>e-mail</strong> (facultatif), le{" "}
              <strong>type de projet</strong> et le <strong>message</strong> que vous nous adressez.
              Aucune donnée n'est collectée à votre insu.
            </p>

            <h2 className="block-title">Finalité et base légale</h2>
            <p>
              Ces données servent uniquement à <strong>vous recontacter</strong> au sujet de votre
              demande et à établir un devis. La base légale est votre consentement et l'intérêt
              légitime à répondre à une demande commerciale que vous avez initiée.
            </p>

            <h2 className="block-title">Destinataires</h2>
            <p>
              Vos données sont reçues par {SITE.name} et stockées via notre prestataire{" "}
              <strong>Supabase</strong> ; les notifications de devis transitent par{" "}
              <strong>Brevo</strong> (e-mail). Vos données ne sont{" "}
              <strong>jamais cédées ni vendues</strong> à des tiers à des fins commerciales.
            </p>

            <h2 className="block-title">Durée de conservation</h2>
            <p>
              Vos données sont conservées le temps nécessaire au traitement de votre demande et à la
              relation commerciale, puis archivées ou supprimées conformément aux obligations
              légales.
            </p>

            <h2 className="block-title">Vos droits</h2>
            <p>
              Conformément au RGPD, vous disposez d'un droit d'accès, de rectification,
              d'effacement, d'opposition et de portabilité de vos données. Pour les exercer,
              écrivez-nous à <a href={`mailto:${SITE.email}`}>{SITE.email}</a> ou appelez le{" "}
              <a href={`tel:${SITE.phoneHref}`}>{SITE.phoneDisplay}</a>.
            </p>

            <h2 className="block-title">Cookies</h2>
            <p>
              Ce site n'utilise pas de cookies publicitaires ni de traceurs tiers à des fins
              marketing. Seuls des éléments techniques strictement nécessaires au fonctionnement du
              site peuvent être employés.
            </p>

            <p className="muted">
              Voir aussi nos{" "}
              <Link href="/mentions-legales">mentions légales</Link>.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
