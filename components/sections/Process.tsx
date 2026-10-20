import { ProcessTrack } from "@/components/sections/ProcessTrack";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/primitives";
import { processSteps } from "@/lib/content";

export function Process() {
  return (
    <section
      id="process"
      aria-labelledby="process-title"
      className="relative bg-steel-100 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            id="process-title"
            index="۰۶"
            en="How We Work"
            title="فرایند همکاری، ساده و شفاف"
            lead="از اولین پیام تا تحویل در بندر، چهار مرحله‌ی مشخص."
          />
        </Reveal>
        <ProcessTrack steps={processSteps} />
      </div>
    </section>
  );
}
