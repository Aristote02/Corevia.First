import { useEffect, useState } from "react";
import {
  Star,
  Quote,
  Loader2,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Send,
  MapPin,
  GraduationCap,
} from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { PageHeader, Section } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import {
  listApprovedTestimonials,
  submitTestimonial,
} from "@/lib/api/client";
import type { Testimonial } from "@/lib/api/types";

export const Route = createFileRoute("/temoignages")({
  head: () => ({
    meta: [
      { title: "Témoignages — COREVIA FIRST" },
      {
        name: "description",
        content:
          "Découvrez les témoignages des étudiants accompagnés par COREVIA FIRST vers leurs études à l'international.",
      },
      { property: "og:title", content: "Témoignages — COREVIA FIRST" },
    ],
  }),
  component: TestimonialsPage,
});

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`size-4 ${i < n ? "fill-gold text-gold" : "text-muted-foreground/40"}`}
        />
      ))}
    </div>
  );
}

function TestimonialsPage() {
  const { lang } = useI18n();
  const fr = lang === "fr";
  const { profile } = useAuth();

  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [data, setData] = useState({
    countryFrom: "",
    destinationCountry: "",
    university: "",
    rating: 5,
    testimonial: "",
  });

  useEffect(() => {
    listApprovedTestimonials().then((d) => {
      setItems(d);
      setLoading(false);
    });
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: name === "rating" ? parseInt(value, 10) : value,
    }));
    setFormError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError("");

    if (!profile) {
      setFormError(fr ? "Vous devez être connecté" : "You must be logged in");
      setIsSubmitting(false);
      return;
    }
    if (data.testimonial.length < 20) {
      setFormError(
        fr
          ? "Le témoignage doit contenir au moins 20 caractères"
          : "Testimonial must be at least 20 characters",
      );
      setIsSubmitting(false);
      return;
    }

    try {
      await submitTestimonial({
        student_name: profile.full_name || "Anonymous",
        country_from: data.countryFrom,
        destination_country: data.destinationCountry,
        university: data.university,
        rating: data.rating,
        testimonial_fr: data.testimonial,
        testimonial_en: data.testimonial,
      });
      setSubmitted(true);
      setData({
        countryFrom: "",
        destinationCountry: "",
        university: "",
        rating: 5,
        testimonial: "",
      });
      setShowForm(false);
    } catch {
      setFormError(fr ? "Erreur lors de l'envoi" : "Error submitting testimonial");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputCls =
    "w-full rounded-xl border border-border bg-card px-4 py-3.5 text-foreground outline-none transition-colors focus:border-gold";
  const labelCls = "block text-sm font-semibold text-foreground mb-2";

  return (
    <>
      <PageHeader
        eyebrow={fr ? "Témoignages" : "Testimonials"}
        title={fr ? "Témoignages d'étudiants" : "Student testimonials"}
        subtitle={
          fr
            ? "Les expériences de nos étudiants qui ont réalisé leur rêve."
            : "Experiences from our students who achieved their dreams."
        }
      />

      <Section>
        {/* Submission area (only for logged-in users) */}
        {profile && (
          <div className="mb-12">
            {submitted && (
              <div className="mb-6 flex items-start gap-3 rounded-xl border border-gold/40 bg-gold/10 p-6">
                <CheckCircle className="mt-0.5 size-6 shrink-0 text-gold" />
                <div>
                  <p className="font-semibold text-foreground">
                    {fr ? "Témoignage soumis !" : "Testimonial submitted!"}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {fr
                      ? "Votre témoignage sera visible après validation par notre équipe."
                      : "Your testimonial will be visible after validation by our team."}
                  </p>
                </div>
              </div>
            )}

            {!showForm ? (
              <div className="text-center">
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-gold px-6 py-3 text-sm font-bold text-gold-foreground shadow-gold transition-transform hover:scale-[1.03]"
                >
                  <MessageSquare className="size-5" />
                  {fr ? "Partager mon expérience" : "Share my experience"}
                </button>
              </div>
            ) : (
              <div className="rounded-2xl border border-border/60 bg-card p-8 shadow-soft">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="font-display text-2xl font-semibold text-foreground">
                    {fr ? "Partagez votre témoignage" : "Share your testimonial"}
                  </h3>
                  <button
                    onClick={() => setShowForm(false)}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                    aria-label="Close"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div>
                      <label className={labelCls}>
                        {fr ? "Pays d'origine *" : "Country of origin *"}
                      </label>
                      <input
                        type="text"
                        name="countryFrom"
                        value={data.countryFrom}
                        onChange={handleChange}
                        required
                        className={inputCls}
                        placeholder={fr ? "Ex: RD Congo" : "Ex: DR Congo"}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>
                        {fr ? "Pays de destination *" : "Destination country *"}
                      </label>
                      <input
                        type="text"
                        name="destinationCountry"
                        value={data.destinationCountry}
                        onChange={handleChange}
                        required
                        className={inputCls}
                        placeholder={fr ? "Ex: Biélorussie" : "Ex: Belarus"}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>
                      {fr ? "Université *" : "University *"}
                    </label>
                    <input
                      type="text"
                      name="university"
                      value={data.university}
                      onChange={handleChange}
                      required
                      className={inputCls}
                      placeholder={
                        fr ? "Nom de votre université" : "Your university name"
                      }
                    />
                  </div>

                  <div>
                    <label className={labelCls}>{fr ? "Note *" : "Rating *"}</label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() =>
                            setData((prev) => ({ ...prev, rating: r }))
                          }
                          aria-label={`${r} ${fr ? "étoiles" : "stars"}`}
                          className="p-1 transition-transform hover:scale-110"
                        >
                          <Star
                            className={`size-8 ${
                              r <= data.rating
                                ? "fill-gold text-gold"
                                : "text-muted-foreground/40"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>
                      {fr ? "Votre témoignage *" : "Your testimonial *"}
                    </label>
                    <textarea
                      name="testimonial"
                      value={data.testimonial}
                      onChange={handleChange}
                      required
                      rows={6}
                      maxLength={500}
                      className={`${inputCls} resize-none`}
                      placeholder={
                        fr
                          ? "Partagez votre expérience avec COREVIA FIRST (en français ou en anglais)..."
                          : "Share your experience with COREVIA FIRST (in French or English)..."
                      }
                    />
                    <div className="mt-1 text-right text-sm text-muted-foreground">
                      {data.testimonial.length} / 500
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || data.testimonial.length < 20}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-gold px-8 py-4 text-sm font-bold text-gold-foreground shadow-gold transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Send className="size-5" />
                    {isSubmitting
                      ? fr
                        ? "Envoi en cours..."
                        : "Sending..."
                      : fr
                        ? "Soumettre mon témoignage"
                        : "Submit my testimonial"}
                  </button>

                  {formError && (
                    <div className="flex items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
                      <AlertCircle className="mt-0.5 size-5 shrink-0" />
                      {formError}
                    </div>
                  )}
                </form>
              </div>
            )}
          </div>
        )}

        {/* Testimonials list */}
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="size-8 animate-spin text-gold" />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item, i) => (
              <Reveal key={item.id} delay={i * 80}>
                <figure className="flex h-full flex-col rounded-2xl border border-border/60 bg-card p-8">
                  <Quote className="size-8 text-gold/60" />
                  <blockquote className="mt-4 flex-1 text-muted-foreground">
                    “{fr ? item.testimonial_fr : item.testimonial_en || item.testimonial_fr}”
                  </blockquote>
                  <div className="mt-6">
                    <Stars n={item.rating} />
                    <figcaption className="mt-3 font-display text-lg font-semibold text-foreground">
                      {item.student_name}
                    </figcaption>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin className="size-3.5 text-gold" />
                      {item.country_from} → {item.destination_country}
                    </p>
                    <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <GraduationCap className="size-3.5 text-gold" />
                      {item.university}
                    </p>
                  </div>
                </figure>
              </Reveal>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}