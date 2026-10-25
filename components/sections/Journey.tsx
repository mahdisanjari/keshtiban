"use client";

import { Check } from "lucide-react";
import { useMotionValueEvent, useReducedMotion, useScroll, useSpring } from "motion/react";
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { JourneyScene } from "@/components/sections/JourneyScene";
import { toFa } from "@/lib/fa";

type Step = { title: string; text: string };

/** بازه‌ی نمایش هر مرحله از پیشرفت اسکرول (۰ تا ۱) */
const ranges: [number, number][] = [
  [-1, 0.235],
  [0.265, 0.485],
  [0.515, 0.715],
  [0.745, 1.2],
];
const stepLabels = ["درخواست", "بررسی", "پیشنهاد", "تحویل"];
const chipLabels = ["روغن و روان‌کننده", "رنگ و پوشش", "مواد شیمیایی", "آذوقه", "پوشاک و PPE", "تجهیزات ایمنی", "اقلام مصرفی"];

const vars = (o: Record<string, string | number>) => o as unknown as CSSProperties;

function Extras({ index }: { index: number }) {
  if (index === 1) {
    return (
      <ul className="mt-5 flex flex-wrap gap-2" aria-label="گروه‌های کالایی بررسی‌شده">
        {chipLabels.map((c, i) => (
          <li
            key={c}
            className="j-chip rounded-full border px-3 py-1 text-xs font-semibold text-steel-100"
            style={vars({ "--a": (0.27 + i * 0.03).toFixed(3) })}
          >
            {c}
          </li>
        ))}
      </ul>
    );
  }
  if (index === 2) {
    return (
      <div className="mt-5 w-full max-w-xs rounded-md border border-white/15 bg-white/5 p-4" aria-hidden>
        <div className="flex items-center justify-between text-xs font-semibold text-steel-200">
          <span>پیشنهاد قیمت و شرایط تأمین</span>
          <span className="j-tick grid size-5 place-items-center rounded-full bg-aqua-400 text-ink-950">
            <Check className="size-3" />
          </span>
        </div>
        <div className="mt-3 space-y-2">
          {[78, 92, 56].map((w, i) => (
            <div key={w} className="h-1.5 rounded-full bg-white/10">
              <div
                className="j-line h-full rounded-full bg-aqua-400/70"
                style={vars({ width: `${w}%`, "--a": (0.53 + i * 0.04).toFixed(3) })}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
}

function Pinned({ steps }: { steps: Step[] }) {
  const wrap = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start start", "end end"] });
  // اسکرول بومی می‌ماند؛ فقط مقدارِ نمایش‌داده‌شده با تأخیر نرم دنبالش می‌رود (مثل گردول)
  const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.4, restDelta: 0.0005 });

  useMotionValueEvent(smooth, "change", (v) => {
    stage.current?.style.setProperty("--p", Math.min(1, Math.max(0, v)).toFixed(4));
  });

  // اگر صفحه وسط اسکرول بارگذاری شد، مقدار اولیه درست باشد
  useEffect(() => {
    stage.current?.style.setProperty("--p", Math.min(1, Math.max(0, smooth.get())).toFixed(4));
  }, [smooth]);

  return (
    <div ref={wrap} className="relative h-[360svh] lg:h-[400svh]">
      <div ref={stage} className="journey sticky top-0 h-svh overflow-clip bg-ink-900 text-white">
        <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" aria-hidden />

        <div className="relative mx-auto grid h-full max-w-7xl grid-rows-[auto_minmax(0,1fr)] gap-4 px-5 pb-6 pt-24 sm:px-8 lg:grid-cols-12 lg:grid-rows-1 lg:items-center lg:gap-12 lg:pt-20">
          <div className="lg:col-span-5">
            {/* مراحل و نوار پیشرفت */}
            <div aria-hidden>
              <ol className="flex items-center gap-4">
                {stepLabels.map((label, i) => (
                  <li
                    key={label}
                    className="j-on flex items-center gap-2"
                    style={vars({ "--a": ranges[i][0], "--b": ranges[i][1] })}
                  >
                    <span className="j-on-dot grid size-7 place-items-center rounded-full border border-white/25 text-xs font-bold tabular-nums">
                      {toFa(i + 1)}
                    </span>
                    <span className="hidden text-xs font-semibold sm:inline">{label}</span>
                  </li>
                ))}
              </ol>
              <div className="mt-4 h-px w-full bg-white/10">
                <div className="j-bar h-full bg-aqua-400" />
              </div>
            </div>

            {/* فصل‌های متن */}
            <div className="relative mt-7 h-[17.5rem] sm:h-[16rem] lg:h-[21rem]">
              {steps.map((s, i) => (
                <div
                  key={s.title}
                  className="j-fade absolute inset-x-0 top-0"
                  style={vars({ "--a": ranges[i][0], "--b": ranges[i][1] })}
                >
                  <p className="text-sm font-semibold text-aqua-400">
                    مرحله‌ی {toFa(i + 1)} از {toFa(steps.length)}
                  </p>
                  <h3 className="mt-3 text-2xl font-extrabold leading-[1.5] sm:text-3xl">{s.title}</h3>
                  <p className="mt-3 max-w-md text-[0.97rem] leading-9 text-steel-300">{s.text}</p>
                  <Extras index={i} />
                </div>
              ))}
            </div>
          </div>

          <div className="relative min-h-0 lg:col-span-7">
            <JourneyScene className="absolute inset-0 size-full lg:static lg:h-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * «سفر کالا»: صحنه‌ی پین‌شده که با اسکرول جلو و عقب می‌رود.
 * برای کاربرانی که کاهش حرکت را فعال کرده‌اند، فهرست ساده‌ی مراحل (fallback) نمایش داده می‌شود.
 */
export function Journey({ steps, fallback }: { steps: Step[]; fallback: ReactNode }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{fallback}</>;
  return <Pinned steps={steps} />;
}
