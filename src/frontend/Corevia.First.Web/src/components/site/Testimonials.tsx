import { Quote, Star } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Reveal } from "./Reveal";

export function Testimonials() {
  const { t } = useI18n();

  return (
    <section
      id="testimonials"
      className="relative overflow-hidden py-24 lg:py-32"
    >
      <div className="pointer-events-none absolute -left-32 top-0 size-96 rounded-full bg-gold/5 blur-3xl" />
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow text-gold">{t.testimonials.eyebrow}</p>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
            {t.testimonials.title}
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {t.testimonials.items.map((item, i) => (
            <Reveal key={item.name} delay={i * 120}>
              <figure className="flex h-full flex-col rounded-2xl border border-border/60 bg-card/60 p-8 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-gold/40">
                <Quote className="size-8 text-gold/40" />
                <div className="mt-4 flex gap-1">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="size-4 fill-gold text-gold" />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-[0.95rem] leading-relaxed text-foreground/90">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 border-t border-border/50 pt-5">
                  <p className="font-display text-lg font-semibold text-foreground">
                    {item.name}
                  </p>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">
                    {item.role}
                  </p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}