"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

/** media query بدون setState درون effect (سازگار با SSR). */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (notify) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", notify);
      return () => mq.removeEventListener("change", notify);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** آیا صفحه بیش از threshold پیکسل اسکرول شده است؟ */
export function useScrolled(threshold = 24): boolean {
  return useSyncExternalStore(
    (notify) => {
      window.addEventListener("scroll", notify, { passive: true });
      return () => window.removeEventListener("scroll", notify);
    },
    () => window.scrollY > threshold,
    () => false,
  );
}

/** بخش فعال در اسکرول برای منوی ناوبری. */
export function useActiveSection(ids: readonly string[]): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
    );
    els.forEach((el) => observer.observe(el));

    // وقتی به بالای صفحه برگشتیم (Hero)، حالت فعال پاک شود
    const onScroll = () => {
      if (window.scrollY < 120) setActive(null);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [ids]);

  return active;
}
