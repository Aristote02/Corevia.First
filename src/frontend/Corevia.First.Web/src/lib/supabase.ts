import { createClient, type Session, type SupabaseClient } from "@supabase/supabase-js";
import { getApiBaseUrl } from "./config";
import { isSupabaseAuthEnabled } from "./auth-config";

let client: SupabaseClient | null = null;
let initPromise: Promise<SupabaseClient | null> | null = null;

interface AuthConfigResponse {
  supabase_enabled: boolean;
  supabase_url: string | null;
  supabase_anon_key: string | null;
}

async function resolveSupabaseCredentials() {
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (typeof envUrl === "string" && envUrl && typeof envKey === "string" && envKey) {
    return { url: envUrl, anonKey: envKey };
  }

  try {
    const res = await fetch(`${getApiBaseUrl()}/auth/config`);
    if (!res.ok) return null;
    const data = (await res.json()) as AuthConfigResponse;
    if (!data.supabase_enabled || !data.supabase_url || !data.supabase_anon_key) return null;
    return { url: data.supabase_url, anonKey: data.supabase_anon_key };
  } catch {
    return null;
  }
}

export async function getSupabaseClient(): Promise<SupabaseClient | null> {
  if (!isSupabaseAuthEnabled()) return null;
  if (client) return client;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const creds = await resolveSupabaseCredentials();
    if (!creds) return null;

    const supabase = createClient(creds.url, creds.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });

    await Promise.race([
      new Promise<void>((resolve) => {
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((event) => {
          if (event === "INITIAL_SESSION") {
            subscription.unsubscribe();
            resolve();
          }
        });
      }),
      new Promise<void>((resolve) => {
        setTimeout(resolve, 3000);
      }),
    ]);

    client = supabase;
    return client;
  })();

  return initPromise;
}

export async function getSupabaseAccessToken(): Promise<string | null> {
  const supabase = await getSupabaseClient();
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

/** Wait until Supabase has restored any persisted session (avoids refresh logout race). */
export async function waitForSupabaseSession(
  supabase: SupabaseClient,
  timeoutMs = 8000,
): Promise<Session | null> {
  const { data: initial } = await supabase.auth.getSession();
  if (initial.session) return initial.session;

  return new Promise((resolve) => {
    let settled = false;

    const finish = (session: Session | null) => {
      if (settled) return;
      settled = true;
      subscription.unsubscribe();
      clearTimeout(timer);
      resolve(session);
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "INITIAL_SESSION" || event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        finish(session);
      }
    });

    const timer = setTimeout(async () => {
      const { data } = await supabase.auth.getSession();
      finish(data.session);
    }, timeoutMs);
  });
}

export async function signInWithEmailSupabase(email: string, password: string) {
  const supabase = await getSupabaseClient();
  if (!supabase) throw new Error("Supabase auth is not configured.");
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

export async function signUpWithEmailSupabase(
  email: string,
  password: string,
  fullName: string,
) {
  const supabase = await getSupabaseClient();
  if (!supabase) throw new Error("Supabase auth is not configured.");
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName.trim() } },
  });
  if (error) throw error;
  return data.session;
}

export async function signInWithGoogleRedirect(redirectTo?: string) {
  const supabase = await getSupabaseClient();
  if (!supabase) throw new Error("Supabase auth is not configured.");

  const redirectUrl = redirectTo ?? `${window.location.origin}/connexion`;
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: redirectUrl,
      queryParams: { access_type: "offline", prompt: "consent" },
      scopes: "email profile",
    },
  });
  if (error) throw error;
}

export async function signOutSupabase() {
  const supabase = await getSupabaseClient();
  if (!supabase) return;
  await supabase.auth.signOut();
}

export async function resetPasswordWithSupabase(email: string, redirectTo?: string) {
  const supabase = await getSupabaseClient();
  if (!supabase) throw new Error("Supabase auth is not configured.");
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectTo ?? `${window.location.origin}/reset-password`,
  });
  if (error) throw error;
}

export async function updatePasswordWithSupabase(password: string) {
  const supabase = await getSupabaseClient();
  if (!supabase) throw new Error("Supabase auth is not configured.");
  const { error } = await supabase.auth.updateUser({ password });
  if (error) throw error;
}
