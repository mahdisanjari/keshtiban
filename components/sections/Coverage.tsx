import { CoverageMap } from "@/components/sections/CoverageMap";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/primitives";

export function Coverage() {
  return (
    <section
      id="coverage"
      aria-labelledby="coverage-title"
      className="relative overflow-hidden bg-ink-900 py-24 text-white sm:py-32"
    >
      <div
        className="blueprint-grid pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            id="coverage-title"
            tone="dark"
            index="۰۵"
            en="Coverage"
            title="محدوده فعالیت: بنادر شمال و جنوب ایران"
            lead="کشتی‌بان کالا و ملزومات کشتی‌ها را در بنادر شمالی کشور در سواحل دریای خزر و در بنادر جنوبی در خلیج فارس و دریای عمان تأمین می‌کند."
          />
        </Reveal>
        <div className="mt-16">
          <CoverageMap />
        </div>
      </div>
    </section>
  );
}
