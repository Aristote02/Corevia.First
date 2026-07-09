import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, ChevronDown } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { PageHeader, Section } from "@/components/site/PageHeader";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — COREVIA FIRST" },
      {
        name: "description",
        content:
          "Réponses aux questions fréquentes sur les visas d'étude, l'admission et l'accompagnement COREVIA FIRST.",
      },
      { property: "og:title", content: "FAQ — COREVIA FIRST" },
    ],
  }),
  component: FaqPage,
});

type Cat = "general" | "visa" | "procedure" | "cost" | "destinations" | "housing";

const FAQS: {
  cat: Cat;
  q_fr: string;
  q_en: string;
  a_fr: string;
  a_en: string;
}[] = [
  {
    cat: "general",
    q_fr: "Quels services proposez-vous ?",
    q_en: "What services do you offer?",
    a_fr: "Orientation universitaire, constitution de dossier, procédure de visa, logement, assurance et accompagnement complet jusqu'à votre installation.",
    a_en: "University guidance, application file, visa procedure, housing, insurance and full support until you are settled.",
  },
  {
    cat: "procedure",
    q_fr: "Combien de temps dure la procédure ?",
    q_en: "How long does the procedure take?",
    a_fr: "Cela varie selon le pays et l'université, généralement entre 1 et 3 mois après réception de votre dossier complet.",
    a_en: "It varies by country and university, generally between 1 and 3 months after we receive your complete file.",
  },
  {
    cat: "general",
    q_fr: "Quel est votre taux de réussite ?",
    q_en: "What is your success rate?",
    a_fr: "Nous affichons un taux de réussite de 98 % sur les dossiers de visa et d'admission que nous traitons.",
    a_en: "We have a 98% success rate on the visa and admission files we handle.",
  },
  {
    cat: "destinations",
    q_fr: "Dans quels pays puis-je étudier ?",
    q_en: "In which countries can I study?",
    a_fr: "Biélorussie, Russie, Turquie, Pologne, Allemagne, Canada, France, Chine et plus de 30 pays partenaires.",
    a_en: "Belarus, Russia, Turkey, Poland, Germany, Canada, France, China and over 30 partner countries.",
  },
  {
    cat: "cost",
    q_fr: "Comment obtenir un devis ?",
    q_en: "How do I get a quote?",
    a_fr: "Remplissez le formulaire de contact ou écrivez-nous sur WhatsApp : la consultation initiale est gratuite.",
    a_en: "Fill out the contact form or message us on WhatsApp: the initial consultation is free.",
  },
  {
    cat: "housing",
    q_fr: "Aidez-vous pour le logement ?",
    q_en: "Do you help with housing?",
    a_fr: "Oui, nous vous aidons à trouver un logement adapté et à organiser votre arrivée.",
    a_en: "Yes, we help you find suitable accommodation and organise your arrival.",
  },
  {
    cat: "visa",
    q_fr: "Quels documents sont nécessaires pour le visa ?",
    q_en: "What documents are required for the visa?",
    a_fr: "Passeport valide, lettre d'admission, relevés de notes, justificatifs financiers, assurance et photos conformes.",
    a_en: "Valid passport, admission letter, transcripts, proof of funds, insurance and compliant photos.",
  },
  {
    cat: "cost",
    q_fr: "Quel budget prévoir pour étudier à l'étranger ?",
    q_en: "What budget should I plan for studying abroad?",
    a_fr: "Le budget varie selon le pays : de 2000€/an en Biélorussie à 25000€/an au Canada, hors coût de vie.",
    a_en: "The budget varies by country: from €2000/yr in Belarus to €25000/yr in Canada, excluding cost of living.",
  },
];

function FaqPage() {
  const { lang } = useI18n();
  const fr = lang === "fr";
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<Cat | "all">("all");
  const [open, setOpen] = useState<number | null>(0);

  const categories: { key: Cat | "all"; label: string }[] = [
    { key: "all", label: fr ? "Toutes" : "All" },
    { key: "general", label: fr ? "Général" : "General" },
    { key: "visa", label: "Visa" },
    { key: "procedure", label: fr ? "Procédure" : "Procedure" },
    { key: "cost", label: fr ? "Coûts" : "Costs" },
    { key: "destinations", label: "Destinations" },
    { key: "housing", label: fr ? "Logement" : "Housing" },
  ];

  const filtered = useMemo(() => {
    const s = query.trim().toLowerCase();
    return FAQS.map((f, i) => ({ ...f, i })).filter((f) => {
      if (cat !== "all" && f.cat !== cat) return false;
      if (!s) return true;
      const q = fr ? f.q_fr : f.q_en;
      const a = fr ? f.a_fr : f.a_en;
      return q.toLowerCase().includes(s) || a.toLowerCase().includes(s);
    });
  }, [query, fr, cat]);

  return (
    <>
      <PageHeader
        eyebrow="FAQ"
        title={fr ? "Questions fréquentes" : "Frequently asked questions"}
        subtitle={
          fr
            ? "Trouvez rapidement les réponses à vos questions."
            : "Find quick answers to your questions."
        }
      />

      <Section className="max-w-3xl">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={fr ? "Rechercher une question..." : "Search a question..."}
            className="w-full rounded-full border border-border bg-card py-3.5 pl-12 pr-5 text-foreground outline-none transition-colors focus:border-gold"
          />
        </div>

        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => setCat(c.key)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                cat === c.key
                  ? "bg-gradient-gold text-gold-foreground shadow-gold"
                  : "border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="mt-8 space-y-3">
          {filtered.map((f) => {
            const isOpen = open === f.i;
            return (
              <div
                key={f.i}
                className="overflow-hidden rounded-2xl border border-border/60 bg-card"
              >
                <button
                  onClick={() => setOpen(isOpen ? null : f.i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="font-medium text-foreground">
                    {fr ? f.q_fr : f.q_en}
                  </span>
                  <ChevronDown
                    className={`size-5 shrink-0 text-gold transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="px-6 pb-5 text-sm text-muted-foreground">
                    {fr ? f.a_fr : f.a_en}
                  </p>
                )}
              </div>
            );
          })}
          {filtered.length === 0 && (
            <p className="py-10 text-center text-muted-foreground">
              {fr
                ? "Aucune question ne correspond à votre recherche."
                : "No questions match your search."}
            </p>
          )}
        </div>

        <div className="mt-12 rounded-2xl border border-gold/30 bg-gradient-dark p-8 text-center">
          <h2 className="font-display text-2xl font-semibold text-foreground">
            {fr ? "Vous ne trouvez pas de réponse ?" : "Can't find an answer?"}
          </h2>
          <p className="mt-2 text-muted-foreground">
            {fr
              ? "Notre équipe est là pour vous aider."
              : "Our team is here to help."}
          </p>
          <Link
            to="/contact"
            className="mt-6 inline-block rounded-full bg-gradient-gold px-7 py-3 text-sm font-semibold text-gold-foreground shadow-gold transition-transform hover:scale-[1.04]"
          >
            {fr ? "Nous contacter" : "Contact us"}
          </Link>
        </div>
      </Section>
    </>
  );
}