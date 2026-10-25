import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/primitives";
import { advantages } from "@/lib/content";
import { toFa } from "@/lib/fa";

export function WhyUs() {
  return (
    <section
      id="why"
      aria-labelledby="why-title"
      className="relative bg-white py-24 sm:py-32"
    >
      <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-12 lg:gap-20">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <Reveal>
              <SectionHeading
                id="why-title"
                index="۰۴"
                en="Why Kashtiban"
                title="مزیت همکاری با کشتی‌بان"
                lead="کشتی‌بان روی یک کار تمرکز دارد: تأمین کالا و ملزومات کشتی‌های تجاری، با پیشنهادی روشن و قابل‌اجرا."
              />
            </Reveal>
          </div>
        </div>

        <Stagger className="grid gap-x-10 gap-y-2 sm:grid-cols-2 lg:col-span-7">
          {advantages.map((a, i) => (
            <StaggerItem key={a.title}>
              <article className="group h-full border-t border-ink-900/15 py-7 transition-colors duration-500 hover:border-sea-500">
                <div className="flex items-baseline gap-4">
                  <span className="text-3xl font-extrabold tabular-nums text-steel-300 transition-colors duration-500 group-hover:text-sea-500">
                    {toFa(String(i + 1).padStart(2, "0"))}
                  </span>
                  <h3 className="text-lg font-bold leading-8 text-ink-900">{a.title}</h3>
                </div>
                <p className="mt-3 ps-[3.4rem] text-[0.93rem] leading-8 text-steel-600">{a.text}</p>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
