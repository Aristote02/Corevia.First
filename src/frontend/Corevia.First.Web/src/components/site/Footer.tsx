import { Mail, Phone, MapPin, Clock, Scale } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useI18n, COMPANY } from "@/lib/i18n";
import { SocialLinks } from "./SocialLinks";
import { MinskClock } from "./MinskClock";
import { logoUrl } from "@/lib/media";

export function Footer() {
  const { t, lang } = useI18n();
  const fr = lang === "fr";
  const year = new Date().getFullYear();

  const legal = [
    { to: "/mentions-legales", label: fr ? "Mentions légales" : "Legal notice" },
    { to: "/confidentialite", label: fr ? "Confidentialité" : "Privacy" },
    { to: "/conditions", label: fr ? "Conditions générales" : "Terms" },
    {
      to: "/politique-remboursement",
      label: fr ? "Remboursement" : "Refund policy",
    },
  ] as const;

  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-3 lg:px-8">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3">
            <img
              src={logoUrl}
              alt="COREVIA FIRST"
              width={44}
              height={44}
              className="size-10 rounded-md object-cover ring-1 ring-gold/30"
            />
            <span className="font-display text-lg font-semibold tracking-wide text-foreground">
              COREVIA <span className="text-gold-gradient">FIRST</span>
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            {t.footer.tagline}
          </p>
          <MinskClock className="mt-6" />
          <SocialLinks className="mt-6" />
          <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2">
            {legal.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="eyebrow text-gold">{t.footer.contact}</h4>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-gold" />
              <span>{COMPANY.address}</span>
            </li>
            <li>
              <a
                href={`tel:${COMPANY.phone}`}
                className="flex items-center gap-3 transition-colors hover:text-foreground"
              >
                <Phone className="size-4 text-gold" />
                <span>{COMPANY.phone}</span>
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Clock className="mt-0.5 size-4 shrink-0 text-gold" />
              <span>{fr ? COMPANY.hours : COMPANY.hoursEn}</span>
            </li>
            <li>
              <a
                href={`mailto:${COMPANY.email}`}
                className="flex items-center gap-3 transition-colors hover:text-foreground"
              >
                <Mail className="size-4 text-gold" />
                <span>{COMPANY.email}</span>
              </a>
            </li>
          </ul>
        </div>

        {/* Legal information */}
        <div>
          <h4 className="eyebrow text-gold">
            <span className="inline-flex items-center gap-2">
              <Scale className="size-4" />
              {fr ? "Informations juridiques" : "Legal information"}
            </span>
          </h4>
          <div className="mt-4 space-y-2 text-sm text-muted-foreground">
            <p className="font-semibold text-foreground">{COMPANY.legalName}</p>
            <p>{COMPANY.address}</p>
            <p>
              {fr ? "Numéro d'identification fiscale (UNP)" : "Tax ID (UNP)"} :{" "}
              {COMPANY.unp}
            </p>
            <p>{fr ? COMPANY.registration : COMPANY.registrationEn}</p>
          </div>
        </div>
      </div>

      <div className="border-t border-border/60 py-6">
        <p className="mx-auto max-w-7xl px-5 text-center text-xs text-muted-foreground lg:px-8">
          &copy; {year} COREVIA FIRST. {t.footer.rights}
        </p>
      </div>
    </footer>
  );
}