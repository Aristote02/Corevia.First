import { useEffect, useMemo, useState } from "react";
import {
  Search,
  ChevronDown,
  ChevronUp,
  Save,
  Trash2,
  History,
  Loader2,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import {
  listApplications,
  updateApplicationStatus,
  updateApplicationNotes,
  deleteApplication,
  getApplicationHistory,
} from "@/lib/api/client";
import {
  ADMIN_STATUS_COLORS,
  ADMIN_STATUSES,
  ALLOWED_TRANSITIONS,
  coarseStatus,
  type AdminStatus,
  type Application,
  type ApplicationHistoryEntry,
  type FilterKey,
} from "@/lib/api/types";

const PAGE_SIZE = 8;

export function AdminApplications({
  initialFilter = "all",
}: {
  initialFilter?: FilterKey;
}) {
  const { lang } = useI18n();
  const fr = lang === "fr";

  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterKey>(initialFilter);
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState<Record<string, string>>({});
  const [history, setHistory] = useState<Record<string, ApplicationHistoryEntry[]>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const [advanced, setAdvanced] = useState(false);

  const load = async () => {
    setLoading(true);
    const d = await listApplications();
    setApps(d);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => setFilter(initialFilter), [initialFilter]);

  const filtered = useMemo(() => {
    const s = query.trim().toLowerCase();
    return apps.filter((a) => {
      const matchesFilter =
        filter === "all" ? true : coarseStatus(a.admin_status) === filter;
      const matchesQuery =
        !s ||
        a.full_name.toLowerCase().includes(s) ||
        a.email.toLowerCase().includes(s) ||
        a.application_number.toLowerCase().includes(s);
      return matchesFilter && matchesQuery;
    });
  }, [apps, query, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggle = async (id: string) => {
    if (expanded === id) {
      setExpanded(null);
      return;
    }
    setExpanded(id);
    const app = apps.find((a) => a.id === id);
    if (app) setNotesDraft((d) => ({ ...d, [id]: app.admin_notes }));
    if (!history[id]) {
      const h = await getApplicationHistory(id);
      setHistory((prev) => ({ ...prev, [id]: h }));
    }
  };

  const changeStatus = async (id: string, status: AdminStatus) => {
    setBusy(id);
    await updateApplicationStatus(id, status, notesDraft[id]);
    const h = await getApplicationHistory(id);
    setHistory((prev) => ({ ...prev, [id]: h }));
    await load();
    setBusy(null);
  };

  const saveNotes = async (id: string) => {
    setBusy(id);
    await updateApplicationNotes(id, notesDraft[id] ?? "");
    await load();
    setBusy(null);
  };

  const remove = async (id: string) => {
    if (!confirm(fr ? "Supprimer cette demande ?" : "Delete this application?")) return;
    setBusy(id);
    await deleteApplication(id);
    await load();
    setBusy(null);
  };

  const filters: { key: FilterKey; label: string }[] = [
    { key: "all", label: fr ? "Toutes" : "All" },
    { key: "nouveau", label: fr ? "Nouvelles" : "New" },
    { key: "en_cours", label: fr ? "En cours" : "In progress" },
    { key: "cloture", label: fr ? "Clôturées" : "Closed" },
  ];

  if (loading)
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="size-8 animate-spin text-gold" />
      </div>
    );

  return (
    <div>
      {/* Advanced admin mode */}
      <div
        className={`mb-6 rounded-2xl border p-4 transition-colors ${
          advanced ? "border-gold/50 bg-gold/5" : "border-border/60 bg-card"
        }`}
      >
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={advanced}
            onChange={(e) => setAdvanced(e.target.checked)}
            className="mt-0.5 size-4 shrink-0 accent-[var(--gold,#e0b341)]"
          />
          <span>
            <span className="flex items-center gap-2 font-semibold text-foreground">
              <AlertTriangle className="size-4 text-gold" />
              {fr
                ? "Mode admin avancé (corriger une erreur)"
                : "Advanced admin mode (fix an error)"}
            </span>
            <span className="mt-1 block text-sm text-muted-foreground">
              {fr
                ? "Ce mode est réservé à la correction d'erreurs administratives. Il permet de forcer des transitions de statut normalement interdites."
                : "This mode is reserved for fixing administrative errors. It allows forcing status transitions that are normally forbidden."}
            </span>
          </span>
        </label>
        {advanced && (
          <p className="mt-3 flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">
            <AlertTriangle className="size-4 shrink-0" />
            {fr
              ? "Mode avancé actif : toutes les transitions de statut sont désormais possibles."
              : "Advanced mode active: All status transitions are now possible."}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder={fr ? "Rechercher..." : "Search..."}
            className="w-full rounded-lg border border-border bg-card py-2.5 pl-10 pr-4 text-sm text-foreground outline-none focus:border-gold"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => {
                setFilter(f.key);
                setPage(1);
              }}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                filter === f.key
                  ? "bg-gradient-gold text-gold-foreground"
                  : "border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {pageItems.map((a) => {
          const isOpen = expanded === a.id;
          const allowed = ALLOWED_TRANSITIONS[a.admin_status] ?? [];
          const statusOptions = advanced
            ? ADMIN_STATUSES.filter((s) => s !== a.admin_status)
            : allowed;
          return (
            <div
              key={a.id}
              className="overflow-hidden rounded-xl border border-border/60 bg-card"
            >
              <button
                onClick={() => toggle(a.id)}
                className="flex w-full items-center gap-4 px-5 py-4 text-left"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-foreground">{a.full_name}</span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {a.application_number}
                    </span>
                  </div>
                  <p className="truncate text-sm text-muted-foreground">
                    {a.email} · {a.country ?? "—"} · {a.service ?? "—"}
                  </p>
                </div>
                <span
                  className={`hidden rounded-full border px-3 py-1 text-xs font-medium capitalize sm:inline ${
                    ADMIN_STATUS_COLORS[a.admin_status] ?? ""
                  }`}
                >
                  {a.admin_status.replace(/_/g, " ")}
                </span>
                {isOpen ? (
                  <ChevronUp className="size-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="size-5 text-muted-foreground" />
                )}
              </button>

              {isOpen && (
                <div className="border-t border-border/60 px-5 py-5">
                  <p className="text-sm text-foreground">{a.message}</p>

                  <div className="mt-5 grid gap-5 lg:grid-cols-2">
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {fr ? "Changer le statut" : "Change status"}
                      </h4>
                      {statusOptions.length === 0 ? (
                        <p className="mt-3 text-sm text-muted-foreground">
                          {fr ? "Statut final." : "Final status."}
                        </p>
                      ) : (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {statusOptions.map((s) => (
                            <button
                              key={s}
                              disabled={busy === a.id}
                              onClick={() => changeStatus(a.id, s)}
                              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium capitalize transition-opacity hover:opacity-80 disabled:opacity-50 ${
                                advanced
                                  ? ADMIN_STATUS_COLORS[s] ?? "border-gold/40 text-foreground"
                                  : "border-gold/40 text-foreground hover:bg-gold/10"
                              }`}
                            >
                              <ArrowRight className="size-3.5" />
                              {s.replace(/_/g, " ")}
                            </button>
                          ))}
                        </div>
                      )}

                      <h4 className="mt-5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {fr ? "Notes internes" : "Internal notes"}
                      </h4>
                      <textarea
                        rows={3}
                        value={notesDraft[a.id] ?? ""}
                        onChange={(e) =>
                          setNotesDraft((d) => ({ ...d, [a.id]: e.target.value }))
                        }
                        className="mt-2 w-full rounded-lg border border-border bg-background/40 px-3 py-2 text-sm text-foreground outline-none focus:border-gold"
                      />
                      <div className="mt-2 flex gap-2">
                        <button
                          disabled={busy === a.id}
                          onClick={() => saveNotes(a.id)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-gold px-4 py-2 text-xs font-semibold text-gold-foreground disabled:opacity-50"
                        >
                          <Save className="size-3.5" />
                          {fr ? "Enregistrer" : "Save"}
                        </button>
                        <button
                          disabled={busy === a.id}
                          onClick={() => remove(a.id)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-destructive/50 px-4 py-2 text-xs font-semibold text-destructive hover:bg-destructive/10 disabled:opacity-50"
                        >
                          <Trash2 className="size-3.5" />
                          {fr ? "Supprimer" : "Delete"}
                        </button>
                      </div>
                    </div>

                    <div>
                      <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        <History className="size-3.5" />
                        {fr ? "Historique" : "History"}
                      </h4>
                      <ul className="mt-3 space-y-2">
                        {(history[a.id] ?? []).length === 0 ? (
                          <li className="text-sm text-muted-foreground">
                            {fr ? "Aucun changement." : "No changes."}
                          </li>
                        ) : (
                          history[a.id].map((h) => (
                            <li
                              key={h.id}
                              className="rounded-lg border border-border/60 bg-background/40 px-3 py-2 text-xs text-muted-foreground"
                            >
                              <span className="capitalize text-foreground">
                                {(h.old_status ?? "—").replace(/_/g, " ")} →{" "}
                                {h.new_status.replace(/_/g, " ")}
                              </span>
                              <span className="block text-[0.7rem]">
                                {new Date(h.created_at).toLocaleString()} ·{" "}
                                {h.changed_by}
                              </span>
                              {h.notes && <span className="block">{h.notes}</span>}
                            </li>
                          ))
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {pageItems.length === 0 && (
          <p className="py-10 text-center text-muted-foreground">
            {fr ? "Aucune demande." : "No applications."}
          </p>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`size-9 rounded-lg text-sm font-medium ${
                page === i + 1
                  ? "bg-gradient-gold text-gold-foreground"
                  : "border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}