import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import * as api from "./api/client";
import { clearTokens } from "./api/http";
import type { UserProfile } from "./api/types";
import { getAuthMode, isCustomAuthEnabled, isSupabaseAuthEnabled } from "./auth-config";
import {
  getSupabaseClient,
  signInWithEmailSupabase,
  signInWithGoogleRedirect,
  signOutSupabase,
  signUpWithEmailSupabase,
  waitForSupabaseSession,
} from "./supabase";

interface AuthContextValue {
  profile: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  supabaseReady: boolean;
  syncError: string | null;
  signIn: (email: string, password: string) => Promise<api.AuthResult>;
  signUp: (
    email: string,
    password: string,
    fullName: string,
  ) => Promise<api.AuthResult>;
  signInWithGoogle: (returnPath?: string) => Promise<void>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
  setProfile: (p: UserProfile | null) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function loadProfileFromSupabaseSession(): Promise<UserProfile | null> {
  try {
    const synced = await api.syncSupabaseSession();
    if (synced) return synced;
  } catch {
    // Fall back to the saved local profile when sync is unnecessary or fails.
  }
  return api.getCurrentProfile();
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [supabaseReady, setSupabaseReady] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setSyncError(null);

    if (isSupabaseAuthEnabled()) {
      const client = await getSupabaseClient();
      if (!client) {
        setProfile(null);
        setLoading(false);
        return;
      }

      const session = await waitForSupabaseSession(client);
      if (session) {
        try {
          const nextProfile = await loadProfileFromSupabaseSession();
          setProfile(nextProfile);
          if (!nextProfile) {
            setSyncError("Unable to restore your account session.");
          }
        } catch (err) {
          setSyncError(err instanceof Error ? err.message : "Account sync failed.");
          setProfile(null);
        }
        setLoading(false);
        return;
      }
    }

    const p = await api.getCurrentProfile();
    setProfile(p);
    setLoading(false);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      if (isSupabaseAuthEnabled()) {
        const client = await getSupabaseClient();
        if (cancelled) return;
        setSupabaseReady(!!client);

        if (client) {
          const session = await waitForSupabaseSession(client);
          if (cancelled) return;

          if (session) {
            try {
              const nextProfile = await loadProfileFromSupabaseSession();
              if (!cancelled) {
                setProfile(nextProfile);
                if (!nextProfile) {
                  setSyncError("Unable to restore your account session.");
                }
              }
            } catch (err) {
              if (!cancelled) {
                setSyncError(err instanceof Error ? err.message : "Account sync failed.");
              }
            }
            if (!cancelled) setLoading(false);
            return;
          }
        }
      }

      if (!cancelled) {
        const p = await api.getCurrentProfile();
        setProfile(p);
        setLoading(false);
      }
    }

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isSupabaseAuthEnabled()) return;

    let unsubscribe: (() => void) | undefined;

    void getSupabaseClient().then((client) => {
      if (!client) return;
      const { data } = client.auth.onAuthStateChange(async (event, session) => {
        if (event === "SIGNED_OUT") {
          setProfile(null);
          setLoading(false);
          return;
        }

        if (!session) return;

        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          try {
            setSyncError(null);
            const nextProfile = await loadProfileFromSupabaseSession();
            setProfile(nextProfile);
          } catch (err) {
            setSyncError(err instanceof Error ? err.message : "Account sync failed.");
          } finally {
            setLoading(false);
          }
        }
      });
      unsubscribe = () => data.subscription.unsubscribe();
    });

    return () => unsubscribe?.();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    if (getAuthMode() === "supabase") {
      try {
        await signInWithEmailSupabase(email, password);
        const synced = await api.syncSupabaseSession();
        if (synced) setProfile(synced);
        return {
          user: synced ? { id: synced.id, email: synced.email } : null,
          profile: synced,
          error: synced ? null : "Sign in failed",
        };
      } catch (err) {
        return {
          user: null,
          profile: null,
          error: err instanceof Error ? err.message : "Sign in failed",
        };
      }
    }

    const res = await api.signIn(email, password);
    if (res.profile) setProfile(res.profile);
    return res;
  }, []);

  const signUp = useCallback(
    async (email: string, password: string, fullName: string) => {
      if (getAuthMode() === "supabase") {
        try {
          const session = await signUpWithEmailSupabase(email, password, fullName);
          if (!session) {
            return {
              user: null,
              profile: null,
              error: null,
              needsEmailConfirmation: true,
            };
          }
          const synced = await api.syncSupabaseSession();
          if (synced) setProfile(synced);
          return {
            user: synced ? { id: synced.id, email: synced.email } : null,
            profile: synced,
            error: synced ? null : "Sign up failed",
          };
        } catch (err) {
          return {
            user: null,
            profile: null,
            error: err instanceof Error ? err.message : "Sign up failed",
          };
        }
      }

      const res = await api.signUp(email, password, fullName);
      if (res.profile) setProfile(res.profile);
      return res;
    },
    [],
  );

  const signInWithGoogle = useCallback(async (returnPath?: string) => {
    const path = returnPath ?? "/connexion";
    const redirectTo = path.startsWith("http")
      ? path
      : `${window.location.origin}${path.startsWith("/") ? path : `/${path}`}`;
    await signInWithGoogleRedirect(redirectTo);
  }, []);

  const signOut = useCallback(async () => {
    try {
      if (isSupabaseAuthEnabled()) {
        await signOutSupabase();
      }
      if (isCustomAuthEnabled()) {
        await api.signOut();
        return;
      }
    } finally {
      clearTokens();
      setProfile(null);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      profile,
      loading,
      isAuthenticated: !!profile,
      isAdmin: profile?.role === "admin",
      isSuperAdmin: profile?.is_super_admin === true,
      supabaseReady,
      syncError,
      signIn,
      signUp,
      signInWithGoogle,
      signOut,
      refresh,
      setProfile,
    }),
    [profile, loading, supabaseReady, syncError, signIn, signUp, signInWithGoogle, signOut, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
