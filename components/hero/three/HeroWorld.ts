/**
 * صحنه‌ی سه‌بعدی Hero با three.js، فقط از کد (بدون فایل مدل یا تکسچر دانلودی):
 * کشتی کانتینری، اسکله‌ی دوردست با جرثقیل، دریا، آسمان فیزیکی و نور غروب.
 * ساختار نور (Sky + PMREM + یک خورشید سایه‌انداز) از skill «threejs-scene» گرفته شده است.
 *
 * یکاها متر هستند. همه‌ی اعداد ترکیب‌بندی در LOOK و COMPOSE جمع شده تا بتوان بدون دست‌زدن
 * به هندسه تنظیمشان کرد. این ماژول فقط سمت کلاینت و با import پویا بارگذاری می‌شود.
 */
import * as THREE from "three";
import { Sky } from "three/examples/jsm/objects/Sky.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

export type HeroWorldOptions = {
  /** کاربر کاهش حرکت خواسته: فقط یک فریم ثابت رسم می‌شود */
  reducedMotion: boolean;
  /** موبایل یا دستگاه ضعیف: بدون سایه، DPR کمتر */
  lowPower: boolean;
  onReady?: () => void;
};

export type HeroWorld = {
  setVisible(visible: boolean): void;
  setPointer(x: number, y: number): void;
  dispose(): void;
};

/* ───────────────────────── ثابت‌ها ───────────────────────── */

const SHIP = { length: 300, bow: -150, beam: 20, draft: 11, deck: 14 };

/** ساعت آبی با خورشید گرم و کم‌ارتفاع؛ skyEl آسمان را رنگ می‌کند و el نور را (کمی بالاتر) */
const LOOK = {
  skyEl: 4.5,
  el: 11,
  az: 240,
  sunI: 3.3,
  sunC: "#ffb877",
  hemiS: "#8fb2e6",
  hemiG: "#14233a",
  hemiI: 0.55,
  envI: 0.7,
  turb: 3.6,
  ray: 2.6,
  mie: 0.005,
  mieG: 0.82,
  fogC: "#a9b9cf",
  fogD: 0.00035,
  exposure: 0.62,
};

const COMPOSE = {
  /** چرخش کشتی (رادیان): دماغه به‌سمت دوربین، نمای سه‌چهارم */
  turn: 0.45,
  camY: 16,
  /** شیب دوربین به بالا (رادیان) → جای خط افق */
  pitch: 0.04,
  /** کسری از عرض کادر که کشتی اشغال می‌کند: عریض / باریک */
  fracWide: 0.6,
  fracNarrow: 0.94,
  /** کشتی در دسکتاپ چقدر به چپ می‌رود (کسری از نیم‌عرض کادر)؛ متن در سمت راست است */
  shiftWide: 0.42,
};

const BOX_COLORS = [
  "#1d4a7a", "#16395f", "#2a5f8f", "#2f6d7c", "#244e66", "#43587a",
  "#7b8794", "#d8dde3", "#3a4a5c", "#1b6b73", "#8a2b2b", "#c9a24a",
];

/* ───────────────────────── ابزارها ───────────────────────── */

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function dirFrom(elDeg: number, azDeg: number) {
  const e = THREE.MathUtils.degToRad(elDeg);
  const a = THREE.MathUtils.degToRad(azDeg);
  return new THREE.Vector3(Math.sin(a) * Math.cos(e), Math.sin(e), -Math.cos(a) * Math.cos(e));
}

/** با باریک‌شدن صفحه، میدان دید عمودی بازتر می‌شود تا عرض دیده‌شده ثابت بماند */
function fitFov(aspect: number, base = 38, baseAspect = 16 / 9) {
  if (aspect >= baseAspect) return base;
  const h = Math.tan(THREE.MathUtils.degToRad(base) / 2) * baseAspect;
  return Math.min(THREE.MathUtils.radToDeg(2 * Math.atan(h / aspect)), 72);
}

/** نقشه‌ی نرمال قابل‌تکرار برای موج‌ها: مجموع سینوس‌ها با بسامد صحیح */
function waterNormals(seed: number, size = 256, slope = 40) {
  const rnd = mulberry32(seed);
  const waves = Array.from({ length: 9 }, () => {
    let kx = 0;
    let ky = 0;
    while (kx === 0 && ky === 0) {
      kx = Math.round((rnd() * 2 - 1) * 5);
      ky = Math.round((rnd() * 2 - 1) * 5);
    }
    return { kx, ky, amp: (0.4 / Math.hypot(kx, ky)) * (0.6 + rnd() * 0.8), ph: rnd() * Math.PI * 2 };
  });
  const data = new Uint8Array(size * size * 4);
  const k = (2 * Math.PI) / size;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let dx = 0;
      let dy = 0;
      for (const w of waves) {
        const c = Math.cos(k * (w.kx * x + w.ky * y) + w.ph) * w.amp * k;
        dx += c * w.kx;
        dy += c * w.ky;
      }
      let nx = -dx * slope;
      let ny = -dy * slope;
      let nz = 1;
      const len = Math.hypot(nx, ny, nz);
      nx /= len;
      ny /= len;
      nz /= len;
      const i = (y * size + x) * 4;
      data[i] = (nx * 0.5 + 0.5) * 255;
      data[i + 1] = (ny * 0.5 + 0.5) * 255;
      data[i + 2] = (nz * 0.5 + 0.5) * 255;
      data[i + 3] = 255;
    }
  }
  const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.magFilter = THREE.LinearFilter;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.generateMipmaps = true;
  tex.colorSpace = THREE.NoColorSpace;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

/** بافت کانتینر: شیار موج‌دار و خط درِ انتها، رنگ از instance می‌آید */
function containerTexture() {
  const c = document.createElement("canvas");
  c.width = 128;
  c.height = 64;
  const g = c.getContext("2d")!;
  g.fillStyle = "#e8e8e8";
  g.fillRect(0, 0, 128, 64);
  for (let x = 0; x < 128; x += 4) {
    g.fillStyle = x % 8 === 0 ? "#cfcfcf" : "#f4f4f4";
    g.fillRect(x, 3, 2, 58);
  }
  g.fillStyle = "#9a9a9a";
  g.fillRect(0, 0, 128, 3);
  g.fillRect(0, 61, 128, 3);
  g.fillRect(0, 0, 3, 64);
  g.fillRect(125, 0, 3, 64);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

/** رد کف پشت کشتی: خط‌های کم‌رنگ که به انتها محو می‌شوند */
function wakeTexture() {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 128;
  const g = c.getContext("2d")!;
  const rnd = mulberry32(7);
  g.fillStyle = "#ffffff";
  for (let i = 0; i < 1400; i++) {
    g.globalAlpha = 0.05 + rnd() * 0.16;
    g.fillRect(rnd() * 512, rnd() * 128, 14 + rnd() * 70, 1 + rnd() * 2.4);
  }
  g.globalAlpha = 1;
  g.globalCompositeOperation = "destination-in";
  const gx = g.createLinearGradient(0, 0, 512, 0);
  gx.addColorStop(0, "rgba(255,255,255,1)");
  gx.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = gx;
  g.fillRect(0, 0, 512, 128);
  const gy = g.createLinearGradient(0, 0, 0, 128);
  gy.addColorStop(0, "rgba(255,255,255,0)");
  gy.addColorStop(0.5, "rgba(255,255,255,1)");
  gy.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = gy;
  g.fillRect(0, 0, 512, 128);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/* ───────────────────────── کشتی ───────────────────────── */

const halfBeam = (u: number) => {
  const bow = Math.pow(Math.sin(Math.min(1, u / 0.3) * (Math.PI / 2)), 0.75);
  const stern = 1 - Math.max(0, (u - 0.88) / 0.12) * 0.28;
  return SHIP.beam * bow * stern;
};
/** عرشه در دماغه کمی بالا می‌آید (sheer) */
const deckAt = (u: number) => SHIP.deck + Math.pow(Math.max(0, 0.22 - u) / 0.22, 2) * 7;

/** بدنه از مقطع‌های عرضی ساخته می‌شود (loft)، نه جعبه */
function buildHull() {
  const stations = 56;
  const positions: number[] = [];
  const colors: number[] = [];
  const indices: number[] = [];
  const hull = new THREE.Color("#10294a");
  const boot = new THREE.Color("#1a8f9a");
  const under = new THREE.Color("#0a1a30");
  let ringN = 0;
  let last: number[][] = [];

  for (let i = 0; i <= stations; i++) {
    const u = i / stations;
    const x = SHIP.bow + u * SHIP.length;
    const b = halfBeam(u);
    const deck = deckAt(u);
    const keel = -SHIP.draft * (u < 0.12 ? 0.45 + (0.55 * u) / 0.12 : 1);
    const bf = b * (1 + (0.1 * Math.max(0, 0.3 - u)) / 0.3);
    const half: [number, number][] = [
      [deck, bf],
      [deck - 1.5, bf * 0.985],
      [7, b],
      [2.4, b],
      [1.0, b * 0.99],
      [0, b * 0.985],
      [keel * 0.45, b * 0.95],
      [keel * 0.85, b * 0.72],
      [keel, b * 0.3],
    ];
    const ring: [number, number][] = [
      ...half.map(([y, z]) => [y, -z] as [number, number]),
      ...half.slice().reverse().map(([y, z]) => [y, z] as [number, number]),
    ];
    ringN = ring.length;
    last = [];
    for (const [y, z] of ring) {
      positions.push(x, y, z);
      const col = y < -0.5 ? under : y < 1.6 ? boot : hull;
      colors.push(col.r, col.g, col.b);
      last.push([x, y, z]);
    }
  }
  for (let i = 0; i < stations; i++) {
    for (let j = 0; j < ringN; j++) {
      const a = i * ringN + j;
      const b = i * ringN + ((j + 1) % ringN);
      const c = (i + 1) * ringN + j;
      const d = (i + 1) * ringN + ((j + 1) % ringN);
      indices.push(a, c, b, b, c, d);
    }
  }
  // آینه‌ی عقب (transom): مرکز + حلقه، با رأس‌های جدا تا نرمال‌ها جدا بمانند
  const base = positions.length / 3;
  const cy = last.reduce((s, p) => s + p[1], 0) / last.length;
  positions.push(last[0][0], cy, 0);
  colors.push(hull.r, hull.g, hull.b);
  for (const [x, y, z] of last) {
    positions.push(x, y, z);
    colors.push(hull.r, hull.g, hull.b);
  }
  for (let j = 0; j < ringN; j++) indices.push(base, base + 1 + j, base + 1 + ((j + 1) % ringN));

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

function buildShip(rnd: () => number, boxTex: THREE.Texture) {
  const g = new THREE.Group();

  const hull = new THREE.Mesh(
    buildHull(),
    new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.55, metalness: 0.2, side: THREE.DoubleSide }),
  );
  hull.castShadow = true;
  hull.receiveShadow = true;
  g.add(hull);

  // کانتینرها: یک InstancedMesh (یک draw call)
  const stackStartX = -96;
  const bays = 15;
  const pitch = 12.6;
  const items: { x: number; y: number; z: number; c: string }[] = [];
  for (let bay = 0; bay < bays; bay++) {
    const x = stackStartX + bay * pitch;
    const u = (x - SHIP.bow) / SHIP.length;
    const b = halfBeam(u);
    const deck = deckAt(u);
    for (let k = 0; k < 14; k++) {
      const z = -17.5 + (k + 0.5) * 2.5;
      if (Math.abs(z) + 1.4 > b) continue;
      const wave = 0.5 + 0.5 * Math.sin(bay * 0.7 + k * 0.18);
      let tiers = 2 + Math.floor(wave * 4 + rnd() * 2);
      tiers = Math.min(6, tiers);
      if (bay < 3) tiers = Math.max(1, tiers - 2);
      for (let t = 0; t < tiers; t++) {
        items.push({ x, y: deck + 1.35 + t * 2.62, z, c: BOX_COLORS[Math.floor(rnd() * BOX_COLORS.length)] });
      }
    }
  }
  const boxes = new THREE.InstancedMesh(
    new THREE.BoxGeometry(12, 2.55, 2.4),
    new THREE.MeshStandardMaterial({ map: boxTex, roughness: 0.62, metalness: 0.25 }),
    items.length,
  );
  const m = new THREE.Matrix4();
  const col = new THREE.Color();
  items.forEach((it, i) => {
    m.makeTranslation(it.x, it.y, it.z);
    boxes.setMatrixAt(i, m);
    boxes.setColorAt(i, col.set(it.c));
  });
  boxes.instanceMatrix.needsUpdate = true;
  if (boxes.instanceColor) boxes.instanceColor.needsUpdate = true;
  boxes.castShadow = true;
  boxes.receiveShadow = true;
  g.add(boxes);

  // روبنا
  const white = new THREE.MeshStandardMaterial({ color: "#e9eef4", roughness: 0.68, metalness: 0.05 });
  const navy = new THREE.MeshStandardMaterial({ color: "#12304f", roughness: 0.6, metalness: 0.1 });
  const aqua = new THREE.MeshStandardMaterial({ color: "#1fb5b0", roughness: 0.5 });
  const glass = new THREE.MeshStandardMaterial({
    color: "#0b1626",
    emissive: new THREE.Color("#ffcf99"),
    emissiveIntensity: 0.4,
    roughness: 0.2,
    metalness: 0.4,
  });
  const box = (w: number, h: number, d: number, x: number, y: number, z: number, mat: THREE.Material) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    mesh.position.set(x, y + h / 2, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    g.add(mesh);
    return mesh;
  };
  const D = SHIP.deck;
  box(30, 26, 30, 114, D, 0, white); // ساختمان اصلی تا y=40
  box(22, 12, 28, 116, D + 26, 0, white); // طبقه‌ی بالا تا y=52
  box(14, 6, 44, 111, D + 38, 0, white); // پل فرماندهی با بال‌ها تا y=58
  box(9, 15, 12, 121, D + 38, 0, navy); // دودکش
  box(9.2, 2.4, 12.2, 121, D + 46, 0, aqua); // نوار دودکش
  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.55, 16, 8), navy);
  mast.position.set(108, D + 44 + 8, 0);
  mast.castShadow = true;
  g.add(mast);
  box(0.4, 0.4, 12, 108, D + 58, 0, navy);

  // پنجره‌ها
  const strip = (w: number, h: number, d: number, x: number, y: number, z: number) => box(w, h, d, x, y, z, glass);
  strip(0.3, 1.6, 40, 103.9, D + 39.2, 0); // جلوی پل
  strip(12, 1.6, 0.3, 111, D + 39.2, 22.1);
  strip(12, 1.6, 0.3, 111, D + 39.2, -22.1);
  for (const yy of [30.5, 33.5]) {
    strip(0.3, 1.4, 24, 104.9, yy, 0);
    strip(18, 1.4, 0.3, 116, yy, 14.1);
    strip(18, 1.4, 0.3, 116, yy, -14.1);
  }
  for (const yy of [18, 21.5, 25, 28.5, 32, 35.5]) {
    strip(0.3, 1.1, 26, 98.9, yy, 0);
    strip(24, 1.1, 0.3, 114, yy, 15.1);
    strip(24, 1.1, 0.3, 114, yy, -15.1);
  }

  // دماغه
  box(10, 4, 16, SHIP.bow + 28, deckAt(0.09), 0, navy);

  return g;
}

/* ───────────────────────── بندر دوردست ───────────────────────── */

function buildPort(rnd: () => number, boxTex: THREE.Texture) {
  const g = new THREE.Group();
  g.position.set(0, 0, -380);

  const quayMat = new THREE.MeshStandardMaterial({ color: "#2b3a4d", roughness: 0.9 });
  const quay = new THREE.Mesh(new THREE.BoxGeometry(1500, 4, 80), quayMat);
  quay.position.set(550, 2, 0);
  quay.receiveShadow = true;
  g.add(quay);

  const shed = new THREE.Mesh(
    new THREE.BoxGeometry(260, 16, 40),
    new THREE.MeshStandardMaterial({ color: "#34465c", roughness: 0.85 }),
  );
  shed.position.set(520, 12, -48);
  g.add(shed);

  // پشته‌های کانتینر
  const items: { x: number; y: number; z: number; c: string }[] = [];
  for (let r = 0; r < 5; r++) {
    for (let bay = 0; bay < 70; bay++) {
      if (rnd() < 0.12) continue;
      const x = 120 + bay * 12.6;
      const tiers = 1 + Math.floor(rnd() * 4);
      for (let t = 0; t < tiers; t++) {
        items.push({ x, y: 5.3 + t * 2.62, z: -14 + r * 3.1, c: BOX_COLORS[Math.floor(rnd() * BOX_COLORS.length)] });
      }
    }
  }
  const stacks = new THREE.InstancedMesh(
    new THREE.BoxGeometry(12, 2.55, 2.4),
    new THREE.MeshStandardMaterial({ map: boxTex, roughness: 0.65, metalness: 0.2 }),
    items.length,
  );
  const m = new THREE.Matrix4();
  const col = new THREE.Color();
  items.forEach((it, i) => {
    m.makeTranslation(it.x, it.y, it.z);
    stacks.setMatrixAt(i, m);
    stacks.setColorAt(i, col.set(it.c));
  });
  stacks.instanceMatrix.needsUpdate = true;
  if (stacks.instanceColor) stacks.instanceColor.needsUpdate = true;
  g.add(stacks);

  // جرثقیل گنتری: هندسه‌ی ادغام‌شده، پنج نسخه
  const parts: THREE.BufferGeometry[] = [];
  const add = (w: number, h: number, d: number, x: number, y: number, z: number) => {
    const geo = new THREE.BoxGeometry(w, h, d);
    geo.translate(x, y + h / 2, z);
    parts.push(geo);
  };
  for (const lx of [-12, 12]) for (const lz of [-8, 8]) add(1.8, 40, 1.8, lx, 4, lz);
  add(28, 3, 20, 0, 43, 0);
  add(3, 3, 100, 0, 46, 14); // بازوی بلند به سمت آب
  add(3, 3, 30, 0, 46, -30);
  add(6, 4.5, 6, 0, 42, 28);
  add(1.2, 16, 1.2, 0, 49, -2);
  const craneGeo = mergeGeometries(parts)!;
  const craneMat = new THREE.MeshStandardMaterial({ color: "#a8b6c8", roughness: 0.6, metalness: 0.3 });
  [230, 340, 480, 610, 770].forEach((x, i) => {
    const crane = new THREE.Mesh(craneGeo, craneMat);
    crane.position.set(x, 4, 2);
    crane.scale.setScalar(0.85 + (i % 3) * 0.1);
    g.add(crane);
  });

  return g;
}

/** رشته‌کوه دوردست: سایه‌ای که در مه حل می‌شود */
function buildRidge() {
  const shape = new THREE.Shape();
  shape.moveTo(-6000, 0);
  for (let i = 0; i <= 120; i++) {
    const x = -6000 + i * 100;
    const y = 50 + 70 * Math.sin(i * 0.37) + 40 * Math.sin(i * 0.91 + 1.3) + 25 * Math.sin(i * 2.3);
    shape.lineTo(x, Math.max(10, y));
  }
  shape.lineTo(6000, 0);
  const mesh = new THREE.Mesh(new THREE.ShapeGeometry(shape), new THREE.MeshBasicMaterial({ color: "#4d6382" }));
  mesh.position.set(0, 0, -2400);
  return mesh;
}

/* ───────────────────────── ساخت و اجرای صحنه ───────────────────────── */

export function createHeroWorld(canvas: HTMLCanvasElement, opts: HeroWorldOptions): HeroWorld {
  const rnd = mulberry32(2024);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = LOOK.exposure;
  renderer.shadowMap.enabled = !opts.lowPower;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  let dpr = Math.min(window.devicePixelRatio || 1, opts.lowPower ? 1.25 : 1.75);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 16 / 9, 1, 30000);

  // آسمان فیزیکی
  const far = 9000;
  const sky = new Sky();
  sky.scale.setScalar(far);
  sky.renderOrder = -3;
  sky.frustumCulled = false;
  scene.add(sky);
  const skyDir = dirFrom(LOOK.skyEl, LOOK.az);
  const applySky = (s: Sky) => {
    const u = s.material.uniforms;
    u["turbidity"].value = LOOK.turb;
    u["rayleigh"].value = LOOK.ray;
    u["mieCoefficient"].value = LOOK.mie;
    u["mieDirectionalG"].value = LOOK.mieG;
    (u["sunPosition"].value as THREE.Vector3).copy(skyDir);
  };
  applySky(sky);

  // نور محیطی از همان آسمان (PMREM): بازتاب‌ها و نور پرکننده با آسمان یکی می‌شوند
  const envScene = new THREE.Scene();
  const envSky = new Sky();
  envSky.scale.setScalar(far * 0.5);
  applySky(envSky);
  envScene.add(envSky);
  const envGround = new THREE.Mesh(
    new THREE.CircleGeometry(far * 0.4, 32),
    new THREE.MeshBasicMaterial({ color: new THREE.Color(0.14, 0.2, 0.28) }),
  );
  envGround.rotation.x = -Math.PI / 2;
  envGround.position.y = -2;
  envScene.add(envGround);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envRT = pmrem.fromScene(envScene, 0, 1, far);
  scene.environment = envRT.texture;
  scene.environmentIntensity = LOOK.envI;
  scene.fog = new THREE.FogExp2(LOOK.fogC, LOOK.fogD);

  // نور: یک خورشید سایه‌انداز + نیم‌کره‌ی رنگی
  const sun = new THREE.DirectionalLight(LOOK.sunC, LOOK.sunI);
  const sunDir = dirFrom(LOOK.el, LOOK.az);
  sun.castShadow = !opts.lowPower;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.bias = -0.0002;
  sun.shadow.normalBias = 0.15;
  const half = 230;
  Object.assign(sun.shadow.camera, { left: -half, right: half, top: half, bottom: -half, near: 1, far: 2400 });
  sun.shadow.camera.updateProjectionMatrix();
  scene.add(sun, sun.target);
  scene.add(new THREE.HemisphereLight(LOOK.hemiS, LOOK.hemiG, LOOK.hemiI));

  // دریا: دو لایه‌ی موج با نقشه‌ی نرمال که در دو جهت آهسته می‌لغزند
  const nA = waterNormals(11);
  const nB = waterNormals(29, 256, 55);
  nA.repeat.set(220, 220);
  nB.repeat.set(95, 95);
  const seaGeo = new THREE.PlaneGeometry(20000, 20000);
  seaGeo.rotateX(-Math.PI / 2);
  const sea = new THREE.Mesh(
    seaGeo,
    new THREE.MeshStandardMaterial({ color: "#0b2b50", roughness: 0.1, metalness: 0, normalMap: nA, normalScale: new THREE.Vector2(0.9, 0.9) }),
  );
  sea.receiveShadow = true;
  scene.add(sea);
  const sea2 = new THREE.Mesh(
    seaGeo,
    new THREE.MeshStandardMaterial({
      color: "#0d3560",
      roughness: 0.14,
      metalness: 0,
      normalMap: nB,
      normalScale: new THREE.Vector2(0.7, 0.7),
      transparent: true,
      opacity: 0.4,
      depthWrite: false,
    }),
  );
  sea2.position.y = 0.05;
  scene.add(sea2);

  // دنیا
  const boxTex = containerTexture();
  scene.add(buildRidge());
  scene.add(buildPort(rnd, boxTex));

  const shipRoot = new THREE.Group();
  shipRoot.rotation.y = COMPOSE.turn;
  const hullGroup = buildShip(rnd, boxTex);
  shipRoot.add(hullGroup);
  const wakeTex = wakeTexture();
  const wakeGeo = new THREE.PlaneGeometry(330, 62);
  wakeGeo.rotateX(-Math.PI / 2);
  const wake = new THREE.Mesh(
    wakeGeo,
    new THREE.MeshBasicMaterial({ map: wakeTex, transparent: true, opacity: 0.6, depthWrite: false }),
  );
  wake.position.set(SHIP.bow + SHIP.length + 160, 0.2, 0);
  shipRoot.add(wake);
  scene.add(shipRoot);

  /* ── چیدمان و اندازه ── */
  const state = { dist: 330, halfW: 200, shipX: 0, lookY: 28, visible: true, running: false };
  const pointer = { tx: 0, ty: 0, x: 0, y: 0 };
  const look = new THREE.Vector3();

  function layout() {
    const w = canvas.clientWidth || 1;
    const h = canvas.clientHeight || 1;
    renderer.setPixelRatio(dpr);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = fitFov(camera.aspect);
    camera.updateProjectionMatrix();

    const wide = camera.aspect >= 1.35;
    const frac = wide ? COMPOSE.fracWide : COMPOSE.fracNarrow;
    const projected = SHIP.length * Math.cos(COMPOSE.turn) + 40 * Math.sin(COMPOSE.turn);
    const tanHalf = Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
    state.dist = Math.max(200, projected / frac / (2 * tanHalf * camera.aspect));
    state.halfW = state.dist * tanHalf * camera.aspect;
    state.shipX = wide ? -COMPOSE.shiftWide * state.halfW : 0;
    state.lookY = COMPOSE.camY + state.dist * Math.tan(COMPOSE.pitch);
    if (!state.running) draw(performance.now() / 1000);
  }

  const scrollProgress = () => {
    const host = canvas.parentElement;
    const hh = host?.offsetHeight || window.innerHeight;
    return THREE.MathUtils.clamp(window.scrollY / hh, 0, 1);
  };

  function draw(t: number) {
    const p = scrollProgress();
    pointer.x += (pointer.tx - pointer.x) * 0.05;
    pointer.y += (pointer.ty - pointer.y) * 0.05;

    // کشتی آرام روی موج می‌لرزد
    hullGroup.position.y = Math.sin(t * 0.6) * 0.25;
    hullGroup.rotation.x = Math.sin(t * 0.5) * 0.0035;
    hullGroup.rotation.z = Math.sin(t * 0.37 + 1) * 0.0028;
    shipRoot.position.set(state.shipX - p * 45, 0, 0);

    // دریا
    nA.offset.x = t * 0.0016;
    nA.offset.y = t * 0.0009;
    nB.offset.x = -t * 0.0011;
    nB.offset.y = t * 0.0017;

    // دوربین: رانش آرام + parallax اشاره‌گر + حرکت با اسکرول
    camera.position.set(
      pointer.x * 12 - p * 40 + Math.sin(t * 0.05) * 6,
      COMPOSE.camY + pointer.y * 3 + p * 4,
      state.dist - p * 80,
    );
    look.set(pointer.x * 8 - p * 24 + Math.sin(t * 0.04) * 10, state.lookY, 0);
    camera.lookAt(look);

    // سایه‌ی خورشید همراه کشتی
    sun.target.position.set(shipRoot.position.x, 0, 0);
    sun.position.copy(sun.target.position).addScaledVector(sunDir, 900);
    sun.target.updateMatrixWorld();

    renderer.render(scene, camera);
  }

  /* ── حلقه‌ی رندر + کاهش کیفیت خودکار ── */
  let raf = 0;
  let last = performance.now() / 1000;
  const perf = { sum: 0, n: 0 };
  function frame() {
    if (!state.running) return;
    const t = performance.now() / 1000;
    const dt = Math.min(t - last, 0.25);
    last = t;
    draw(t);
    perf.sum += dt;
    if (++perf.n >= 120) {
      const avg = perf.sum / perf.n;
      perf.sum = 0;
      perf.n = 0;
      if (avg > 1 / 38) {
        if (dpr > 1) {
          dpr = Math.max(1, dpr - 0.35);
          layout();
        } else if (sun.castShadow) {
          sun.castShadow = false;
        }
      }
    }
    raf = requestAnimationFrame(frame);
  }
  function start() {
    if (state.running || opts.reducedMotion) return;
    state.running = true;
    last = performance.now() / 1000;
    raf = requestAnimationFrame(frame);
  }
  function stop() {
    state.running = false;
    cancelAnimationFrame(raf);
  }

  const ro = new ResizeObserver(() => layout());
  ro.observe(canvas);
  layout();
  draw(performance.now() / 1000);
  requestAnimationFrame(() => opts.onReady?.());
  start();

  const onVisibility = () => {
    if (document.hidden) stop();
    else if (state.visible) start();
  };
  document.addEventListener("visibilitychange", onVisibility);

  return {
    setVisible(v) {
      state.visible = v;
      if (v && !document.hidden) start();
      else stop();
    },
    setPointer(x, y) {
      pointer.tx = x;
      pointer.ty = y;
    },
    dispose() {
      stop();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      scene.traverse((o) => {
        const mesh = o as THREE.Mesh;
        mesh.geometry?.dispose?.();
        const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
        else mat?.dispose?.();
      });
      [nA, nB, boxTex, wakeTex].forEach((t) => t.dispose());
      envRT.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}
