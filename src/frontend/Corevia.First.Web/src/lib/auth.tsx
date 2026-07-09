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
import { isCustomAuthEnabled, isSupabaseAuthEnabled } from "./auth-config";
import { getSupabaseClient, signOutSupabase } from "./supabase";

interface AuthContextValue {
  profile: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  supabaseReady: boolean;
  signIn: (email: string, password: string) => Promise<api.AuthResult>;
  signUp: (
    email: string,
    password: string,
    fullName: string,
  ) => Promise<api.AuthResult>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
  setProfile: (p: UserProfile | null) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [supabaseReady, setSupabaseReady] = useState(false);

  const refresh = useCallback(async () => {
    if (isSupabaseAuthEnabled()) {
      const synced = await api.syncSupabaseSession();
      if (synced) {
        setProfile(synced);
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
        if (!cancelled) setSupabaseReady(!!client);
      }
      await refresh();
    }

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, [refresh]);

  useEffect(() => {
    if (!isSupabaseAuthEnabled()) return;

    let unsubscribe: (() => void) | undefined;

    void getSupabaseClient().then((client) => {
      if (!client) return;
      const { data } = client.auth.onAuthStateChange(async (event, session) => {
        if (event === "SIGNED_OUT") {
          setProfile(null);
          return;
        }
        if (session && (event === "SIGNED_IN" || event === "TOKEN_REFRESHED")) {
          const synced = await api.syncSupabaseSession();
          if (synced) setProfile(synced);
        }
      });
      unsubscribe = () => data.subscription.unsubscribe();
    });

    return () => unsubscribe?.();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const res = await api.signIn(email, password);
    if (res.profile) setProfile(res.profile);
    return res;
  }, []);

  const signUp = useCallback(
    async (email: string, password: string, fullName: string) => {
      const res = await api.signUp(email, password, fullName);
      if (res.profile) setProfile(res.profile);
      return res;
    },
    [],
  );

  const signInWithGoogle = useCallback(async () => {
    const client = await getSupabaseClient();
    if (!client) throw new Error("Supabase auth is not configured.");
    const redirectTo = `${window.location.origin}/connexion`;
    const { error } = await client.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
    if (error) throw error;
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
      signIn,
      signUp,
      signInWithGoogle,
      signOut,
      refresh,
      setProfile,
    }),
    [profile, loading, supabaseReady, signIn, signUp, signInWithGoogle, signOut, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
