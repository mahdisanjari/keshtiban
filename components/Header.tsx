"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { navItems } from "@/lib/site";
import { toFa } from "@/lib/fa";
import { useActiveSection, useScrolled } from "@/components/motion/hooks";
import { ButtonLink, Logo, cn } from "@/components/ui/primitives";

const ids = [...navItems.map((n) => n.id), "vessels", "why", "process", "faq"] as const;

export function Header() {
  const scrolled = useScrolled(24);
  const active = useActiveSection(ids);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);

  // قفل اسکرول + Escape + فوکوس اولیه هنگام باز بودن منوی موبایل
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // نواحی مرتبط با هر آیتم منو (مثلاً «چرا کشتی‌بان» زیرمجموعه‌ی «درباره ما» محسوب می‌شود)
  const group: Record<string, string> = {
    vessels: "services",
    why: "about",
    process: "contact",
    faq: "contact",
  };
  const current = active ? (group[active] ?? active) : null;

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-aqua-400 focus:px-4 focus:py-2 focus:font-bold focus:text-ink-950"
      >
        پرش به محتوای اصلی
      </a>

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter,padding] duration-500 ease-out-expo",
          scrolled
            ? "border-b border-white/10 bg-ink-900/85 py-3 shadow-[0_10px_40px_-20px_rgb(0_0_0/0.6)] backdrop-blur-md"
            : "bg-transparent py-5 sm:py-6",
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 sm:px-8">
          <a href="#top" aria-label="کشتی‌بان — بازگشت به بالای صفحه" className="shrink-0 rounded-sm">
            <Logo />
          </a>

          <nav aria-label="ناوبری اصلی" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = current === item.id;
                return (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      aria-current={isActive ? "true" : undefined}
                      className={cn(
                        "relative block px-4 py-2 text-[0.95rem] font-semibold transition-colors duration-300",
                        isActive ? "text-white" : "text-steel-300 hover:text-white",
                      )}
                    >
                      {item.label}
                      <span
                        aria-hidden
                        className={cn(
                          "absolute inset-x-4 -bottom-0.5 h-[2px] origin-right rounded-full bg-aqua-400 transition-transform duration-500 ease-out-expo",
                          isActive ? "scale-x-100" : "scale-x-0",
                        )}
                      />
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <ButtonLink href="#contact" className="px-5! py-2.5! text-sm!">
                درخواست استعلام
              </ButtonLink>
            </div>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="باز کردن منو"
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="inline-flex size-11 items-center justify-center rounded-md border border-white/20 text-white transition-colors hover:bg-white/10 lg:hidden"
            >
              <Menu className="size-5" aria-hidden />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="منوی اصلی"
            className="fixed inset-0 z-[60] flex flex-col bg-ink-950 lg:hidden"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden />
            <div className="relative flex items-center justify-between px-5 py-5">
              <Logo />
              <button
                ref={closeRef}
                type="button"
                onClick={() => setOpen(false)}
                aria-label="بستن منو"
                className="inline-flex size-11 items-center justify-center rounded-md border border-white/20 text-white hover:bg-white/10"
              >
                <X className="size-5" aria-hidden />
              </button>
            </div>

            <nav aria-label="منوی موبایل" className="relative flex-1 px-5 pt-6">
              <ul className="divide-y divide-white/10 border-y border-white/10">
                {navItems.map((item, i) => (
                  <motion.li
                    key={item.id}
                    initial={reduce ? false : { opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <a
                      href={`#${item.id}`}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between py-5 text-2xl font-bold text-white"
                    >
                      <span>{item.label}</span>
                      <span className="text-sm font-semibold tabular-nums text-aqua-400">
                        {toFa(String(i + 1).padStart(2, "0"))}
                      </span>
                    </a>
                  </motion.li>
                ))}
              </ul>
            </nav>

            <div className="relative p-5">
              <ButtonLink
                href="#contact"
                onClick={() => setOpen(false)}
                arrow
                className="w-full"
              >
                درخواست استعلام قیمت
              </ButtonLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
