import { useI18n } from "@/lib/i18n";
import { Reveal } from "./Reveal";
import { cityScrollVideoUrl } from "@/lib/media";

/**
 * Cinematic cityscape section. The video plays on its own (autoplay + loop)
 * and the text simply reveals when the section scrolls into view — no
 * scroll-scrubbing, so it never feels blocked or laggy.
 */
export function ParallaxCity() {
  const { lang } = useI18n();

  const copy =
    lang === "fr"
      ? {
          eyebrow: "Destination Minsk",
          title: "Votre nouvelle ville vous attend",
          sub: "Des campus modernes, une vie étudiante vibrante et un avenir qui commence ici.",
        }
      : {
          eyebrow: "Destination Minsk",
          title: "Your new city awaits",
          sub: "Modern campuses, vibrant student life, and a future that starts right here.",
        };

  return (
    <section className="relative h-[90svh] min-h-[560px] w-full overflow-hidden">
      {/* Auto-playing cinematic video */}
      <video
        src={cityScrollVideoUrl}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 size-full object-cover"
      />

      {/* Cinematic overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/30 to-background" />
      <div className="absolute inset-0 bg-gradient-to-t from-background/70 to-transparent" />

      {/* Text revealed on scroll into view */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-5 text-center">
        <Reveal>
          <p className="eyebrow text-gold">{copy.eyebrow}</p>
        </Reveal>
        <Reveal delay={120}>
          <h2 className="mt-4 max-w-4xl font-display text-4xl font-semibold leading-tight text-foreground sm:text-6xl lg:text-7xl">
            {copy.title}
          </h2>
        </Reveal>
        <Reveal delay={240}>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            {copy.sub}
          </p>
        </Reveal>
      </div>
    </section>
  );
}