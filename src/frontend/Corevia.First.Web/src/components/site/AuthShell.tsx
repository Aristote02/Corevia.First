import { type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { logoUrl } from "@/lib/media";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-dark px-5 py-28">
      <div
        className="pointer-events-none absolute -top-24 left-1/2 size-[30rem] -translate-x-1/2 rounded-full opacity-15 blur-3xl"
        style={{ background: "var(--gradient-gold)" }}
      />
      <div className="relative w-full max-w-md rounded-2xl border border-border/60 bg-card/80 p-8 shadow-soft backdrop-blur">
        <Link to="/" className="flex items-center justify-center gap-3">
          <img
            src={logoUrl}
            alt="COREVIA FIRST"
            className="size-10 rounded-md object-cover ring-1 ring-gold/30"
          />
          <span className="font-display text-xl font-semibold text-foreground">
            COREVIA <span className="text-gold-gradient">FIRST</span>
          </span>
        </Link>
        <h1 className="mt-7 text-center font-display text-2xl font-semibold text-foreground">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 text-center text-sm text-muted-foreground">
            {subtitle}
          </p>
        )}
        <div className="mt-7">{children}</div>
        {footer && (
          <div className="mt-6 text-center text-sm text-muted-foreground">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export const authInputCls =
  "w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-foreground outline-none transition-colors focus:border-gold";