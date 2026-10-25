import { ChevronDown } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/primitives";
import { faqs } from "@/lib/content";

export function Faq() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="relative bg-steel-50 py-24 sm:py-32"
    >
      <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:gap-20">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <Reveal>
              <SectionHeading
                id="faq-title"
                index="۰۸"
                en="FAQ"
                title="پرسش‌های متداول"
                lead="پاسخ کوتاه به پرسش‌های رایج درباره‌ی کالاها، مشتریان، محدوده‌ی فعالیت و نحوه‌ی ارسال درخواست."
              />
            </Reveal>
          </div>
        </div>

        <Stagger className="border-b border-ink-900/15 lg:col-span-8">
          {faqs.map((f) => (
            <StaggerItem key={f.q}>
              <details className="group border-t border-ink-900/15">
                <summary className="flex cursor-pointer items-center justify-between gap-6 py-6 text-start text-[1.05rem] font-bold leading-8 text-ink-900 transition-colors hover:text-sea-600 sm:text-lg">
                  <h3 className="text-[inherit] font-[inherit]">{f.q}</h3>
                  <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-ink-900/15 text-ink-700 transition-[transform,background-color,color,border-color] duration-300 group-open:rotate-180 group-open:border-ink-900 group-open:bg-ink-900 group-open:text-aqua-400">
                    <ChevronDown className="size-4" aria-hidden />
                  </span>
                </summary>
                <p className="max-w-3xl pb-7 pe-12 text-[0.97rem] leading-9 text-steel-600">{f.a}</p>
              </details>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
