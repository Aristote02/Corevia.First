import { createFileRoute, Link } from "@tanstack/react-router";
import {
  GraduationCap,
  Languages,
  FileCheck,
  Home,
  HeartHandshake,
  Building,
  ArrowRight,
  Search,
  MapPin,
  FolderCheck,
  Stamp,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { PageHeader, Section } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — COREVIA FIRST" },
      {
        name: "description",
        content:
          "Orientation, admission, visa, logement et accompagnement complet pour vos études à l'international avec COREVIA FIRST.",
      },
      { property: "og:title", content: "Services — COREVIA FIRST" },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const { lang } = useI18n();
  const fr = lang === "fr";

  const services = [
    {
      icon: GraduationCap,
      title: fr ? "Orientation universitaire" : "University guidance",
      desc: fr
        ? "Choix de la formation et de l'université adaptées à votre profil et budget."
        : "Choosing the programme and university suited to your profile and budget.",
    },
    {
      icon: FileCheck,
      title: fr ? "Constitution du dossier" : "Application file",
      desc: fr
        ? "Préparation et soumission complète de votre dossier d'admission."
        : "Complete preparation and submission of your admission file.",
    },
    {
      icon: Stamp,
      title: fr ? "Procédure de visa" : "Visa procedure",
      desc: fr
        ? "Accompagnement de A à Z pour l'obtention de votre visa étudiant."
        : "End-to-end support to obtain your student visa.",
    },
    {
      icon: Languages,
      title: fr ? "Préparation linguistique" : "Language preparation",
      desc: fr
        ? "Orientation vers les tests et programmes de langue requis."
        : "Guidance toward required language tests and programmes.",
    },
    {
      icon: Home,
      title: fr ? "Logement & installation" : "Housing & settling in",
      desc: fr
        ? "Recherche de logement et organisation de votre arrivée."
        : "Finding accommodation and organising your arrival.",
    },
    {
      icon: HeartHandshake,
      title: fr ? "Suivi & assurance" : "Follow-up & insurance",
      desc: fr
        ? "Assurance, billet et suivi jusqu'à votre installation complète."
        : "Insurance, ticket and follow-up until you are fully settled.",
    },
  ];

  const steps = [
    {
      icon: Search,
      n: "01",
      title: fr ? "Analyse du profil" : "Profile analysis",
      desc: fr
        ? "Nous étudions votre projet, votre profil et votre budget."
        : "We study your project, profile and budget.",
    },
    {
      icon: MapPin,
      n: "02",
      title: fr ? "Choix de destination" : "Destination selection",
      desc: fr
        ? "Nous vous orientons vers les meilleures options."
        : "We guide you toward the best options.",
    },
    {
      icon: FolderCheck,
      n: "03",
      title: fr ? "Constitution du dossier" : "File preparation",
      desc: fr
        ? "Nous préparons et soumettons votre dossier."
        : "We prepare and submit your file.",
    },
    {
      icon: Stamp,
      n: "04",
      title: fr ? "Obtention du visa" : "Visa approval",
      desc: fr
        ? "Nous vous accompagnons jusqu'au départ."
        : "We support you until departure.",
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow={fr ? "Procédure & Services" : "Process & Services"}
        title={fr ? "Un accompagnement de bout en bout" : "End-to-end support"}
        subtitle={
          fr
            ? "De la première consultation à votre installation, nous prenons en charge chaque étape."
            : "From the first consultation to your arrival, we handle every step."
        }
      />

      <Section>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={i * 80}>
              <div className="group flex h-full flex-col rounded-2xl border border-border/60 bg-card p-8 transition-all hover:border-gold/40 hover:shadow-gold">
                <s.icon className="size-10 text-gold transition-transform group-hover:scale-110" />
                <h3 className="mt-5 font-display text-xl font-semibold text-foreground">
                  {s.title}
                </h3>
                <p className="mt-3 flex-1 text-sm text-muted-foreground">
                  {s.desc}
                </p>
                <Link
                  to="/contact"
                  search={{ service: s.title }}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gold"
                >
                  {fr ? "Demander un devis" : "Request a quote"}
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <div className="border-y border-border/50 bg-gradient-dark">
        <Section>
          <Reveal>
            <p className="eyebrow text-gold">
              {fr ? "Comment ça marche" : "How it works"}
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-foreground sm:text-4xl">
              {fr ? "Votre parcours en 4 étapes" : "Your journey in 4 steps"}
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((st, i) => (
              <Reveal key={st.n} delay={i * 100}>
                <div className="relative h-full rounded-2xl border border-border/60 bg-card p-8">
                  <span className="text-gold-gradient font-display text-4xl font-semibold">
                    {st.n}
                  </span>
                  <st.icon className="mt-4 size-8 text-gold" />
                  <h3 className="mt-4 font-display text-lg font-semibold text-foreground">
                    {st.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">{st.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>
      </div>

      <Section className="text-center">
        <Reveal>
          <h2 className="font-display text-3xl font-semibold text-foreground">
            {fr ? "Prêt à commencer ?" : "Ready to start?"}
          </h2>
          <Link
            to="/contact"
            className="mt-6 inline-block rounded-full bg-gradient-gold px-8 py-3.5 text-sm font-semibold text-gold-foreground shadow-gold transition-transform hover:scale-[1.04]"
          >
            {fr ? "Demander un devis gratuit" : "Request a free quote"}
          </Link>
        </Reveal>
      </Section>
    </>
  );
}