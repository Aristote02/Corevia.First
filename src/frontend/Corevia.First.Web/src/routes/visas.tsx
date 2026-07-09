import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Clock,
  CheckCircle2,
  ShieldCheck,
  FileText,
  Stamp,
  Plane,
  ChevronLeft,
  ChevronRight,
  Search,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { PageHeader, Section } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/visas")({
  head: () => ({
    meta: [
      { title: "Visas d'étude — COREVIA FIRST" },
      {
        name: "description",
        content:
          "Tout savoir sur le visa étudiant : destinations, types, documents requis et procédure. COREVIA FIRST vous accompagne à chaque étape.",
      },
      { property: "og:title", content: "Visas d'étude — COREVIA FIRST" },
    ],
  }),
  component: VisasPage,
});

type Region = "all" | "europe" | "afrique" | "asie" | "amerique" | "moyen-orient";

const img = (fn: string) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fn)}?width=800`;

type VisaCountry = {
  name: string;
  flag: string;
  region: Region;
  image: string;
  delay: string;
};

type VisaPackage = {
  country: string;
  type: string;
  price: number;
  region: Region;
  duration: string;
  validity: string;
  services: string[];
  documents: string[];
};

function VisasPage() {
  const { lang } = useI18n();
  const fr = lang === "fr";
  const [region, setRegion] = useState<Region>("all");
  const [pkgRegion, setPkgRegion] = useState<Region>("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const PER_PAGE = 6;

  const regions: { key: Region; label: string }[] = [
    { key: "all", label: fr ? "Tous" : "All" },
    { key: "europe", label: "Europe" },
    { key: "afrique", label: fr ? "Afrique" : "Africa" },
    { key: "asie", label: fr ? "Asie" : "Asia" },
    { key: "amerique", label: fr ? "Amérique" : "America" },
    { key: "moyen-orient", label: fr ? "Moyen-Orient" : "Middle East" },
  ];

  const w = (n: number) => (fr ? `${n} sem.` : `${n} wks`);

  const countries: VisaCountry[] = [
    // Europe
    { name: fr ? "Biélorussie" : "Belarus", flag: "🇧🇾", region: "europe", image: img("Minsk city skyline.jpg"), delay: fr ? "4-6 sem." : "4-6 wks" },
    { name: fr ? "Russie" : "Russia", flag: "🇷🇺", region: "europe", image: img("Moscow_July_2011-7a.jpg"), delay: fr ? "6-8 sem." : "6-8 wks" },
    { name: fr ? "Pologne" : "Poland", flag: "🇵🇱", region: "europe", image: img("Skyline of Warsaw, Poland.jpg"), delay: fr ? "6-8 sem." : "6-8 wks" },
    { name: fr ? "Allemagne" : "Germany", flag: "🇩🇪", region: "europe", image: img("Brandenburger_Tor_abends.jpg"), delay: fr ? "8-12 sem." : "8-12 wks" },
    { name: "France", flag: "🇫🇷", region: "europe", image: img("Tour_Eiffel_Wikimedia_Commons.jpg"), delay: fr ? "8-10 sem." : "8-10 wks" },
    { name: fr ? "Chypre" : "Cyprus", flag: "🇨🇾", region: "europe", image: img("Kyrenia_Harbour.jpg"), delay: fr ? "4-6 sem." : "4-6 wks" },
    { name: fr ? "Serbie" : "Serbia", flag: "🇷🇸", region: "europe", image: img("Temple_of_Saint_Sava.jpg"), delay: fr ? "4-6 sem." : "4-6 wks" },
    // Afrique
    { name: fr ? "Maroc" : "Morocco", flag: "🇲🇦", region: "afrique", image: img("Chefchaouen_Morocco.jpg"), delay: fr ? "4-6 sem." : "4-6 wks" },
    { name: fr ? "Tunisie" : "Tunisia", flag: "🇹🇳", region: "afrique", image: img("Sidi_Bou_Said,_Tunisia.jpg"), delay: fr ? "4-6 sem." : "4-6 wks" },
    { name: fr ? "Égypte" : "Egypt", flag: "🇪🇬", region: "afrique", image: img("Kheops-Pyramid.jpg"), delay: fr ? "4-6 sem." : "4-6 wks" },
    // Asie
    { name: fr ? "Turquie" : "Turkey", flag: "🇹🇷", region: "asie", image: img("Hagia_Sophia_Mars_2013.jpg"), delay: fr ? "4-6 sem." : "4-6 wks" },
    { name: "Chine", flag: "🇨🇳", region: "asie", image: img("The_Great_Wall_of_China_at_Jinshanling-edit.jpg"), delay: fr ? "6-10 sem." : "6-10 wks" },
    { name: fr ? "Malaisie" : "Malaysia", flag: "🇲🇾", region: "asie", image: img("Petronas_Towers_2015.jpg"), delay: fr ? "4-6 sem." : "4-6 wks" },
    { name: "Inde", flag: "🇮🇳", region: "asie", image: img("Taj_Mahal_(Edited).jpeg"), delay: fr ? "4-6 sem." : "4-6 wks" },
    // Amérique
    { name: "Canada", flag: "🇨🇦", region: "amerique", image: img("Toronto_-_ON_-_Toronto_Skyline2.jpg"), delay: fr ? "8-12 sem." : "8-12 wks" },
    { name: fr ? "États-Unis" : "USA", flag: "🇺🇸", region: "amerique", image: img("Statue_of_Liberty_7.jpg"), delay: fr ? "8-14 sem." : "8-14 wks" },
    { name: fr ? "Brésil" : "Brazil", flag: "🇧🇷", region: "amerique", image: img("Christ_on_Corcovado_mountain.JPG"), delay: fr ? "6-8 sem." : "6-8 wks" },
    // Moyen-Orient
    { name: fr ? "Émirats Arabes Unis" : "United Arab Emirates", flag: "🇦🇪", region: "moyen-orient", image: img("Dubai, United Arab Emirates (Unsplash).jpg"), delay: fr ? "4-6 sem." : "4-6 wks" },
  ];

  const filteredCountries = useMemo(
    () => countries.filter((c) => region === "all" || c.region === region),
    [region, countries],
  );

  const svc = {
    express: fr ? "Traitement express" : "Express processing",
    admin: fr ? "Assistance administrative" : "Administrative assistance",
    follow: fr ? "Suivi du dossier" : "Application tracking",
    full: fr ? "Assistance complète" : "Full assistance",
    translation: fr ? "Traduction certifiée" : "Certified translation",
    perso: fr ? "Accompagnement personnalisé" : "Personalised support",
    support: fr ? "Support 24/7" : "24/7 support",
  };
  const doc = {
    passport: fr ? "Passeport valide" : "Valid passport",
    photos: fr ? "Photos d'identité" : "ID photos",
    admission: fr ? "Lettre d'admission" : "Admission letter",
    funds: fr ? "Justificatifs financiers" : "Proof of funds",
    insurance: fr ? "Assurance santé" : "Health insurance",
  };
  const studentLabel = fr ? "Visa Étudiant" : "Student Visa";
  const touristLabel = fr ? "Visa Touristique" : "Tourist Visa";

  const packages: VisaPackage[] = [
    { country: fr ? "Biélorussie" : "Belarus", type: studentLabel, price: 350, region: "europe", duration: w(6), validity: fr ? "1 an (renouvelable)" : "1 yr (renewable)", services: [svc.full, svc.translation, svc.follow, svc.support], documents: [doc.passport, doc.photos, doc.admission] },
    { country: fr ? "Russie" : "Russia", type: studentLabel, price: 450, region: "europe", duration: w(8), validity: fr ? "1 an (renouvelable)" : "1 yr (renewable)", services: [svc.full, svc.perso, svc.follow, svc.support], documents: [doc.passport, doc.photos, doc.admission, doc.funds] },
    { country: fr ? "Pologne" : "Poland", type: studentLabel, price: 500, region: "europe", duration: w(8), validity: fr ? "1 an (renouvelable)" : "1 yr (renewable)", services: [svc.full, svc.translation, svc.perso, svc.follow], documents: [doc.passport, doc.admission, doc.funds, doc.insurance] },
    { country: fr ? "Allemagne" : "Germany", type: touristLabel, price: 180, region: "europe", duration: w(3), validity: fr ? "90 jours" : "90 days", services: [svc.express, svc.admin, svc.follow], documents: [doc.passport, doc.photos, doc.insurance] },
    { country: fr ? "Allemagne" : "Germany", type: studentLabel, price: 450, region: "europe", duration: w(10), validity: fr ? "1 an (renouvelable)" : "1 yr (renewable)", services: [svc.full, svc.translation, svc.perso, svc.support], documents: [doc.passport, doc.photos, doc.admission, doc.funds] },
    { country: "France", type: studentLabel, price: 400, region: "europe", duration: w(9), validity: fr ? "1 an (renouvelable)" : "1 yr (renewable)", services: [svc.full, svc.perso, svc.follow, svc.support], documents: [doc.passport, doc.admission, doc.funds] },
    { country: fr ? "Turquie" : "Turkey", type: studentLabel, price: 300, region: "asie", duration: w(5), validity: fr ? "1 an (renouvelable)" : "1 yr (renewable)", services: [svc.express, svc.admin, svc.translation, svc.follow], documents: [doc.passport, doc.photos, doc.admission] },
    { country: "Chine", type: studentLabel, price: 420, region: "asie", duration: w(8), validity: fr ? "1 an (renouvelable)" : "1 yr (renewable)", services: [svc.full, svc.translation, svc.perso], documents: [doc.passport, doc.admission, doc.funds] },
    { country: fr ? "Malaisie" : "Malaysia", type: studentLabel, price: 380, region: "asie", duration: w(5), validity: fr ? "1 an (renouvelable)" : "1 yr (renewable)", services: [svc.full, svc.admin, svc.follow], documents: [doc.passport, doc.photos, doc.admission] },
    { country: "Canada", type: studentLabel, price: 600, region: "amerique", duration: w(12), validity: fr ? "Durée des études" : "Study duration", services: [svc.full, svc.perso, svc.support], documents: [doc.passport, doc.admission, doc.funds, doc.insurance] },
    { country: fr ? "États-Unis" : "USA", type: studentLabel, price: 700, region: "amerique", duration: w(14), validity: fr ? "Durée des études" : "Study duration", services: [svc.full, svc.perso, svc.support], documents: [doc.passport, doc.admission, doc.funds] },
    { country: fr ? "Émirats Arabes Unis" : "UAE", type: studentLabel, price: 500, region: "moyen-orient", duration: w(6), validity: fr ? "1 an (renouvelable)" : "1 yr (renewable)", services: [svc.full, svc.admin, svc.support], documents: [doc.passport, doc.photos, doc.admission] },
    { country: fr ? "Maroc" : "Morocco", type: touristLabel, price: 150, region: "afrique", duration: w(3), validity: fr ? "90 jours" : "90 days", services: [svc.express, svc.admin, svc.follow], documents: [doc.passport, doc.photos] },
  ];

  const filteredPackages = useMemo(() => {
    const q = query.trim().toLowerCase();
    return packages.filter((p) => {
      const okRegion = pkgRegion === "all" || p.region === pkgRegion;
      const okQuery =
        !q ||
        p.country.toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q);
      return okRegion && okQuery;
    });
  }, [pkgRegion, query, packages]);

  const pageCount = Math.max(1, Math.ceil(filteredPackages.length / PER_PAGE));
  const safePage = Math.min(page, pageCount - 1);
  const pagePackages = filteredPackages.slice(
    safePage * PER_PAGE,
    safePage * PER_PAGE + PER_PAGE,
  );

  const steps = [
    { icon: FileText, title: fr ? "Préparation des documents" : "Document preparation", desc: fr ? "Nous vérifions et constituons un dossier complet et conforme." : "We verify and assemble a complete, compliant file." },
    { icon: Stamp, title: fr ? "Dépôt de la demande" : "Application submission", desc: fr ? "Prise de rendez-vous et soumission auprès des autorités." : "Appointment booking and submission to the authorities." },
    { icon: Clock, title: fr ? "Suivi du dossier" : "Application tracking", desc: fr ? "Nous suivons l'avancement jusqu'à la décision." : "We track progress until the decision." },
    { icon: Plane, title: fr ? "Préparation au départ" : "Departure preparation", desc: fr ? "Billet, logement et installation organisés." : "Ticket, housing and settling organised." },
  ];

  return (
    <>
      <PageHeader
        eyebrow={fr ? "Visas d'étude" : "Study visas"}
        title={fr ? "Obtenez votre visa en toute sérénité" : "Get your visa with peace of mind"}
        subtitle={
          fr
            ? "Un taux de réussite de 98 % grâce à un accompagnement rigoureux à chaque étape de la procédure."
            : "A 98% success rate thanks to rigorous support at every step of the procedure."
        }
      />

      {/* Destinations with image + hover details */}
      <Section>
        <Reveal>
          <h2 className="font-display text-3xl font-semibold text-foreground">
            {fr ? "Visas par destination" : "Visas by destination"}
          </h2>
          <p className="mt-3 text-muted-foreground">
            {fr
              ? "Survolez une destination pour découvrir les détails et créer votre dossier."
              : "Hover a destination to reveal the details and create your application."}
          </p>
        </Reveal>

        <div className="mt-6 flex flex-wrap gap-2">
          {regions.map((r) => (
            <button
              key={r.key}
              onClick={() => setRegion(r.key)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                region === r.key
                  ? "bg-gradient-gold text-gold-foreground shadow-gold"
                  : "border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCountries.map((c, i) => (
            <Reveal key={c.name} delay={(i % 3) * 60}>
              <div className="group relative h-72 overflow-hidden rounded-2xl border border-border/60 shadow-soft">
                <img
                  src={c.image}
                  alt={c.name}
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                {/* Always-visible name */}
                <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 p-5 transition-opacity duration-300 group-hover:opacity-0">
                  <span className="text-2xl">{c.flag}</span>
                  <h3 className="font-display text-2xl font-semibold text-white">
                    {c.name}
                  </h3>
                </div>

                {/* Hover details */}
                <div className="absolute inset-0 flex translate-y-4 flex-col justify-end gap-3 bg-black/60 p-6 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">{c.flag}</span>
                    <h3 className="font-display text-2xl font-semibold text-white">
                      {c.name}
                    </h3>
                  </div>
                  <p className="flex items-center gap-2 text-sm text-white/85">
                    <Clock className="size-4 text-gold" />
                    {fr ? "Délai" : "Processing"}: {c.delay}
                  </p>
                  <p className="flex items-center gap-2 text-sm text-white/85">
                    <ShieldCheck className="size-4 text-gold" />
                    {fr ? "98% de réussite" : "98% success rate"}
                  </p>
                  <Link
                    to="/contact"
                    search={{ country: c.name, service: studentLabel }}
                    className="mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-gold px-5 py-3 text-sm font-bold text-gold-foreground shadow-gold transition-transform hover:scale-[1.03]"
                  >
                    {fr ? "Créer un dossier" : "Create a file"}
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}
          {filteredCountries.length === 0 && (
            <p className="py-8 text-center text-muted-foreground">
              {fr ? "Aucune destination dans cette région." : "No destination in this region."}
            </p>
          )}
        </div>
      </Section>

      {/* Our Visa packages */}
      <div className="border-y border-border/50 bg-gradient-dark">
        <Section>
          <Reveal className="text-center">
            <p className="eyebrow text-gold">{fr ? "Nos forfaits visa" : "Our visa packages"}</p>
            <h2 className="mt-3 font-display text-4xl font-semibold text-foreground">
              {fr ? "Nos forfaits visa" : "Our visa packages"}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              {fr
                ? "Une tarification transparente et des services complets pour votre demande de visa."
                : "Transparent pricing and comprehensive services for your visa application."}
            </p>
          </Reveal>

          {/* Search */}
          <div className="mx-auto mt-8 max-w-xl">
            <div className="flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3">
              <Search className="size-5 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(0);
                }}
                placeholder={fr ? "Rechercher un pays ou un type de visa..." : "Search for a country or visa type..."}
                className="w-full bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {regions.map((r) => (
              <button
                key={r.key}
                onClick={() => {
                  setPkgRegion(r.key);
                  setPage(0);
                }}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                  pkgRegion === r.key
                    ? "bg-gradient-gold text-gold-foreground shadow-gold"
                    : "border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pagePackages.map((p, i) => (
              <Reveal key={`${p.country}-${p.type}-${i}`} delay={(i % 3) * 60}>
                <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-soft">
                  <div className="flex items-start justify-between gap-3 bg-gradient-gold p-6 text-gold-foreground">
                    <div>
                      <h3 className="font-display text-2xl font-bold">{p.country}</h3>
                      <p className="text-sm font-semibold opacity-90">{p.type}</p>
                    </div>
                    <div className="rounded-xl bg-black/15 px-3 py-2 text-right">
                      <p className="text-2xl font-bold leading-none">${p.price}</p>
                      <p className="text-[10px] font-semibold uppercase tracking-wide opacity-80">USD</p>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-secondary/50 p-3">
                        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          <Clock className="size-3.5 text-gold" /> {fr ? "Durée" : "Duration"}
                        </p>
                        <p className="mt-1 text-sm font-bold text-foreground">{p.duration}</p>
                      </div>
                      <div className="rounded-xl bg-secondary/50 p-3">
                        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          <Calendar className="size-3.5 text-gold" /> {fr ? "Validité" : "Validity"}
                        </p>
                        <p className="mt-1 text-sm font-bold text-foreground">{p.validity}</p>
                      </div>
                    </div>

                    <p className="mt-5 text-xs font-bold uppercase tracking-wide text-gold">
                      {fr ? "Services inclus" : "Services included"}
                    </p>
                    <ul className="mt-2 space-y-1.5">
                      {p.services.map((s) => (
                        <li key={s} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-gold" />
                          {s}
                        </li>
                      ))}
                    </ul>

                    <p className="mt-4 text-xs font-bold uppercase tracking-wide text-gold">
                      {fr ? "Documents requis" : "Required documents"}
                    </p>
                    <ul className="mt-2 space-y-1.5">
                      {p.documents.map((d) => (
                        <li key={d} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-gold" />
                          {d}
                        </li>
                      ))}
                    </ul>

                    <Link
                      to="/contact"
                      search={{ country: p.country, service: p.type }}
                      className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-gold px-6 py-3 text-sm font-bold text-gold-foreground shadow-gold transition-transform hover:scale-[1.02]"
                    >
                      {fr ? "Faire une demande" : "Apply now"}
                      <ArrowRight className="size-4" />
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {filteredPackages.length === 0 && (
            <p className="py-8 text-center text-muted-foreground">
              {fr ? "Aucun forfait ne correspond à votre recherche." : "No package matches your search."}
            </p>
          )}

          {/* Pagination */}
          {pageCount > 1 && (
            <div className="mt-10 flex items-center justify-center gap-4">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={safePage === 0}
                className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-gold/40 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="size-4" />
                {fr ? "Précédent" : "Previous"}
              </button>
              <span className="text-sm font-semibold text-muted-foreground">
                {safePage + 1} / {pageCount}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
                disabled={safePage >= pageCount - 1}
                className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-gold/40 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {fr ? "Suivant" : "Next"}
                <ChevronRight className="size-4" />
              </button>
            </div>
          )}
        </Section>
      </div>

      {/* Procedure */}
      <Section>
        <Reveal>
          <h2 className="font-display text-3xl font-semibold text-foreground">
            {fr ? "La procédure étape par étape" : "The step-by-step procedure"}
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 100}>
              <div className="h-full rounded-2xl border border-border/60 bg-card p-8">
                <s.icon className="size-9 text-gold" />
                <h3 className="mt-4 font-display text-lg font-semibold text-foreground">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}