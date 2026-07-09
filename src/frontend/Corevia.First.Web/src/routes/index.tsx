import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/site/Hero";
import { About } from "@/components/site/About";
import { HowItWorks } from "@/components/site/HowItWorks";
import { ParallaxCity } from "@/components/site/ParallaxCity";
import { Destinations } from "@/components/site/Destinations";
import { Testimonials } from "@/components/site/Testimonials";
import { CTA } from "@/components/site/CTA";
import { SceneBackground } from "@/components/site/SceneBackground";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "COREVIA FIRST — Visas d'étude & orientation universitaire",
      },
      {
        name: "description",
        content:
          "COREVIA FIRST, experts en visas d'étude et orientation universitaire. Votre avenir académique commence à l'international.",
      },
      {
        property: "og:title",
        content: "COREVIA FIRST — Visas d'étude & orientation universitaire",
      },
      {
        property: "og:description",
        content:
          "Experts en visas d'étude et orientation universitaire. 98% de réussite, 30+ pays partenaires.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Hero />
      <SceneBackground>
        <About />
        <HowItWorks />
        <ParallaxCity />
        <Destinations />
        <Testimonials />
        <CTA />
      </SceneBackground>
    </>
  );
}