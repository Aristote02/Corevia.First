import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Loader2, Info } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { isEmailPasswordAuthEnabled } from "@/lib/auth-config";
import { AuthShell, authInputCls } from "@/components/site/AuthShell";
import { PasswordInput } from "@/components/site/PasswordInput";

export const Route = createFileRoute("/connexion")({
  validateSearch: (s: Record<string, unknown>) => ({
    redirect: typeof s.redirect === "string" ? s.redirect : undefined,
    message: typeof s.message === "string" ? s.message : undefined,
  }),
  head: () => ({ meta: [{ title: "Connexion — COREVIA FIRST" }] }),
  component: LoginPage,
});

function LoginPage() {
  const { lang } = useI18n();
  const fr = lang === "fr";
  const { signIn, signInWithGoogle, supabaseReady, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { redirect, message } = Route.useSearch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate({ to: redirect ?? "/" });
    }
  }, [isAuthenticated, authLoading, navigate, redirect]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn(email, password);
    setLoading(false);
    if (res.error) {
      setError(res.error);
      return;
    }
    navigate({ to: redirect ?? "/" });
  };

  const onGoogleSignIn = async () => {
    setOauthLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err) {
      setOauthLoading(false);
      setError(err instanceof Error ? err.message : fr ? "Connexion Google échouée." : "Google sign-in failed.");
    }
  };

  const showEmailForm = isEmailPasswordAuthEnabled();
  const showGoogle = supabaseReady;

  return (
    <AuthShell
      title={fr ? "Connexion" : "Sign in"}
      subtitle={
        fr ? "Accédez à votre espace personnel" : "Access your personal space"
      }
      footer={
        <>
          {fr ? "Pas encore de compte ?" : "No account yet?"}{" "}
          <Link to="/inscription" className="font-semibold text-gold">
            {fr ? "Inscrivez-vous" : "Sign up"}
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {message && (
          <div className="flex items-start gap-3 rounded-xl border border-gold/40 bg-gold/10 p-4 text-sm font-semibold text-foreground">
            <Info className="mt-0.5 size-5 shrink-0 text-gold" />
            <p>{message}</p>
          </div>
        )}
        {showGoogle && (
          <>
            <button
              type="button"
              onClick={onGoogleSignIn}
              disabled={oauthLoading || loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border bg-background py-3.5 text-sm font-semibold text-foreground transition-transform hover:scale-[1.02] disabled:opacity-60"
            >
              {oauthLoading && <Loader2 className="size-4 animate-spin" />}
              {fr ? "Continuer avec Google" : "Continue with Google"}
            </button>
            {showEmailForm && (
              <div className="relative py-2 text-center text-xs text-muted-foreground">
                <span className="bg-card px-2">{fr ? "ou" : "or"}</span>
                <div className="absolute inset-x-0 top-1/2 -z-10 border-t border-border" />
              </div>
            )}
          </>
        )}
        {showEmailForm && (
          <>
        <input
          required
          type="email"
          placeholder={fr ? "Adresse e-mail" : "Email address"}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={authInputCls}
        />
        <PasswordInput
          required
          placeholder={fr ? "Mot de passe" : "Password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          showPasswordLabel={fr ? "Afficher le mot de passe" : "Show password"}
          hidePasswordLabel={fr ? "Masquer le mot de passe" : "Hide password"}
        />
        <div className="text-right">
          <Link
            to="/mot-de-passe-oublie"
            className="text-xs text-muted-foreground hover:text-gold"
          >
            {fr ? "Mot de passe oublié ?" : "Forgot password?"}
          </Link>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-gold py-3.5 text-sm font-semibold text-gold-foreground shadow-gold transition-transform hover:scale-[1.02] disabled:opacity-60"
        >
          {loading && <Loader2 className="size-4 animate-spin" />}
          {fr ? "Se connecter" : "Sign in"}
        </button>
          </>
        )}
        {!showEmailForm && !showGoogle && (
          <p className="text-sm text-muted-foreground">
            {fr ? "Authentification indisponible." : "Authentication is unavailable."}
          </p>
        )}
      </form>
    </AuthShell>
  );
}