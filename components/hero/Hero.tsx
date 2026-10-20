"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import { brand } from "@/lib/site";
import { useMediaQuery } from "@/components/motion/hooks";
import { ButtonLink, En } from "@/components/ui/primitives";
import { SceneBack, SceneFront } from "./HeroScene";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const stack: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};
const rise: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
};

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const wide = useMediaQuery("(min-width: 1024px)");
  const parallax = wide && !reduce;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const yBack = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const yFront = useTransform(scrollYProgress, [0, 1], [0, 36]);

  return (
    <section
      id="top"
      ref={ref}
      aria-labelledby="hero-title"
      className="relative isolate min-h-svh overflow-hidden bg-ink-950 text-white"
    >
      {/* ───── صحنه ───── */}
      <div className="absolute inset-x-0 bottom-0 h-[54%] xl:inset-0 xl:h-auto">
        {brand.heroImage ? (
          <Image
            src={brand.heroImage}
            alt={brand.heroImageAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <>
            <motion.div
              className="absolute inset-0 will-change-transform"
              style={parallax ? { y: yBack } : undefined}
              initial={reduce ? false : { opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 2.2, ease: EASE }}
            >
              <SceneBack />
            </motion.div>
            <motion.div
              className="absolute inset-0 will-change-transform"
              style={parallax ? { y: yFront } : undefined}
              initial={reduce ? false : { opacity: 0, x: 90 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 2.6, delay: 0.25, ease: EASE }}
            >
              <SceneFront />
            </motion.div>
          </>
        )}
      </div>

      {/* ───── لایه‌های خوانایی ───── */}
      <div
        aria-hidden
        className="blueprint-grid pointer-events-none absolute inset-0 opacity-50 [mask-image:linear-gradient(to_bottom,black,transparent_65%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[72%] bg-linear-to-b from-ink-950 via-ink-950/70 to-transparent xl:hidden"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden bg-linear-to-l from-ink-950/90 via-ink-950/45 via-50% to-transparent to-78% xl:block"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-linear-to-b from-ink-950/80 to-transparent"
      />

      {/* ───── محتوا ───── */}
      <div className="relative z-10 mx-auto flex min-h-svh max-w-7xl items-start px-5 pb-[46svh] pt-32 sm:px-8 sm:pt-40 xl:items-center xl:pb-24 xl:pt-32">
        <motion.div
          className="max-w-2xl xl:w-[52%]"
          variants={stack}
          initial={reduce ? false : "hidden"}
          animate="show"
        >
          <motion.p variants={rise}>
            <span className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold text-steel-200">
              <span className="relative flex size-2" aria-hidden>
                <span className="absolute inline-flex size-full animate-ping-soft rounded-full bg-aqua-400" />
                <span className="relative inline-flex size-2 rounded-full bg-aqua-400" />
              </span>
              <En className="uppercase tracking-[0.18em]">Ship Chandlery · Marine Supplier Iran</En>
            </span>
          </motion.p>

          <h1
            id="hero-title"
            className="mt-7 text-[2.15rem] font-extrabold leading-[1.42] sm:text-5xl sm:leading-[1.38] xl:text-[3.6rem] xl:leading-[1.34]"
          >
            <span className="-mb-1 block overflow-hidden pb-2 pt-1">
              <motion.span
                className="block"
                initial={reduce ? false : { y: "115%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1.1, delay: 0.3, ease: EASE }}
              >
                تأمین مطمئن ملزومات کشتی،
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-2 pt-1">
              <motion.span
                className="block text-aqua-400"
                initial={reduce ? false : { y: "115%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1.1, delay: 0.48, ease: EASE }}
              >
                در بنادر ایران
              </motion.span>
            </span>
          </h1>

          <motion.p
            variants={rise}
            className="mt-6 max-w-xl text-pretty text-base leading-9 text-steel-300 sm:text-lg sm:leading-9"
          >
            کشتی‌بان، تأمین‌کننده ملزومات مصرفی، تجهیزات ایمنی، مواد غذایی و
            محصولات تخصصی دریایی برای کشتی‌های تجاری در بنادر شمال و جنوب ایران.
          </motion.p>

          <motion.div variants={rise} className="mt-9 flex flex-wrap items-center gap-3.5">
            <ButtonLink href="#contact" arrow>
              درخواست استعلام قیمت
            </ButtonLink>
            <ButtonLink href="#services" variant="secondary">
              مشاهده خدمات
            </ButtonLink>
          </motion.div>

          <motion.ul
            variants={rise}
            className="mt-10 hidden flex-wrap gap-x-7 gap-y-2 text-sm font-medium text-steel-300 sm:flex"
          >
            {["کشتی‌های کانتینری", "نفت‌کش‌ها و تانکرها", "کشتی‌های حمل گاز"].map((t) => (
              <li key={t} className="flex items-center gap-2.5">
                <span className="size-1 rotate-45 bg-aqua-400" aria-hidden />
                {t}
              </li>
            ))}
          </motion.ul>
        </motion.div>
      </div>
    </section>
  );
}
