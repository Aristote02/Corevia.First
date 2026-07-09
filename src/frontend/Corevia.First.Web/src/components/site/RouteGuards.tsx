import { useEffect, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";

function FullScreenLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Loader2 className="size-8 animate-spin text-gold" />
    </div>
  );
}

/** Requires an authenticated user; redirects to /connexion otherwise. */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate({ to: "/connexion", search: { redirect: location.pathname } });
    }
  }, [loading, isAuthenticated, navigate]);

  if (loading) return <FullScreenLoader />;
  if (!isAuthenticated) return <FullScreenLoader />;
  return <>{children}</>;
}

/** Requires an admin user; redirects otherwise. */
export function AdminRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      navigate({ to: "/connexion", search: { redirect: "/admin/dashboard" } });
    } else if (!isAdmin) {
      navigate({ to: "/" });
    }
  }, [loading, isAuthenticated, isAdmin, navigate]);

  if (loading) return <FullScreenLoader />;
  if (!isAuthenticated || !isAdmin) return <FullScreenLoader />;
  return <>{children}</>;
}