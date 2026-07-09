import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Loader2,
  LogOut,
  User,
  FileText,
  Mail,
  Phone,
  Globe,
  Save,
  AlertCircle,
  CheckCircle,
  CheckCircle2,
  Clock,
  Shield,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { ProtectedRoute } from "@/components/site/RouteGuards";
import { PageHeader, Section } from "@/components/site/PageHeader";
import { listMyApplications, updateProfile } from "@/lib/api/client";
import type { Application } from "@/lib/api/types";

export const Route = createFileRoute("/mon-compte")({
  validateSearch: (s: Record<string, unknown>) => ({
    complete: s.complete === "1" || s.complete === 1 ? "1" : undefined,
  }),
  head: () => ({ meta: [{ title: "Mon compte — COREVIA FIRST" }] }),
  component: () => (
    <ProtectedRoute>
      <AccountPage />
    </ProtectedRoute>
  ),
});

type CoarseStatus = "nouveau" | "en_cours" | "cloture";
const STATUS_ORDER: CoarseStatus[] = ["nouveau", "en_cours", "cloture"];

function AccountPage() {
  const { lang } = useI18n();
  const fr = lang === "fr";
  const { complete } = Route.useSearch();
  const { profile, setProfile, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();

  const STATUS_CONFIG: Record<
    CoarseStatus,
    { label: string; icon: typeof FileText; description: string }
  > = {
    nouveau: {
      label: fr ? "Nouveau" : "New",
      icon: FileText,
      description: fr ? "Votre dossier a été reçu" : "Your file has been received",
    },
    en_cours: {
      label: fr ? "En cours" : "In progress",
      icon: Clock,
      description: fr
        ? "Votre dossier est en cours de traitement"
        : "Your file is being processed",
    },
    cloture: {
      label: fr ? "Clôturé" : "Closed",
      icon: CheckCircle2,
      description: fr ? "Votre dossier est finalisé" : "Your file is complete",
    },
  };

  const initial = {
    name: profile?.full_name ?? "",
    phone: profile?.phone ?? "",
    country: profile?.country ?? "",
    email: profile?.email ?? "",
  };

  const [apps, setApps] = useState<Application[]>([]);
  const [loadingApps, setLoadingApps] = useState(true);
  const [formData, setFormData] = useState(initial);
  const [initialFormData, setInitialFormData] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    listMyApplications().then((d) => {
      setApps(d);
      setLoadingApps(false);
    });
  }, []);

  useEffect(() => {
    if (!profile) return;
    const next = {
      name: profile.full_name ?? "",
      phone: profile.phone ?? "",
      country: profile.country ?? "",
      email: profile.email ?? "",
    };
    setFormData(next);
    setInitialFormData(next);
    setHasUnsavedChanges(false);
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updated = { ...formData, [e.target.name]: e.target.value };
    setFormData(updated);
    setHasUnsavedChanges(
      updated.name !== initialFormData.name ||
        updated.phone !== initialFormData.phone ||
        updated.country !== initialFormData.country,
    );
  };

  const handleSubmitAttempt = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  const handleConfirmSave = async () => {
    setSaving(true);
    setError("");
    setMessage("");
    setShowConfirmModal(false);
    try {
      const updated = await updateProfile({
        full_name: formData.name,
        phone: formData.phone || null,
        country: formData.country || null,
      });
      if (!updated) {
        throw new Error("Update failed");
      }
      setProfile(updated);
      const saved = {
        name: updated.full_name,
        phone: updated.phone ?? "",
        country: updated.country ?? "",
        email: updated.email,
      };
      setFormData(saved);
      setInitialFormData(saved);
      setHasUnsavedChanges(false);
      setMessage(fr ? "Profil mis à jour avec succès." : "Profile updated successfully.");
      setTimeout(() => setMessage(""), 3000);
    } catch {
      setError(fr ? "Erreur lors de la mise à jour." : "Update failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  const inputCls =
    "w-full rounded-xl border border-border bg-card px-4 py-3 pl-10 text-foreground outline-none transition-colors focus:border-gold";
  const labelCls = "block text-sm font-semibold text-foreground mb-2";

  return (
    <>
      <PageHeader
        eyebrow={fr ? "Espace personnel" : "Personal space"}
        title={
          formData.name
            ? fr
              ? `Compte de ${formData.name}`
              : `${formData.name}'s account`
            : fr
              ? "Mon compte"
              : "My account"
        }
        subtitle={profile?.email}
      />

      <Section>
        <div className="mx-auto max-w-4xl space-y-8">
          {complete === "1" && (
            <div className="flex items-start gap-3 rounded-2xl border border-gold/40 bg-gold/10 p-4 text-sm text-foreground">
              <User className="mt-0.5 size-5 shrink-0 text-gold" />
              <p>
                {fr
                  ? "Bienvenue ! Complétez votre nom et vos coordonnées pour finaliser votre profil."
                  : "Welcome! Complete your name and contact details to finish your profile."}
              </p>
            </div>
          )}
          {isAdmin && (
            <div className="flex items-center justify-between gap-4 rounded-2xl border border-gold/30 bg-card p-6">
              <div>
                <h3 className="text-xl font-bold text-foreground">
                  {fr ? "Espace administrateur" : "Admin space"}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {fr
                    ? "Gérez les dossiers, messages et témoignages."
                    : "Manage files, messages and testimonials."}
                </p>
              </div>
              <Link
                to="/admin/dashboard"
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-gradient-gold px-5 py-2.5 text-sm font-semibold text-gold-foreground shadow-gold"
              >
                <Shield className="size-4" />
                {fr ? "Tableau de bord" : "Dashboard"}
              </Link>
            </div>
          )}

          {/* Applications history */}
          <div className="rounded-2xl border border-border/60 bg-card p-8">
            <h2 className="mb-4 font-display text-2xl font-semibold text-foreground">
              {fr ? "Historique des demandes" : "Applications history"}
            </h2>

            {loadingApps ? (
              <div className="flex justify-center py-10">
                <Loader2 className="size-7 animate-spin text-gold" />
              </div>
            ) : apps.length > 0 ? (
              <div className="space-y-3">
                {apps.map((a) => {
                  const coarse = (a.status as CoarseStatus) ?? "nouveau";
                  const cfg = STATUS_CONFIG[coarse] ?? STATUS_CONFIG.nouveau;
                  const Icon = cfg.icon;
                  const currentIndex = STATUS_ORDER.indexOf(coarse);
                  return (
                    <div
                      key={a.id}
                      className="rounded-xl border border-border/60 bg-background/40 p-4 transition-colors hover:border-gold/50"
                    >
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <span className="inline-block rounded bg-gold/15 px-3 py-0.5 text-xs font-bold tracking-wide text-gold">
                            {a.application_number}
                          </span>
                          {a.service && (
                            <h3 className="mt-1.5 text-base font-bold text-foreground">
                              {a.service}
                            </h3>
                          )}
                          {a.country && (
                            <p className="text-xs text-muted-foreground">
                              {fr ? "Pays" : "Country"}: {a.country}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 rounded-lg bg-gold/15 px-3 py-1.5 text-xs font-semibold text-gold">
                          <Icon className="size-4" />
                          {cfg.label}
                        </div>
                      </div>

                      <div className="mb-3 grid grid-cols-2 gap-3 text-xs text-muted-foreground">
                        <div>
                          <span className="font-semibold text-foreground">
                            {fr ? "Créé le" : "Created on"}:{" "}
                          </span>
                          {new Date(a.created_at).toLocaleDateString(
                            fr ? "fr-FR" : "en-US",
                          )}
                        </div>
                        <div>
                          <span className="font-semibold text-foreground">
                            {fr ? "Mis à jour le" : "Updated on"}:{" "}
                          </span>
                          {new Date(a.updated_at).toLocaleDateString(
                            fr ? "fr-FR" : "en-US",
                          )}
                        </div>
                      </div>

                      {coarse === "cloture" ? (
                        <div className="mt-2 flex items-center gap-2 border-t border-border/60 pt-2 text-gold">
                          <CheckCircle2 className="size-4" />
                          <span className="text-xs font-semibold">
                            {fr ? "Dossier finalisé avec succès" : "File successfully completed"}
                          </span>
                        </div>
                      ) : (
                        <div className="mt-3 border-t border-border/60 pt-3">
                          <div className="flex items-center gap-3">
                            {STATUS_ORDER.map((s, index) => {
                              const active = currentIndex >= index;
                              return (
                                <div key={s} className="flex-1">
                                  <div
                                    className={`h-1.5 rounded-full ${active ? "bg-gold" : "bg-border"}`}
                                  />
                                  <p
                                    className={`mt-0.5 text-center text-[10px] ${active ? "font-semibold text-foreground" : "text-muted-foreground"}`}
                                  >
                                    {STATUS_CONFIG[s].label}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                          <div className="mt-2 flex items-center justify-center gap-1.5">
                            <div className="size-1.5 animate-pulse rounded-full bg-gold" />
                            <span className="text-xs font-semibold text-gold">
                              {cfg.description}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-xl border border-border/60 bg-background/40 p-6 text-center">
                <FileText className="mx-auto mb-3 size-12 text-gold" />
                <h3 className="mb-2 text-lg font-bold text-foreground">
                  {fr ? "Aucune demande" : "No applications"}
                </h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  {fr
                    ? "Vous n'avez pas encore de dossier. Lancez votre projet dès maintenant."
                    : "You don't have any file yet. Start your project now."}
                </p>
                <Link
                  to="/contact"
                  className="inline-block rounded-full bg-gradient-gold px-6 py-2.5 text-sm font-semibold text-gold-foreground shadow-gold"
                >
                  {fr ? "Créer un dossier" : "Create a file"}
                </Link>
              </div>
            )}
          </div>

          {/* Need new file */}
          <div className="rounded-2xl border border-border/60 bg-card p-5">
            <div className="flex items-start gap-3">
              <FileText className="mt-0.5 size-6 shrink-0 text-gold" />
              <div>
                <h3 className="mb-1.5 text-sm font-bold text-foreground">
                  {fr ? "Besoin d'un nouveau dossier ?" : "Need a new file?"}
                </h3>
                <p className="mb-3 text-xs text-muted-foreground">
                  {fr
                    ? "Vous pouvez soumettre une nouvelle demande à tout moment."
                    : "You can submit a new request at any time."}
                </p>
                <Link
                  to="/contact"
                  className="inline-block rounded-full bg-gradient-gold px-5 py-2 text-xs font-semibold text-gold-foreground shadow-gold"
                >
                  {fr ? "Créer un nouveau dossier" : "Create a new file"}
                </Link>
              </div>
            </div>
          </div>

          {/* Personal info */}
          <div className="rounded-2xl border border-border/60 bg-card p-8">
            <div className="mb-6 flex items-center gap-2">
              <User className="size-5 text-gold" />
              <h2 className="font-display text-2xl font-semibold text-foreground">
                {fr ? "Informations personnelles" : "Personal information"}
              </h2>
            </div>

            <form onSubmit={handleSubmitAttempt} className="space-y-6">
              {error && (
                <div className="flex items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
                  <AlertCircle className="mt-0.5 size-5 shrink-0" />
                  <p>{error}</p>
                </div>
              )}
              {message && (
                <div className="flex items-start gap-3 rounded-xl border border-gold/40 bg-gold/10 p-4 text-sm text-foreground">
                  <CheckCircle className="mt-0.5 size-5 shrink-0 text-gold" />
                  <p>{message}</p>
                </div>
              )}

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className={labelCls}>{fr ? "Nom complet" : "Full name"}</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 size-5 text-muted-foreground" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={inputCls}
                      placeholder={fr ? "Votre nom complet" : "Your full name"}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>{fr ? "Adresse e-mail" : "Email"}</label>
                  <p className="mb-2 text-xs text-muted-foreground">
                    {fr ? "L'e-mail ne peut pas être modifié" : "Email cannot be modified"}
                  </p>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 size-5 text-muted-foreground" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      disabled
                      className={`${inputCls} opacity-60`}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>{fr ? "Téléphone" : "Phone"}</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3.5 size-5 text-muted-foreground" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={inputCls}
                      placeholder="+XXX XXX XXX XXX"
                    />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>{fr ? "Pays" : "Country"}</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3.5 size-5 text-muted-foreground" />
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className={inputCls}
                      placeholder={fr ? "Votre pays" : "Your country"}
                    />
                  </div>
                </div>
              </div>

              {hasUnsavedChanges && (
                <div className="flex items-start gap-3 rounded-xl border border-gold/40 bg-gold/10 p-4 text-sm font-semibold text-foreground">
                  <AlertCircle className="mt-0.5 size-5 shrink-0 text-gold" />
                  <p>
                    {fr
                      ? "Vous avez des modifications non enregistrées."
                      : "You have unsaved changes."}
                  </p>
                </div>
              )}

              <div className="border-t border-border/60 pt-6">
                <button
                  type="submit"
                  disabled={saving || !hasUnsavedChanges}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-gold px-8 py-3 text-sm font-semibold text-gold-foreground shadow-gold transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Save className="size-5" />
                  {saving ? (fr ? "Enregistrement..." : "Saving...") : fr ? "Enregistrer" : "Save"}
                </button>
              </div>
            </form>
          </div>

          {/* Tip */}
          <div className="rounded-2xl border border-border/60 bg-card p-6">
            <h3 className="mb-2 font-semibold text-gold">{fr ? "Astuce" : "Tip"}</h3>
            <p className="text-sm text-muted-foreground">
              {fr
                ? "Gardez vos informations à jour pour un traitement plus rapide de vos dossiers."
                : "Keep your information up to date for faster processing of your files."}
            </p>
          </div>
        </div>
      </Section>

      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-2xl border border-border/60 bg-card p-6 shadow-soft">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-gold/15">
                <AlertCircle className="size-6 text-gold" />
              </span>
              <h3 className="text-xl font-bold text-foreground">
                {fr ? "Confirmer les modifications" : "Confirm changes"}
              </h3>
            </div>
            <p className="mb-6 text-muted-foreground">
              {fr
                ? "Voulez-vous enregistrer ces modifications ?"
                : "Do you want to save these changes?"}
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 rounded-full border border-border px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-accent"
              >
                {fr ? "Annuler" : "Cancel"}
              </button>
              <button
                type="button"
                onClick={handleConfirmSave}
                disabled={saving}
                className="flex-1 rounded-full bg-gradient-gold px-4 py-2.5 text-sm font-semibold text-gold-foreground shadow-gold disabled:opacity-50"
              >
                {saving ? (fr ? "Enregistrement..." : "Saving...") : fr ? "Confirmer" : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}