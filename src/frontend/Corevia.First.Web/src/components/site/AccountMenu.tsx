import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ChevronDown,
  User,
  LogOut,
  LayoutDashboard,
  Sun,
  Moon,
  Globe,
} from "lucide-react";
import { useI18n, type Lang, WHATSAPP_LINK } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/lib/theme";

function initialsOf(name: string) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("") || "U"
  );
}

function SettingsPanel({ onAction }: { onAction: () => void }) {
  const { t, lang, setLang } = useI18n();
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-4 p-4">
      <p className="eyebrow text-muted-foreground">{t.nav.settings}</p>

      {/* Language */}
      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-2 text-sm text-foreground">
          <Globe className="size-4 text-gold" />
          {t.nav.language}
        </span>
        <div className="inline-flex rounded-full border border-border/70 p-1">
          {(["fr", "en"] as Lang[]).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-colors ${
                lang === l
                  ? "bg-gradient-gold text-gold-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Theme */}
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm text-foreground">{t.nav.theme}</span>
        <div className="inline-flex rounded-full border border-border/70 p-1">
          <button
            onClick={() => setTheme("light")}
            aria-label={t.nav.lightTheme}
            className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
              theme === "light"
                ? "bg-gradient-gold text-gold-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Sun className="size-4" />
          </button>
          <button
            onClick={() => setTheme("dark")}
            aria-label={t.nav.darkTheme}
            className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
              theme === "dark"
                ? "bg-gradient-gold text-gold-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Moon className="size-4" />
          </button>
        </div>
      </div>

      <a
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onAction}
        className="block rounded-full bg-gradient-gold px-4 py-2.5 text-center text-sm font-semibold text-gold-foreground shadow-gold"
      >
        {t.nav.quote}
      </a>
    </div>
  );
}

export function AccountMenu() {
  const { t } = useI18n();
  const { isAuthenticated, isAdmin, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const handleLogout = async () => {
    setOpen(false);
    await signOut();
    navigate({ to: "/" });
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full border border-border bg-background/40 py-1.5 pl-1.5 pr-3 backdrop-blur transition-colors hover:border-gold/40"
      >
        <span className="flex size-8 items-center justify-center rounded-full bg-gradient-gold text-xs font-bold text-gold-foreground">
          {isAuthenticated ? initialsOf(profile?.full_name || "") : (
            <User className="size-4" />
          )}
        </span>
        <span className="hidden max-w-[8rem] truncate text-sm font-semibold text-foreground sm:block">
          {isAuthenticated ? profile?.full_name || t.nav.account : t.nav.account}
        </span>
        <ChevronDown
          className={`size-4 text-muted-foreground transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 overflow-hidden rounded-2xl border border-border/70 bg-popover shadow-soft">
          {isAuthenticated ? (
            <>
              <Link
                to="/mon-compte"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 border-b border-border/60 px-4 py-3 text-sm font-semibold text-foreground hover:bg-accent"
              >
                <User className="size-4 text-gold" />
                {t.nav.account}
              </Link>
              {isAdmin && (
                <Link
                  to="/admin/dashboard"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 border-b border-border/60 px-4 py-3 text-sm font-semibold text-foreground hover:bg-accent"
                >
                  <LayoutDashboard className="size-4 text-gold" />
                  {t.nav.admin}
                </Link>
              )}
              <SettingsPanel onAction={() => setOpen(false)} />
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 border-t border-border/60 px-4 py-3 text-sm font-semibold text-destructive hover:bg-destructive/10"
              >
                <LogOut className="size-4" />
                {t.nav.logout}
              </button>
            </>
          ) : (
            <>
              <Link
                to="/connexion"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 border-b border-border/60 px-4 py-3 text-sm font-semibold text-foreground hover:bg-accent"
              >
                <User className="size-4 text-gold" />
                {t.nav.login}
              </Link>
              <SettingsPanel onAction={() => setOpen(false)} />
            </>
          )}
        </div>
      )}
    </div>
  );
}