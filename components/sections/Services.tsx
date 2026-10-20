import {
  ArrowLeft,
  Boxes,
  Droplets,
  Flame,
  FlaskConical,
  HardHat,
  LifeBuoy,
  PaintBucket,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { CornerMarks, En, SectionHeading, cn } from "@/components/ui/primitives";
import { serviceCategories, type ServiceCategory } from "@/lib/content";
import { toFa } from "@/lib/fa";

const icons: Record<string, LucideIcon> = {
  lubricants: Droplets,
  paints: PaintBucket,
  chemicals: FlaskConical,
  provisions: UtensilsCrossed,
  ppe: HardHat,
  safety: LifeBuoy,
  consumables: Boxes,
};

const spans: Record<string, string> = {
  lubricants: "lg:col-span-2",
  paints: "lg:col-span-2",
  chemicals: "lg:col-span-2",
  provisions: "lg:col-span-3",
  ppe: "md:col-span-2 lg:col-span-3",
  safety: "md:col-span-2 lg:col-span-4",
  consumables: "md:col-span-2 lg:col-span-2",
};

function ItemList({ items, className }: { items: string[]; className?: string }) {
  return (
    <ul className={cn("grid gap-x-6 gap-y-2.5 text-[0.93rem] text-steel-200", className)}>
      {items.map((item) => (
        <li key={item} className="flex items-center gap-3">
          <span className="size-1.5 shrink-0 rotate-45 bg-aqua-400/80" aria-hidden />
          {item}
        </li>
      ))}
    </ul>
  );
}

function ServiceCard({ cat, index }: { cat: ServiceCategory; index: number }) {
  const Icon = icons[cat.id] ?? Boxes;
  const wide = cat.id === "safety";

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-white/10 bg-ink-800/60 p-7 transition-[transform,border-color,background-color] duration-500 ease-out-expo hover:-translate-y-1 hover:border-aqua-400/40 hover:bg-ink-800 sm:p-8">
      <CornerMarks className="border-white/20 transition-colors duration-500 group-hover:border-aqua-400/70" />
      {/* خط نوری بالای کارت */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-px origin-right scale-x-0 bg-linear-to-l from-aqua-400 to-transparent transition-transform duration-700 ease-out-expo group-hover:scale-x-100"
      />

      <div className="flex items-start justify-between">
        <span className="inline-flex size-12 items-center justify-center rounded-md border border-white/15 bg-ink-900 text-aqua-400 transition-colors duration-500 group-hover:border-aqua-400/50 group-hover:bg-aqua-400/10">
          <Icon className="size-[22px]" aria-hidden />
        </span>
        <span className="text-sm font-semibold tabular-nums text-steel-500">
          {toFa(String(index + 1).padStart(2, "0"))}
        </span>
      </div>

      <h3 className="mt-7 text-xl font-bold leading-9 text-white">{cat.title}</h3>
      <p lang="en" dir="ltr" className="mt-0.5 text-right text-xs font-medium uppercase tracking-[0.18em] text-sea-300/80">
        {cat.en}
      </p>
      <p className="mt-4 text-[0.95rem] leading-8 text-steel-300">{cat.description}</p>

      <div className="mt-6 border-t border-white/10 pt-5">
        {cat.groups ? (
          <div className={cn("grid gap-6", wide && "sm:grid-cols-2")}>
            {cat.groups.map((g) => (
              <div key={g.code}>
                <p className="mb-3 flex items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 rounded bg-aqua-400/15 px-2 py-0.5 text-xs font-bold text-aqua-300">
                    {g.code === "FFA" && <Flame className="size-3" aria-hidden />}
                    {g.code === "LSA" && <LifeBuoy className="size-3" aria-hidden />}
                    <En className="tracking-wider">{g.code}</En>
                  </span>
                  <span className="text-xs leading-6 text-steel-400">{g.title}</span>
                </p>
                <ItemList items={g.items} />
              </div>
            ))}
          </div>
        ) : (
          <ItemList
            items={cat.items}
            className={cat.id === "ppe" || cat.id === "consumables" ? "sm:grid-cols-2" : undefined}
          />
        )}
      </div>
    </article>
  );
}

export function Services() {
  return (
    <section
      id="services"
      aria-labelledby="services-title"
      className="relative overflow-hidden bg-ink-900 py-24 text-white sm:py-32"
    >
      <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-70 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            id="services-title"
            tone="dark"
            index="۰۲"
            en="Supply Categories"
            title="هفت گروه کالایی، یک مجموعه تأمین"
            lead="به‌جای هماهنگی با چند تأمین‌کننده جداگانه، نیاز کشتی را یک‌جا برای کشتی‌بان بنویسید. فهرست زیر نمونه‌ی اقلام هر گروه است، نه کاتالوگ قیمت‌دار."
          />
        </Reveal>

        <Stagger className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-6">
          {serviceCategories.map((cat, i) => (
            <StaggerItem key={cat.id} className={spans[cat.id]}>
              <ServiceCard cat={cat} index={i} />
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal className="mt-12 flex flex-col items-start justify-between gap-5 border-t border-white/10 pt-8 sm:flex-row sm:items-center">
          <p className="max-w-xl text-sm leading-8 text-steel-400">
            کالای موردنیاز شما در فهرست نیست؟ نیاز خود را آزادانه شرح دهید؛ تأمین
            کالا و ملزومات مصرفی دریایی در حوزه‌ی فعالیت ماست.
          </p>
          <a
            href="#contact"
            className="group inline-flex items-center gap-2.5 font-bold text-aqua-400 transition-colors hover:text-aqua-300"
          >
            ارسال فهرست نیازها
            <ArrowLeft className="size-4 transition-transform duration-300 ease-out-expo group-hover:-translate-x-1.5" aria-hidden />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
