import { createFileRoute } from "@tanstack/react-router";
import {
  FileText,
  Briefcase,
  ShieldAlert,
  CreditCard,
  UserCheck,
  Scale,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { LegalDoc, type LegalSection } from "@/components/site/LegalDoc";

export const Route = createFileRoute("/conditions")({
  head: () => ({
    meta: [
      { title: "Conditions générales — COREVIA FIRST" },
      {
        name: "description",
        content:
          "Conditions générales d'utilisation et de services de COREVIA FIRST : objet, prestations, obligations, responsabilité et droit applicable.",
      },
    ],
  }),
  component: Page,
});

function Page() {
  const { lang } = useI18n();
  const fr = lang === "fr";

  const sections: LegalSection[] = [
    {
      id: "objet",
      icon: FileText,
      title: fr ? "Objet" : "Purpose",
      body: (
        <p>
          {fr
            ? "Les présentes conditions générales régissent l'utilisation des services d'orientation universitaire, d'accompagnement administratif et de traitement de visas d'étude proposés par COREVIA FIRST. Toute demande adressée à l'agence implique l'acceptation pleine et entière de ces conditions."
            : "These terms and conditions govern the use of the university guidance, administrative support and study-visa processing services offered by COREVIA FIRST. Any request sent to the agency implies full and unreserved acceptance of these terms."}
        </p>
      ),
    },
    {
      id: "services",
      icon: Briefcase,
      title: fr ? "Nos prestations" : "Our services",
      body: (
        <>
          <p>
            {fr
              ? "COREVIA FIRST s'engage à fournir un accompagnement avec diligence et professionnalisme, comprenant notamment :"
              : "COREVIA FIRST commits to providing diligent and professional support, including in particular:"}
          </p>
          <ul>
            <li>
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-gold" />
              {fr
                ? "Le conseil et l'orientation vers les établissements partenaires."
                : "Advice and orientation toward partner institutions."}
            </li>
            <li>
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-gold" />
              {fr
                ? "La constitution et le suivi du dossier de candidature."
                : "Building and tracking the application file."}
            </li>
            <li>
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-gold" />
              {fr
                ? "L'assistance à la procédure de visa et à la préparation du voyage."
                : "Assistance with the visa procedure and travel preparation."}
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "obligations",
      icon: UserCheck,
      title: fr ? "Obligations du client" : "Client obligations",
      body: (
        <p>
          {fr
            ? "Le client s'engage à fournir des informations exactes, complètes et à jour, ainsi que tous les documents nécessaires dans les délais impartis. Toute information erronée ou tout retard peut compromettre le traitement du dossier, sans que la responsabilité de l'agence puisse être engagée."
            : "The client undertakes to provide accurate, complete and up-to-date information, as well as all required documents within the given deadlines. Any incorrect information or delay may compromise the processing of the file, without the agency being held liable."}
        </p>
      ),
    },
    {
      id: "tarifs",
      icon: CreditCard,
      title: fr ? "Tarifs et paiement" : "Fees & payment",
      body: (
        <p>
          {fr
            ? "Les tarifs des prestations sont communiqués avant toute souscription. Le paiement conditionne le démarrage effectif du traitement du dossier. Les frais versés à des tiers (universités, ambassades, organismes officiels) sont indépendants des honoraires de l'agence."
            : "Service fees are communicated before any subscription. Payment conditions the effective start of file processing. Fees paid to third parties (universities, embassies, official bodies) are separate from the agency's fees."}
        </p>
      ),
    },
    {
      id: "responsabilite",
      icon: ShieldAlert,
      title: fr ? "Responsabilité" : "Liability",
      body: (
        <p>
          {fr
            ? "COREVIA FIRST est tenue à une obligation de moyens et non de résultat. L'agence ne saurait être tenue responsable des décisions souveraines des organismes tiers (universités, ambassades, consulats), notamment en cas de refus de visa ou d'admission."
            : "COREVIA FIRST is bound by an obligation of means and not of result. The agency cannot be held responsible for the sovereign decisions of third-party bodies (universities, embassies, consulates), particularly in the event of a visa or admission refusal."}
        </p>
      ),
    },
    {
      id: "droit",
      icon: Scale,
      title: fr ? "Droit applicable" : "Governing law",
      body: (
        <p>
          {fr
            ? "Les présentes conditions sont régies par le droit applicable au siège de l'agence. Tout litige fera l'objet d'une recherche de solution amiable avant toute action contentieuse."
            : "These terms are governed by the law applicable at the agency's registered office. Any dispute will be subject to an attempt at an amicable settlement before any litigation."}
        </p>
      ),
    },
  ];

  return (
    <LegalDoc
      eyebrow="COREVIA FIRST"
      title={fr ? "Conditions générales" : "Terms & conditions"}
      intro={
        fr
          ? "Le cadre qui encadre nos prestations d'accompagnement, en toute transparence."
          : "The framework governing our support services, in full transparency."
      }
      updated={fr ? "Dernière mise à jour : 2026" : "Last updated: 2026"}
      sections={sections}
    />
  );
}