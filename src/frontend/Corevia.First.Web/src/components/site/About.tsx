import { Award, Globe2, UserCheck, TrendingUp } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Reveal } from "./Reveal";

const icons = [Award, Globe2, UserCheck, TrendingUp];

export function About() {
  const { t } = useI18n();

  return (
    <section id="about" className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow text-gold">{t.about.eyebrow}</p>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
            {t.about.title}
          </h2>
          <p className="mt-5 text-muted-foreground">{t.about.subtitle}</p>
        </Reveal>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {t.about.cards.map((card, i) => {
            const Icon = icons[i];
            return (
              <Reveal key={card.title} delay={i * 100}>
                <div className="group h-full rounded-2xl border border-border/60 bg-card/60 p-7 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-gold">
                  <span className="inline-flex size-12 items-center justify-center rounded-xl bg-gold/10 text-gold transition-colors group-hover:bg-gradient-gold group-hover:text-gold-foreground">
                    <Icon className="size-6" />
                  </span>
                  <h3 className="mt-5 font-display text-xl font-semibold text-foreground">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {card.desc}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={150}>
          <div className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border/60 bg-border/40 lg:grid-cols-4">
            {t.about.stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-background/80 px-6 py-10 text-center"
              >
                <p className="font-display text-4xl font-semibold text-gold-gradient sm:text-5xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-xs uppercase tracking-wider text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}