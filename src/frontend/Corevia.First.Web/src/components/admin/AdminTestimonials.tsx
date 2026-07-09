import { useEffect, useState } from "react";
import {
  Loader2,
  Star,
  Trash2,
  Eye,
  EyeOff,
  MapPin,
  GraduationCap,
  Quote,
  AlertCircle,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import {
  listAllTestimonials,
  toggleTestimonialActive,
  toggleTestimonialFeatured,
  deleteTestimonial,
} from "@/lib/api/client";
import type { Testimonial } from "@/lib/api/types";

type Filter = "all" | "pending" | "active";

export function AdminTestimonials() {
  const { lang } = useI18n();
  const fr = lang === "fr";
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("pending");
  const [deleteConfirm, setDeleteConfirm] = useState<{
    step: 1 | 2;
    id: string;
    name: string;
  } | null>(null);

  const load = async () => {
    setLoading(true);
    const all = await listAllTestimonials();
    const sorted = [...all].sort(
      (a, b) => +new Date(b.created_at) - +new Date(a.created_at),
    );
    setItems(
      filter === "pending"
        ? sorted.filter((t) => !t.is_active)
        : filter === "active"
          ? sorted.filter((t) => t.is_active)
          : sorted,
    );
    setLoading(false);
  };
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const toggleActive = async (id: string, current: boolean) => {
    await toggleTestimonialActive(id, !current);
    load();
  };
  const toggleFeatured = async (id: string, current: boolean) => {
    await toggleTestimonialFeatured(id, !current);
    load();
  };
  const confirmDelete = async () => {
    if (!deleteConfirm || deleteConfirm.step !== 2) return;
    await deleteTestimonial(deleteConfirm.id);
    setDeleteConfirm(null);
    load();
  };

  const pendingCount = items.filter((t) => !t.is_active).length;

  const filterBtn = (key: Filter, label: string) => (
    <button
      onClick={() => setFilter(key)}
      className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
        filter === key
          ? "bg-gradient-gold text-gold-foreground shadow-gold"
          : "border border-border bg-card text-muted-foreground hover:bg-accent"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold text-foreground">
          {fr ? "Gestion des témoignages" : "Testimonials management"}
        </h2>
        {filter !== "active" && pendingCount > 0 && (
          <div className="flex items-center gap-2 rounded-lg bg-gold/15 px-4 py-2 text-sm font-semibold text-gold">
            <AlertCircle className="size-4" />
            {pendingCount} {fr ? "en attente" : "pending"}
          </div>
        )}
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        {filterBtn("pending", fr ? "En attente" : "Pending")}
        {filterBtn("active", fr ? "Actifs" : "Active")}
        {filterBtn("all", fr ? "Tous" : "All")}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="size-8 animate-spin text-gold" />
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-border/60 bg-card py-12 text-center text-muted-foreground">
          {fr ? "Aucun témoignage dans cette catégorie." : "No testimonials in this category."}
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((t) => (
            <div
              key={t.id}
              className={`rounded-xl border-2 bg-card p-6 transition-all ${
                t.is_active ? "border-gold/30" : "border-border/60"
              }`}
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-3">
                    <h3 className="text-lg font-bold text-foreground">
                      {t.student_name}
                    </h3>
                    {t.is_featured && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-gold/15 px-2 py-1 text-xs font-bold text-gold">
                        <Star className="size-3 fill-current" />
                        {fr ? "À la une" : "Featured"}
                      </span>
                    )}
                    {!t.is_active && (
                      <span className="rounded-full bg-secondary px-2 py-1 text-xs font-bold text-muted-foreground">
                        {fr ? "En attente" : "Pending"}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`size-4 ${
                          i < t.rating ? "fill-gold text-gold" : "text-muted-foreground/40"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleActive(t.id, t.is_active)}
                    className="rounded-lg border border-border p-2 text-foreground transition-all hover:bg-accent"
                    title={
                      t.is_active
                        ? fr
                          ? "Désactiver"
                          : "Deactivate"
                        : fr
                          ? "Activer"
                          : "Activate"
                    }
                  >
                    {t.is_active ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                  </button>
                  <button
                    onClick={() => toggleFeatured(t.id, t.is_featured)}
                    className={`rounded-lg p-2 transition-all ${
                      t.is_featured
                        ? "bg-gradient-gold text-gold-foreground"
                        : "border border-border text-foreground hover:bg-accent"
                    }`}
                    title={
                      t.is_featured
                        ? fr
                          ? "Retirer de la une"
                          : "Remove featured"
                        : fr
                          ? "Mettre à la une"
                          : "Make featured"
                    }
                  >
                    <Star className="size-5" />
                  </button>
                  <button
                    onClick={() =>
                      setDeleteConfirm({ step: 1, id: t.id, name: t.student_name })
                    }
                    className="rounded-lg border border-destructive/50 p-2 text-destructive transition-all hover:bg-destructive/10"
                    title={fr ? "Supprimer" : "Delete"}
                  >
                    <Trash2 className="size-5" />
                  </button>
                </div>
              </div>

              <div className="relative mb-4">
                <Quote className="absolute -left-1 -top-1 size-6 text-gold/20" />
                <p className="pl-6 italic leading-relaxed text-muted-foreground">
                  "{t.testimonial_fr}"
                </p>
              </div>

              {t.testimonial_en && t.testimonial_en !== t.testimonial_fr && (
                <div className="mb-4 border-t border-border/60 pt-4">
                  <p className="mb-2 text-sm font-semibold text-muted-foreground">
                    {fr ? "Version anglaise" : "English version"}
                  </p>
                  <p className="pl-6 text-sm italic leading-relaxed text-muted-foreground">
                    "{t.testimonial_en}"
                  </p>
                </div>
              )}

              <div className="mt-4 flex flex-wrap gap-4 border-t border-border/60 pt-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="size-4 text-gold" />
                  <span>
                    {t.country_from} → {t.destination_country}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="size-4 text-gold" />
                  <span>{t.university}</span>
                </div>
                <div>
                  {fr ? "Promotion" : "Class of"} {t.year}
                </div>
                <div>{new Date(t.created_at).toLocaleDateString(fr ? "fr-FR" : "en-US")}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl border border-border/60 bg-card p-6 shadow-soft">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex size-12 items-center justify-center rounded-full bg-destructive/15">
                <Trash2 className="size-6 text-destructive" />
              </span>
              <h3
                className={`text-xl font-bold ${deleteConfirm.step === 2 ? "text-destructive" : "text-foreground"}`}
              >
                {deleteConfirm.step === 1
                  ? fr
                    ? "Confirmer la suppression"
                    : "Confirm deletion"
                  : fr
                    ? "Confirmation finale"
                    : "Final confirmation"}
              </h3>
            </div>
            <div className="mb-6 space-y-3">
              <p className="text-muted-foreground">
                {deleteConfirm.step === 1
                  ? fr
                    ? "Vous êtes sur le point de supprimer le témoignage de :"
                    : "You are about to delete the testimonial from:"
                  : fr
                    ? "Dernière chance. Cette action est irréversible."
                    : "Last chance. This action is irreversible."}
              </p>
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4">
                <p className="font-semibold text-foreground">{deleteConfirm.name}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 rounded-full border border-border px-4 py-3 text-sm font-semibold text-foreground hover:bg-accent"
              >
                {fr ? "Annuler" : "Cancel"}
              </button>
              {deleteConfirm.step === 1 ? (
                <button
                  onClick={() => setDeleteConfirm({ ...deleteConfirm, step: 2 })}
                  className="flex-1 rounded-full bg-destructive px-4 py-3 text-sm font-semibold text-destructive-foreground hover:opacity-90"
                >
                  {fr ? "Continuer" : "Continue"}
                </button>
              ) : (
                <button
                  onClick={confirmDelete}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-destructive px-4 py-3 text-sm font-semibold text-destructive-foreground hover:opacity-90"
                >
                  <Trash2 className="size-4" />
                  {fr ? "Supprimer" : "Delete"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}