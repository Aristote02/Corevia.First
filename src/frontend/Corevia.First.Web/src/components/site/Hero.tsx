import { ChevronDown } from "lucide-react";
import { useI18n, WHATSAPP_LINK } from "@/lib/i18n";
import { heroVideoUrl } from "@/lib/media";

export function Hero() {
  const { t } = useI18n();

  return (
    <section
      id="top"
      className="relative h-[100svh] min-h-[640px] w-full overflow-hidden"
    >
      {/* Cinematic looping video background */}
      <div className="absolute inset-0">
        <video
          className="size-full object-cover"
          src={heroVideoUrl}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster=""
        />
      </div>

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/45 to-background" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/85 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-5 lg:px-8">
        <div className="max-w-3xl">
          <p
            className="eyebrow text-gold animate-fade-up opacity-0"
            style={{ animationDelay: "0.1s" }}
          >
            {t.hero.tagline}
          </p>
          <h1
            className="mt-5 font-display text-5xl font-semibold leading-[1.05] text-foreground animate-fade-up opacity-0 sm:text-6xl lg:text-7xl"
            style={{ animationDelay: "0.25s" }}
          >
            {t.hero.title.split(" ").slice(0, -1).join(" ")}{" "}
            <span className="text-gold-gradient">
              {t.hero.title.split(" ").slice(-1)}
            </span>
          </h1>
          <p
            className="mt-6 max-w-xl text-lg text-muted-foreground animate-fade-up opacity-0"
            style={{ animationDelay: "0.4s" }}
          >
            {t.hero.subtitle}
          </p>
          <div
            className="mt-9 flex flex-col gap-4 animate-fade-up opacity-0 sm:flex-row"
            style={{ animationDelay: "0.55s" }}
          >
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-gradient-gold px-7 py-3.5 text-center text-sm font-semibold text-gold-foreground shadow-gold transition-transform hover:scale-[1.04]"
            >
              {t.hero.ctaPrimary}
            </a>
            <a
              href="#how"
              className="rounded-full border border-gold/40 px-7 py-3.5 text-center text-sm font-semibold text-foreground transition-colors hover:bg-gold/10"
            >
              {t.hero.ctaSecondary}
            </a>
          </div>
        </div>
      </div>

      <a
        href="#about"
        className="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-gold"
      >
        {t.hero.scroll}
        <ChevronDown className="size-4 animate-float" />
      </a>
    </section>
  );
}