"use client";

import { useState } from "react";
import { PROJECT_TYPES, SITE } from "@/lib/content";
import {
  IconArrow,
  IconCheck,
  IconClock,
  IconMail,
  IconMapPin,
  IconPhone,
} from "@/lib/icons";

type FieldKey = "nom" | "tel" | "email" | "type" | "message";
const EMPTY: Record<FieldKey, boolean> = {
  nom: false,
  tel: false,
  email: false,
  type: false,
  message: false,
};

export function Contact() {
  const [invalid, setInvalid] = useState(EMPTY);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const clear = (k: FieldKey) => setInvalid((s) => ({ ...s, [k]: false }));

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const nom = String(data.get("nom") ?? "").trim();
    const tel = String(data.get("tel") ?? "");
    const email = String(data.get("email") ?? "").trim();
    const type = String(data.get("type") ?? "");
    const message = String(data.get("message") ?? "").trim();

    const telOk = /^(\+33|0)\d{9}$/.test(tel.replace(/[\s.\-]/g, ""));
    const emailOk = !email || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);

    const next: Record<FieldKey, boolean> = {
      nom: !nom,
      tel: !telOk,
      email: !emailOk,
      type: !type,
      message: !message,
    };
    setInvalid(next);
    if (Object.values(next).some(Boolean)) {
      form
        .querySelector<HTMLElement>(
          ".field.invalid input,.field.invalid select,.field.invalid textarea"
        )
        ?.focus();
      return;
    }

    setSubmitting(true);
    setServerError(null);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nom, tel, email, type, message }),
      });
      if (!res.ok) throw new Error("bad status");
      setDone(true);
    } catch {
      setServerError(
        "Une erreur est survenue. Merci de réessayer ou de nous appeler directement."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="section" id="contact">
      <div className="wrap">
        <div className="section-head reveal" style={{ maxWidth: "680px" }}>
          <span className="eyebrow">Devis gratuit</span>
          <h2>
            Parlons de <em>votre projet</em>
          </h2>
          <p className="lede">
            Décrivez-nous vos travaux en quelques mots. Nous vous rappelons rapidement pour
            organiser une visite et établir un devis gratuit.
          </p>
        </div>

        <div className="contact-grid">
          <div className="form reveal" id="formWrap">
            {!done ? (
              <form id="devisForm" noValidate onSubmit={onSubmit}>
                <div className="form-row">
                  <div className={`field${invalid.nom ? " invalid" : ""}`}>
                    <label htmlFor="f-nom">
                      Nom <span className="req">*</span>
                    </label>
                    <input
                      type="text"
                      id="f-nom"
                      name="nom"
                      autoComplete="name"
                      placeholder="Votre nom"
                      onInput={() => clear("nom")}
                    />
                    <span className="err">Merci d&apos;indiquer votre nom.</span>
                  </div>
                  <div className={`field${invalid.tel ? " invalid" : ""}`}>
                    <label htmlFor="f-tel">
                      Téléphone <span className="req">*</span>
                    </label>
                    <input
                      type="tel"
                      id="f-tel"
                      name="tel"
                      autoComplete="tel"
                      placeholder="06 12 34 56 78"
                      onInput={() => clear("tel")}
                    />
                    <span className="err">Numéro de téléphone invalide.</span>
                  </div>
                </div>
                <div className={`field${invalid.email ? " invalid" : ""}`}>
                  <label htmlFor="f-email">E-mail</label>
                  <input
                    type="email"
                    id="f-email"
                    name="email"
                    autoComplete="email"
                    placeholder="vous@exemple.fr"
                    onInput={() => clear("email")}
                  />
                  <span className="err">Adresse e-mail invalide.</span>
                </div>
                <div className={`field${invalid.type ? " invalid" : ""}`}>
                  <label htmlFor="f-type">
                    Type de projet <span className="req">*</span>
                  </label>
                  <select id="f-type" name="type" defaultValue="" onChange={() => clear("type")}>
                    <option value="" disabled>
                      Sélectionnez un service…
                    </option>
                    {PROJECT_TYPES.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                  <span className="err">Merci de choisir un type de projet.</span>
                </div>
                <div className={`field${invalid.message ? " invalid" : ""}`}>
                  <label htmlFor="f-msg">
                    Votre projet <span className="req">*</span>
                  </label>
                  <textarea
                    id="f-msg"
                    name="message"
                    placeholder="Décrivez vos travaux, la commune, vos délais…"
                    onInput={() => clear("message")}
                  />
                  <span className="err">Merci de décrire votre projet.</span>
                </div>
                <p className="consent">
                  En envoyant ce formulaire, vous acceptez d&apos;être recontacté par Artisans de
                  France au sujet de votre demande. Vos données ne sont jamais cédées à des tiers.
                </p>
                {serverError && (
                  <p className="consent" style={{ color: "var(--rouge)" }}>
                    {serverError}
                  </p>
                )}
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? "Envoi…" : "Envoyer ma demande de devis"}
                  <IconArrow />
                </button>
              </form>
            ) : (
              <div className="form-success show" id="formSuccess">
                <div className="ok">
                  <IconCheck />
                </div>
                <h3>Demande envoyée, merci !</h3>
                <p>
                  Un artisan vous recontacte sous 24 h pour organiser votre visite et votre devis
                  gratuit.
                </p>
              </div>
            )}
          </div>

          <aside className="coords">
            <div className="coord">
              <div className="ic">
                <IconPhone />
              </div>
              <div>
                <div className="k">Téléphone</div>
                <div className="v">
                  <a href={`tel:${SITE.phoneHref}`}>{SITE.phoneDisplay}</a>
                  <span>Du lundi au samedi, 8 h – 19 h</span>
                </div>
              </div>
            </div>
            <div className="coord">
              <div className="ic">
                <IconMail />
              </div>
              <div>
                <div className="k">E-mail</div>
                <div className="v">
                  <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
                </div>
              </div>
            </div>
            <div className="coord">
              <div className="ic">
                <IconMapPin />
              </div>
              <div>
                <div className="k">Zone d&apos;intervention</div>
                <div className="v">
                  Vienne (86) &amp; alentours
                  <span>Deux-Sèvres (79), Maine-et-Loire (49), Vendée (85)</span>
                </div>
              </div>
            </div>
            <div className="coord" style={{ borderBottom: "none" }}>
              <div className="ic">
                <IconClock />
              </div>
              <div>
                <div className="k">Horaires</div>
                <div className="v">
                  Lun – Sam : 8 h – 19 h<span>Dépannage rapide aux heures d&apos;ouverture</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
