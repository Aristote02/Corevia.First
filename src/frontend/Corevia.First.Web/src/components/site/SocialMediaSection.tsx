import { Youtube, Instagram, Facebook } from "lucide-react";
import { useI18n, SOCIAL_LINKS } from "@/lib/i18n";

function TikTok({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 1 1-2.59-2.59c.27 0 .53.04.78.12V9.79a5.67 5.67 0 0 0-.78-.05A5.68 5.68 0 1 0 15.54 15.4V9.01a7.34 7.34 0 0 0 4.3 1.38V7.3a4.28 4.28 0 0 1-3.24-1.48z" />
    </svg>
  );
}

function WhatsApp({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M16.004 0h-.008C7.174 0 .004 7.172.004 16c0 3.504 1.13 6.75 3.05 9.383L1.05 31.5l6.32-2.02A15.93 15.93 0 0 0 16.004 32C24.834 32 32 24.828 32 16S24.834 0 16.004 0zm9.31 22.594c-.387 1.09-1.92 1.996-3.14 2.258-.836.176-1.926.316-5.598-1.203-4.695-1.945-7.715-6.715-7.95-7.027-.226-.313-1.89-2.516-1.89-4.797s1.16-3.398 1.57-3.86c.34-.382.89-.558 1.418-.558.172 0 .328.008.468.016.41.016.617.04.887.687.34.812 1.16 2.812 1.258 3.018.1.207.168.45.034.726-.125.27-.234.418-.43.65-.207.231-.402.418-.598.652-.18.207-.379.43-.156.812.226.383 1.004 1.656 2.156 2.68 1.484 1.32 2.71 1.73 3.14 1.91.32.133.703.102.937-.149.297-.32.664-.851 1.039-1.375.266-.375.601-.422.937-.297.34.117 2.156 1.016 2.527 1.199.371.184.617.273.71.426.094.156.094.898-.293 1.989z" />
    </svg>
  );
}

const links = [
  { href: SOCIAL_LINKS.facebook, label: "Facebook", Icon: Facebook, color: "#1877F2" },
  { href: SOCIAL_LINKS.instagram, label: "Instagram", Icon: Instagram, color: "#E4405F" },
  { href: SOCIAL_LINKS.tiktok, label: "TikTok", Icon: TikTok, color: "#010101" },
  { href: SOCIAL_LINKS.whatsapp, label: "WhatsApp", Icon: WhatsApp, color: "#25D366" },
  { href: SOCIAL_LINKS.youtube, label: "YouTube", Icon: Youtube, color: "#FF0000" },
] as const;

export function SocialMediaSection() {
  const { lang } = useI18n();
  const fr = lang === "fr";
  return (
    <div className="mt-14 rounded-3xl border border-border/60 bg-card p-8 text-center shadow-soft sm:p-10">
      <p className="eyebrow text-gold">{fr ? "Restez connecté" : "Stay connected"}</p>
      <h2 className="mt-3 font-display text-3xl font-semibold text-foreground">
        {fr ? "Suivez-nous sur les réseaux" : "Follow us on social media"}
      </h2>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        {links.map(({ href, label, Icon, color }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-2xl border border-border/60 bg-background px-5 py-3 font-semibold text-foreground transition-all hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-gold"
          >
            <Icon className="size-5" style={{ color }} />
            {label}
          </a>
        ))}
      </div>
    </div>
  );
}