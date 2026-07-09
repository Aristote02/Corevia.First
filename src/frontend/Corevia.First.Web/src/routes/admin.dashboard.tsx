import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Home,
  FileText,
  Users,
  MessageSquare,
  Star,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { AdminRoute } from "@/components/site/RouteGuards";
import { AdminOverview } from "@/components/admin/AdminOverview";
import { AdminApplications } from "@/components/admin/AdminApplications";
import { AdminUsers } from "@/components/admin/AdminUsers";
import { AdminMessages } from "@/components/admin/AdminMessages";
import { AdminTestimonials } from "@/components/admin/AdminTestimonials";
import type { FilterKey } from "@/lib/api/types";

type TabKey = "overview" | "applications" | "users" | "messages" | "testimonials";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({ meta: [{ title: "Tableau de bord — COREVIA FIRST" }] }),
  component: () => (
    <AdminRoute>
      <AdminDashboard />
    </AdminRoute>
  ),
});

function AdminDashboard() {
  const { lang } = useI18n();
  const fr = lang === "fr";
  const [tab, setTab] = useState<TabKey>("overview");
  const [filter, setFilter] = useState<FilterKey>("all");

  const tabs: { key: TabKey; label: string; icon: typeof Home }[] = [
    { key: "overview", label: fr ? "Aperçu" : "Overview", icon: Home },
    { key: "applications", label: fr ? "Demandes" : "Applications", icon: FileText },
    { key: "users", label: fr ? "Utilisateurs" : "Users", icon: Users },
    { key: "messages", label: "Messages", icon: MessageSquare },
    { key: "testimonials", label: fr ? "Témoignages" : "Testimonials", icon: Star },
  ];

  const goTo = (t: TabKey, f: FilterKey = "all") => {
    setTab(t);
    setFilter(f);
  };

  return (
    <div className="min-h-screen bg-gradient-dark pt-20">
      <div className="border-b border-border/60 bg-background/60 backdrop-blur">
        <div className="mx-auto max-w-7xl px-5 py-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <LayoutDashboard className="size-7 text-gold" />
            <h1 className="font-display text-2xl font-semibold text-foreground">
              {fr ? "Tableau de bord" : "Dashboard"}
            </h1>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {tabs.map((tb) => (
              <button
                key={tb.key}
                onClick={() => setTab(tb.key)}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  tab === tb.key
                    ? "bg-gradient-gold text-gold-foreground"
                    : "border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                <tb.icon className="size-4" />
                {tb.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        {tab === "overview" && <AdminOverview onCardClick={goTo} />}
        {tab === "applications" && <AdminApplications initialFilter={filter} />}
        {tab === "users" && <AdminUsers />}
        {tab === "messages" && <AdminMessages />}
        {tab === "testimonials" && <AdminTestimonials />}
      </div>
    </div>
  );
}