import { Check } from "lucide-react";
import { ContactChannels } from "@/components/ContactChannels";
import { Reveal } from "@/components/motion/Reveal";
import { ContactForm } from "@/components/sections/ContactForm";
import { CornerMarks, SectionHeading } from "@/components/ui/primitives";

const checklist = [
  "نام کشتی یا شرکت",
  "بندر و زمان تقریبی رسیدن (ETA)",
  "فهرست اقلام و مقدار موردنیاز",
  "مشخصات فنی یا برند موردنظر (در صورت وجود)",
];

export function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="relative bg-white py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            id="contact-title"
            index="۰۷"
            en="Request a Quotation"
            title="درخواست تأمین و استعلام قیمت"
            lead="نیاز کشتی را آزادانه شرح دهید. لازم نیست اقلام را یک‌به‌یک انتخاب کنید؛ فهرست یا توضیح کلی کافی است."
          />
        </Reveal>

        <div className="mt-14 grid gap-8 lg:grid-cols-5">
          <Reveal className="lg:col-span-3">
            <div className="rounded-lg border border-ink-900/10 bg-white p-6 shadow-[0_30px_60px_-40px_rgb(7_23_48/0.35)] sm:p-9">
              <ContactForm />
            </div>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-2">
            <aside className="relative h-full overflow-hidden rounded-lg bg-ink-900 p-7 text-white sm:p-9">
              <CornerMarks className="border-aqua-400/40" />
              <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden />
              <div className="relative">
                <h3 className="text-lg font-bold">راه‌های ارتباطی</h3>
                <div className="mt-6">
                  <ContactChannels tone="dark" />
                </div>

                <div className="mt-9 border-t border-white/10 pt-8">
                  <h3 className="text-lg font-bold">برای پیشنهاد دقیق‌تر بنویسید</h3>
                  <ul className="mt-5 space-y-3.5">
                    {checklist.map((c) => (
                      <li key={c} className="flex items-start gap-3 text-[0.93rem] leading-7 text-steel-200">
                        <span className="mt-1 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-aqua-400/15 text-aqua-400">
                          <Check className="size-3" aria-hidden />
                        </span>
                        {c}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-6 text-sm leading-8 text-steel-400">
                    فهرست اقلام را می‌توانید داخل متن درخواست بنویسید یا فایل آن را از طریق ایمیل یا واتس‌اپ بفرستید.
                  </p>
                </div>
              </div>
            </aside>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
