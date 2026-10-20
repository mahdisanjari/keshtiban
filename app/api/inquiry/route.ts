import { validateInquiry, type InquiryPayload } from "@/lib/validation";

/**
 * دریافت درخواست استعلام.
 *
 * محل اتصال به سرویس ایمیل/CRM: متغیر محیطی INQUIRY_WEBHOOK_URL.
 * درخواست اعتبارسنجی‌شده به‌صورت JSON (POST) به آن آدرس فوروارد می‌شود
 * (n8n، Make، Zapier، یا endpoint ارسال ایمیل خودتان).
 * اگر تنظیم نشده باشد، پاسخ 501 برمی‌گردد و فرم هرگز «ارسال موفق» جعلی نشان نمی‌دهد.
 *
 * برای اتصال مستقیم به SMTP/Resend/… می‌توانید بخش «forward» را با ارسال ایمیل جایگزین کنید.
 */

const MAX_BODY_BYTES = 20_000;

function json(body: Record<string, unknown>, status: number) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(request: Request) {
  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return json({ ok: false, code: "too_large", message: "حجم درخواست بیش از حد مجاز است." }, 413);
  }

  let data: Partial<InquiryPayload>;
  try {
    data = JSON.parse(raw) as Partial<InquiryPayload>;
  } catch {
    return json({ ok: false, code: "bad_json", message: "قالب درخواست نامعتبر است." }, 400);
  }

  // honeypot: ربات‌ها فیلد مخفی را پر می‌کنند؛ بی‌صدا نادیده می‌گیریم
  if (typeof data.website === "string" && data.website.trim() !== "") {
    return json({ ok: true }, 200);
  }

  const fields = {
    name: String(data.name ?? ""),
    company: String(data.company ?? ""),
    phone: String(data.phone ?? ""),
    email: String(data.email ?? ""),
    port: String(data.port ?? ""),
    category: String(data.category ?? ""),
    message: String(data.message ?? ""),
  };

  const errors = validateInquiry(fields);
  if (Object.keys(errors).length > 0) {
    return json({ ok: false, code: "invalid", errors }, 422);
  }

  const webhook = process.env.INQUIRY_WEBHOOK_URL;
  if (!webhook) {
    return json(
      {
        ok: false,
        code: "not_configured",
        message: "سرویس دریافت آنلاین درخواست هنوز فعال نشده است.",
      },
      501,
    );
  }

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.INQUIRY_WEBHOOK_TOKEN
          ? { Authorization: `Bearer ${process.env.INQUIRY_WEBHOOK_TOKEN}` }
          : {}),
      },
      body: JSON.stringify({
        source: "kashtiban-landing",
        receivedAt: new Date().toISOString(),
        ...fields,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) throw new Error(`webhook responded ${res.status}`);
    return json({ ok: true }, 200);
  } catch (error) {
    console.error("[inquiry] forward failed:", error);
    return json(
      { ok: false, code: "upstream", message: "ارسال درخواست با خطا مواجه شد." },
      502,
    );
  }
}
