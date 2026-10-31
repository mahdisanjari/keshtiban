"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/components/ui/primitives";

type Connection = { saveData?: boolean };

function canRunWebGL() {
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") ?? c.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * لایه‌ی سه‌بعدی Hero (three.js). ارتقای تدریجی است:
 * - صحنه‌ی SVG همیشه زیرش هست و تا آماده‌شدن سه‌بعدی دیده می‌شود (LCP و بدون JS سالم می‌مانند)؛
 * - کتابخانه فقط پس از بارگذاری صفحه و در زمان بیکاری، با import پویا می‌آید؛
 * - بدون WebGL، با «ذخیره‌ی داده»، یا حافظه‌ی کم، اصلاً بارگذاری نمی‌شود.
 */
export function Hero3D({ onReady }: { onReady: () => void }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const nav = navigator as Navigator & { connection?: Connection; deviceMemory?: number };
    if (nav.connection?.saveData) return;
    if (typeof nav.deviceMemory === "number" && nav.deviceMemory < 4) return;
    if (!canRunWebGL()) return;

    let disposed = false;
    let world: { setVisible(v: boolean): void; setPointer(x: number, y: number): void; dispose(): void } | null = null;
    let observer: IntersectionObserver | null = null;
    let idleId = 0;
    let timeoutId = 0;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lowPower =
      window.matchMedia("(pointer: coarse)").matches || window.matchMedia("(max-width: 767px)").matches;

    const onPointer = (e: PointerEvent) => {
      world?.setPointer((e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1));
    };

    const boot = async () => {
      try {
        const { createHeroWorld } = await import("./three/HeroWorld");
        if (disposed) return;
        world = createHeroWorld(canvas, {
          reducedMotion: reduced,
          lowPower,
          onReady: () => {
            if (disposed) return;
            setShown(true);
            onReady();
          },
        });
        observer = new IntersectionObserver(([entry]) => world?.setVisible(entry.isIntersecting), { threshold: 0 });
        observer.observe(canvas);
        if (!reduced && !lowPower) window.addEventListener("pointermove", onPointer, { passive: true });
      } catch (error) {
        // صحنه‌ی SVG به کار خود ادامه می‌دهد
        console.error("[Hero3D] 3D scene failed, keeping SVG fallback", error);
      }
    };

    const schedule = () => {
      if ("requestIdleCallback" in window) idleId = window.requestIdleCallback(boot, { timeout: 2500 });
      else timeoutId = window.setTimeout(boot, 800);
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    return () => {
      disposed = true;
      window.removeEventListener("load", schedule);
      window.removeEventListener("pointermove", onPointer);
      if (idleId && "cancelIdleCallback" in window) window.cancelIdleCallback(idleId);
      window.clearTimeout(timeoutId);
      observer?.disconnect();
      world?.dispose();
    };
  }, [onReady]);

  return (
    <canvas
      ref={ref}
      role="img"
      aria-label="تصویر سه‌بعدی از یک کشتی کانتینری تجاری در دریا، با بندر و جرثقیل‌های بارگیری در دوردست"
      className={cn(
        "absolute inset-0 size-full transition-opacity duration-[1400ms] ease-out",
        shown ? "opacity-100" : "opacity-0",
      )}
    />
  );
}
