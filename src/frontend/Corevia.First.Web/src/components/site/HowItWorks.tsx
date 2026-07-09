import { useI18n } from "@/lib/i18n";
import { Reveal } from "./Reveal";

export function HowItWorks() {
  const { t } = useI18n();

  return (
    <section id="how" className="relative overflow-hidden py-24 lg:py-32">
      <div className="pointer-events-none absolute -right-32 top-1/4 size-96 rounded-full bg-gold/5 blur-3xl" />
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow text-gold">{t.how.eyebrow}</p>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
            {t.how.title}
          </h2>
        </Reveal>

        <div className="relative mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* connecting line on desktop */}
          <div className="pointer-events-none absolute left-0 top-7 hidden h-px w-full bg-gradient-to-r from-transparent via-gold/30 to-transparent lg:block" />
          {t.how.steps.map((step, i) => (
            <Reveal key={step.n} delay={i * 120} className="relative">
              <div className="flex flex-col items-start">
                <span className="relative z-10 flex size-14 items-center justify-center rounded-full border border-gold/40 bg-background font-display text-xl font-semibold text-gold-gradient shadow-gold">
                  {step.n}
                </span>
                <h3 className="mt-6 font-display text-xl font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {step.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}