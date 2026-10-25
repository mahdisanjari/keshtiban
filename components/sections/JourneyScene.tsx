import type { CSSProperties } from "react";

/**
 * صحنه‌ی «سفر کالا»: کشتی کنار اسکله می‌آید و هفت گروه کالایی با جرثقیل روی عرشه می‌نشینند.
 * هیچ منطقی در JS نیست؛ همه‌ی حرکت‌ها تابعی از متغیر CSS با نام --p هستند (globals.css → .j-*).
 */

const WATER_Y = 400;
const SHIP_X = 120; // موقعیت نهایی دماغه
const deckY = (x: number) => -50 + x * (10 / 520);

const boxTones = ["#1d4a7a", "#16395f", "#2a5f8f", "#102c4c", "#2f6d7c", "#244e66"];
const stackRows = [2, 3, 2, 3, 3, 2, 3, 2, 3];
const deckBoxes = stackRows.flatMap((n, c) => {
  const x = 186 + c * 26;
  const base = deckY(x + 24) + 0.5;
  return Array.from({ length: n }, (_, r) => ({
    x,
    y: base - (r + 1) * 12.4,
    fill: boxTones[(c * 5 + r * 2) % boxTones.length],
    key: `${c}-${r}`,
  }));
});

/** هفت جعبه‌ی کالا: [x محلی، y محلی] روی عرشه‌ی جلویی (دو ردیف) */
const CRATE_W = 36;
const CRATE_H = 24;
const crateSlots: [number, number][] = [
  [18, -48 - CRATE_H],
  [58, -48 - CRATE_H],
  [98, -48 - CRATE_H],
  [138, -48 - CRATE_H],
  [38, -48 - CRATE_H * 2],
  [78, -48 - CRATE_H * 2],
  [118, -48 - CRATE_H * 2],
];
const crateTones = ["#1fb5b0", "#2b7bc9", "#3fd0c9", "#4d9be3", "#1fb5b0", "#2b7bc9", "#3fd0c9"];

const BOOM_Y = 160;
const wavePath = "M0 0q25 -5 50 0" + " t50 0".repeat(41);

/* پشته‌های کانتینر اسکله */
const quayStacks = Array.from({ length: 46 }, (_, i) => ({
  x: i < 16 ? 14 + i * 17 : 700 + (i - 16) * 10.3,
  rows: 1 + ((i * 7) % 3),
  w: i < 16 ? 15 : 9,
}));

const vars = (o: Record<string, string | number>) => o as unknown as CSSProperties;

export function JourneyScene({ className = "h-auto w-full" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1000 560"
      preserveAspectRatio="xMidYMax meet"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="jn-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1d5f92" />
          <stop offset="0.16" stopColor="#12426f" />
          <stop offset="0.6" stopColor="#0a2447" />
          <stop offset="1" stopColor="#071730" />
        </linearGradient>
        <radialGradient id="jn-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#7fe3dd" stopOpacity="0.38" />
          <stop offset="1" stopColor="#3fd0c9" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="jn-hull" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#12335f" />
          <stop offset="1" stopColor="#050f20" />
        </linearGradient>
        <linearGradient id="jn-wake" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.5" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* افق و دریا */}
      <ellipse cx="500" cy="330" rx="620" ry="90" fill="url(#jn-glow)" />
      <rect y="330" width="1000" height="230" fill="url(#jn-sea)" />
      <rect y="329" width="1000" height="2" fill="#8cc0f0" opacity="0.35" />

      {/* اسکله‌ی دوردست: ساختمان، کانتینرها و جرثقیل */}
      <g>
        <rect x="770" y="282" width="190" height="42" fill="#0b2749" />
        <path d="M762 282L865 262L968 282Z" fill="#0d2f58" />
        <g fill="#ffe2b0" opacity="0.7">
          {[790, 830, 870, 910].map((x) => (
            <rect key={x} x={x} y="296" width="10" height="6" className="animate-twinkle" style={{ animationDelay: `${(x % 5) * 0.4}s` }} />
          ))}
        </g>
        {quayStacks.map((s, i) => (
          <g key={i} fill={i % 2 ? "#0e2c52" : "#12335f"}>
            {Array.from({ length: s.rows }, (_, r) => (
              <rect key={r} x={s.x} y={322 - (r + 1) * 11} width={s.w} height="10" />
            ))}
          </g>
        ))}
        <rect x="0" y="321" width="1000" height="26" fill="#0a2244" />
        <rect x="0" y="321" width="1000" height="2" fill="#4d9be3" opacity="0.4" />

        {/* جرثقیل */}
        <g stroke="#1d4a7a" strokeWidth="3" fill="none" strokeLinecap="round">
          <path d="M330 322V176M372 322V176M326 176H376M330 250H372" />
          <path d={`M150 ${BOOM_Y}H560`} strokeWidth="5" />
          <path d={`M351 92L150 ${BOOM_Y}M351 92L560 ${BOOM_Y}M351 92V${BOOM_Y}`} strokeWidth="2.2" />
        </g>
        <circle cx="351" cy="90" r="2.4" fill="#86e4de" className="animate-twinkle" />
      </g>

      {/* مارکر «کشتی‌بان» و خط درخواست */}
      <g className="j-marker">
        <circle cx="90" cy="296" r="4.5" fill="#3fd0c9" />
        <circle cx="90" cy="296" r="9" fill="none" stroke="#3fd0c9" strokeOpacity="0.7" className="animate-ping-soft" style={{ transformOrigin: "90px 296px" }} />
        <text x="90" y="278" textAnchor="middle" fontSize="14" fontWeight="700" fill="#86e4de" className="font-sans">
          کشتی‌بان
        </text>
        <circle cx="980" cy="248" r="3.5" fill="#86e4de" />
        <circle cx="980" cy="248" r="8" fill="none" stroke="#86e4de" strokeOpacity="0.7" className="animate-ping-soft" style={{ transformOrigin: "980px 248px" }} />
      </g>
      <path
        d="M980 248Q560 20 90 296"
        pathLength={1}
        fill="none"
        stroke="#3fd0c9"
        strokeWidth="1.8"
        strokeLinecap="round"
        className="j-route"
      />

      {/* امواج */}
      {[
        { y: 350, o: 0.2, c: "animate-drift-slow", w: 1.1, x: -40 },
        { y: 376, o: 0.28, c: "animate-drift", w: 1.3, x: -120 },
        { y: 430, o: 0.26, c: "animate-drift-slow", w: 1.5, x: -10 },
        { y: 480, o: 0.2, c: "animate-drift", w: 1.8, x: -170 },
        { y: 530, o: 0.14, c: "animate-drift-slow", w: 2.2, x: -80 },
      ].map((r) => (
        <g key={r.y} transform={`translate(${r.x} ${r.y})`}>
          <path d={wavePath} className={r.c} stroke="#8cc0f0" strokeOpacity={r.o} strokeWidth={r.w} fill="none" strokeLinecap="round" />
        </g>
      ))}

      {/* کابل جرثقیل برای هر جعبه */}
      {crateSlots.map(([x, y], i) => {
        const top = WATER_Y + y; // مختصات مطلق بالای جعبه در حالت نهایی
        const h0 = top - BOOM_Y + 10;
        return (
          <rect
            key={i}
            className="j-cable"
            x={SHIP_X + x + CRATE_W / 2 - 0.8}
            y={BOOM_Y - 10}
            width="1.6"
            height={h0}
            fill="#8cc0f0"
            style={vars({ "--ti": 0.74 + i * 0.033, "--k": ((h0 - 6) / h0).toFixed(3) })}
          />
        );
      })}

      {/* سایه‌ی کشتی روی آب */}
      <ellipse cx="380" cy={WATER_Y + 6} rx="300" ry="6" fill="#040c19" opacity="0.5" />

      {/* کشتی */}
      <g className="j-ship">
        <g transform={`translate(${SHIP_X} ${WATER_Y})`}>
          {/* ردّ حرکت */}
          <g className="j-wake">
            <path d="M520 0L760 -3L800 0L760 3Z" fill="url(#jn-wake)" opacity="0.6" />
            <path d="M524 6L690 5L720 7L690 9Z" fill="url(#jn-wake)" opacity="0.35" />
          </g>

          <g className="animate-bob" style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}>
            <path d="M0 -50C22 -22 50 -4 92 0L508 0L520 -40Z" fill="url(#jn-hull)" />
            <path d="M0 -50L520 -40" stroke="#4d9be3" strokeOpacity="0.55" strokeWidth="1.3" fill="none" />
            <path d="M40 -8C60 -4 76 -2 96 -1L512 -1" stroke="#1d62ab" strokeOpacity="0.8" strokeWidth="2.4" fill="none" />

            {/* کانتینرهای ثابت */}
            {deckBoxes.map((b) => (
              <g key={b.key}>
                <rect x={b.x} y={b.y} width="24" height="11.4" fill={b.fill} />
                <rect x={b.x} y={b.y} width="24" height="1.2" fill="#fff" opacity="0.12" />
              </g>
            ))}

            {/* روبنا */}
            <rect x="444" y="-88" width="64" height="48" fill="#0f2c52" />
            <rect x="452" y="-114" width="48" height="28" fill="#13355f" />
            <path d="M446 -128H506L502 -112H450Z" fill="#1c4a7b" />
            <g fill="#86e4de">
              {Array.from({ length: 6 }, (_, i) => (
                <rect key={i} x={454 + i * 8} y="-124" width="5" height="4" opacity="0.85" />
              ))}
            </g>
            <path d="M478 -128V-156M468 -146H488" stroke="#183f6c" strokeWidth="2.4" fill="none" />
            <circle cx="478" cy="-158" r="2.4" fill="#86e4de" className="animate-twinkle" />

            {/* جعبه‌های کالا: یکی‌یکی از جرثقیل فرود می‌آیند */}
            {crateSlots.map(([x, y], i) => {
              const finalBottom = WATER_Y + y + CRATE_H;
              return (
                <g
                  key={i}
                  className="j-crate"
                  style={vars({ "--ti": 0.74 + i * 0.033, "--d": finalBottom - (BOOM_Y + 18) })}
                >
                  <g transform={`translate(${x} ${y})`}>
                    <rect width={CRATE_W} height={CRATE_H} rx="1.5" fill={crateTones[i]} />
                    <rect width={CRATE_W} height="3" fill="#ffffff" opacity="0.22" />
                    <path d={`M${CRATE_W / 2} 3V${CRATE_H}M3 ${CRATE_H / 2 + 1}H${CRATE_W - 3}`} stroke="#040c19" strokeOpacity="0.28" strokeWidth="1" />
                  </g>
                </g>
              );
            })}
          </g>
        </g>
      </g>

      {/* طناب‌های مهار */}
      <g className="j-moor" stroke="#b6c2d1" strokeOpacity="0.75" strokeWidth="1.4" fill="none">
        <path d="M150 362Q132 360 112 348" />
        <path d="M640 362Q664 358 690 346" />
      </g>

      {/* نشان تحویل */}
      <g className="j-done">
        <rect x="150" y="262" width="128" height="26" rx="13" fill="#040c19" fillOpacity="0.88" stroke="#3fd0c9" strokeOpacity="0.7" />
        <circle cx="168" cy="275" r="7" fill="#3fd0c9" />
        <path d="M164.5 275l2.6 2.6 4.8-5" stroke="#040c19" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <text x="184" y="280" fontSize="13" fontWeight="700" fill="#e6fbf9" className="font-sans">
          تحویل در بندر
        </text>
      </g>

      {/* محو شدن پایین صحنه */}
      <rect y="500" width="1000" height="60" fill="#071730" opacity="0.5" />
    </svg>
  );
}
