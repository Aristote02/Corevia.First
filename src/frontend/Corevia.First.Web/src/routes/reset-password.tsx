import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Loader2, CheckCircle2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { updatePassword } from "@/lib/api/client";
import { getAuthMode, isSupabaseAuthEnabled } from "@/lib/auth-config";
import { getSupabaseClient } from "@/lib/supabase";
import { AuthShell } from "@/components/site/AuthShell";
import { PasswordInput } from "@/components/site/PasswordInput";

export const Route = createFileRoute("/reset-password")({
  validateSearch: (search: Record<string, unknown>) => ({
    token: typeof search.token === "string" ? search.token : undefined,
    email: typeof search.email === "string" ? search.email : undefined,
  }),
  head: () => ({ meta: [{ title: "Réinitialiser le mot de passe — COREVIA FIRST" }] }),
  component: ResetPage,
});

function ResetPage() {
  const { lang } = useI18n();
  const fr = lang === "fr";
  const navigate = useNavigate();
  const { token, email } = Route.useSearch();
  const isSupabaseMode = isSupabaseAuthEnabled() && getAuthMode() === "supabase";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "saving" | "done">(
    isSupabaseMode ? "loading" : "idle",
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseMode) {
      if (!token || !email) {
        setError(
          fr
            ? "Lien de réinitialisation invalide ou expiré."
            : "Invalid or expired reset link.",
        );
      }
      return;
    }

    let cancelled = false;
    void getSupabaseClient().then(async (client) => {
      if (cancelled) return;
      if (!client) {
        setError(fr ? "Authentification indisponible." : "Authentication unavailable.");
        setStatus("idle");
        return;
      }
      const { data } = await client.auth.getSession();
      if (!data.session) {
        setError(
          fr
            ? "Lien de réinitialisation invalide ou expiré."
            : "Invalid or expired reset link.",
        );
      }
      setStatus("idle");
    });

    return () => {
      cancelled = true;
    };
  }, [email, fr, isSupabaseMode, token]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setError(fr ? "Les mots de passe ne correspondent pas." : "Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError(
        fr
          ? "Le mot de passe doit contenir au moins 6 caractères."
          : "Password must be at least 6 characters.",
      );
      return;
    }
    setError(null);
    setStatus("saving");
    try {
      await updatePassword(password, { email, token });
      setStatus("done");
    } catch (err) {
      setStatus("idle");
      setError(err instanceof Error ? err.message : fr ? "Échec de la mise à jour." : "Update failed.");
    }
  };

  const showForm = status !== "done" && status !== "loading";

  return (
    <AuthShell
      title={fr ? "Nouveau mot de passe" : "New password"}
      subtitle={fr ? "Choisissez un nouveau mot de passe" : "Choose a new password"}
      footer={
        <Link to="/connexion" className="font-semibold text-gold">
          {fr ? "Retour à la connexion" : "Back to sign in"}
        </Link>
      }
    >
      {status === "loading" ? (
        <div className="flex justify-center py-8">
          <Loader2 className="size-8 animate-spin text-gold" />
        </div>
      ) : status === "done" ? (
        <div className="flex flex-col items-center py-4 text-center">
          <CheckCircle2 className="size-12 text-gold" />
          <p className="mt-4 text-muted-foreground">
            {fr ? "Mot de passe mis à jour." : "Password updated."}
          </p>
          <button
            onClick={() => navigate({ to: "/connexion" })}
            className="mt-5 rounded-full bg-gradient-gold px-6 py-2.5 text-sm font-semibold text-gold-foreground shadow-gold"
          >
            {fr ? "Se connecter" : "Sign in"}
          </button>
        </div>
      ) : showForm ? (
        <form onSubmit={onSubmit} className="space-y-4">
          <PasswordInput
            required
            placeholder={fr ? "Nouveau mot de passe" : "New password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            showPasswordLabel={fr ? "Afficher le mot de passe" : "Show password"}
            hidePasswordLabel={fr ? "Masquer le mot de passe" : "Hide password"}
          />
          <PasswordInput
            required
            placeholder={fr ? "Confirmer le mot de passe" : "Confirm password"}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            showPasswordLabel={fr ? "Afficher le mot de passe" : "Show password"}
            hidePasswordLabel={fr ? "Masquer le mot de passe" : "Hide password"}
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button
            type="submit"
            disabled={status === "saving" || (!isSupabaseMode && (!token || !email))}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-gold py-3.5 text-sm font-semibold text-gold-foreground shadow-gold transition-transform hover:scale-[1.02] disabled:opacity-60"
          >
            {status === "saving" && <Loader2 className="size-4 animate-spin" />}
            {fr ? "Mettre à jour" : "Update"}
          </button>
        </form>
      ) : null}
    </AuthShell>
  );
}
