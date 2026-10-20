import { Ban } from "lucide-react";
import { CountUp } from "@/components/motion/CountUp";
import { Reveal } from "@/components/motion/Reveal";
import { CornerMarks, En, SectionHeading } from "@/components/ui/primitives";
import { serviceCategories, vesselTypes } from "@/lib/content";

const particulars = [
  { k: "حوزه فعالیت", v: <En>Ship Chandlery</En> },
  { k: "مشتریان", v: "کشتی‌های تجاری" },
  { k: "پوشش", v: "بنادر شمال و جنوب ایران" },
  { k: "تمرکز", v: "بنادر خلیج فارس" },
  { k: "شیوه همکاری", v: "درخواست، پیشنهاد، تحویل" },
];

export function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="blueprint-grid-light relative bg-steel-50 py-24 sm:py-32"
    >
      <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <Reveal>
            <SectionHeading
              id="about-title"
              index="۰۱"
              en="About Kashtiban"
              title="شریک تأمین شما، در بندر و کنار کشتی"
            />
          </Reveal>

          <Reveal delay={0.08} className="mt-8 space-y-5 text-base leading-9 text-steel-600 sm:text-[1.075rem]">
            <p>
              کشتی‌بان یک شرکت ایرانی در حوزه <En>Ship Chandlery</En> است؛ یعنی
              تأمین کالاها، ملزومات مصرفی و تجهیزات ایمنی که کشتی‌های تجاری برای
              هر سفر و هر توقف در بندر به آن نیاز دارند.
            </p>
            <p>
              ما برای کشتی‌های کانتینری، نفت‌کش‌ها، کشتی‌های حمل گاز و سایر
              شناورهای تجاری در بنادر شمال و جنوب ایران، با تمرکز بیشتر بر بنادر
              خلیج فارس، فعالیت می‌کنیم. هدف ما این است که مدیر خرید و ناخدا
              بتوانند چند گروه کالایی را از یک مجموعه، با کیفیت مناسب و قیمت
              رقابتی دریافت کنند.
            </p>
          </Reveal>

          <Reveal delay={0.14} className="mt-9">
            <div className="flex gap-4 rounded-md border border-ink-900/10 bg-white p-5 sm:p-6">
              <span className="mt-1 inline-flex size-9 shrink-0 items-center justify-center rounded-md bg-ink-900/5 text-ink-700">
                <Ban className="size-[18px]" aria-hidden />
              </span>
              <div>
                <h3 className="font-bold text-ink-900">چه چیزی ارائه نمی‌شود؟</h3>
                <p className="mt-1.5 text-sm leading-8 text-steel-600 sm:text-[0.95rem]">
                  کشتی‌بان شرکت مدیریت پروژه یا تعمیرات کشتی نیست و قطعات فنی و
                  یدکی موتور و ماشین‌آلات عرضه نمی‌کند. تمرکز ما بر کالا،
                  ملزومات مصرفی و تجهیزات ایمنی است.
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-5">
          <Reveal delay={0.1}>
            <div className="relative overflow-hidden rounded-lg bg-ink-900 p-7 text-white sm:p-9">
              <CornerMarks className="border-aqua-400/50" />
              <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden />
              <div className="relative">
                <p className="flex items-center justify-between text-xs font-semibold text-aqua-400">
                  <span>مشخصات فعالیت</span>
                  <En className="uppercase tracking-[0.26em]">Particulars</En>
                </p>
                <dl className="mt-6 divide-y divide-white/10 border-y border-white/10">
                  {particulars.map((row) => (
                    <div key={row.k} className="flex items-baseline justify-between gap-6 py-3.5">
                      <dt className="text-sm text-steel-400">{row.k}</dt>
                      <dd className="text-end text-[0.95rem] font-semibold">{row.v}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-7 grid grid-cols-3 gap-4 text-center">
                  {[
                    { n: serviceCategories.length, l: "گروه کالایی" },
                    { n: vesselTypes.length, l: "نوع شناور" },
                    { n: 2, l: "حوزه ساحلی" },
                  ].map((s) => (
                    <div key={s.l}>
                      <div className="text-4xl font-extrabold text-white">
                        <CountUp to={s.n} />
                      </div>
                      <div className="mt-1 text-xs leading-6 text-steel-400">{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
