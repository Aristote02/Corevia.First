import { type ReactNode } from "react";
import { Reveal } from "./Reveal";

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  children,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
  align?: "left" | "center";
}) {
  const centered = align === "center";

  return (
    <section className="relative overflow-hidden border-b border-border/50 bg-gradient-dark pt-32 pb-16">
      <div
        className="pointer-events-none absolute -top-24 right-0 size-[28rem] rounded-full opacity-20 blur-3xl"
        style={{ background: "var(--gradient-gold)" }}
      />
      <div
        className={`relative mx-auto max-w-7xl px-5 lg:px-8 ${centered ? "text-center" : ""}`}
      >
        <Reveal>
          {eyebrow && <p className="eyebrow text-gold">{eyebrow}</p>}
          <h1
            className={`mt-4 font-display text-4xl font-semibold leading-tight text-foreground sm:text-5xl lg:text-6xl ${
              centered ? "mx-auto max-w-4xl" : "max-w-3xl"
            }`}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              className={`mt-5 text-lg text-muted-foreground ${
                centered ? "mx-auto max-w-2xl" : "max-w-2xl"
              }`}
            >
              {subtitle}
            </p>
          )}
          {children}
        </Reveal>
      </div>
    </section>
  );
}

export function Section({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`mx-auto max-w-7xl px-5 py-20 lg:px-8 ${className}`}>
      {children}
    </section>
  );
}