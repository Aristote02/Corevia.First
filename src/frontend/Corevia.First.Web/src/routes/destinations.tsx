import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  MapPin,
  Star,
  ArrowRight,
  X,
  DollarSign,
  Clock,
  GraduationCap,
  CheckCircle2,
  Map as MapIcon,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { PageHeader, Section } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/destinations")({
  head: () => ({
    meta: [
      { title: "Destinations — COREVIA FIRST" },
      {
        name: "description",
        content:
          "Biélorussie, Russie, Turquie, Pologne, Allemagne, Canada, France, Chine : nos destinations d'études sélectionnées pour leur excellence.",
      },
      { property: "og:title", content: "Destinations — COREVIA FIRST" },
    ],
  }),
  component: DestinationsPage,
});

type Country = {
  name: string;
  flag: string;
  capital: string;
  featured?: boolean;
  budget: string;
  delay: string;
  cost: string;
  desc: string;
  highlights: string[];
  universities: string[];
  programs: string[];
};

function DestinationsPage() {
  const { lang } = useI18n();
  const fr = lang === "fr";
  const [active, setActive] = useState<Country | null>(null);

  const countries: Country[] = [
    {
      name: fr ? "Biélorussie" : "Belarus",
      flag: "🇧🇾",
      capital: "Minsk",
      featured: true,
      budget: "2000-5000€/" + (fr ? "an" : "yr"),
      delay: fr ? "4-6 semaines" : "4-6 weeks",
      cost: "300-500€/" + (fr ? "mois" : "mo"),
      desc: fr
        ? "Destination phare : universités de médecine et d'ingénierie reconnues, coût de vie abordable."
        : "Featured: renowned medical and engineering universities, affordable cost of living.",
      highlights: fr
        ? ["99% de réussite", "Prix très compétitifs", "Accompagnement complet"]
        : ["99% success rate", "Very competitive prices", "Full support"],
      universities: [
        "Université d'État de Biélorussie",
        "Université Médicale d'État",
        "Université Technique d'État",
        "Université d'État de Grodno",
      ],
      programs: fr
        ? ["Médecine", "Ingénierie", "Sciences", "Architecture"]
        : ["Medicine", "Engineering", "Sciences", "Architecture"],
    },
    {
      name: fr ? "Russie" : "Russia",
      flag: "🇷🇺",
      capital: fr ? "Moscou" : "Moscow",
      budget: "2500-5000€/" + (fr ? "an" : "yr"),
      delay: fr ? "6-8 semaines" : "6-8 weeks",
      cost: "350-600€/" + (fr ? "mois" : "mo"),
      desc: fr
        ? "Excellence scientifique et programmes en anglais."
        : "Scientific excellence and English-taught programmes.",
      highlights: fr
        ? ["Universités prestigieuses", "Diplômes reconnus", "Culture riche"]
        : ["Prestigious universities", "Recognised degrees", "Rich culture"],
      universities: [
        fr ? "Université d'État de Moscou" : "Moscow State University",
        "RUDN University",
        "Saint Petersburg State University",
      ],
      programs: fr
        ? ["Médecine", "Ingénierie", "Aéronautique", "Sciences"]
        : ["Medicine", "Engineering", "Aeronautics", "Sciences"],
    },
    {
      name: fr ? "Turquie" : "Turkey",
      flag: "🇹🇷",
      capital: "Istanbul",
      budget: "3000-8000€/" + (fr ? "an" : "yr"),
      delay: fr ? "4-6 semaines" : "4-6 weeks",
      cost: "400-700€/" + (fr ? "mois" : "mo"),
      desc: fr
        ? "Universités modernes au carrefour de l'Europe et de l'Asie."
        : "Modern universities at the crossroads of Europe and Asia.",
      highlights: fr
        ? ["Pont entre cultures", "Programmes en anglais", "Coût de vie abordable"]
        : ["Bridge between cultures", "English programmes", "Affordable living"],
      universities: [
        "Université d'Istanbul",
        "Bogazici University",
        "Middle East Technical University",
      ],
      programs: fr
        ? ["Tous domaines", "Ingénierie", "Commerce", "Médecine"]
        : ["All fields", "Engineering", "Business", "Medicine"],
    },
    {
      name: fr ? "Pologne" : "Poland",
      flag: "🇵🇱",
      capital: fr ? "Varsovie" : "Warsaw",
      budget: "2000-5000€/" + (fr ? "an" : "yr"),
      delay: fr ? "6-8 semaines" : "6-8 weeks",
      cost: "400-650€/" + (fr ? "mois" : "mo"),
      desc: fr
        ? "Diplômes européens reconnus et campus dynamiques."
        : "Recognised European degrees and dynamic campuses.",
      highlights: fr
        ? ["Union Européenne", "Qualité d'enseignement", "Vie étudiante dynamique"]
        : ["European Union", "Teaching quality", "Dynamic student life"],
      universities: [
        "University of Warsaw",
        "Jagiellonian University",
        "Warsaw University of Technology",
      ],
      programs: fr
        ? ["Médecine", "Ingénierie", "Commerce", "Informatique"]
        : ["Medicine", "Engineering", "Business", "Computer science"],
    },
    {
      name: fr ? "Allemagne" : "Germany",
      flag: "🇩🇪",
      capital: fr ? "Berlin" : "Berlin",
      budget: "0-3000€/" + (fr ? "an" : "yr"),
      delay: fr ? "8-12 semaines" : "8-12 weeks",
      cost: "700-1000€/" + (fr ? "mois" : "mo"),
      desc: fr
        ? "Ingénierie et recherche de niveau mondial."
        : "World-class engineering and research.",
      highlights: fr
        ? ["Universités gratuites", "Excellence académique", "Opportunités d'emploi"]
        : ["Free universities", "Academic excellence", "Job opportunities"],
      universities: [
        "Technical University of Munich",
        "Heidelberg University",
        "Humboldt University of Berlin",
      ],
      programs: fr
        ? ["Ingénierie", "Sciences", "Automobile", "Recherche"]
        : ["Engineering", "Sciences", "Automotive", "Research"],
    },
    {
      name: "Canada",
      flag: "🇨🇦",
      capital: fr ? "Ottawa" : "Ottawa",
      budget: "10000-25000€/" + (fr ? "an" : "yr"),
      delay: fr ? "8-12 semaines" : "8-12 weeks",
      cost: "900-1400€/" + (fr ? "mois" : "mo"),
      desc: fr
        ? "Qualité de vie et perspectives d'immigration."
        : "Quality of life and immigration prospects.",
      highlights: fr
        ? ["Immigration facilitée", "Bilingue", "Qualité de vie"]
        : ["Immigration pathways", "Bilingual", "Quality of life"],
      universities: [
        fr ? "Université de Montréal" : "University of Montreal",
        "University of Toronto",
        "McGill University",
      ],
      programs: fr
        ? ["Tous domaines", "Technologie", "Commerce", "Santé"]
        : ["All fields", "Technology", "Business", "Health"],
    },
    {
      name: "France",
      flag: "🇫🇷",
      capital: fr ? "Paris" : "Paris",
      budget: "170-3000€/" + (fr ? "an" : "yr"),
      delay: fr ? "8-10 semaines" : "8-10 weeks",
      cost: "700-1100€/" + (fr ? "mois" : "mo"),
      desc: fr
        ? "Excellence académique et frais de scolarité accessibles."
        : "Academic excellence and accessible tuition fees.",
      highlights: fr
        ? ["Frais accessibles", "Diplômes reconnus", "Culture & art"]
        : ["Affordable fees", "Recognised degrees", "Culture & art"],
      universities: [
        fr ? "Sorbonne Université" : "Sorbonne University",
        "Sciences Po",
        fr ? "Université PSL" : "PSL University",
      ],
      programs: fr
        ? ["Tous domaines", "Arts", "Commerce", "Sciences"]
        : ["All fields", "Arts", "Business", "Sciences"],
    },
    {
      name: "Chine",
      flag: "🇨🇳",
      capital: fr ? "Pékin" : "Beijing",
      budget: "3000-6000€/" + (fr ? "an" : "yr"),
      delay: fr ? "6-10 semaines" : "6-10 weeks",
      cost: "400-800€/" + (fr ? "mois" : "mo"),
      desc: fr
        ? "Universités de premier plan et bourses attractives."
        : "Top-tier universities and attractive scholarships.",
      highlights: fr
        ? ["Bourses disponibles", "Universités classées", "Programmes en anglais"]
        : ["Scholarships available", "Ranked universities", "English programmes"],
      universities: [
        fr ? "Université de Pékin" : "Peking University",
        "Tsinghua University",
        "Fudan University",
      ],
      programs: fr
        ? ["Business", "Technologie", "Langue chinoise", "Relations internationales"]
        : ["Business", "Technology", "Chinese language", "International relations"],
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow={fr ? "Explorez le monde" : "Explore the world"}
        title={fr ? "Découvrez nos destinations" : "Discover our destinations"}
        subtitle={
          fr
            ? "Des universités d'exception à travers le monde, sélectionnées pour leur excellence."
            : "Exceptional universities around the world, selected for their excellence."
        }
      />

      <Section>
        {(() => {
          const featured = countries.find((c) => c.featured);
          const rest = countries.filter((c) => !c.featured);
          return (
            <>
              {featured && (
                <Reveal>
                  <div className="relative overflow-hidden rounded-3xl bg-gradient-gold p-8 text-gold-foreground shadow-gold sm:p-12">
                    <div className="absolute -right-10 -top-10 size-64 rounded-full bg-white/10 blur-2xl" />
                    <div className="relative">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-black/15 px-3 py-1 text-xs font-bold uppercase tracking-wider">
                        <Star className="size-3.5 fill-current" />
                        {fr ? "Destination phare" : "Featured destination"}
                      </span>
                      <h2 className="mt-4 font-display text-4xl font-bold sm:text-5xl">
                        {featured.name}
                      </h2>
                      <p className="mt-3 max-w-2xl text-sm/relaxed opacity-90">
                        {featured.desc}
                      </p>

                      <div className="mt-7 grid gap-4 sm:grid-cols-3">
                        <div className="rounded-2xl bg-black/10 p-5">
                          <DollarSign className="size-5" />
                          <p className="mt-2 text-xs uppercase tracking-wide opacity-80">
                            {fr ? "Budget" : "Budget"}
                          </p>
                          <p className="text-lg font-bold">{featured.budget}</p>
                        </div>
                        <div className="rounded-2xl bg-black/10 p-5">
                          <Clock className="size-5" />
                          <p className="mt-2 text-xs uppercase tracking-wide opacity-80">
                            {fr ? "Durée" : "Duration"}
                          </p>
                          <p className="text-lg font-bold">{featured.delay}</p>
                        </div>
                        <div className="rounded-2xl bg-black/10 p-5">
                          <CheckCircle2 className="size-5" />
                          <p className="mt-2 text-xs uppercase tracking-wide opacity-80">
                            {fr ? "Points forts" : "Highlights"}
                          </p>
                          <ul className="mt-1 space-y-0.5 text-sm font-semibold">
                            {featured.highlights.map((h) => (
                              <li key={h}>• {h}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <button
                        onClick={() => setActive(featured)}
                        className="mt-8 inline-flex items-center gap-2 rounded-full bg-card px-7 py-3.5 text-sm font-bold text-foreground shadow-soft transition-transform hover:scale-[1.03]"
                      >
                        {fr ? "En savoir plus" : "Learn more"}
                        <ArrowRight className="size-4" />
                      </button>
                    </div>
                  </div>
                </Reveal>
              )}

              <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {rest.map((c, i) => (
                  <Reveal key={c.name} delay={i * 60}>
                    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card p-8 transition-all hover:-translate-y-1 hover:shadow-gold">
                      <div className="text-5xl">{c.flag}</div>
                      <h3 className="mt-5 font-display text-2xl font-semibold text-foreground">
                        {c.name}
                      </h3>
                      <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                        <MapPin className="size-4 text-gold" /> {c.capital}
                      </p>
                      <p className="mt-4 flex-1 text-sm text-muted-foreground">{c.desc}</p>
                      <div className="mt-5 grid grid-cols-2 gap-2 text-xs">
                        <span className="rounded-lg bg-secondary/50 px-3 py-2 text-muted-foreground">
                          💰 {c.budget}
                        </span>
                        <span className="rounded-lg bg-secondary/50 px-3 py-2 text-muted-foreground">
                          ⏱ {c.delay}
                        </span>
                      </div>
                      <button
                        onClick={() => setActive(c)}
                        className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gold"
                      >
                        {fr ? "En savoir plus" : "Learn more"}
                        <ArrowRight className="size-4" />
                      </button>
                    </div>
                  </Reveal>
                ))}
              </div>
            </>
          );
        })()}
      </Section>

      {active && (
        <DestinationModal
          country={active}
          fr={fr}
          onClose={() => setActive(null)}
        />
      )}
    </>
  );
}

function DestinationModal({
  country: c,
  fr,
  onClose,
}: {
  country: Country;
  fr: boolean;
  onClose: () => void;
}) {
  const mapQuery = encodeURIComponent(`${c.capital}`);
  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="my-8 w-full max-w-3xl overflow-hidden rounded-3xl border border-border/70 bg-card shadow-soft"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative flex items-center justify-between bg-gradient-dark px-7 py-6">
          <div className="flex items-center gap-4">
            <span className="text-5xl">{c.flag}</span>
            <div>
              <h3 className="font-display text-3xl font-semibold text-foreground">
                {c.name}
              </h3>
              <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="size-4 text-gold" /> {c.capital}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="space-y-7 p-7">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { icon: DollarSign, label: fr ? "Budget estimatif" : "Est. budget", value: c.budget },
              { icon: Clock, label: fr ? "Délai de traitement" : "Processing time", value: c.delay },
              { icon: DollarSign, label: fr ? "Coût de vie/mois" : "Cost of living/mo", value: c.cost },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-border/60 bg-secondary/30 p-4">
                <s.icon className="size-5 text-gold" />
                <p className="mt-2 text-xs text-muted-foreground">{s.label}</p>
                <p className="font-semibold text-foreground">{s.value}</p>
              </div>
            ))}
          </div>

          <div>
            <h4 className="flex items-center gap-2 font-semibold text-foreground">
              <CheckCircle2 className="size-5 text-gold" />
              {fr ? "Points forts" : "Highlights"}
            </h4>
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
              {c.highlights.map((h) => (
                <span key={h} className="rounded-xl bg-secondary/40 px-3 py-2 text-sm text-muted-foreground">
                  • {h}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="flex items-center gap-2 font-semibold text-foreground">
              <GraduationCap className="size-5 text-gold" />
              {fr ? "Universités populaires" : "Popular universities"}
            </h4>
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {c.universities.map((u) => (
                <span key={u} className="rounded-xl bg-secondary/40 px-3 py-2 text-sm text-muted-foreground">
                  {u}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-foreground">
              {fr ? "Programmes populaires" : "Popular programmes"}
            </h4>
            <div className="mt-3 flex flex-wrap gap-2">
              {c.programs.map((p) => (
                <span key={p} className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-sm text-gold">
                  {p}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="flex items-center gap-2 font-semibold text-foreground">
              <MapIcon className="size-5 text-gold" />
              {fr ? "Localisation" : "Location"}
            </h4>
            <div className="mt-3 overflow-hidden rounded-2xl border border-border/60">
              <iframe
                title={`Map of ${c.capital}`}
                src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                className="h-64 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <Link
            to="/contact"
            search={{ country: c.name, service: fr ? "Visa étudiant" : "Student visa" }}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-gold px-8 py-3.5 text-sm font-semibold text-gold-foreground shadow-gold transition-transform hover:scale-[1.02]"
          >
            {fr ? "Étudier ici" : "Study here"}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}