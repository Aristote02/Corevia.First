import { useEffect, useState } from "react";
import { Loader2, Shield, User, Trash2, Crown } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { listUsers, setUserRole, deleteUser } from "@/lib/api/client";
import type { UserProfile } from "@/lib/api/types";

export function AdminUsers() {
  const { lang } = useI18n();
  const fr = lang === "fr";
  const [items, setItems] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    setItems(await listUsers());
    setLoading(false);
  };
  useEffect(() => {
    load();
  }, []);

  const toggleRole = async (u: UserProfile) => {
    await setUserRole(u.id, u.role === "admin" ? "client" : "admin");
    load();
  };
  const remove = async (id: string) => {
    if (!confirm(fr ? "Supprimer cet utilisateur ?" : "Delete this user?")) return;
    await deleteUser(id);
    load();
  };

  if (loading)
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="size-8 animate-spin text-gold" />
      </div>
    );

  return (
    <div className="overflow-hidden rounded-xl border border-border/60 bg-card">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-border/60 text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="px-5 py-3">{fr ? "Utilisateur" : "User"}</th>
            <th className="px-5 py-3">{fr ? "Rôle" : "Role"}</th>
            <th className="hidden px-5 py-3 sm:table-cell">{fr ? "Pays" : "Country"}</th>
            <th className="px-5 py-3 text-right">{fr ? "Actions" : "Actions"}</th>
          </tr>
        </thead>
        <tbody>
          {items.map((u) => (
            <tr key={u.id} className="border-b border-border/40 last:border-0">
              <td className="px-5 py-4">
                <div className="font-medium text-foreground">{u.full_name}</div>
                <div className="text-xs text-muted-foreground">{u.email}</div>
              </td>
              <td className="px-5 py-4">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                    u.role === "admin"
                      ? "bg-gold/15 text-gold"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {u.is_super_admin ? (
                    <Crown className="size-3.5" />
                  ) : u.role === "admin" ? (
                    <Shield className="size-3.5" />
                  ) : (
                    <User className="size-3.5" />
                  )}
                  {u.is_super_admin ? "super admin" : u.role}
                </span>
              </td>
              <td className="hidden px-5 py-4 text-muted-foreground sm:table-cell">
                {u.country ?? "—"}
              </td>
              <td className="px-5 py-4">
                <div className="flex justify-end gap-2">
                  {!u.is_super_admin && (
                    <>
                      <button
                        onClick={() => toggleRole(u)}
                        className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent"
                      >
                        {u.role === "admin"
                          ? fr
                            ? "Rétrograder"
                            : "Demote"
                          : fr
                            ? "Promouvoir admin"
                            : "Make admin"}
                      </button>
                      <button
                        onClick={() => remove(u.id)}
                        className="rounded-lg border border-destructive/50 p-1.5 text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}