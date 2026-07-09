import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { PageHeader, Section } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { heroImages } from "@/lib/media";

export const Route = createFileRoute("/galerie")({
  head: () => ({
    meta: [
      { title: "Galerie — COREVIA FIRST" },
      {
        name: "description",
        content:
          "Découvrez en images le parcours de nos étudiants : aéroport, embarquement et réussite à l'international.",
      },
      { property: "og:title", content: "Galerie — COREVIA FIRST" },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const { lang } = useI18n();
  const fr = lang === "fr";

  const photos = [
    { src: heroImages.airport, alt: fr ? "Aéroport international" : "International airport", span: "lg:row-span-2" },
    { src: heroImages.students, alt: fr ? "Étudiants internationaux" : "International students", span: "" },
    { src: heroImages.boarding, alt: fr ? "Embarquement" : "Boarding", span: "" },
    { src: heroImages.landing, alt: fr ? "Atterrissage à Minsk" : "Landing in Minsk", span: "lg:col-span-2" },
    { src: heroImages.success, alt: fr ? "Réussite étudiante" : "Student success", span: "" },
  ];

  const universities: {
    group: string;
    items: { name: string; location: string; domains: string; img: string }[];
  }[] = [
    {
      group: fr ? "Universités de Biélorussie" : "Universities in Belarus",
      items: [
        {
          name: fr ? "Université d'État de Biélorussie" : "Belarusian State University",
          location: "Minsk, " + (fr ? "Biélorussie" : "Belarus"),
          domains: fr ? "Médecine, Sciences, Ingénierie" : "Medicine, Sciences, Engineering",
          img: "https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg?auto=compress&cs=tinysrgb&w=800",
        },
        {
          name: fr ? "Université Médicale d'État" : "State Medical University",
          location: "Minsk, " + (fr ? "Biélorussie" : "Belarus"),
          domains: fr ? "Médecine, Dentisterie, Pharmacie" : "Medicine, Dentistry, Pharmacy",
          img: "https://images.pexels.com/photos/4226119/pexels-photo-4226119.jpeg?auto=compress&cs=tinysrgb&w=800",
        },
        {
          name: fr ? "Université Technique d'État" : "State Technical University",
          location: "Minsk, " + (fr ? "Biélorussie" : "Belarus"),
          domains: fr ? "Ingénierie, Architecture, Technologies" : "Engineering, Architecture, Technology",
          img: "https://images.pexels.com/photos/1438072/pexels-photo-1438072.jpeg?auto=compress&cs=tinysrgb&w=800",
        },
        {
          name: fr ? "Université d'État de Grodno" : "Grodno State University",
          location: "Grodno, " + (fr ? "Biélorussie" : "Belarus"),
          domains: fr ? "Médecine, Sciences, Biologie" : "Medicine, Sciences, Biology",
          img: "https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg?auto=compress&cs=tinysrgb&w=800",
        },
      ],
    },
    {
      group: fr ? "Universités partenaires internationales" : "International partner universities",
      items: [
        {
          name: fr ? "Université d'Istanbul" : "Istanbul University",
          location: "Istanbul, " + (fr ? "Turquie" : "Turkey"),
          domains: fr ? "Tous domaines" : "All fields",
          img: "https://images.pexels.com/photos/3214110/pexels-photo-3214110.jpeg?auto=compress&cs=tinysrgb&w=800",
        },
        {
          name: fr ? "Université de Montréal" : "University of Montreal",
          location: "Montréal, Canada",
          domains: fr ? "Tous domaines" : "All fields",
          img: "https://images.pexels.com/photos/2305098/pexels-photo-2305098.jpeg?auto=compress&cs=tinysrgb&w=800",
        },
        {
          name: fr ? "Université de Pékin" : "Peking University",
          location: fr ? "Pékin, Chine" : "Beijing, China",
          domains: fr ? "Business, Technologie, Relations internationales" : "Business, Technology, International relations",
          img: "https://images.pexels.com/photos/2693212/pexels-photo-2693212.jpeg?auto=compress&cs=tinysrgb&w=800",
        },
        {
          name: fr ? "Sorbonne Université" : "Sorbonne University",
          location: "Paris, France",
          domains: fr ? "Tous domaines" : "All fields",
          img: "https://images.pexels.com/photos/161853/eiffel-tower-paris-france-tower-161853.jpeg?auto=compress&cs=tinysrgb&w=800",
        },
        {
          name: fr ? "Université Technique Nationale du Bélarus" : "Belarusian National Technical University",
          location: "Minsk, " + (fr ? "Biélorussie" : "Belarus"),
          domains: fr ? "Ingénierie, Technologies, Architecture" : "Engineering, Technology, Architecture",
          img: "https://commons.wikimedia.org/wiki/Special:FilePath/Minsk city skyline.jpg?width=800",
        },
        {
          name: fr ? "Université d'État de Moscou" : "Lomonosov Moscow State University",
          location: fr ? "Moscou, Russie" : "Moscow, Russia",
          domains: fr ? "Sciences, Économie, Droit" : "Sciences, Economics, Law",
          img: "https://images.pexels.com/photos/2570059/pexels-photo-2570059.jpeg?auto=compress&cs=tinysrgb&w=800",
        },
        {
          name: fr ? "Université de Varsovie" : "University of Warsaw",
          location: "Varsovie, " + (fr ? "Pologne" : "Poland"),
          domains: fr ? "Tous domaines" : "All fields",
          img: "https://commons.wikimedia.org/wiki/Special:FilePath/Skyline of Warsaw, Poland.jpg?width=800",
        },
        {
          name: fr ? "Université Humboldt de Berlin" : "Humboldt University of Berlin",
          location: "Berlin, " + (fr ? "Allemagne" : "Germany"),
          domains: fr ? "Sciences, Humanités, Recherche" : "Sciences, Humanities, Research",
          img: "https://commons.wikimedia.org/wiki/Special:FilePath/Brandenburger_Tor_abends.jpg?width=800",
        },
      ],
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow={fr ? "Galerie" : "Gallery"}
        title={fr ? "Le voyage de la réussite" : "The journey to success"}
        subtitle={
          fr
            ? "De l'aéroport à l'université : des moments qui marquent un nouveau départ."
            : "From the airport to the university: moments that mark a new beginning."
        }
      />

      <Section>
        <div className="grid auto-rows-[16rem] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((p, i) => (
            <Reveal
              key={p.alt}
              delay={i * 80}
              className={`overflow-hidden rounded-2xl border border-border/60 ${p.span}`}
            >
              <img
                src={p.src}
                alt={p.alt}
                loading="lazy"
                className="size-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </Reveal>
          ))}
        </div>
      </Section>

      {universities.map((grp) => (
        <Section key={grp.group} className="pt-0">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold text-foreground">
              {grp.group}
            </h2>
            <p className="mt-2 text-muted-foreground">
              {fr ? "Nos universités partenaires" : "Our partner universities"}
            </p>
          </Reveal>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {grp.items.map((u, i) => (
              <Reveal key={u.name} delay={(i % 4) * 60}>
                <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card transition-all hover:-translate-y-1 hover:shadow-gold">
                  <div className="h-40 overflow-hidden">
                    <img
                      src={u.img}
                      alt={u.name}
                      loading="lazy"
                      className="size-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-semibold text-foreground">{u.name}</h3>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="size-3.5 text-gold" /> {u.location}
                    </p>
                    <p className="mt-2 flex-1 text-xs text-muted-foreground">
                      {u.domains}
                    </p>
                    <Link
                      to="/contact"
                      className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-gold"
                    >
                      {fr ? "En savoir plus" : "Learn more"}
                      <ArrowRight className="size-4" />
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>
      ))}
    </>
  );
}