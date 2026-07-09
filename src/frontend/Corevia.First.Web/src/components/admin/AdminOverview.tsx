import { useEffect, useState } from "react";
import {
  FileText,
  Users,
  MessageSquare,
  Star,
  Loader2,
  Clock,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useI18n } from "@/lib/i18n";
import {
  listApplications,
  listMessages,
  listUsers,
  listAllTestimonials,
} from "@/lib/api/client";
import { coarseStatus, type FilterKey } from "@/lib/api/types";

type TabKey = "overview" | "applications" | "users" | "messages" | "testimonials";

export function AdminOverview({
  onCardClick,
}: {
  onCardClick: (tab: TabKey, filter?: FilterKey) => void;
}) {
  const { lang } = useI18n();
  const fr = lang === "fr";
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    nouveau: 0,
    en_cours: 0,
    cloture: 0,
    users: 0,
    unread: 0,
    pendingTestimonials: 0,
  });

  useEffect(() => {
    (async () => {
      const [apps, msgs, users, tests] = await Promise.all([
        listApplications(),
        listMessages(),
        listUsers(),
        listAllTestimonials(),
      ]);
      setStats({
        total: apps.length,
        nouveau: apps.filter((a) => coarseStatus(a.admin_status) === "nouveau").length,
        en_cours: apps.filter((a) => coarseStatus(a.admin_status) === "en_cours").length,
        cloture: apps.filter((a) => coarseStatus(a.admin_status) === "cloture").length,
        users: users.length,
        unread: msgs.filter((m) => !m.is_read).length,
        pendingTestimonials: tests.filter((t) => !t.is_active).length,
      });
      setLoading(false);
    })();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="size-8 animate-spin text-gold" />
      </div>
    );

  const cards = [
    {
      icon: FileText,
      value: stats.total,
      label: fr ? "Demandes totales" : "Total applications",
      onClick: () => onCardClick("applications", "all"),
    },
    {
      icon: Sparkles,
      value: stats.nouveau,
      label: fr ? "Nouvelles" : "New",
      onClick: () => onCardClick("applications", "nouveau"),
    },
    {
      icon: Clock,
      value: stats.en_cours,
      label: fr ? "En cours" : "In progress",
      onClick: () => onCardClick("applications", "en_cours"),
    },
    {
      icon: CheckCircle2,
      value: stats.cloture,
      label: fr ? "Clôturées" : "Closed",
      onClick: () => onCardClick("applications", "cloture"),
    },
    {
      icon: Users,
      value: stats.users,
      label: fr ? "Utilisateurs" : "Users",
      onClick: () => onCardClick("users"),
    },
    {
      icon: MessageSquare,
      value: stats.unread,
      label: fr ? "Messages non lus" : "Unread messages",
      onClick: () => onCardClick("messages"),
    },
    {
      icon: Star,
      value: stats.pendingTestimonials,
      label: fr ? "Témoignages à valider" : "Testimonials to review",
      onClick: () => onCardClick("testimonials"),
    },
  ];

  const pieData = [
    { name: fr ? "Nouvelles" : "New", value: stats.nouveau, color: "#7aa2ff" },
    { name: fr ? "En cours" : "In progress", value: stats.en_cours, color: "#e0b341" },
    { name: fr ? "Clôturées" : "Closed", value: stats.cloture, color: "#4ade80" },
  ];

  const barData = [
    { name: fr ? "Demandes" : "Applications", value: stats.total, color: "#e0b341" },
    { name: fr ? "Utilisateurs" : "Users", value: stats.users, color: "#7aa2ff" },
    { name: "Messages", value: stats.unread, color: "#4ade80" },
    { name: fr ? "Témoignages" : "Reviews", value: stats.pendingTestimonials, color: "#f472b6" },
  ];

  const tooltipStyle = {
    background: "var(--popover)",
    border: "1px solid var(--border)",
    borderRadius: 12,
    color: "var(--foreground)",
  } as const;

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <button
            key={c.label}
            onClick={c.onClick}
            className="group flex flex-col items-center rounded-2xl border border-border/60 bg-card p-6 text-center transition-all hover:border-gold/40 hover:shadow-gold"
          >
            <c.icon className="size-8 text-gold transition-transform group-hover:scale-110" />
            <div className="text-gold-gradient mt-4 font-display text-4xl font-semibold">
              {c.value}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">{c.label}</div>
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border/60 bg-card p-6">
          <h3 className="font-display text-lg font-semibold text-foreground">
            {fr ? "Répartition des dossiers" : "Applications breakdown"}
          </h3>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={3}
                >
                  {pieData.map((d) => (
                    <Cell key={d.name} fill={d.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={tooltipStyle}
                  itemStyle={{ color: "var(--foreground)" }}
                  labelStyle={{ color: "var(--foreground)" }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card p-6">
          <h3 className="font-display text-lg font-semibold text-foreground">
            {fr ? "Statistiques globales" : "Global statistics"}
          </h3>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis
                  dataKey="name"
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: "var(--accent)", opacity: 0.3 }}
                  contentStyle={tooltipStyle}
                  itemStyle={{ color: "var(--foreground)" }}
                  labelStyle={{ color: "var(--foreground)" }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {barData.map((d) => (
                    <Cell key={d.name} fill={d.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}