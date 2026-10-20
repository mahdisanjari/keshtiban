"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { toFa } from "@/lib/fa";

/** شمارش نرم تا مقدار نهایی با ارقام فارسی. متن نهایی در HTML سرور وجود دارد (SEO و بدون JS). */
export function CountUp({ to, duration = 1.4 }: { to: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduce = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!inView || reduce || !node) return;
    const controls = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        node.textContent = toFa(Math.round(v));
      },
    });
    return () => controls.stop();
  }, [inView, reduce, to, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {toFa(to)}
    </span>
  );
}
