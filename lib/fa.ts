const FA = "۰۱۲۳۴۵۶۷۸۹";
const AR = "٠١٢٣٤٥٦٧٨٩";

/** اعداد لاتین را به ارقام فارسی تبدیل می‌کند. */
export function toFa(value: number | string): string {
  return String(value).replace(/\d/g, (d) => FA[Number(d)]);
}

/** ارقام فارسی و عربی را به لاتین تبدیل می‌کند (برای اعتبارسنجی و ارسال). */
export function toEn(value: string): string {
  return value
    .replace(/[۰-۹]/g, (d) => String(FA.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String(AR.indexOf(d)));
}
