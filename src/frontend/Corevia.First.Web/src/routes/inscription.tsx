import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { isCustomAuthEnabled } from "@/lib/auth-config";
import { AuthShell, authInputCls } from "@/components/site/AuthShell";
import { PasswordInput } from "@/components/site/PasswordInput";

export const Route = createFileRoute("/inscription")({
  head: () => ({ meta: [{ title: "Inscription — COREVIA FIRST" }] }),
  component: SignupPage,
});

function SignupPage() {
  const { lang } = useI18n();
  const fr = lang === "fr";
  const { signUp, signInWithGoogle, supabaseReady } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const handleEmailBlur = () => {
    if (email.trim() && !validateEmail(email)) {
      setEmailError(fr ? "Adresse e-mail invalide" : "Invalid email address");
    } else {
      setEmailError("");
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setEmailError("");

    if (!validateEmail(email)) {
      setEmailError(fr ? "Adresse e-mail invalide" : "Invalid email address");
      return;
    }
    if (password !== confirmPassword) {
      setError(
        fr ? "Les mots de passe ne correspondent pas." : "Passwords do not match.",
      );
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

    setLoading(true);
    const res = await signUp(email, password, name);
    setLoading(false);
    if (res.error) {
      setError(res.error);
      return;
    }
    setSuccess(true);
  };

  const onGoogleSignUp = async () => {
    setOauthLoading(true);
    setError("");
    try {
      await signInWithGoogle();
    } catch (err) {
      setOauthLoading(false);
      setError(err instanceof Error ? err.message : fr ? "Inscription Google échouée." : "Google sign-up failed.");
    }
  };

  const showEmailForm = isCustomAuthEnabled();
  const showGoogle = supabaseReady;

  return (
    <AuthShell
      title={fr ? "Créer un compte" : "Create an account"}
      subtitle={
        fr
          ? "Suivez vos demandes et votre parcours"
          : "Track your requests and journey"
      }
      footer={
        success ? null : (
          <>
            {fr ? "Déjà inscrit ?" : "Already registered?"}{" "}
            <Link to="/connexion" className="font-semibold text-gold">
              {fr ? "Connectez-vous" : "Sign in"}
            </Link>
          </>
        )
      }
    >
      {success ? (
        <div className="flex flex-col items-center py-4 text-center">
          <CheckCircle2 className="size-14 text-gold" />
          <h2 className="mt-4 font-display text-2xl font-semibold text-foreground">
            {fr ? "Compte créé !" : "Account created!"}
          </h2>
          <p className="mt-2 text-muted-foreground">
            {fr
              ? "Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter."
              : "Your account was created successfully. You can now sign in."}
          </p>
          <Link
            to="/connexion"
            className="mt-6 rounded-full bg-gradient-gold px-8 py-3 text-sm font-semibold text-gold-foreground shadow-gold transition-transform hover:scale-[1.02]"
          >
            {fr ? "Se connecter" : "Sign in"}
          </Link>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          {error && (
            <div className="flex items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
              <AlertCircle className="mt-0.5 size-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}
          {showGoogle && (
            <>
              <button
                type="button"
                onClick={onGoogleSignUp}
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
            placeholder={fr ? "Nom complet" : "Full name"}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={authInputCls}
          />
          <div>
            <input
              required
              type="email"
              placeholder={fr ? "Adresse e-mail" : "Email address"}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError("");
              }}
              onBlur={handleEmailBlur}
              className={`${authInputCls} ${emailError ? "border-destructive" : ""}`}
            />
            {emailError && (
              <p className="mt-2 flex items-center gap-1 text-sm text-destructive">
                <AlertCircle className="size-4" />
                {emailError}
              </p>
            )}
          </div>
          <PasswordInput
            required
            placeholder={fr ? "Mot de passe" : "Password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            showPasswordLabel={fr ? "Afficher le mot de passe" : "Show password"}
            hidePasswordLabel={fr ? "Masquer le mot de passe" : "Hide password"}
          />
          <PasswordInput
            required
            placeholder={fr ? "Confirmer le mot de passe" : "Confirm password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            showPasswordLabel={fr ? "Afficher le mot de passe" : "Show password"}
            hidePasswordLabel={fr ? "Masquer le mot de passe" : "Hide password"}
          />
          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-gold py-3.5 text-sm font-semibold text-gold-foreground shadow-gold transition-transform hover:scale-[1.02] disabled:opacity-60"
          >
            {loading && <Loader2 className="size-4 animate-spin" />}
            {fr ? "S'inscrire" : "Sign up"}
          </button>
            </>
          )}
          {!showEmailForm && !showGoogle && (
            <p className="text-sm text-muted-foreground">
              {fr ? "Inscription indisponible." : "Sign up is unavailable."}
            </p>
          )}
        </form>
      )}
    </AuthShell>
  );
}