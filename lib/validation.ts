import { toEn } from "./fa";

export type InquiryFields = {
  name: string;
  company: string;
  phone: string;
  email: string;
  port: string;
  category: string;
  message: string;
};

export type InquiryPayload = InquiryFields & {
  /** honeypot — باید خالی بماند */
  website: string;
};

export type FieldErrors = Partial<Record<keyof InquiryFields, string>>;

export const emptyInquiry: InquiryFields = {
  name: "",
  company: "",
  phone: "",
  email: "",
  port: "",
  category: "",
  message: "",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function normalizePhone(value: string): string {
  return toEn(value).replace(/[\s\-().]/g, "");
}

export function validateField(
  key: keyof InquiryFields,
  raw: string,
): string | undefined {
  const value = raw.trim();
  switch (key) {
    case "name":
      if (!value) return "نام و نام خانوادگی را وارد کنید.";
      if (value.length < 3) return "نام واردشده بسیار کوتاه است.";
      if (value.length > 80) return "نام واردشده بیش از حد طولانی است.";
      return;
    case "company":
      if (!value) return "نام شرکت یا کشتی را وارد کنید.";
      if (value.length < 2) return "نام واردشده بسیار کوتاه است.";
      if (value.length > 120) return "متن واردشده بیش از حد طولانی است.";
      return;
    case "phone": {
      if (!value) return "شماره تماس را وارد کنید.";
      const p = normalizePhone(value);
      if (!/^\+?\d{7,15}$/.test(p)) return "شماره تماس معتبر نیست (۷ تا ۱۵ رقم).";
      return;
    }
    case "email":
      if (!value) return; // اختیاری
      if (value.length > 160 || !EMAIL_RE.test(value)) return "نشانی ایمیل معتبر نیست.";
      return;
    case "port":
      if (!value) return "بندر یا محل تحویل را وارد کنید.";
      if (value.length < 2) return "نام واردشده بسیار کوتاه است.";
      if (value.length > 120) return "متن واردشده بیش از حد طولانی است.";
      return;
    case "category":
      if (!value) return "گروه کالایی را انتخاب کنید.";
      return;
    case "message":
      if (!value) return "نیاز خود را شرح دهید.";
      if (value.length < 10) return "لطفاً کمی بیشتر توضیح دهید (حداقل ۱۰ نویسه).";
      if (value.length > 4000) return "متن درخواست بیش از ۴۰۰۰ نویسه است.";
      return;
  }
}

export function validateInquiry(fields: InquiryFields): FieldErrors {
  const errors: FieldErrors = {};
  (Object.keys(emptyInquiry) as (keyof InquiryFields)[]).forEach((key) => {
    const err = validateField(key, fields[key] ?? "");
    if (err) errors[key] = err;
  });
  return errors;
}

/** متن آماده برای ایمیل و واتس‌اپ */
export function inquiryToText(f: InquiryFields): string {
  const details = [
    f.name && `نام: ${f.name}`,
    f.company && `شرکت یا کشتی: ${f.company}`,
    f.port && `بندر / محل تحویل: ${f.port}`,
    f.category && `گروه کالایی: ${f.category}`,
    f.phone && `تلفن: ${f.phone}`,
    f.email && `ایمیل: ${f.email}`,
  ].filter(Boolean);
  const parts = ["درخواست تأمین / استعلام قیمت", details.join("\n")];
  if (f.message) parts.push(`شرح درخواست:\n${f.message}`);
  return parts.join("\n\n");
}
