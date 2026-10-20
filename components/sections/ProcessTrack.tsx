"use client";

import { motion, useReducedMotion } from "motion/react";
import { toFa } from "@/lib/fa";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function ProcessTrack({ steps }: { steps: { title: string; text: string }[] }) {
  const reduce = useReducedMotion();

  return (
    <div className="relative mt-16">
      {/* خط اتصال — دسکتاپ: افقی از راست به چپ؛ موبایل: عمودی */}
      <div aria-hidden className="absolute start-[1.65rem] top-0 h-full w-px bg-ink-900/10 lg:start-0 lg:top-[1.65rem] lg:h-px lg:w-[calc(75%+3.15rem)]" />
      <motion.div
        aria-hidden
        className="absolute start-[1.65rem] top-0 h-full w-px origin-top bg-sea-500 lg:start-0 lg:top-[1.65rem] lg:h-px lg:w-[calc(75%+3.15rem)] lg:origin-right"
        initial={reduce ? false : { scaleY: 0, scaleX: 0 }}
        whileInView={{ scaleY: 1, scaleX: 1 }}
        viewport={{ once: true, margin: "0px 0px -20% 0px" }}
        transition={{ duration: 1.6, ease: EASE }}
      />

      <ol className="relative grid gap-10 lg:grid-cols-4 lg:gap-8">
        {steps.map((s, i) => (
          <motion.li
            key={s.title}
            className="group relative flex gap-5 lg:block"
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -12% 0px" }}
            transition={{ duration: 0.8, delay: 0.15 + i * 0.14, ease: EASE }}
          >
            <span className="relative z-10 inline-flex size-[3.3rem] shrink-0 items-center justify-center rounded-full border border-ink-900/15 bg-white text-lg font-extrabold tabular-nums text-ink-900 transition-colors duration-500 group-hover:border-ink-900 group-hover:bg-ink-900 group-hover:text-aqua-400">
              {toFa(i + 1)}
            </span>
            <div className="lg:mt-7">
              <h3 className="text-lg font-bold leading-8 text-ink-900">{s.title}</h3>
              <p className="mt-2 text-[0.93rem] leading-8 text-steel-600">{s.text}</p>
            </div>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
