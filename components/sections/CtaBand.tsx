import { MessageCircle } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink, En } from "@/components/ui/primitives";
import { whatsappHref } from "@/lib/site";

export function CtaBand() {
  const wa = whatsappHref("سلام، می‌خواهم برای تأمین ملزومات کشتی استعلام قیمت بگیرم.");

  return (
    <section
      aria-labelledby="cta-title"
      className="relative overflow-hidden bg-sea-600 py-20 text-white sm:py-24"
    >
      {/* قوس‌های هم‌مرکز (الهام از رادار و مسیر دریایی) */}
      <svg
        aria-hidden
        viewBox="0 0 800 400"
        className="pointer-events-none absolute -start-24 top-1/2 h-[140%] -translate-y-1/2 opacity-30"
        fill="none"
        stroke="#ffffff"
        strokeWidth="1"
      >
        {[80, 140, 200, 260, 320, 380].map((r) => (
          <circle key={r} cx="0" cy="200" r={r} strokeOpacity={0.5 - r / 1000} strokeDasharray={r % 120 === 20 ? "3 8" : undefined} />
        ))}
      </svg>
      <div className="absolute inset-0 bg-linear-to-l from-ink-900/55 via-transparent to-transparent" aria-hidden />

      <div className="relative mx-auto flex max-w-7xl flex-col items-start justify-between gap-10 px-5 sm:px-8 lg:flex-row lg:items-center">
        <Reveal className="max-w-2xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.26em] text-aqua-300">
            <En>Request for Quotation</En>
          </p>
          <h2 id="cta-title" className="text-balance text-3xl font-extrabold leading-[1.5] sm:text-4xl sm:leading-[1.45]">
            فهرست نیاز کشتی را بفرستید تا پیشنهاد قیمت ارسال کنیم
          </h2>
          <p className="mt-4 text-base leading-9 text-white/80">
            لازم نیست اقلام را یک‌به‌یک انتخاب کنید؛ نیاز خود را همان‌طور که دارید بنویسید.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="flex flex-wrap items-center gap-3.5">
          <ButtonLink href="#contact" variant="dark" arrow>
            درخواست استعلام قیمت
          </ButtonLink>
          {wa && (
            <ButtonLink href={wa} target="_blank" rel="noopener noreferrer" variant="secondary">
              <MessageCircle className="size-4" aria-hidden />
              ارسال از طریق واتس‌اپ
            </ButtonLink>
          )}
        </Reveal>
      </div>
    </section>
  );
}
