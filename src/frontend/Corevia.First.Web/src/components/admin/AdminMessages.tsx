import { useEffect, useState } from "react";
import { Loader2, Mail, MailOpen, Trash2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import {
  listMessages,
  markMessageRead,
  deleteMessage,
} from "@/lib/api/client";
import type { ContactMessage } from "@/lib/api/types";

export function AdminMessages() {
  const { lang } = useI18n();
  const fr = lang === "fr";
  const [items, setItems] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    setItems(await listMessages());
    setLoading(false);
  };
  useEffect(() => {
    load();
  }, []);

  const toggleRead = async (m: ContactMessage) => {
    await markMessageRead(m.id, !m.is_read);
    load();
  };
  const remove = async (id: string) => {
    if (!confirm(fr ? "Supprimer ce message ?" : "Delete this message?")) return;
    await deleteMessage(id);
    load();
  };

  if (loading)
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="size-8 animate-spin text-gold" />
      </div>
    );

  return (
    <div className="space-y-3">
      {items.length === 0 && (
        <p className="py-10 text-center text-muted-foreground">
          {fr ? "Aucun message." : "No messages."}
        </p>
      )}
      {items.map((m) => (
        <div
          key={m.id}
          className={`rounded-xl border bg-card p-5 ${
            m.is_read ? "border-border/60" : "border-gold/40"
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium text-foreground">{m.full_name}</span>
                {!m.is_read && (
                  <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[0.65rem] font-semibold uppercase text-gold">
                    {fr ? "Nouveau" : "New"}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {m.email}
                {m.phone ? ` · ${m.phone}` : ""}
              </p>
              {m.subject && (
                <p className="mt-2 text-sm font-medium text-foreground">
                  {m.subject}
                </p>
              )}
              <p className="mt-1 text-sm text-muted-foreground">{m.message}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                {new Date(m.created_at).toLocaleString()}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                onClick={() => toggleRead(m)}
                title={m.is_read ? (fr ? "Marquer non lu" : "Mark unread") : fr ? "Marquer lu" : "Mark read"}
                className="rounded-lg border border-border p-2 text-muted-foreground hover:text-foreground"
              >
                {m.is_read ? (
                  <Mail className="size-4" />
                ) : (
                  <MailOpen className="size-4" />
                )}
              </button>
              <button
                onClick={() => remove(m.id)}
                className="rounded-lg border border-destructive/50 p-2 text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}