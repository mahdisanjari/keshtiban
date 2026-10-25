import { Container, Flame, Fuel, Ship, type LucideIcon } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/primitives";
import { vesselTypes } from "@/lib/content";

const icons: Record<string, LucideIcon> = {
  container: Container,
  tanker: Fuel,
  gas: Flame,
  commercial: Ship,
};

/* خط ساحلی مشترک: دماغه سمت چپ (جهت حرکت در RTL) */
const Hull = () => <path d="M8 42L252 44L246 66L44 66Q20 60 8 42Z" />;
const Tower = ({ x = 204 }: { x?: number }) => (
  <g>
    <rect x={x} y="22" width="34" height="22" />
    <rect x={x + 6} y="12" width="22" height="10" />
    <rect x={x + 12} y="4" width="3" height="8" />
  </g>
);

function Art({ id }: { id: string }) {
  return (
    <svg viewBox="0 0 260 84" className="h-auto w-full" aria-hidden focusable="false">
      <g fill="currentColor">
        <Hull />
        <Tower />
        {id === "container" &&
          [3, 3, 2, 3, 3, 3, 2, 3, 3, 2, 3, 3].map((n, c) => (
            <g key={c} opacity={0.55}>
              {Array.from({ length: n }, (_, r) => (
                <rect key={r} x={34 + c * 14.4} y={42 - (r + 1) * 9.4} width="12.6" height="8.4" />
              ))}
            </g>
          ))}
        {id === "tanker" && (
          <g>
            <rect x="46" y="35.5" width="150" height="2" opacity={0.6} />
            {Array.from({ length: 9 }, (_, i) => (
              <rect key={i} x={52 + i * 17} y="32" width="2.4" height="10" opacity={0.6} />
            ))}
            <rect x="22" y="36" width="14" height="6" opacity={0.6} />
          </g>
        )}
        {id === "gas" &&
          [38, 80, 122, 164].map((x) => (
            <path key={x} d={`M${x} 43a19 19 0 0 1 38 0Z`} opacity={0.55} />
          ))}
        {id === "commercial" && (
          <g opacity={0.6}>
            {[64, 138].map((x) => (
              <g key={x}>
                <rect x={x} y="22" width="5" height="21" />
                <path d={`M${x + 2.5} 24L${x - 30} 40`} stroke="currentColor" strokeWidth="2.2" fill="none" />
                <path d={`M${x + 2.5} 24L${x + 30} 40`} stroke="currentColor" strokeWidth="1.2" fill="none" />
              </g>
            ))}
            <rect x="92" y="36" width="34" height="6" />
            <rect x="168" y="36" width="28" height="6" />
          </g>
        )}
      </g>
      <path
        d="M0 74q10 -4 20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.3"
        strokeWidth="1.4"
      />
    </svg>
  );
}

export function Vessels() {
  return (
    <section
      id="vessels"
      aria-labelledby="vessels-title"
      className="relative bg-steel-100 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            id="vessels-title"
            index="۰۳"
            en="Vessels"
            title="کشتی‌هایی که برای آن‌ها کالا تأمین می‌کنیم"
            lead="کشتی‌بان برای کشتی‌های تجاری کالا و ملزومات تأمین می‌کند. هر نوع کشتی فهرست نیاز متفاوتی دارد و درخواست شما بر اساس همان نیاز بررسی می‌شود."
          />
        </Reveal>

        <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {vesselTypes.map((v) => {
            const Icon = icons[v.id];
            return (
              <StaggerItem key={v.id} className="h-full">
                <article className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-ink-900/10 bg-white p-6 transition-[transform,box-shadow,border-color] duration-500 ease-out-expo hover:-translate-y-1 hover:border-sea-500/40 hover:shadow-[0_24px_50px_-28px_rgb(7_23_48/0.45)]">
                  <div className="rounded-md bg-steel-50 px-4 pb-3 pt-6 text-ink-700 transition-colors duration-500 group-hover:text-sea-600">
                    <div className="transition-transform duration-700 ease-out-expo group-hover:-translate-x-1.5">
                      <Art id={v.id} />
                    </div>
                  </div>
                  <div className="mt-6 flex items-center gap-3">
                    <span className="inline-flex size-9 items-center justify-center rounded-md bg-ink-900 text-aqua-400">
                      <Icon className="size-[18px]" aria-hidden />
                    </span>
                    <div>
                      <h3 className="text-lg font-bold leading-7 text-ink-900">{v.title}</h3>
                      <p lang="en" dir="ltr" className="text-right text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-sea-600">
                        {v.en}
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 text-[0.93rem] leading-8 text-steel-600">{v.description}</p>
                </article>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
