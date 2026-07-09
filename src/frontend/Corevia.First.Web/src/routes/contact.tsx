import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  Loader2,
  MessageCircle,
  ArrowRight,
} from "lucide-react";
import { useI18n, WHATSAPP_LINK, WHATSAPP_NUMBER } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { PageHeader, Section } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { submitContact } from "@/lib/api/client";
import { SocialMediaSection } from "@/components/site/SocialMediaSection";

export const Route = createFileRoute("/contact")({
  validateSearch: (search: Record<string, unknown>) => ({
    service: typeof search.service === "string" ? search.service : undefined,
    country: typeof search.country === "string" ? search.country : undefined,
    message: typeof search.message === "string" ? search.message : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Contact — COREVIA FIRST" },
      {
        name: "description",
        content:
          "Contactez COREVIA FIRST pour une consultation gratuite sur votre projet d'études à l'international.",
      },
      { property: "og:title", content: "Contact — COREVIA FIRST" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { lang } = useI18n();
  const fr = lang === "fr";
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { service, country: prefillCountry, message: prefillMessage } =
    Route.useSearch();

  const requestTypes = fr
    ? [
        "Visa étudiant",
        "Orientation universitaire",
        "Constitution du dossier",
        "Procédure de visa",
        "Préparation linguistique",
        "Logement & installation",
        "Suivi & assurance",
        "Autre",
      ]
    : [
        "Student visa",
        "University guidance",
        "Application file",
        "Visa procedure",
        "Language preparation",
        "Housing & settling in",
        "Follow-up & insurance",
        "Other",
      ];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    country: prefillCountry ?? "",
    visaType: service ?? requestTypes[0],
    message: prefillMessage ?? "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Restore draft message
  useEffect(() => {
    if (typeof localStorage === "undefined") return;
    const saved = localStorage.getItem("contact_draft_message");
    if (saved && !prefillMessage) {
      setFormData((prev) => ({ ...prev, message: saved }));
    }
  }, [prefillMessage]);

  // Pre-fill from the authenticated profile (keep a destination chosen via URL)
  useEffect(() => {
    if (profile) {
      setFormData((prev) => ({
        ...prev,
        name: profile.full_name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        country: prefillCountry || profile.country || prev.country,
      }));
    }
  }, [profile, prefillCountry]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "message" && typeof localStorage !== "undefined") {
      localStorage.setItem("contact_draft_message", value);
    }
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (formData.message.length < 10) {
      setError(
        fr
          ? "Le message doit contenir au moins 10 caractères."
          : "The message must be at least 10 characters.",
      );
      setIsSubmitting(false);
      return;
    }
    if (formData.message.length > 500) {
      setError(
        fr
          ? "Le message ne peut pas dépasser 500 caractères."
          : "The message cannot exceed 500 characters.",
      );
      setIsSubmitting(false);
      return;
    }

    try {
      await submitContact({
        full_name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        country: formData.country || undefined,
        service: formData.visaType || undefined,
        message: formData.message,
      });
      if (typeof localStorage !== "undefined")
        localStorage.removeItem("contact_draft_message");
      setSubmitted(true);
    } catch {
      setError(
        fr
          ? "Une erreur est survenue. Réessayez ou contactez-nous sur WhatsApp."
          : "Something went wrong. Please retry or reach us on WhatsApp.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputCls =
    "w-full rounded-xl border border-border bg-card px-4 py-3.5 text-foreground outline-none transition-colors focus:border-gold";
  const labelCls = "block text-sm font-semibold text-foreground mb-2";

  const msgLen = formData.message.length;
  const msgInvalid = msgLen > 0 && (msgLen < 10 || msgLen > 500);

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title={fr ? "Parlons de votre projet" : "Let's talk about your project"}
        subtitle={
          fr
            ? "Consultation gratuite et personnalisée. Nous vous répondons rapidement."
            : "Free, personalised consultation. We reply quickly."
        }
      />

      <Section>
        {/* Contact cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-border/60 bg-card p-7 shadow-soft">
            <span className="flex size-12 items-center justify-center rounded-xl bg-[#EA4335]/15">
              <Mail className="size-6 text-[#EA4335]" />
            </span>
            <h3 className="mt-4 text-lg font-bold text-foreground">
              {fr ? "E-mail" : "Email"}
            </h3>
            <p className="mt-1 text-sm font-semibold text-gold">
              contact@coreviafirst.com
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {fr ? "Réponse sous 24h" : "Reply within 24h"}
            </p>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card p-7 shadow-soft">
            <span className="flex size-12 items-center justify-center rounded-xl bg-[#25D366]/15">
              <MessageCircle className="size-6 text-[#25D366]" />
            </span>
            <h3 className="mt-4 text-lg font-bold text-foreground">WhatsApp</h3>
            <p className="mt-1 text-sm font-semibold text-gold">
              +{WHATSAPP_NUMBER}
            </p>
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-foreground hover:text-gold"
            >
              {fr ? "Envoyer un message" : "Send a message"}
              <ArrowRight className="size-3" />
            </a>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card p-7 shadow-soft">
            <span className="flex size-12 items-center justify-center rounded-xl bg-[#2563EB]/15">
              <MapPin className="size-6 text-[#2563EB]" />
            </span>
            <h3 className="mt-4 text-lg font-bold text-foreground">
              {fr ? "Localisation" : "Location"}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Minsk · {fr ? "International" : "International"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {fr ? "Biélorussie" : "Belarus"}
            </p>
          </div>
        </div>

        {/* Form + sidebar */}
        <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-5">
          <Reveal className="lg:col-span-3">
            <span className="text-sm font-bold uppercase tracking-widest text-gold">
              {fr ? "Formulaire" : "Form"}
            </span>
            <h2 className="mb-8 mt-2 font-display text-3xl font-semibold text-foreground">
              {fr ? "Demande de devis gratuit" : "Free quote request"}
            </h2>

            {submitted ? (
              <div className="rounded-2xl border border-gold/30 bg-card p-8 text-center">
                <CheckCircle2 className="mx-auto size-14 text-gold" />
                <h3 className="mt-4 font-display text-2xl font-semibold text-foreground">
                  {fr ? "Demande envoyée !" : "Request sent!"}
                </h3>
                <p className="mt-2 text-muted-foreground">
                  {fr
                    ? "Merci, nous revenons vers vous très vite."
                    : "Thank you, we'll get back to you very soon."}
                </p>
                <button
                  onClick={() => navigate({ to: "/mon-compte" })}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-gold px-6 py-3 text-sm font-semibold text-gold-foreground shadow-gold transition-transform hover:scale-[1.03]"
                >
                  {fr ? "Voir mon compte" : "View my account"}
                  <ArrowRight className="size-4" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className={labelCls}>{fr ? "Nom complet" : "Full name"} *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={inputCls}
                    placeholder={fr ? "Votre nom complet" : "Your full name"}
                  />
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <label className={labelCls}>{fr ? "Adresse e-mail" : "Email"} *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={inputCls}
                      placeholder="email@exemple.com"
                    />
                  </div>
                  <div>
                    <label className={labelCls}>{fr ? "Téléphone" : "Phone"}</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={inputCls}
                      placeholder="+XXX XXX XXX XXX"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <label className={labelCls}>{fr ? "Pays" : "Country"} *</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      required
                      className={inputCls}
                      placeholder={fr ? "Votre pays" : "Your country"}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>
                      {fr ? "Type de demande" : "Request type"} *
                    </label>
                    <select
                      name="visaType"
                      value={formData.visaType}
                      onChange={handleChange}
                      className={inputCls}
                    >
                      {requestTypes.map((rt) => (
                        <option key={rt} value={rt}>
                          {rt}
                        </option>
                      ))}
                      {/* keep a service passed via URL even if not in the list */}
                      {service && !requestTypes.includes(service) && (
                        <option value={service}>{service}</option>
                      )}
                    </select>
                  </div>
                </div>

                <div>
                  <label className={labelCls}>{fr ? "Message" : "Message"} *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    maxLength={500}
                    className={`${inputCls} resize-none ${
                      msgInvalid ? "border-destructive focus:border-destructive" : ""
                    }`}
                    placeholder={
                      fr
                        ? "Décrivez votre projet d'études..."
                        : "Describe your study project..."
                    }
                  />
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm font-semibold text-destructive">
                      {msgLen > 0 && msgLen < 10 &&
                        (fr ? "Minimum 10 caractères" : "Minimum 10 characters")}
                      {msgLen > 500 &&
                        (fr ? "Maximum 500 caractères" : "Maximum 500 characters")}
                    </span>
                    <span
                      className={`text-sm font-semibold ${
                        msgLen > 500
                          ? "text-destructive"
                          : msgLen >= 450
                            ? "text-gold"
                            : "text-muted-foreground"
                      }`}
                    >
                      {msgLen} / 500
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || msgLen < 10 || msgLen > 500}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-gold px-8 py-4 text-sm font-semibold text-gold-foreground shadow-gold transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      {fr ? "Envoi..." : "Sending..."}
                    </>
                  ) : (
                    <>
                      <Send className="size-4" />
                      {fr ? "Envoyer ma demande" : "Send my request"}
                    </>
                  )}
                </button>

                {error && (
                  <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-center text-sm font-medium text-destructive">
                    {error}
                  </div>
                )}
              </form>
            )}
          </Reveal>

          <Reveal delay={120} className="space-y-6 lg:col-span-2">
            <div className="rounded-2xl border border-border/60 bg-card p-7 shadow-soft">
              <div className="mb-5 flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-[#F59E0B]/15 text-xl">
                  🕒
                </span>
                <h3 className="text-xl font-bold text-foreground">
                  {fr ? "Heures d'ouverture" : "Business hours"}
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-xl bg-secondary/40 p-3">
                  <span className="text-sm text-muted-foreground">
                    {fr ? "Lundi - Samedi" : "Monday - Saturday"}
                  </span>
                  <span className="text-sm font-bold text-foreground">8h00 - 20h00</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-secondary/40 p-3">
                  <span className="text-sm text-muted-foreground">
                    {fr ? "Dimanche" : "Sunday"}
                  </span>
                  <span className="text-sm font-bold text-foreground">10h00 - 18h00</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border/60 bg-card p-7 shadow-soft">
              <h3 className="mb-5 text-xl font-bold text-foreground">
                {fr ? "Pourquoi nous contacter ?" : "Why contact us?"}
              </h3>
              <ul className="space-y-3">
                {(fr
                  ? [
                      "Consultation gratuite",
                      "Réponse rapide",
                      "Devis gratuit",
                      "Accompagnement expert",
                      "Support multilingue",
                    ]
                  : [
                      "Free consultation",
                      "Quick response",
                      "Free quote",
                      "Expert support",
                      "Multilingual support",
                    ]
                ).map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-gold" />
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-gold/30 bg-card p-7 shadow-soft">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-gold/15">
                  <Phone className="size-5 text-gold" />
                </span>
                <h3 className="text-xl font-bold text-foreground">
                  {fr ? "WhatsApp rapide" : "Quick WhatsApp"}
                </h3>
              </div>
              <p className="mb-5 text-sm text-muted-foreground">
                {fr
                  ? "Discutez directement avec un conseiller pour une réponse immédiate."
                  : "Chat directly with an advisor for an immediate answer."}
              </p>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-gold px-6 py-3 text-sm font-bold text-gold-foreground shadow-gold transition-transform hover:scale-[1.03]"
              >
                {fr ? "Discuter sur WhatsApp" : "Chat on WhatsApp"}
                <ArrowRight className="size-4" />
              </a>
            </div>
          </Reveal>
        </div>

        <Reveal>
          <SocialMediaSection />
        </Reveal>
      </Section>
    </>
  );
}