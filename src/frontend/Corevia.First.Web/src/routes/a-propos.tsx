import { createFileRoute } from "@tanstack/react-router";
import { Award, Globe, Users, ShieldCheck, Target, Heart } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { PageHeader, Section } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/a-propos")({
  head: () => ({
    meta: [
      { title: "À propos — COREVIA FIRST" },
      {
        name: "description",
        content:
          "COREVIA FIRST accompagne les étudiants vers les meilleures universités internationales avec expertise et discrétion.",
      },
      { property: "og:title", content: "À propos — COREVIA FIRST" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { lang } = useI18n();
  const fr = lang === "fr";

  const values = [
    {
      icon: Target,
      title: fr ? "Excellence" : "Excellence",
      desc: fr
        ? "Un standard élevé à chaque étape, du premier contact à l'arrivée."
        : "A high standard at every step, from first contact to arrival.",
    },
    {
      icon: ShieldCheck,
      title: fr ? "Confiance" : "Trust",
      desc: fr
        ? "Transparence totale sur les démarches, les délais et les frais."
        : "Full transparency on procedures, timelines and fees.",
    },
    {
      icon: Heart,
      title: fr ? "Proximité" : "Proximity",
      desc: fr
        ? "Un conseiller dédié, à votre écoute tout au long du parcours."
        : "A dedicated advisor, listening throughout your journey.",
    },
  ];

  const stats = [
    { value: "500+", label: fr ? "Étudiants accompagnés" : "Students assisted" },
    { value: "30+", label: fr ? "Pays partenaires" : "Partner countries" },
    { value: "98%", label: fr ? "Taux de réussite" : "Success rate" },
    { value: "10+", label: fr ? "Années d'expérience" : "Years of experience" },
  ];

  return (
    <>
      <PageHeader
        eyebrow={fr ? "Qui sommes-nous" : "Who we are"}
        title={
          fr
            ? "Une agence d'excellence pour vos études à l'étranger"
            : "An agency of excellence for your studies abroad"
        }
        subtitle={
          fr
            ? "COREVIA FIRST — la base qui guide. Nous transformons les ambitions académiques en parcours internationaux réussis."
            : "COREVIA FIRST — the base that guides. We turn academic ambitions into successful international journeys."
        }
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold text-foreground sm:text-4xl">
              {fr ? "Notre mission" : "Our mission"}
            </h2>
            <p className="mt-5 text-muted-foreground">
              {fr
                ? "Depuis plus de dix ans, nous guidons les étudiants vers des universités sélectionnées avec soin. De l'orientation au visa, du logement à l'installation, nous prenons en charge chaque détail pour que vous puissiez vous concentrer sur l'essentiel : votre réussite."
                : "For over ten years, we have guided students toward carefully selected universities. From orientation to visa, from housing to settling in, we handle every detail so you can focus on what matters: your success."}
            </p>
            <p className="mt-4 text-muted-foreground">
              {fr
                ? "Notre réseau international et notre connaissance des procédures nous permettent d'offrir un accompagnement fiable, personnalisé et discret."
                : "Our international network and our knowledge of procedures allow us to offer reliable, personalised and discreet support."}
            </p>
          </Reveal>
          <Reveal delay={120}>
            <div className="grid grid-cols-2 gap-5">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-border/60 bg-card p-6 text-center shadow-soft"
                >
                  <div className="text-gold-gradient font-display text-4xl font-semibold">
                    {s.value}
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </Section>

      <Section className="!pt-0">
        <Reveal>
          <p className="eyebrow text-gold">{fr ? "Nos valeurs" : "Our values"}</p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-foreground sm:text-4xl">
            {fr ? "Ce qui nous guide" : "What guides us"}
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={i * 100}>
              <div className="group h-full rounded-2xl border border-border/60 bg-card p-8 transition-all hover:border-gold/40 hover:shadow-gold">
                <v.icon className="size-10 text-gold transition-transform group-hover:scale-110" />
                <h3 className="mt-5 font-display text-xl font-semibold text-foreground">
                  {v.title}
                </h3>
                <p className="mt-3 text-sm text-muted-foreground">{v.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}