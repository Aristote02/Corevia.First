import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { LegalLayout } from "@/components/site/LegalLayout";

export const Route = createFileRoute("/mentions-legales")({
  head: () => ({
    meta: [{ title: "Mentions légales — COREVIA FIRST" }],
  }),
  component: Page,
});

function Page() {
  const { lang } = useI18n();
  const fr = lang === "fr";
  return (
    <LegalLayout
      title={fr ? "Mentions légales" : "Legal notice"}
      updated={fr ? "Dernière mise à jour : 2026" : "Last updated: 2026"}
    >
      <section>
        <h2>{fr ? "Éditeur" : "Publisher"}</h2>
        <p>
          {fr
            ? "Ce site est édité par COREVIA FIRST, agence d'orientation universitaire et de visas d'étude."
            : "This site is published by COREVIA FIRST, a university guidance and study-visa agency."}
        </p>
      </section>
      <section>
        <h2>{fr ? "Contact" : "Contact"}</h2>
        <p>contact@coreviafirst.com — WhatsApp : +375256335217</p>
      </section>
      <section>
        <h2>{fr ? "Hébergement" : "Hosting"}</h2>
        <p>
          {fr
            ? "Les informations d'hébergement sont fournies sur demande."
            : "Hosting information is available upon request."}
        </p>
      </section>
      <section>
        <h2>{fr ? "Propriété intellectuelle" : "Intellectual property"}</h2>
        <p>
          {fr
            ? "L'ensemble des contenus de ce site est protégé. Toute reproduction sans autorisation est interdite."
            : "All content on this site is protected. Any reproduction without authorisation is prohibited."}
        </p>
      </section>
    </LegalLayout>
  );
}