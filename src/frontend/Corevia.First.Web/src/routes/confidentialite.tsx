import { createFileRoute } from "@tanstack/react-router";
import {
  Database,
  Target,
  Share2,
  Lock,
  UserCog,
  Cookie,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { LegalDoc, type LegalSection } from "@/components/site/LegalDoc";

export const Route = createFileRoute("/confidentialite")({
  head: () => ({
    meta: [
      { title: "Confidentialité — COREVIA FIRST" },
      {
        name: "description",
        content:
          "Politique de confidentialité de COREVIA FIRST : données collectées, finalités, partage, sécurité et vos droits.",
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
      id: "donnees",
      icon: Database,
      title: fr ? "Données collectées" : "Data collected",
      body: (
        <>
          <p>
            {fr
              ? "Nous collectons uniquement les informations nécessaires au traitement de votre demande, transmises via nos formulaires :"
              : "We only collect the information necessary to process your request, submitted through our forms:"}
          </p>
          <ul>
            <li>
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-gold" />
              {fr ? "Identité : nom et prénom." : "Identity: first and last name."}
            </li>
            <li>
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-gold" />
              {fr
                ? "Coordonnées : e-mail, téléphone, pays."
                : "Contact details: email, phone, country."}
            </li>
            <li>
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-gold" />
              {fr
                ? "Contenu de votre message et documents fournis."
                : "The content of your message and documents provided."}
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "finalites",
      icon: Target,
      title: fr ? "Utilisation des données" : "Use of data",
      body: (
        <p>
          {fr
            ? "Vos données sont utilisées uniquement pour vous accompagner dans votre projet d'études : traitement de votre dossier, communication de suivi et amélioration de nos services. Elles ne sont jamais revendues à des tiers."
            : "Your data is used solely to support your study project: processing your file, follow-up communication and improving our services. It is never resold to third parties."}
        </p>
      ),
    },
    {
      id: "partage",
      icon: Share2,
      title: fr ? "Partage des données" : "Data sharing",
      body: (
        <p>
          {fr
            ? "Certaines données peuvent être transmises aux établissements et autorités concernés (universités, ambassades) strictement dans le cadre de votre procédure, et uniquement avec votre accord."
            : "Certain data may be shared with relevant institutions and authorities (universities, embassies) strictly within the scope of your procedure, and only with your consent."}
        </p>
      ),
    },
    {
      id: "securite",
      icon: Lock,
      title: fr ? "Sécurité" : "Security",
      body: (
        <p>
          {fr
            ? "Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, perte ou divulgation."
            : "We implement appropriate technical and organisational measures to protect your data against any unauthorised access, loss or disclosure."}
        </p>
      ),
    },
    {
      id: "droits",
      icon: UserCog,
      title: fr ? "Vos droits" : "Your rights",
      body: (
        <p>
          {fr
            ? "Vous pouvez à tout moment demander l'accès, la rectification, la limitation ou la suppression de vos données en écrivant à contact@coreviafirst.com. Nous répondons à toute demande dans les meilleurs délais."
            : "You may at any time request access, correction, restriction or deletion of your data by writing to contact@coreviafirst.com. We respond to any request as promptly as possible."}
        </p>
      ),
    },
    {
      id: "cookies",
      icon: Cookie,
      title: "Cookies",
      body: (
        <p>
          {fr
            ? "Notre site peut utiliser des cookies techniques et de mesure d'audience afin d'améliorer votre expérience de navigation. Vous pouvez configurer votre navigateur pour les refuser."
            : "Our website may use technical and analytics cookies to improve your browsing experience. You can configure your browser to refuse them."}
        </p>
      ),
    },
  ];

  return (
    <LegalDoc
      eyebrow="COREVIA FIRST"
      title={fr ? "Politique de confidentialité" : "Privacy policy"}
      intro={
        fr
          ? "Votre confiance compte. Voici comment nous protégeons et utilisons vos données."
          : "Your trust matters. Here is how we protect and use your data."
      }
      updated={fr ? "Dernière mise à jour : 2026" : "Last updated: 2026"}
      sections={sections}
    />
  );
}