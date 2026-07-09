import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Loader2, MailCheck } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { requestPasswordReset } from "@/lib/api/client";
import { AuthShell, authInputCls } from "@/components/site/AuthShell";

export const Route = createFileRoute("/mot-de-passe-oublie")({
  head: () => ({ meta: [{ title: "Mot de passe oublié — COREVIA FIRST" }] }),
  component: ForgotPage,
});

function ForgotPage() {
  const { lang } = useI18n();
  const fr = lang === "fr";
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setError(null);
    try {
      await requestPasswordReset(email);
      setStatus("done");
    } catch (err) {
      setStatus("idle");
      setError(
        err instanceof Error
          ? err.message
          : fr
            ? "Impossible d'envoyer l'e-mail."
            : "Unable to send reset email.",
      );
    }
  };

  return (
    <AuthShell
      title={fr ? "Mot de passe oublié" : "Forgot password"}
      subtitle={
        fr
          ? "Nous vous enverrons un lien de réinitialisation"
          : "We'll send you a reset link"
      }
      footer={
        <Link to="/connexion" className="font-semibold text-gold">
          {fr ? "Retour à la connexion" : "Back to sign in"}
        </Link>
      }
    >
      {status === "done" ? (
        <div className="flex flex-col items-center py-4 text-center">
          <MailCheck className="size-12 text-gold" />
          <p className="mt-4 text-muted-foreground">
            {fr
              ? "Si un compte existe, un e-mail de réinitialisation a été envoyé."
              : "If an account exists, a reset email has been sent."}
          </p>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            required
            type="email"
            placeholder={fr ? "Adresse e-mail" : "Email address"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={authInputCls}
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button
            type="submit"
            disabled={status === "sending"}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-gold py-3.5 text-sm font-semibold text-gold-foreground shadow-gold transition-transform hover:scale-[1.02] disabled:opacity-60"
          >
            {status === "sending" && <Loader2 className="size-4 animate-spin" />}
            {fr ? "Envoyer le lien" : "Send link"}
          </button>
        </form>
      )}
    </AuthShell>
  );
}