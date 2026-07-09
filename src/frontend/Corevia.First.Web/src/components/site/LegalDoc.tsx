import { type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { CheckCircle2, Mail } from "lucide-react";
import { PageHeader, Section } from "./PageHeader";
import { Reveal } from "./Reveal";
import { useI18n, WHATSAPP_LINK } from "@/lib/i18n";

export type LegalSection = {
  id: string;
  icon: LucideIcon;
  title: string;
  body: ReactNode;
};

export function LegalDoc({
  eyebrow,
  title,
  intro,
  updated,
  sections,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  updated: string;
  sections: LegalSection[];
}) {
  const { lang } = useI18n();
  const fr = lang === "fr";

  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title} subtitle={intro}>
        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-gold">
          <CheckCircle2 className="size-3.5" />
          {updated}
        </div>
      </PageHeader>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[16rem_1fr]">
          {/* Sticky table of contents */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 rounded-2xl border border-border/60 bg-card p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-gold">
                {fr ? "Sommaire" : "Contents"}
              </p>
              <nav className="mt-4 space-y-1">
                {sections.map((s, i) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-gold/10 hover:text-foreground"
                  >
                    <span className="font-mono text-xs text-gold">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {s.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Sections */}
          <div className="space-y-6">
            {sections.map((s, i) => (
              <Reveal key={s.id} delay={(i % 4) * 60}>
                <article
                  id={s.id}
                  className="scroll-mt-28 rounded-2xl border border-border/60 bg-card p-7 transition-all hover:border-gold/40 hover:shadow-soft"
                >
                  <div className="flex items-center gap-4">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gold/10 text-gold">
                      <s.icon className="size-5" />
                    </span>
                    <h2 className="font-display text-2xl font-semibold text-foreground">
                      <span className="mr-2 font-mono text-base text-gold/70">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {s.title}
                    </h2>
                  </div>
                  <div className="mt-4 space-y-3 leading-relaxed text-muted-foreground [&_li]:flex [&_li]:items-start [&_li]:gap-2 [&_ul]:mt-2 [&_ul]:space-y-2">
                    {s.body}
                  </div>
                </article>
              </Reveal>
            ))}

            {/* Contact CTA */}
            <Reveal>
              <div className="rounded-2xl border border-gold/30 bg-gradient-dark p-8 text-center">
                <h3 className="font-display text-2xl font-semibold text-foreground">
                  {fr ? "Une question ?" : "Any questions?"}
                </h3>
                <p className="mx-auto mt-2 max-w-md text-muted-foreground">
                  {fr
                    ? "Notre équipe reste à votre disposition pour toute précision concernant ce document."
                    : "Our team is available for any clarification regarding this document."}
                </p>
                <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <a
                    href="mailto:contact@coreviafirst.com"
                    className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-gold/10"
                  >
                    <Mail className="size-4 text-gold" />
                    contact@coreviafirst.com
                  </a>
                  <a
                    href={WHATSAPP_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-gold px-6 py-3 text-sm font-semibold text-gold-foreground shadow-gold transition-transform hover:scale-[1.03]"
                  >
                    {fr ? "Nous contacter" : "Contact us"}
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </Section>
    </>
  );
}