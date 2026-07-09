import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function MinskClock({ className = "" }: { className?: string }) {
  const { lang } = useI18n();
  const fr = lang === "fr";
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date().toLocaleTimeString(fr ? "fr-FR" : "en-GB", {
        timeZone: "Europe/Minsk",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
      setTime(now);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [fr]);

  if (!time) return null;

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border border-gold/30 bg-card px-4 py-2 ${className}`}
    >
      <Clock className="size-4 text-gold" />
      <span className="text-sm text-muted-foreground">
        {fr ? "Heure de Minsk" : "Minsk time"}
      </span>
      <span className="font-mono text-sm font-semibold tabular-nums text-foreground">
        {time}
      </span>
    </div>
  );
}