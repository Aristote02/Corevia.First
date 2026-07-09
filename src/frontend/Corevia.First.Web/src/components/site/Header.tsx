import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useRouterState } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { AccountMenu } from "./AccountMenu";
import { SocialLinks } from "./SocialLinks";
import { logoUrl } from "@/lib/media";

export function Header() {
  const { t } = useI18n();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const links = [
    { to: "/", label: t.nav.home },
    { to: "/a-propos", label: t.nav.about },
    { to: "/visas", label: t.nav.visas },
    { to: "/services", label: t.nav.services },
    { to: "/destinations", label: t.nav.destinations },
    { to: "/galerie", label: t.nav.gallery },
    { to: "/temoignages", label: t.nav.testimonials },
    { to: "/faq", label: t.nav.faq },
    { to: "/contact", label: t.nav.contact },
  ] as const;

  const solid = !isHome || scrolled;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        solid
          ? "border-b border-border/60 bg-background/90 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-5 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <img
            src={logoUrl}
            alt="COREVIA FIRST"
            width={48}
            height={48}
            className="size-11 rounded-md object-cover ring-1 ring-gold/30"
          />
          <span className="flex flex-col leading-none">
            <span className="font-display text-xl font-semibold tracking-wide text-foreground">
              COREVIA <span className="text-gold-gradient">FIRST</span>
            </span>
            <span className="mt-0.5 text-[0.6rem] uppercase tracking-[0.3em] text-muted-foreground">
              {t.hero.tagline}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-5 xl:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              className="group relative py-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-gold" }}
            >
              {l.label}
              <span className="absolute -bottom-0.5 left-0 h-0.5 w-0 rounded-full bg-gradient-gold transition-all duration-300 group-hover:w-full group-data-[status=active]:w-full" />
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <SocialLinks className="hidden 2xl:flex" />
          <AccountMenu />
        </div>

        <button
          className="text-foreground lg:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Menu"
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border/60 bg-background/95 px-5 py-6 backdrop-blur-xl lg:hidden">
          <nav className="flex flex-col gap-4">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                activeOptions={{ exact: l.to === "/" }}
                className="text-base text-muted-foreground hover:text-foreground"
                activeProps={{ className: "font-semibold text-gold" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="mt-6 flex flex-col gap-4">
            <AccountMenu />
            <SocialLinks />
          </div>
        </div>
      )}
    </header>
  );
}