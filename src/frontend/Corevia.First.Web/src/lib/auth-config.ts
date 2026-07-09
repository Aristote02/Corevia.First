export type AuthMode = "custom" | "supabase" | "hybrid";

export function getAuthMode(): AuthMode {
  const mode = import.meta.env.VITE_AUTH_MODE;
  if (mode === "supabase" || mode === "hybrid") return mode;
  return "custom";
}

export function isSupabaseAuthEnabled(): boolean {
  return getAuthMode() === "supabase" || getAuthMode() === "hybrid";
}

export function isCustomAuthEnabled(): boolean {
  return getAuthMode() === "custom" || getAuthMode() === "hybrid";
}

/** Email/password form: API auth (custom/hybrid) or Supabase email auth (supabase). */
export function isEmailPasswordAuthEnabled(): boolean {
  return isCustomAuthEnabled() || getAuthMode() === "supabase";
}
