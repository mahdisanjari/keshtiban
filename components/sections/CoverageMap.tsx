"use client";

import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { ports, type Port } from "@/lib/content";
import { cn } from "@/components/ui/primitives";

/* ── تصویرسازی شماتیک (نه نقشه‌ی دقیق): طول و عرض جغرافیایی → مختصات SVG ── */
const W = 500;
const H = 470;
const px = (lon: number) => (lon - 43.4) * 24;
const py = (lat: number) => (40.2 - lat) * 28;
const pt = (lon: number, lat: number) => `${px(lon).toFixed(1)} ${py(lat).toFixed(1)}`;

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
const outlinePath = "M" + outline.map(([lo, la]) => pt(lo, la)).join("L") + "Z";

/** مسیرهای دریایی تزئینی */
const gulfLane = "M" + [[56.5, 26.3], [54.4, 26.2], [52.4, 27.0], [50.7, 28.5], [49.6, 29.6]].map(([a, b]) => pt(a, b)).join("L");
const caspianLane = "M" + [[48.5, 38.1], [49.5, 37.8], [51.0, 37.2], [52.6, 37.2], [53.5, 37.2]].map(([a, b]) => pt(a, b)).join("L");

const graticule = {
  lons: [45, 50, 55, 60],
  lats: [25, 30, 35, 40],
};

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

function Label({ port }: { port: Port }) {
  const x = px(port.lon);
  const y = py(port.lat);
  const south = port.region === "south";
  const ty = south ? y + 22 : y - 14;
  const w = port.name.length * 8.6 + 18;
  return (
    <g className="pointer-events-none">
      <rect x={x - w / 2} y={ty - 13} width={w} height="21" rx="3" fill="#040c19" fillOpacity="0.9" stroke="#3fd0c9" strokeOpacity="0.5" />
      <text x={x} y={ty + 2} textAnchor="middle" fontSize="12" fontWeight="700" fill="#e6fbf9" className="font-sans">
        {port.name}
      </text>
    </g>
  );
}

function PortList({
  title,
  sub,
  list,
  tone,
  active,
  onActive,
}: {
  title: string;
  sub: string;
  list: Port[];
  tone: "south" | "north";
  active: string | null;
  onActive: (id: string | null) => void;
}) {
  return (
    <div>
      <h3 className="flex items-center gap-3 text-lg font-bold">
        <span className={cn("size-2.5 rounded-full", tone === "south" ? "bg-aqua-400" : "bg-sea-300")} aria-hidden />
        {title}
      </h3>
      <p className="mt-1 text-sm text-steel-400">{sub}</p>
      <ul className="mt-4 flex flex-wrap gap-2.5">
        {list.map((p) => (
          <li key={p.id}>
            <button
              type="button"
              onMouseEnter={() => onActive(p.id)}
              onMouseLeave={() => onActive(null)}
              onFocus={() => onActive(p.id)}
              onBlur={() => onActive(null)}
              className={cn(
                "rounded-md border px-3.5 py-1.5 text-sm font-medium transition-colors duration-300",
                active === p.id
                  ? "border-aqua-400 bg-aqua-400/15 text-white"
                  : "border-white/15 text-steel-200 hover:border-white/40",
              )}
            >
              {p.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CoverageMap() {
  const [active, setActive] = useState<string | null>(null);
  const reduce = useReducedMotion();

  const south = ports.filter((p) => p.region === "south");
  const north = ports.filter((p) => p.region === "north");
  const activePort = ports.find((p) => p.id === active) ?? null;

  return (
    <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-10">
      <div className="space-y-9">
        <div className="inline-flex items-center gap-3 rounded-md border border-aqua-400/30 bg-aqua-400/10 px-4 py-2.5 text-sm font-semibold text-aqua-300">
          <span className="relative flex size-2.5" aria-hidden>
            <span className="absolute inline-flex size-full animate-ping-soft rounded-full bg-aqua-400" />
            <span className="relative inline-flex size-2.5 rounded-full bg-aqua-400" />
          </span>
          تمرکز بیشتر: بنادر خلیج فارس
        </div>
        <PortList
          title="بنادر جنوبی"
          sub="خلیج فارس و دریای عمان"
          list={south}
          tone="south"
          active={active}
          onActive={setActive}
        />
        <PortList
          title="بنادر شمالی"
          sub="سواحل دریای خزر"
          list={north}
          tone="north"
          active={active}
          onActive={setActive}
        />
        <p className="max-w-md text-sm leading-8 text-steel-400">
          فهرست بالا بنادر شاخص این دو حوزه است. برای تأمین در سایر بنادر شمال و
          جنوب، نام بندر را در درخواست خود بنویسید تا امکان‌سنجی شود.
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
          aria-label="نقشه‌ی شماتیک ایران با نمایش بنادر شمالی در دریای خزر و بنادر جنوبی در خلیج فارس و دریای عمان؛ تمرکز بصری بر خلیج فارس"
        >
          <defs>
            <linearGradient id="cm-land" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#12335f" />
              <stop offset="1" stopColor="#0b2244" />
            </linearGradient>
            <radialGradient id="cm-glow" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor="#3fd0c9" stopOpacity="0.4" />
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

          {/* درخشش خلیج فارس */}
          <ellipse cx={px(52.6)} cy={py(27.2)} rx="150" ry="105" fill="url(#cm-glow)" />

          {/* خاک ایران */}
          <path d={outlinePath} fill="url(#cm-land)" stroke="#4d9be3" strokeOpacity="0.7" strokeWidth="1.5" strokeLinejoin="round" />
          <path d={outlinePath} fill="url(#cm-hatch)" />

          {/* مسیرهای دریایی */}
          <g fill="none" strokeWidth="1.5" strokeDasharray="5 7" className="animate-flow">
            <path d={gulfLane} stroke="#3fd0c9" strokeOpacity="0.75" />
            <path d={caspianLane} stroke="#8cc0f0" strokeOpacity="0.65" />
          </g>

          {/* نام دریاها */}
          <g fill="#8cc0f0" fillOpacity="0.55" fontSize="13" fontWeight="600" textAnchor="middle" className="font-sans">
            <text x={px(51.2)} y={py(38.9)}>دریای خزر</text>
            <text x={px(51.6)} y={py(25.7)} fill="#86e4de" fillOpacity="0.9" fontSize="14">خلیج فارس</text>
            <text x={px(58.9)} y={py(24.7)}>دریای عمان</text>
          </g>

          {/* بنادر */}
          {ports.map((p) => {
            const isActive = active === p.id;
            const south = p.region === "south";
            return (
              <g key={p.id} onMouseEnter={() => setActive(p.id)} onMouseLeave={() => setActive(null)}>
                {(isActive || south) && (
                  <circle
                    cx={px(p.lon)}
                    cy={py(p.lat)}
                    r="6"
                    fill="none"
                    stroke={south ? "#3fd0c9" : "#8cc0f0"}
                    strokeWidth="1.2"
                    className={isActive ? "" : "animate-ping-soft"}
                    style={{ transformOrigin: `${px(p.lon)}px ${py(p.lat)}px`, animationDelay: `${(p.lon * 10) % 3}s` }}
                    opacity={isActive ? 0.9 : 1}
                  />
                )}
                <circle
                  cx={px(p.lon)}
                  cy={py(p.lat)}
                  r={isActive ? 5.5 : 3.8}
                  fill={south ? "#3fd0c9" : "#8cc0f0"}
                  stroke="#040c19"
                  strokeWidth="1.5"
                  style={{ transition: "r 0.3s" }}
                />
                {/* ناحیه‌ی لمس بزرگ‌تر */}
                <circle cx={px(p.lon)} cy={py(p.lat)} r="14" fill="transparent" />
              </g>
            );
          })}
          {activePort && <Label port={activePort} />}
        </svg>
        <p className="mt-3 text-center text-xs text-steel-500">طرح شماتیک؛ مقیاس و مرزها دقیق نیست.</p>
      </motion.div>
    </div>
  );
}
