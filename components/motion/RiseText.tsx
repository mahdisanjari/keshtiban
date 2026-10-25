"use client";

import { useInView, useReducedMotion } from "motion/react";
import { Fragment, useRef } from "react";

/**
 * تیتر با ورود کلمه‌به‌کلمه: هر کلمه از ماسک خودش بالا می‌آید (الهام از گردول).
 * متن کامل در DOM می‌ماند؛ فقط نمایش آن با transform کنترل می‌شود (بدون layout shift).
 * @param baseDelay تأخیر شروع (میلی‌ثانیه)
 * @param step فاصله‌ی ورود دو کلمه‌ی پشت‌سرهم (میلی‌ثانیه)
 */
export function RiseText({
  text,
  className,
  baseDelay = 0,
  step = 70,
}: {
  text: string;
  className?: string;
  baseDelay?: number;
  step?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const seen = useInView(ref, { once: true, margin: "0px 0px -8% 0px" });
  const show = seen || reduce === true;

  return (
    <span ref={ref} className={className}>
      {text.split(" ").map((word, i) => (
        <Fragment key={i}>
          {i > 0 && " "}
          {/* padding منفی‌شده تا نیم‌فاصله‌ها و دنباله‌ی حروف فارسی در ماسک بریده نشود */}
          <span className="inline-block overflow-hidden py-[0.16em] -my-[0.16em] align-bottom">
            <span
              className="rise-word inline-block transition-transform duration-[950ms] ease-out-expo will-change-transform"
              style={{
                transform: show ? "translateY(0)" : "translateY(115%)",
                transitionDelay: `${baseDelay + i * step}ms`,
              }}
            >
              {word}
            </span>
          </span>
        </Fragment>
      ))}
    </span>
  );
}
