import { type ReactNode } from "react";
import { PageHeader, Section } from "./PageHeader";

export function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <>
      <PageHeader eyebrow="COREVIA FIRST" title={title} subtitle={updated} />
      <Section className="max-w-3xl">
        <div className="space-y-8 text-muted-foreground [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground [&_p]:mt-2">
          {children}
        </div>
      </Section>
    </>
  );
}