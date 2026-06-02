import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { ClimaHome } from "@/components/ClimaHome";
import { Why } from "@/components/Why";
import { Zone } from "@/components/Zone";
import { Realisations } from "@/components/Realisations";
import { Steps } from "@/components/Steps";
import { Reviews } from "@/components/Reviews";
import { Cta } from "@/components/Cta";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { ScrollFX } from "@/components/ScrollFX";
import { HomeFaq } from "@/components/HomeFaq";
import { HOME_FAQ } from "@/lib/content";
import { faqPageJsonLd, jsonLdScript } from "@/lib/schema";

export default function Home() {
  return (
    <>
      <Header />
      <main id="top">
        <Hero />
        <Services />
        <ClimaHome />
        <Why />
        <Zone />
        <Realisations />
        <Steps />
        <Reviews />
        <HomeFaq />
        <Cta />
        <Contact />
      </main>
      <Footer />
      <ScrollFX />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(faqPageJsonLd(HOME_FAQ)) }}
      />
    </>
  );
}
