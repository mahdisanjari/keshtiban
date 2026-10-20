/**
 * صحنه‌ی برداری Hero: کشتی کانتینری در حال حرکت، بندر دوردست با جرثقیل‌ها،
 * رادار و مسیر دریایی. چون تصویر واقعی در پروژه نبود، کاملاً با SVG ساخته شده (سبک و بدون هزینه‌ی شبکه).
 * برای استفاده از عکس واقعی: brand.heroImage در lib/site.ts.
 *
 * صحنه به دو لایه تقسیم شده تا parallax ظریف ممکن باشد؛ هر دو یک viewBox دارند.
 */

const VB = "0 0 1600 900";
const PAR = "xMinYMax slice";

const SEA_Y = 640;

/* ── ستاره‌ها (قطعی، بدون Math.random تا hydration سالم بماند) ── */
const stars = Array.from({ length: 36 }, (_, i) => ({
  x: (i * 397 + 61) % 1600,
  y: ((i * 211 + 37) % 330) + 24,
  r: i % 6 === 0 ? 1.5 : 0.85,
  d: (i % 7) * 0.6,
}));

/* ── جرثقیل گنتری ── */
function Crane({ x, s = 1 }: { x: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${SEA_Y + 3}) scale(${s})`} stroke="#0d2b52" strokeWidth="2.4" fill="none" strokeLinecap="round">
      <path d="M0 0V-74M28 0V-74M-4 -74H32M0 -40H28" />
      <path d="M-84 -80H62" strokeWidth="3.4" />
      <path d="M14 -112L-84 -80M14 -112L62 -80M14 -112V-80" />
      <path d="M-84 -80V-64" strokeWidth="1.6" />
      <circle cx="14" cy="-114" r="1.8" fill="#86e4de" stroke="none" className="animate-twinkle" />
    </g>
  );
}

/* ── استک‌های کانتینری بندر ── */
const quayStacks = Array.from({ length: 62 }, (_, i) => ({
  x: 840 + i * 12.6,
  h: 7 + ((i * 37) % 6) * 4.4,
  w: 11 + (i % 3),
  tone: i % 4,
}));
const quayTones = ["#0c2a50", "#0a2244", "#10325c", "#0b2749"];

/* ───────────────────────── لایه‌ی پشتی ───────────────────────── */
export function SceneBack() {
  return (
    <svg
      viewBox={VB}
      preserveAspectRatio={PAR}
      className="absolute inset-0 size-full"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="hb-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#040c19" />
          <stop offset="0.34" stopColor="#071730" />
          <stop offset="0.62" stopColor="#0d2f58" />
          <stop offset="0.8" stopColor="#1a5486" />
          <stop offset="1" stopColor="#2f86b8" />
        </linearGradient>
        <linearGradient id="hb-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1d5f92" />
          <stop offset="0.12" stopColor="#12426f" />
          <stop offset="0.5" stopColor="#0a2447" />
          <stop offset="1" stopColor="#040c19" />
        </linearGradient>
        <radialGradient id="hb-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#7fe3dd" stopOpacity="0.5" />
          <stop offset="0.5" stopColor="#3fd0c9" stopOpacity="0.14" />
          <stop offset="1" stopColor="#3fd0c9" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hb-sweep" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0" stopColor="#3fd0c9" stopOpacity="0.38" />
          <stop offset="1" stopColor="#3fd0c9" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* آسمان و دریا */}
      <rect width="1600" height={SEA_Y} fill="url(#hb-sky)" />
      <rect y={SEA_Y} width="1600" height={900 - SEA_Y} fill="url(#hb-sea)" />

      {/* ستاره‌ها */}
      <g fill="#cfe7ff">
        {stars.map((s, i) => (
          <circle
            key={i}
            cx={s.x}
            cy={s.y}
            r={s.r}
            className="animate-twinkle"
            style={{ animationDelay: `${s.d}s`, animationDuration: `${3.5 + (i % 4)}s` }}
          />
        ))}
      </g>

      {/* درخشش افق */}
      <ellipse cx="820" cy={SEA_Y} rx="980" ry="150" fill="url(#hb-glow)" />
      <ellipse cx="820" cy={SEA_Y + 46} rx="560" ry="46" fill="url(#hb-glow)" opacity="0.5" />
      <rect y={SEA_Y - 1} width="1600" height="2" fill="#8cc0f0" opacity="0.35" />

      {/* رادار */}
      <g opacity="0.75">
        <g fill="none" stroke="#3fd0c9" strokeOpacity="0.2" strokeWidth="1">
          <circle cx="300" cy="250" r="60" />
          <circle cx="300" cy="250" r="125" />
          <circle cx="300" cy="250" r="190" strokeOpacity="0.32" />
          <path d="M300 50V450M100 250H500" strokeDasharray="2 7" />
        </g>
        <g stroke="#3fd0c9" strokeOpacity="0.32" strokeWidth="1">
          {Array.from({ length: 72 }, (_, i) => {
            const a = (i * 5 * Math.PI) / 180;
            const len = i % 6 === 0 ? 10 : 5;
            const x1 = 300 + Math.cos(a) * 190;
            const y1 = 250 + Math.sin(a) * 190;
            const x2 = 300 + Math.cos(a) * (190 - len);
            const y2 = 250 + Math.sin(a) * (190 - len);
            return <line key={i} x1={x1.toFixed(1)} y1={y1.toFixed(1)} x2={x2.toFixed(1)} y2={y2.toFixed(1)} />;
          })}
        </g>
        <g className="animate-sweep" style={{ transformOrigin: "300px 250px" }}>
          <path d="M300 250L490 250A190 190 0 0 0 455.6 141Z" fill="url(#hb-sweep)" />
          <path d="M300 250H490" stroke="#86e4de" strokeOpacity="0.7" strokeWidth="1.2" />
        </g>
        {[
          [388, 196, 0],
          [226, 304, 1.8],
          [352, 338, 3.4],
        ].map(([cx, cy, d]) => (
          <g key={`${cx}-${cy}`}>
            <circle cx={cx} cy={cy} r="2.6" fill="#86e4de" />
            <circle
              cx={cx}
              cy={cy}
              r="6"
              fill="none"
              stroke="#86e4de"
              strokeWidth="1"
              className="animate-ping-soft"
              style={{ animationDelay: `${d}s`, transformOrigin: `${cx}px ${cy}px` }}
            />
          </g>
        ))}
      </g>

      {/* بندر دوردست */}
      <g>
        {quayStacks.map((s, i) => (
          <rect
            key={i}
            x={s.x}
            y={SEA_Y + 2 - s.h}
            width={s.w}
            height={s.h}
            fill={quayTones[s.tone]}
          />
        ))}
        <rect x="830" y={SEA_Y - 1} width="770" height="4" fill="#0a2244" />
        {[900, 1030, 1170, 1320, 1470].map((x, i) => (
          <Crane key={x} x={x} s={0.78 + (i % 3) * 0.12} />
        ))}
        {/* چراغ‌های بندر */}
        <g fill="#ffe2b0">
          {[872, 1002, 1214, 1388, 1540].map((x, i) => (
            <circle
              key={x}
              cx={x}
              cy={SEA_Y - 4}
              r="1.6"
              className="animate-twinkle"
              style={{ animationDelay: `${i * 0.7}s` }}
            />
          ))}
        </g>
      </g>

      {/* بازتاب نور افق روی آب */}
      <g stroke="#8cc0f0" strokeLinecap="round" opacity="0.28">
        {Array.from({ length: 10 }, (_, i) => (
          <line
            key={i}
            x1={560 + (i % 3) * 30}
            x2={1080 - (i % 4) * 36}
            y1={SEA_Y + 10 + i * 9}
            y2={SEA_Y + 10 + i * 9}
            strokeWidth={1.2 - i * 0.06}
            strokeOpacity={0.9 - i * 0.07}
          />
        ))}
      </g>
    </svg>
  );
}

/* ── ساخت مسیر موج ── */
const wavePath = "M0 0q25 -5 50 0" + " t50 0".repeat(41);

/* ── کانتینرهای کشتی ── */
const deckY = (x: number) => -96 + (x - 10) * (18 / 992);
const stackHeights = [4, 5, 5, 4, 5, 5, 5, 4, 5, 5, 4, 5, 5, 5, 4, 4, 5, 5];
const boxTones = ["#1d4a7a", "#16395f", "#2a5f8f", "#102c4c", "#2f6d7c", "#244e66", "#43587a", "#1b6b73"];
const boxes = stackHeights.flatMap((n, c) => {
  const x = 190 + c * 33;
  const base = deckY(x + 31) + 1;
  return Array.from({ length: n }, (_, r) => ({
    x,
    y: base - (r + 1) * 22 + 1,
    fill: boxTones[(c * 5 + r * 3) % boxTones.length],
    key: `${c}-${r}`,
  }));
});

/* ── بدنه + روبنای کشتی (قابل استفاده‌ی مجدد برای بازتاب) ── */
function ShipBody() {
  return (
    <g>
      {/* بدنه */}
      <path
        d="M10 -96C40 -40 90 -8 170 0L988 0L1002 -78Z"
        fill="url(#hf-hull)"
      />
      <path d="M10 -96L1002 -78" stroke="#4d9be3" strokeOpacity="0.55" strokeWidth="1.5" fill="none" />
      <path d="M96 -14C120 -8 150 -3 176 -2L992 -2" stroke="#1d62ab" strokeOpacity="0.8" strokeWidth="3" fill="none" />

      {/* کانتینرها */}
      {boxes.map((b) => (
        <g key={b.key}>
          <rect x={b.x} y={b.y} width="31" height="21" fill={b.fill} />
          <rect x={b.x} y={b.y} width="31" height="1.6" fill="#ffffff" opacity="0.12" />
          <rect x={b.x + 30} y={b.y} width="1" height="21" fill="#040c19" opacity="0.35" />
        </g>
      ))}

      {/* دودکش */}
      <path d="M936 -166L964 -166L961 -228L939 -222Z" fill="#17375f" />
      <rect x="937" y="-208" width="25" height="7" fill="#3fd0c9" opacity="0.75" />

      {/* روبنا */}
      <rect x="818" y="-130" width="148" height="52" fill="#0f2c52" />
      <rect x="832" y="-166" width="124" height="38" fill="#13355f" />
      <rect x="846" y="-196" width="100" height="32" fill="#183f6c" />
      <path d="M828 -222H966L958 -196H838Z" fill="#1c4a7b" />
      <path d="M828 -222H966" stroke="#8cc0f0" strokeOpacity="0.6" strokeWidth="1.4" />

      {/* پنجره‌ها */}
      <g fill="#86e4de">
        {Array.from({ length: 12 }, (_, i) => (
          <rect key={i} x={842 + i * 10} y="-214" width="6.5" height="5" opacity="0.85" />
        ))}
      </g>
      <g fill="#8cc0f0" opacity="0.3">
        {Array.from({ length: 9 }, (_, i) => (
          <rect key={`a${i}`} x={856 + i * 10} y="-184" width="5" height="4" />
        ))}
        {Array.from({ length: 11 }, (_, i) => (
          <rect key={`b${i}`} x={842 + i * 10} y="-152" width="5" height="4" />
        ))}
        {Array.from({ length: 12 }, (_, i) => (
          <rect key={`c${i}`} x={826 + i * 11} y="-114" width="5" height="4" />
        ))}
      </g>

      {/* دکل */}
      <path d="M898 -222V-282M882 -268H914" stroke="#183f6c" strokeWidth="3" fill="none" />
      <circle cx="898" cy="-284" r="3" fill="#86e4de" className="animate-twinkle" />

      {/* سرعرشه‌ی دماغه */}
      <path d="M36 -96V-112H92V-92" fill="none" stroke="#183f6c" strokeWidth="2.5" />
      <path d="M64 -112V-140" stroke="#183f6c" strokeWidth="2.5" />
    </g>
  );
}

/* ───────────────────────── لایه‌ی جلو ───────────────────────── */
export function SceneFront() {
  return (
    <svg
      viewBox={VB}
      preserveAspectRatio={PAR}
      className="absolute inset-0 size-full"
      role="img"
      aria-label="تصویر برداری از یک کشتی کانتینری تجاری در حال حرکت در دریا، با بندر و جرثقیل‌های بارگیری در دوردست"
    >
      <title>کشتی کانتینری تجاری در مسیر بندر</title>
      <defs>
        <linearGradient id="hf-hull" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#12335f" />
          <stop offset="1" stopColor="#050f20" />
        </linearGradient>
        <linearGradient id="hf-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#040c19" stopOpacity="0" />
          <stop offset="1" stopColor="#040c19" stopOpacity="0.92" />
        </linearGradient>
        <linearGradient id="hf-wake" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.5" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="hf-refl" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <mask id="hf-reflmask" maskUnits="userSpaceOnUse" x="0" y="700" width="1600" height="200">
          <rect x="0" y="700" width="1600" height="90" fill="url(#hf-refl)" />
        </mask>
        <g id="hf-ship">
          <ShipBody />
        </g>
      </defs>

      {/* بازتاب */}
      <g mask="url(#hf-reflmask)" opacity="0.28">
        <use href="#hf-ship" transform="translate(70 707) scale(0.72 -0.28)" />
      </g>

      {/* امواج */}
      {[
        { y: 722, o: 0.34, c: "animate-drift-slow", w: 1.2, x: -40 },
        { y: 748, o: 0.3, c: "animate-drift", w: 1.3, x: -120 },
        { y: 782, o: 0.26, c: "animate-drift-slow", w: 1.5, x: -10 },
        { y: 820, o: 0.2, c: "animate-drift", w: 1.8, x: -170 },
        { y: 864, o: 0.14, c: "animate-drift-slow", w: 2.2, x: -80 },
      ].map((r) => (
        <g key={r.y} transform={`translate(${r.x} ${r.y})`}>
          <path d={wavePath} className={r.c} stroke="#8cc0f0" strokeOpacity={r.o} strokeWidth={r.w} fill="none" strokeLinecap="round" />
        </g>
      ))}

      {/* مسیر دریایی */}
      <g>
        <path
          d="M120 800C420 766 760 806 1100 752S1480 704 1620 690"
          fill="none"
          stroke="#3fd0c9"
          strokeOpacity="0.6"
          strokeWidth="1.6"
          strokeDasharray="7 7"
          className="animate-flow"
        />
        <g fill="#3fd0c9">
          <circle cx="120" cy="800" r="4" />
          <circle cx="1100" cy="752" r="4" />
        </g>
        <circle cx="1100" cy="752" r="9" fill="none" stroke="#3fd0c9" strokeOpacity="0.6" />
        <g fill="#86e4de" fontSize="15" fontWeight="600" opacity="0.85" className="font-sans">
          <text x="1114" y="738">خلیج فارس · ۲۷°N ۵۱°E</text>
          <text x="134" y="822">مسیر تأمین</text>
        </g>
      </g>

      {/* سایه و موج دماغه */}
      <ellipse cx="440" cy="708" rx="390" ry="6" fill="#040c19" opacity="0.55" />

      {/* کشتی */}
      <g transform="translate(70 705) scale(0.72)">
        <g className="animate-bob" style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}>
          <use href="#hf-ship" />
        </g>
      </g>

      {/* کف دماغه و ردّ حرکت (کشتی به سمت چپ حرکت می‌کند) */}
      <path d="M88 706C118 700 150 703 190 707C150 712 116 712 88 706Z" fill="#ffffff" opacity="0.4" />
      <path d="M790 706L1120 701L1180 706L1120 711Z" fill="url(#hf-wake)" opacity="0.55" />
      <path d="M800 712L1000 710L1040 713L1000 716Z" fill="url(#hf-wake)" opacity="0.35" />

      {/* محو شدن به سمت پایین (خوانایی و عمق) */}
      <rect y="700" width="1600" height="200" fill="url(#hf-fade)" />
    </svg>
  );
}
