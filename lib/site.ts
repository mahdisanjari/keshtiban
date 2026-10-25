/**
 * تنظیمات مرکزی سایت کشتی‌بان.
 * اطلاعات تماس واقعی از طریق متغیرهای محیطی (.env.local) وارد می‌شود؛
 * هیچ مقدار ساختگی در کد وجود ندارد. راهنما: فایل .env.example
 */

export const IS_DEV = process.env.NODE_ENV !== "production";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/+$/, "");

export const brand = {
  name: "کشتی‌بان",
  nameEn: "Kashtiban",
  tagline: "تأمین کالا و ملزومات کشتی‌های تجاری",
  /**
   * مسیر لوگوی رسمی (SVG یا PNG شفاف، ترجیحاً نسخه روشن/سفید برای زمینه تیره).
   * پس از قرار دادن فایل در public/brand، مقدار را مثلاً "/brand/logo.svg" کنید.
   * تا آن زمان یک wordmark متنی ساده نمایش داده می‌شود (لوگو بازطراحی نشده است).
   */
  logoSrc: null as string | null,
  /**
   * عکس سینمایی Hero (مثلاً "/images/hero.jpg"). اگر مقدار داده شود جایگزین
   * صحنه برداری پیش‌فرض می‌شود. ابعاد پیشنهادی: ۲۴۰۰×۱۳۵۰ یا بزرگ‌تر.
   */
  heroImage: null as string | null,
  heroImageAlt:
    "کشتی تجاری در حال تخلیه و بارگیری در بندر، هنگام غروب",
};

const digits = (v: string | undefined) => (v ?? "").replace(/\D/g, "");

export const contact = {
  email: (process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "").trim(),
  whatsapp: digits(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER),
  phone: (process.env.NEXT_PUBLIC_CONTACT_PHONE ?? "").trim(),
  address: (process.env.NEXT_PUBLIC_CONTACT_ADDRESS ?? "").trim(),
};

export function whatsappHref(text?: string): string | null {
  if (!contact.whatsapp) return null;
  const q = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${contact.whatsapp}${q}`;
}

export function mailtoHref(subject?: string, body?: string): string | null {
  if (!contact.email) return null;
  const params = new URLSearchParams();
  if (subject) params.set("subject", subject);
  if (body) params.set("body", body);
  const qs = params.toString().replace(/\+/g, "%20");
  return `mailto:${contact.email}${qs ? `?${qs}` : ""}`;
}

export const navItems = [
  { id: "services", label: "کالاها و خدمات" },
  { id: "about", label: "درباره ما" },
  { id: "coverage", label: "محدوده فعالیت" },
  { id: "contact", label: "تماس با ما" },
] as const;
