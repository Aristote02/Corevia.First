import { MessageCircle } from "lucide-react";
import { useI18n, WHATSAPP_LINK } from "@/lib/i18n";
import { Reveal } from "./Reveal";
import { heroImages } from "@/lib/media";

export function CTA() {
  const { t } = useI18n();

  return (
    <section id="contact" className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-gold/30 p-10 text-center shadow-soft sm:p-16">
            <img
              src={heroImages.success}
              alt=""
              className="absolute inset-0 size-full object-cover opacity-25"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/80 to-background/90" />
            <div className="relative z-10 mx-auto max-w-2xl">
              <p className="eyebrow text-gold">{t.cta.eyebrow}</p>
              <h2 className="mt-4 font-display text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
                {t.cta.title}
              </h2>
              <p className="mt-5 text-muted-foreground">{t.cta.subtitle}</p>
              <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-gradient-gold px-8 py-4 text-sm font-semibold text-gold-foreground shadow-gold transition-transform hover:scale-[1.04]"
                >
                  {t.cta.button}
                </a>
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-8 py-4 text-sm font-semibold text-foreground transition-colors hover:bg-gold/10"
                >
                  <MessageCircle className="size-4" />
                  {t.cta.whatsapp}
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}