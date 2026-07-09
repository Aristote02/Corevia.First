import { useI18n, WHATSAPP_LINK } from "@/lib/i18n";
import { whatsAppIconUrl } from "@/lib/media";

export function WhatsAppButton() {
  const { t } = useI18n();
  return (
    <a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t.whatsapp}
      title={t.whatsapp}
      className="group fixed bottom-5 right-5 z-50 flex items-center gap-3"
    >
      <span className="hidden max-w-0 overflow-hidden whitespace-nowrap rounded-full bg-card/90 py-2 text-sm text-foreground opacity-0 shadow-soft backdrop-blur transition-all duration-300 group-hover:max-w-xs group-hover:px-4 group-hover:opacity-100 sm:block">
        {t.whatsapp}
      </span>
      <span className="relative flex size-14 items-center justify-center rounded-full bg-[#25D366] shadow-[0_10px_30px_-6px_rgba(37,211,102,0.6)] transition-transform group-hover:scale-105">
        <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-30" />
        <img src={whatsAppIconUrl} alt="" className="relative size-7" />
      </span>
    </a>
  );
}