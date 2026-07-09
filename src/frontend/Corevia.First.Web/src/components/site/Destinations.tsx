import { ArrowUpRight } from "lucide-react";
import { useI18n, WHATSAPP_LINK } from "@/lib/i18n";
import { Reveal } from "./Reveal";

const images = [
  "https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg?auto=compress&cs=tinysrgb&w=900",
  "https://images.pexels.com/photos/753339/pexels-photo-753339.jpeg?auto=compress&cs=tinysrgb&w=900",
  "https://images.pexels.com/photos/1440476/pexels-photo-1440476.jpeg?auto=compress&cs=tinysrgb&w=900",
  "https://images.pexels.com/photos/2570063/pexels-photo-2570063.jpeg?auto=compress&cs=tinysrgb&w=900",
  "https://images.pexels.com/photos/1470405/pexels-photo-1470405.jpeg?auto=compress&cs=tinysrgb&w=900",
  "https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=900",
];

export function Destinations() {
  const { t } = useI18n();

  return (
    <section id="destinations" className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow text-gold">{t.destinations.eyebrow}</p>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
            {t.destinations.title}
          </h2>
          <p className="mt-5 text-muted-foreground">{t.destinations.subtitle}</p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {t.destinations.items.map((name, i) => (
            <Reveal
              key={name}
              delay={(i % 3) * 100}
              className={i === 0 ? "sm:col-span-2 lg:col-span-1 lg:row-span-2" : ""}
            >
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative block overflow-hidden rounded-2xl border border-border/60 ${
                  i === 0 ? "h-72 lg:h-full lg:min-h-[26rem]" : "h-72"
                }`}
              >
                <img
                  src={images[i]}
                  alt={name}
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                {i === 0 && (
                  <span className="absolute left-4 top-4 rounded-full bg-gradient-gold px-3 py-1 text-xs font-semibold text-gold-foreground">
                    {t.destinations.featured}
                  </span>
                )}
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-5">
                  <h3 className="font-display text-2xl font-semibold text-foreground">
                    {name}
                  </h3>
                  <span className="flex size-9 items-center justify-center rounded-full border border-gold/40 text-gold transition-colors group-hover:bg-gradient-gold group-hover:text-gold-foreground">
                    <ArrowUpRight className="size-4" />
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}