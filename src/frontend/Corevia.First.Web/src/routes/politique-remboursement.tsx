import { createFileRoute } from "@tanstack/react-router";
import {
  Info,
  ListChecks,
  Send,
  Clock,
  XCircle,
  Wallet,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { LegalDoc, type LegalSection } from "@/components/site/LegalDoc";

export const Route = createFileRoute("/politique-remboursement")({
  head: () => ({
    meta: [
      { title: "Politique de remboursement — COREVIA FIRST" },
      {
        name: "description",
        content:
          "Politique de remboursement de COREVIA FIRST : principe, cas éligibles, procédure de demande et délais de traitement.",
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
      id: "principe",
      icon: Info,
      title: fr ? "Principe général" : "General principle",
      body: (
        <p>
          {fr
            ? "Les conditions de remboursement dépendent du service souscrit et de l'état d'avancement de votre dossier. Les honoraires correspondant à des prestations déjà réalisées ne sont pas remboursables."
            : "Refund conditions depend on the service purchased and the progress of your file. Fees corresponding to services already rendered are non-refundable."}
        </p>
      ),
    },
    {
      id: "eligibles",
      icon: ListChecks,
      title: fr ? "Cas éligibles" : "Eligible cases",
      body: (
        <>
          <p>
            {fr
              ? "Un remboursement partiel peut être envisagé dans les situations suivantes :"
              : "A partial refund may be considered in the following situations:"}
          </p>
          <ul>
            <li>
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-gold" />
              {fr
                ? "Annulation avant le démarrage effectif du traitement."
                : "Cancellation before the effective start of processing."}
            </li>
            <li>
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-gold" />
              {fr
                ? "Impossibilité de fournir le service pour une raison imputable à l'agence."
                : "Inability to deliver the service for a reason attributable to the agency."}
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "exclusions",
      icon: XCircle,
      title: fr ? "Cas non remboursables" : "Non-refundable cases",
      body: (
        <p>
          {fr
            ? "Les frais versés à des tiers (universités, ambassades, consulats) ne sont pas remboursables par l'agence. De même, un refus de visa ou d'admission prononcé par une autorité tierce n'ouvre pas droit au remboursement des honoraires liés aux démarches déjà effectuées."
            : "Fees paid to third parties (universities, embassies, consulates) are not refundable by the agency. Likewise, a visa or admission refusal issued by a third-party authority does not entitle you to a refund of fees related to steps already carried out."}
        </p>
      ),
    },
    {
      id: "demande",
      icon: Send,
      title: fr ? "Demande de remboursement" : "Refund request",
      body: (
        <p>
          {fr
            ? "Toute demande doit être adressée par écrit à contact@coreviafirst.com, en précisant votre numéro de dossier et le motif de votre demande."
            : "Any request must be sent in writing to contact@coreviafirst.com, specifying your file number and the reason for your request."}
        </p>
      ),
    },
    {
      id: "delais",
      icon: Clock,
      title: fr ? "Délais de traitement" : "Processing time",
      body: (
        <p>
          {fr
            ? "Chaque demande est étudiée dans un délai de 14 jours ouvrés. Une réponse motivée vous est communiquée, précisant le montant éventuel remboursé et les modalités."
            : "Each request is reviewed within 14 business days. A reasoned response is provided, specifying any amount refunded and the applicable terms."}
        </p>
      ),
    },
    {
      id: "modalites",
      icon: Wallet,
      title: fr ? "Modalités de remboursement" : "Refund terms",
      body: (
        <p>
          {fr
            ? "Le remboursement, lorsqu'il est accordé, est effectué via le même moyen de paiement que celui utilisé lors de la souscription, sauf accord contraire entre les parties."
            : "The refund, when granted, is processed using the same payment method as the one used at subscription, unless otherwise agreed between the parties."}
        </p>
      ),
    },
  ];

  return (
    <LegalDoc
      eyebrow="COREVIA FIRST"
      title={fr ? "Politique de remboursement" : "Refund policy"}
      intro={
        fr
          ? "Des règles claires et équitables pour le remboursement de nos prestations."
          : "Clear and fair rules for refunding our services."
      }
      updated={fr ? "Dernière mise à jour : 2026" : "Last updated: 2026"}
      sections={sections}
    />
  );
}