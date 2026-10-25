"use client";

import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { coastRegions, type CoastRegionId } from "@/lib/content";
import { cn } from "@/components/ui/primitives";

/* ── تصویرسازی شماتیک (نه نقشه‌ی دقیق): طول و عرض جغرافیایی → مختصات SVG ── */
const W = 500;
const H = 470;
const px = (lon: number) => (lon - 43.4) * 24;
const py = (lat: number) => (40.2 - lat) * 28;
const pt = (lon: number, lat: number) => `${px(lon).toFixed(1)} ${py(lat).toFixed(1)}`;
const line = (pts: [number, number][]) => "M" + pts.map(([lo, la]) => pt(lo, la)).join("L");

/** خط مرزی ساده‌شده‌ی ایران [lon, lat] */
const outline: [number, number][] = [
  [44.03, 39.38], [44.8, 39.7], [45.5, 39.0], [46.5, 38.85], [47.4, 39.1], [48.0, 38.85], [48.88, 38.43],
  [49.1, 37.9], [49.4, 37.4], [50.0, 37.35], [50.6, 36.9], [51.4, 36.75], [52.3, 36.65], [53.1, 36.9],
  [53.9, 36.95], [53.9, 37.3], [54.6, 37.45], [55.4, 38.0], [56.4, 38.2], [57.3, 38.2], [58.2, 37.65],
  [59.3, 37.5], [60.0, 36.7], [61.2, 36.6], [60.8, 35.6], [60.5, 34.6], [60.9, 33.6], [60.6, 32.5],
  [60.8, 31.5], [61.7, 31.4], [61.8, 30.8], [60.9, 29.8], [62.5, 29.4], [63.2, 27.2], [62.7, 26.3],
  [61.6, 25.2], [60.6, 25.3], [59.5, 25.4], [58.2, 25.65], [57.3, 26.0], [56.6, 26.9], [56.3, 27.1],
  [55.5, 26.9], [54.8, 26.55], [54.0, 26.7], [53.3, 26.65], [52.6, 27.4], [52.0, 27.8], [51.3, 28.2],
  [50.8, 28.9], [50.3, 29.5], [50.1, 30.1], [49.4, 30.2], [48.9, 30.4], [48.5, 30.1], [47.7, 30.9],
  [47.7, 31.9], [46.4, 32.9], [45.8, 33.8], [45.5, 34.4], [45.9, 35.3], [45.4, 35.9], [45.2, 36.5],
  [44.7, 37.2], [44.3, 37.9], [44.4, 38.4], [44.2, 38.9],
];
const outlinePath = line(outline) + "Z";

/** سواحل دو ناحیه‌ی فعالیت (زیرمجموعه‌ی همان خط مرزی) */
const northCoast: [number, number][] = [
  [48.88, 38.43], [49.1, 37.9], [49.4, 37.4], [50.0, 37.35], [50.6, 36.9], [51.4, 36.75],
  [52.3, 36.65], [53.1, 36.9], [53.9, 36.95], [53.9, 37.3],
];
const southCoast: [number, number][] = [
  [61.6, 25.2], [60.6, 25.3], [59.5, 25.4], [58.2, 25.65], [57.3, 26.0], [56.6, 26.9], [56.3, 27.1],
  [55.5, 26.9], [54.8, 26.55], [54.0, 26.7], [53.3, 26.65], [52.6, 27.4], [52.0, 27.8], [51.3, 28.2],
  [50.8, 28.9], [50.3, 29.5], [50.1, 30.1], [49.4, 30.2], [48.9, 30.4], [48.5, 30.1],
];

/** مسیرهای دریایی تزئینی، یکی در هر دریا */
const southLane = line([[56.5, 26.0], [54.4, 26.0], [52.4, 26.8], [50.7, 28.3], [49.6, 29.4]]);
const northLane = line([[48.5, 38.1], [49.5, 37.8], [51.0, 37.2], [52.6, 37.2], [53.5, 37.2]]);

const graticule = { lons: [45, 50, 55, 60], lats: [25, 30, 35, 40] };

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const tone: Record<CoastRegionId, { stroke: string; dot: string }> = {
  north: { stroke: "#8cc0f0", dot: "bg-sea-300" },
  south: { stroke: "#3fd0c9", dot: "bg-aqua-400" },
};

function RegionCard({
  region,
  active,
  onActive,
}: {
  region: (typeof coastRegions)[number];
  active: CoastRegionId | null;
  onActive: (id: CoastRegionId | null) => void;
}) {
  const on = active === region.id;
  return (
    <button
      type="button"
      aria-pressed={on}
      onMouseEnter={() => onActive(region.id)}
      onMouseLeave={() => onActive(null)}
      onFocus={() => onActive(region.id)}
      onBlur={() => onActive(null)}
      className={cn(
        "flex w-full items-start gap-4 rounded-lg border p-5 text-start transition-[border-color,background-color] duration-300",
        on ? "border-aqua-400/60 bg-aqua-400/10" : "border-white/12 bg-white/[0.03] hover:border-white/30",
      )}
    >
      <span className={cn("mt-2 size-2.5 shrink-0 rounded-full", tone[region.id].dot)} aria-hidden />
      <span>
        <span className="block text-lg font-bold leading-8 text-white">{region.title}</span>
        <span className="block text-sm font-medium text-steel-300">{region.sub}</span>
        <span className="mt-2 block text-sm leading-7 text-steel-400">{region.text}</span>
      </span>
    </button>
  );
}

function RegionTag({ x, y, label, color }: { x: number; y: number; label: string; color: string }) {
  const w = 86;
  return (
    <g className="pointer-events-none">
      <rect x={x - w / 2} y={y - 12} width={w} height="24" rx="12" fill="#040c19" fillOpacity="0.88" stroke={color} strokeOpacity="0.7" />
      <text x={x} y={y + 4.5} textAnchor="middle" fontSize="12.5" fontWeight="700" fill="#e6fbf9" className="font-sans">
        {label}
      </text>
    </g>
  );
}

export function CoverageMap() {
  const [active, setActive] = useState<CoastRegionId | null>(null);
  const reduce = useReducedMotion();

  const strokeFor = (id: CoastRegionId) => ({
    width: active === id ? 5.5 : 3.5,
    opacity: active && active !== id ? 0.35 : 0.95,
  });

  return (
    <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-10">
      <div className="space-y-5">
        {coastRegions.map((r) => (
          <RegionCard key={r.id} region={r} active={active} onActive={setActive} />
        ))}
        <p className="max-w-md pt-2 text-sm leading-8 text-steel-400">
          برای تأمین در یک بندر مشخص، نام بندر را در درخواست خود بنویسید تا
          امکان‌سنجی شود.
        </p>
      </div>

      <motion.div
        className="relative mx-auto w-full max-w-[34rem]"
        initial={reduce ? false : { opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        transition={{ duration: 1.1, ease: EASE }}
      >
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full overflow-visible"
          role="img"
          aria-label="نقشه‌ی شماتیک ایران با دو ناحیه‌ی فعالیت: سواحل شمالی در دریای خزر و سواحل جنوبی در خلیج فارس و دریای عمان"
        >
          <defs>
            <linearGradient id="cm-land" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#12335f" />
              <stop offset="1" stopColor="#0b2244" />
            </linearGradient>
            <radialGradient id="cm-glow-n" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor="#8cc0f0" stopOpacity="0.32" />
              <stop offset="1" stopColor="#8cc0f0" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="cm-glow-s" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor="#3fd0c9" stopOpacity="0.32" />
              <stop offset="1" stopColor="#3fd0c9" stopOpacity="0" />
            </radialGradient>
            <pattern id="cm-hatch" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="9" stroke="#8cc0f0" strokeOpacity="0.07" strokeWidth="1" />
            </pattern>
          </defs>

          {/* مدار و نصف‌النهار */}
          <g stroke="#8cc0f0" strokeOpacity="0.12" strokeWidth="1" strokeDasharray="2 6">
            {graticule.lons.map((lo) => (
              <line key={lo} x1={px(lo)} x2={px(lo)} y1="0" y2={H} />
            ))}
            {graticule.lats.map((la) => (
              <line key={la} x1="0" x2={W} y1={py(la)} y2={py(la)} />
            ))}
          </g>
          <g fill="#8cc0f0" fillOpacity="0.4" fontSize="10" className="font-sans">
            {graticule.lons.map((lo) => (
              <text key={lo} x={px(lo) + 4} y={H - 4}>{`${lo}°E`}</text>
            ))}
            {graticule.lats.slice(0, 3).map((la) => (
              <text key={la} x="4" y={py(la) - 4}>{`${la}°N`}</text>
            ))}
          </g>

          {/* درخشش دو ناحیه (هم‌وزن) */}
          <ellipse cx={px(51.4)} cy={py(37.2)} rx="120" ry="52" fill="url(#cm-glow-n)" />
          <ellipse cx={px(55.6)} cy={py(26.7)} rx="150" ry="62" fill="url(#cm-glow-s)" />

          {/* خاک ایران */}
          <path d={outlinePath} fill="url(#cm-land)" stroke="#4d9be3" strokeOpacity="0.7" strokeWidth="1.5" strokeLinejoin="round" />
          <path d={outlinePath} fill="url(#cm-hatch)" />

          {/* مسیرهای دریایی */}
          <g fill="none" strokeWidth="1.5" strokeDasharray="5 7" className="animate-flow">
            <path d={southLane} stroke="#3fd0c9" strokeOpacity="0.7" />
            <path d={northLane} stroke="#8cc0f0" strokeOpacity="0.7" />
          </g>

          {/* سواحل دو ناحیه */}
          {(
            [
              ["north", northCoast],
              ["south", southCoast],
            ] as const
          ).map(([id, pts]) => {
            const st = strokeFor(id);
            return (
              <motion.path
                key={id}
                d={line(pts as unknown as [number, number][])}
                fill="none"
                stroke={tone[id].stroke}
                strokeLinecap="round"
                strokeLinejoin="round"
                animate={{ strokeWidth: st.width, strokeOpacity: st.opacity }}
                initial={reduce ? false : { pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ pathLength: { duration: 1.8, ease: EASE }, default: { duration: 0.3 } }}
              />
            );
          })}

          {/* نام دریاها */}
          <g fill="#8cc0f0" fillOpacity="0.55" fontSize="13" fontWeight="600" textAnchor="middle" className="font-sans">
            <text x={px(51.2)} y={py(38.95)}>دریای خزر</text>
            <text x={px(51.6)} y={py(25.7)}>خلیج فارس</text>
            <text x={px(58.9)} y={py(24.5)}>دریای عمان</text>
          </g>

          <RegionTag x={px(51.2)} y={py(37.95)} label="بنادر شمالی" color={tone.north.stroke} />
          <RegionTag x={px(55.2)} y={py(24.95)} label="بنادر جنوبی" color={tone.south.stroke} />
        </svg>
        <p className="mt-3 text-center text-xs text-steel-500">طرح شماتیک؛ مقیاس و مرزها دقیق نیست.</p>
      </motion.div>
    </div>
  );
}
