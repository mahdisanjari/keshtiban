import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import type { ComponentProps, ReactNode } from "react";
import { brand } from "@/lib/site";

export function cn(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

/** متن لاتین داخل متن فارسی (جهت LTR، بدون به‌هم‌ریختگی bidi). */
export function En({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span lang="en" dir="ltr" className={cn("inline-block", className)}>
      {children}
    </span>
  );
}

/* ───────────── لوگو ───────────── */
export function Logo({
  tone = "light",
  className,
}: {
  tone?: "light" | "dark";
  className?: string;
}) {
  if (brand.logoSrc) {
    return (
      <Image
        src={brand.logoSrc}
        alt="لوگوی کشتی‌بان"
        width={160}
        height={48}
        priority
        className={cn("h-10 w-auto", className)}
      />
    );
  }
  const text = tone === "light" ? "text-white" : "text-ink-900";
  const sub = tone === "light" ? "text-aqua-400" : "text-sea-600";
  return (
    <span className={cn("inline-flex flex-col leading-none", className)}>
      <span className={cn("text-[1.55rem] font-extrabold leading-[1.15]", text)}>
        {brand.name}
      </span>
      <span
        lang="en"
        dir="ltr"
        className={cn(
          "mt-1 flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.32em]",
          sub,
        )}
      >
        <span className="h-px w-5 bg-current" aria-hidden />
        {brand.nameEn}
      </span>
    </span>
  );
}

/* ───────────── دکمه ───────────── */
type Variant = "primary" | "secondary" | "dark" | "ghost-light";

const base =
  "group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-md px-6 py-3.5 text-[0.95rem] font-bold transition-[transform,background-color,border-color,color,box-shadow] duration-300 ease-out-expo active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary:
    "bg-aqua-400 text-ink-950 hover:bg-aqua-300 hover:shadow-[0_10px_30px_-10px_rgb(63_208_201/0.7)]",
  secondary:
    "border border-white/25 text-white hover:border-white/60 hover:bg-white/10",
  dark: "bg-ink-900 text-white hover:bg-ink-700",
  "ghost-light":
    "border border-ink-900/15 text-ink-900 hover:border-ink-900/40 hover:bg-ink-900/5",
};

export function buttonClass(variant: Variant = "primary", className?: string) {
  return cn(base, variants[variant], className);
}

export function ButtonLink({
  variant = "primary",
  arrow = false,
  className,
  children,
  ...props
}: ComponentProps<"a"> & { variant?: Variant; arrow?: boolean }) {
  return (
    <a className={buttonClass(variant, className)} {...props}>
      <span className="relative z-10 inline-flex items-center gap-2.5">
        {children}
        {arrow && (
          <ArrowLeft
            className="size-4 transition-transform duration-300 ease-out-expo group-hover:-translate-x-1.5"
            aria-hidden
          />
        )}
      </span>
    </a>
  );
}

/* ───────────── عنوان بخش ───────────── */
export function SectionHeading({
  index,
  en,
  title,
  lead,
  tone = "light",
  className,
  id,
}: {
  index: string;
  en: string;
  title: ReactNode;
  lead?: ReactNode;
  tone?: "light" | "dark";
  className?: string;
  id?: string;
}) {
  const dark = tone === "dark";
  return (
    <header className={cn("max-w-2xl", className)}>
      <p
        className={cn(
          "mb-5 flex items-center gap-3 text-xs font-semibold",
          dark ? "text-aqua-400" : "text-sea-600",
        )}
      >
        <span className="tabular-nums">{index}</span>
        <span className="h-px w-10 bg-current opacity-60" aria-hidden />
        <span lang="en" dir="ltr" className="uppercase tracking-[0.24em]">
          {en}
        </span>
      </p>
      <h2
        id={id}
        className={cn(
          "text-balance text-[1.9rem] font-extrabold leading-[1.45] sm:text-4xl sm:leading-[1.4] lg:text-[2.6rem]",
          dark ? "text-white" : "text-ink-900",
        )}
      >
        {title}
      </h2>
      {lead && (
        <p
          className={cn(
            "mt-5 text-pretty text-base leading-9 sm:text-[1.075rem]",
            dark ? "text-steel-300" : "text-steel-600",
          )}
        >
          {lead}
        </p>
      )}
    </header>
  );
}

/** علامت‌های گوشه‌ی کارت (crosshair صنعتی) */
export function CornerMarks({ className }: { className?: string }) {
  return (
    <>
      {(
        [
          "top-2 start-2 border-t border-s",
          "top-2 end-2 border-t border-e",
          "bottom-2 start-2 border-b border-s",
          "bottom-2 end-2 border-b border-e",
        ] as const
      ).map((pos) => (
        <span
          key={pos}
          aria-hidden
          className={cn("pointer-events-none absolute size-2.5", pos, className)}
        />
      ))}
    </>
  );
}
