"use client";

import { CircleAlert, CircleCheck, LoaderCircle, Mail, MessageCircle, Send } from "lucide-react";
import { useId, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { buttonClass, cn } from "@/components/ui/primitives";
import { categoryOptions } from "@/lib/content";
import { IS_DEV, mailtoHref, whatsappHref } from "@/lib/site";
import {
  emptyInquiry,
  inquiryToText,
  validateField,
  validateInquiry,
  type FieldErrors,
  type InquiryFields,
} from "@/lib/validation";

type Status = "idle" | "submitting" | "success" | "error";

const control =
  "w-full rounded-md border bg-steel-50 px-4 py-3 text-[0.95rem] text-ink-900 transition-[border-color,background-color,box-shadow] duration-200 placeholder:text-steel-400 focus:bg-white focus:outline-none focus:ring-4";
const controlOk = "border-steel-200 focus:border-sea-500 focus:ring-sea-500/15";
const controlBad = "border-rose-500 bg-rose-50/40 focus:border-rose-500 focus:ring-rose-500/15";

function Field({
  id,
  label,
  required,
  error,
  hint,
  children,
  className,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-ink-900">
        {label}
        {required ? (
          <span className="ms-1 text-rose-600" aria-hidden>
            *
          </span>
        ) : (
          <span className="ms-2 text-xs font-normal text-steel-500">(اختیاری)</span>
        )}
      </label>
      {children}
      {hint && !error && <p id={`${id}-hint`} className="mt-1.5 text-xs text-steel-500">{hint}</p>}
      {error && (
        <p id={`${id}-err`} role="alert" className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-rose-600">
          <CircleAlert className="size-3.5 shrink-0" aria-hidden />
          {error}
        </p>
      )}
    </div>
  );
}

export function ContactForm() {
  const uid = useId();
  const fid = (k: keyof InquiryFields) => `${uid}-${k}`;

  const [values, setValues] = useState<InquiryFields>(emptyInquiry);
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof InquiryFields, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverMessage, setServerMessage] = useState("");

  const text = inquiryToText(values);
  const waHref = whatsappHref(text);
  const mailHref = mailtoHref("درخواست تأمین / استعلام قیمت", text);

  function onChange(key: keyof InquiryFields) {
    return (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const v = e.target.value;
      setValues((s) => ({ ...s, [key]: v }));
      if (touched[key]) setErrors((s) => ({ ...s, [key]: validateField(key, v) }));
    };
  }

  function onBlur(key: keyof InquiryFields) {
    return () => {
      setTouched((s) => ({ ...s, [key]: true }));
      setErrors((s) => ({ ...s, [key]: validateField(key, values[key]) }));
    };
  }

  function props(key: keyof InquiryFields) {
    const err = errors[key];
    return {
      id: fid(key),
      name: key,
      value: values[key],
      onChange: onChange(key),
      onBlur: onBlur(key),
      "aria-invalid": err ? true : undefined,
      "aria-describedby": err ? `${fid(key)}-err` : undefined,
      className: cn(control, err ? controlBad : controlOk),
    } as const;
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;

    const found = validateInquiry(values);
    setErrors(found);
    setTouched({ name: true, company: true, phone: true, email: true, port: true, category: true, message: true });
    const firstBad = (Object.keys(found) as (keyof InquiryFields)[])[0];
    if (firstBad) {
      document.getElementById(fid(firstBad))?.focus();
      return;
    }

    setStatus("submitting");
    setServerMessage("");
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, website: honeypot }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        code?: string;
        message?: string;
        errors?: FieldErrors;
      };

      if (res.ok && data.ok) {
        setStatus("success");
        setValues(emptyInquiry);
        setTouched({});
        setErrors({});
        return;
      }
      if (res.status === 422 && data.errors) {
        setErrors(data.errors);
        setStatus("idle");
        return;
      }
      setServerMessage(
        data.code === "not_configured"
          ? "ارسال آنلاین فرم هنوز فعال نشده است. لطفاً از ایمیل یا واتس‌اپ استفاده کنید."
          : (data.message ?? "ارسال درخواست انجام نشد. لطفاً دوباره تلاش کنید یا از ایمیل یا واتس‌اپ استفاده کنید."),
      );
      setStatus("error");
    } catch {
      setServerMessage("اتصال برقرار نشد. اینترنت خود را بررسی کنید و دوباره تلاش کنید.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="flex h-full min-h-[22rem] flex-col items-center justify-center rounded-lg border border-emerald-600/20 bg-emerald-50 p-8 text-center">
        <span className="inline-flex size-14 items-center justify-center rounded-full bg-emerald-600 text-white">
          <CircleCheck className="size-7" aria-hidden />
        </span>
        <h3 className="mt-5 text-xl font-bold text-ink-900">درخواست شما ارسال شد</h3>
        <p className="mt-2 max-w-sm text-sm leading-8 text-steel-600">
          درخواست دریافت شد و بررسی می‌شود. در صورت نیاز به اطلاعات تکمیلی، از طریق شماره یا ایمیلی که وارد کرده‌اید با شما تماس می‌گیریم.
        </p>
        <button type="button" onClick={() => setStatus("idle")} className={cn(buttonClass("ghost-light"), "mt-6")}>
          ثبت درخواست جدید
        </button>
      </div>
    );
  }

  const busy = status === "submitting";
  const hasChannels = Boolean(waHref || mailHref);

  return (
    <form onSubmit={onSubmit} noValidate aria-busy={busy} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id={fid("name")} label="نام و نام خانوادگی" required error={errors.name}>
          <input type="text" autoComplete="name" {...props("name")} />
        </Field>
        <Field id={fid("company")} label="نام شرکت یا کشتی" required error={errors.company}>
          <input type="text" autoComplete="organization" {...props("company")} />
        </Field>
        <Field id={fid("phone")} label="شماره تماس" required error={errors.phone} hint="ترجیحاً همراه با کد کشور">
          <input type="tel" inputMode="tel" autoComplete="tel" dir="ltr" {...props("phone")} className={cn(props("phone").className, "text-right")} />
        </Field>
        <Field id={fid("email")} label="ایمیل" error={errors.email}>
          <input type="email" inputMode="email" autoComplete="email" dir="ltr" {...props("email")} className={cn(props("email").className, "text-right")} />
        </Field>
        <Field
          id={fid("port")}
          label="بندر یا محل تحویل"
          required
          error={errors.port}
          hint="نام بندر؛ در صورت اطلاع، زمان تقریبی رسیدن کشتی (ETA) را هم در شرح درخواست بنویسید."
        >
          <input type="text" {...props("port")} />
        </Field>
        <Field id={fid("category")} label="گروه کالایی" required error={errors.category}>
          <select {...props("category")}>
            <option value="">انتخاب کنید…</option>
            {categoryOptions.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </Field>
      </div>

      <Field
        id={fid("message")}
        label="شرح درخواست"
        required
        error={errors.message}
        hint="اقلام و مقدار موردنیاز، مشخصات یا برند موردنظر و هر توضیح دیگر را بنویسید."
      >
        <textarea rows={6} {...props("message")} className={cn(props("message").className, "resize-y leading-8")} />
      </Field>

      {/* honeypot — برای کاربران و صفحه‌خوان‌ها نامرئی */}
      <div aria-hidden className="sr-only">
        <label>
          وب‌سایت
          <input type="text" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
        </label>
      </div>

      <div aria-live="polite">
        {status === "error" && (
          <div role="alert" className="flex gap-3 rounded-md border border-rose-500/30 bg-rose-50 p-4 text-sm leading-7 text-rose-800">
            <CircleAlert className="mt-1 size-4 shrink-0" aria-hidden />
            <p>{serverMessage}</p>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3.5 pt-1">
        <button type="submit" disabled={busy} className={buttonClass("dark", "min-w-44")}>
          <span className="inline-flex items-center gap-2.5">
            {busy ? <LoaderCircle className="size-4 animate-spin" aria-hidden /> : <Send className="size-4 -scale-x-100" aria-hidden />}
            {busy ? "در حال ارسال…" : "ارسال درخواست"}
          </span>
        </button>

        {waHref && (
          <a href={waHref} target="_blank" rel="noopener noreferrer" className={buttonClass("ghost-light")}>
            <MessageCircle className="size-4" aria-hidden />
            ارسال با واتس‌اپ
          </a>
        )}
        {mailHref && (
          <a href={mailHref} className={buttonClass("ghost-light")}>
            <Mail className="size-4" aria-hidden />
            ارسال با ایمیل
          </a>
        )}
      </div>

      {!hasChannels && IS_DEV && (
        <p className="rounded-md border border-dashed border-amber-500/50 bg-amber-50 p-3 text-xs leading-7 text-amber-800">
          (فقط در حالت توسعه) دکمه‌های واتس‌اپ و ایمیل تا زمانی که{" "}
          <span dir="ltr" lang="en" className="font-mono">NEXT_PUBLIC_WHATSAPP_NUMBER</span> و{" "}
          <span dir="ltr" lang="en" className="font-mono">NEXT_PUBLIC_CONTACT_EMAIL</span> در{" "}
          <span dir="ltr" lang="en" className="font-mono">.env.local</span> تنظیم نشوند نمایش داده نمی‌شوند.
        </p>
      )}
    </form>
  );
}
