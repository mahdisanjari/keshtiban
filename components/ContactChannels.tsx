import { Mail, MapPin, MessageCircle, Phone, type LucideIcon } from "lucide-react";
import { IS_DEV, contact, mailtoHref, whatsappHref } from "@/lib/site";
import { cn } from "@/components/ui/primitives";

type Row = {
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
  ltr?: boolean;
  env: string;
};

function rows(): Row[] {
  const wa = whatsappHref();
  const mail = mailtoHref();
  return [
    {
      icon: Mail,
      label: "ایمیل",
      value: contact.email,
      href: mail ?? undefined,
      ltr: true,
      env: "NEXT_PUBLIC_CONTACT_EMAIL",
    },
    {
      icon: MessageCircle,
      label: "واتس‌اپ",
      value: contact.whatsapp ? `+${contact.whatsapp}` : "",
      href: wa ?? undefined,
      ltr: true,
      env: "NEXT_PUBLIC_WHATSAPP_NUMBER",
    },
    {
      icon: Phone,
      label: "تلفن",
      value: contact.phone,
      href: contact.phone ? `tel:${contact.phone.replace(/[^\d+]/g, "")}` : undefined,
      ltr: true,
      env: "NEXT_PUBLIC_CONTACT_PHONE",
    },
    {
      icon: MapPin,
      label: "نشانی",
      value: contact.address,
      env: "NEXT_PUBLIC_CONTACT_ADDRESS",
    },
  ];
}

/**
 * کانال‌های تماس واقعی (از .env). مقدار تنظیم‌نشده در محیط توسعه با placeholder مشخص
 * نمایش داده می‌شود و در محیط production پنهان است؛ هیچ اطلاعات ساختگی‌ای نمایش داده نمی‌شود.
 */
export function ContactChannels({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const dark = tone === "dark";
  const all = rows();
  const visible = all.filter((r) => r.value || IS_DEV);
  const configured = all.some((r) => r.value);

  return (
    <ul className="space-y-4">
      {visible.map((r) => {
        const Icon = r.icon;
        const empty = !r.value;
        const content = (
          <>
            <span
              className={cn(
                "mt-0.5 inline-flex size-10 shrink-0 items-center justify-center rounded-md border",
                dark ? "border-white/15 text-aqua-400" : "border-ink-900/15 text-sea-600",
                empty && "border-dashed opacity-70",
              )}
            >
              <Icon className="size-[18px]" aria-hidden />
            </span>
            <span className="min-w-0">
              <span className={cn("block text-xs", dark ? "text-steel-400" : "text-steel-500")}>{r.label}</span>
              {empty ? (
                <span className="block text-sm text-amber-300/90">
                  تنظیم نشده · <span dir="ltr" lang="en" className="inline-block font-mono text-xs">{r.env}</span>
                </span>
              ) : (
                <span
                  dir={r.ltr ? "ltr" : undefined}
                  className={cn("block break-words font-semibold", r.ltr && "text-right")}
                >
                  {r.value}
                </span>
              )}
            </span>
          </>
        );
        return (
          <li key={r.label}>
            {r.href && !empty ? (
              <a
                href={r.href}
                target={r.label === "واتس‌اپ" ? "_blank" : undefined}
                rel={r.label === "واتس‌اپ" ? "noopener noreferrer" : undefined}
                className="flex items-start gap-4 transition-opacity hover:opacity-80"
              >
                {content}
              </a>
            ) : (
              <div className="flex items-start gap-4">{content}</div>
            )}
          </li>
        );
      })}
      {!configured && !IS_DEV && (
        <li className={cn("text-sm leading-8", dark ? "text-steel-300" : "text-steel-600")}>
          برای ارتباط با کشتی‌بان، فرم استعلام را تکمیل کنید.
        </li>
      )}
    </ul>
  );
}
