import { Journey } from "@/components/sections/Journey";
import { ProcessTrack } from "@/components/sections/ProcessTrack";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/primitives";
import { processSteps } from "@/lib/content";

export function Process() {
  return (
    <section
      id="process"
      aria-labelledby="process-title"
      className="relative bg-steel-100"
    >
      <div className="mx-auto max-w-7xl px-5 pb-14 pt-24 sm:px-8 sm:pb-16 sm:pt-32">
        <Reveal>
          <SectionHeading
            id="process-title"
            index="۰۶"
            en="How We Work"
            title="فرایند همکاری"
            lead="از ارسال درخواست تا تحویل کالا، چهار مرحله‌ی روشن. با اسکرول، مسیر یک سفارش را دنبال کنید."
          />
        </Reveal>
      </div>

      <Journey
        steps={processSteps}
        fallback={
          <div className="mx-auto max-w-7xl px-5 pb-24 sm:px-8 sm:pb-32">
            <ProcessTrack steps={processSteps} />
          </div>
        }
      />
    </section>
  );
}
