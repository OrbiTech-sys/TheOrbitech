/**
 * "The exploded page": five sheets standing in steel clips on a concrete slab.
 * The back sheet is the finished page; each glass sheet in front carries one
 * layer of how it was made: grid, spacing, focus states, print marks.
 *
 * Loaded on demand by HeroScene. Never imported on the server.
 * Renders only while something is moving, and stops when the stage is off screen.
 */
import {
  CanvasTexture,
  Color,
  DirectionalLight,
  DoubleSide,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  NeutralToneMapping,
  PCFSoftShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  RepeatWrapping,
  Scene,
  ShadowMaterial,
  SRGBColorSpace,
  type BufferGeometry,
  type Material,
  type Texture,
  WebGLRenderer,
} from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

export interface LayersOptions {
  /** First frame is on screen. */
  onReady?: () => void;
  /** Everything has stopped moving. The scene is idle until the visitor does something. */
  onSettled?: () => void;
  onContextLost?: () => void;
}

export interface LayersHandle {
  dispose(): void;
}

/* ── Geometry of the object (scene units ≈ decimetres) ───────── */

const SHEET_W = 1.75;
const SHEET_H = 1.1;
const SHEET_T = 0.016; // paper sheet
const GLASS_T = 0.024;
const SLAB = { w: 2.4, h: 0.14, d: 1.8 };
const LAYER_COUNT = 5;
const GAP_COLLAPSED = 0.016;
const GAP_SPREAD = 0.27;
const GAP_SCROLL = 0.15;
const BASE_YAW = -0.6;

/* ── Colours come from the CSS tokens ────────────────────────── */

// Used only if the browser can't parse the token's colour function in a canvas.
const FALLBACK: Record<string, string> = {
  "--color-paper-hi": "#FBF9F5",
  "--color-stone": "#EAE6DE",
  "--color-ink": "#1B1612",
  "--color-ink-2": "#3D3732",
  "--color-muted": "#5D5751",
  "--color-night": "#0E1818",
  "--color-glass": "#BDD7D7",
  "--color-kiln": "#D2511A",
  "--color-kiln-deep": "#B13C11",
  "--color-concrete": "#A29E98",
  "--color-steel": "#BABFBF",
};

function readTokens() {
  const probe = document.createElement("canvas");
  probe.width = probe.height = 1;
  const ctx = probe.getContext("2d", { willReadFrequently: true })!;
  const style = getComputedStyle(document.documentElement);
  const hex = (name: string) => {
    const raw = style.getPropertyValue(name).trim();
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = "#010203"; // sentinel: stays if the colour can't be parsed
    ctx.fillStyle = raw;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    if (r === 1 && g === 2 && b === 3) return FALLBACK[name];
    return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
  };
  return {
    paperHi: hex("--color-paper-hi"),
    stone: hex("--color-stone"),
    ink: hex("--color-ink"),
    ink2: hex("--color-ink-2"),
    muted: hex("--color-muted"),
    night: hex("--color-night"),
    glass: hex("--color-glass"),
    kiln: hex("--color-kiln"),
    kilnDeep: hex("--color-kiln-deep"),
    concrete: hex("--color-concrete"),
    steel: hex("--color-steel"),
  };
}
type Tokens = ReturnType<typeof readTokens>;

/* ── Textures drawn with Canvas2D ────────────────────────────── */

const TEX_W = 1400;
const TEX_H = 880;

function newCanvas(w = TEX_W, h = TEX_H) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  return { canvas, ctx: canvas.getContext("2d")! };
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
function fillRR(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number, color: string, alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  roundRect(ctx, x, y, w, h, r);
  ctx.fill();
  ctx.restore();
}

/** The finished page, drawn as a quiet layout of bars and blocks (no browser chrome). */
function drawPage(t: Tokens) {
  const { canvas, ctx } = newCanvas();
  ctx.fillStyle = t.paperHi;
  ctx.fillRect(0, 0, TEX_W, TEX_H);

  // Header
  ctx.strokeStyle = t.ink;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(92, 74, 17, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = t.kiln;
  ctx.beginPath();
  ctx.arc(104, 62, 7, 0, Math.PI * 2);
  ctx.fill();
  fillRR(ctx, 126, 64, 120, 20, 10, t.ink);
  for (let i = 0; i < 3; i++) fillRR(ctx, 800 + i * 120, 66, 84, 14, 7, t.ink2, 0.7);
  fillRR(ctx, 1150, 50, 170, 46, 12, t.kilnDeep);

  // Hero copy
  fillRR(ctx, 80, 190, 640, 74, 16, t.ink);
  fillRR(ctx, 80, 284, 470, 74, 16, t.ink);
  [560, 530, 400].forEach((w, i) => fillRR(ctx, 80, 398 + i * 30, w, 14, 7, t.muted, 0.5));
  fillRR(ctx, 80, 510, 210, 58, 12, t.ink);
  ctx.strokeStyle = t.ink2;
  ctx.lineWidth = 3;
  roundRect(ctx, 312, 511, 190, 56, 12);
  ctx.stroke();

  // Hero picture
  fillRR(ctx, 780, 180, 540, 400, 22, t.night);
  fillRR(ctx, 822, 222, 300, 200, 12, t.glass, 0.92);
  fillRR(ctx, 822, 446, 200, 14, 7, t.glass, 0.5);
  fillRR(ctx, 822, 474, 300, 14, 7, t.glass, 0.3);
  ctx.fillStyle = t.kiln;
  ctx.beginPath();
  ctx.arc(1220, 500, 54, 0, Math.PI * 2);
  ctx.fill();

  // Three columns
  for (let i = 0; i < 3; i++) {
    const x = 80 + i * 430;
    fillRR(ctx, x, 650, 380, 120, 14, t.stone);
    fillRR(ctx, x, 792, 250, 14, 7, t.ink, 0.85);
    fillRR(ctx, x, 818, 330, 12, 6, t.muted, 0.45);
  }
  return canvas;
}

/** A 12-column grid. */
function drawStructure(t: Tokens) {
  const { canvas, ctx } = newCanvas();
  const left = 80;
  const width = 1240;
  const gap = 20;
  const col = (width - gap * 11) / 12;
  for (let i = 0; i < 12; i++) {
    ctx.fillStyle = t.kiln;
    ctx.globalAlpha = 0.1;
    ctx.fillRect(left + i * (col + gap), 40, col, TEX_H - 80);
  }
  ctx.globalAlpha = 0.7;
  ctx.strokeStyle = t.kilnDeep;
  ctx.lineWidth = 2.5;
  ctx.setLineDash([]);
  for (const x of [left, left + width]) {
    ctx.beginPath();
    ctx.moveTo(x, 20);
    ctx.lineTo(x, TEX_H - 20);
    ctx.stroke();
  }
  ctx.setLineDash([14, 10]);
  for (const y of [40, TEX_H - 40]) {
    ctx.beginPath();
    ctx.moveTo(30, y);
    ctx.lineTo(TEX_W - 30, y);
    ctx.stroke();
  }
  return canvas;
}

/** A baseline grid and the spacing between things. */
function drawSpacing(t: Tokens) {
  const { canvas, ctx } = newCanvas();
  ctx.strokeStyle = t.ink;
  ctx.globalAlpha = 0.16;
  ctx.lineWidth = 1.5;
  for (let y = 32; y < TEX_H; y += 32) {
    ctx.beginPath();
    ctx.moveTo(60, y);
    ctx.lineTo(TEX_W - 60, y);
    ctx.stroke();
  }

  const callout = (x1: number, y1: number, x2: number, y2: number, label: string) => {
    ctx.save();
    ctx.globalAlpha = 0.95;
    ctx.strokeStyle = t.kilnDeep;
    ctx.fillStyle = t.kilnDeep;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    const vertical = x1 === x2;
    for (const [x, y] of [[x1, y1], [x2, y2]]) {
      ctx.beginPath();
      if (vertical) { ctx.moveTo(x - 10, y); ctx.lineTo(x + 10, y); } else { ctx.moveTo(x, y - 10); ctx.lineTo(x, y + 10); }
      ctx.stroke();
    }
    ctx.font = '600 24px ui-monospace, "SFMono-Regular", Menlo, monospace';
    ctx.textBaseline = "middle";
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    const w = ctx.measureText(label).width + 16;
    ctx.globalAlpha = 0.92;
    ctx.fillStyle = t.paperHi;
    ctx.fillRect(vertical ? mx + 14 : mx - w / 2, vertical ? my - 17 : my - 36, w, 34);
    ctx.globalAlpha = 1;
    ctx.fillStyle = t.kilnDeep;
    ctx.fillText(label, (vertical ? mx + 14 : mx - w / 2) + 8, vertical ? my : my - 19);
    ctx.restore();
  };
  callout(60, 264, 60, 284, "16");
  callout(60, 358, 60, 398, "24");
  callout(60, 568, 60, 650, "64");
  callout(290, 538, 312, 538, "16");
  callout(720, 190, 780, 190, "40");
  return canvas;
}

/** Keyboard focus rings: the behaviour layer. */
function drawBehaviour(t: Tokens) {
  const { canvas, ctx } = newCanvas();
  ctx.strokeStyle = t.kilnDeep;
  ctx.lineWidth = 5;
  ctx.setLineDash([16, 10]);
  ctx.lineCap = "round";
  for (const [x, y, w, h, r] of [
    [70, 500, 232, 78, 18],
    [1140, 40, 192, 66, 16],
    [790, 52, 104, 38, 10],
    [802, 474, 336, 40, 10],
  ]) {
    roundRect(ctx, x, y, w, h, r);
    ctx.stroke();
  }
  // A pointer hit-area
  ctx.setLineDash([]);
  ctx.lineWidth = 3;
  ctx.globalAlpha = 0.85;
  ctx.beginPath();
  ctx.arc(1228, 74, 40, 0, Math.PI * 2);
  ctx.stroke();
  return canvas;
}

/** Print marks at the corners and edges. */
function drawMarks(t: Tokens) {
  const { canvas, ctx } = newCanvas();
  ctx.strokeStyle = t.ink;
  ctx.globalAlpha = 0.75;
  ctx.lineWidth = 3;
  const o = 22;
  const l = 64;
  const c: [number, number, number, number][] = [
    [o, o, 1, 1],
    [TEX_W - o, o, -1, 1],
    [o, TEX_H - o, 1, -1],
    [TEX_W - o, TEX_H - o, -1, -1],
  ];
  for (const [x, y, sx, sy] of c) {
    ctx.beginPath();
    ctx.moveTo(x, y + sy * l);
    ctx.lineTo(x, y);
    ctx.lineTo(x + sx * l, y);
    ctx.stroke();
  }
  for (const [x, y, dx, dy] of [
    [TEX_W / 2, o, 0, 1],
    [TEX_W / 2, TEX_H - o, 0, -1],
    [o, TEX_H / 2, 1, 0],
    [TEX_W - o, TEX_H / 2, -1, 0],
  ] as const) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + dx * 34, y + dy * 34);
    ctx.stroke();
  }
  return canvas;
}

/** A soft diagonal highlight, so each pane catches light like glass. Its position differs per pane. */
function withSheen(canvas: HTMLCanvasElement, index: number) {
  const ctx = canvas.getContext("2d")!;
  const shift = index * 0.05;
  const gradient = ctx.createLinearGradient(0, 0, TEX_W, TEX_H);
  gradient.addColorStop(0, "rgba(255,255,255,0)");
  gradient.addColorStop(Math.min(0.9, 0.3 + shift), "rgba(255,255,255,0)");
  gradient.addColorStop(Math.min(0.95, 0.42 + shift), "rgba(255,255,255,0.22)");
  gradient.addColorStop(Math.min(0.98, 0.54 + shift), "rgba(255,255,255,0)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.save();
  ctx.globalAlpha = 1;
  ctx.setLineDash([]);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, TEX_W, TEX_H);
  ctx.restore();
  return canvas;
}

function concreteTexture(t: Tokens) {
  const { canvas, ctx } = newCanvas(512, 512);
  ctx.fillStyle = t.concrete;
  ctx.fillRect(0, 0, 512, 512);
  const image = ctx.getImageData(0, 0, 512, 512);
  for (let i = 0; i < image.data.length; i += 4) {
    const grain = (Math.random() - 0.5) * 26;
    image.data[i] += grain;
    image.data[i + 1] += grain;
    image.data[i + 2] += grain;
  }
  ctx.putImageData(image, 0, 0);
  // Pores and aggregate
  for (let n = 0; n < 420; n++) {
    ctx.globalAlpha = 0.1 + Math.random() * 0.16;
    ctx.fillStyle = Math.random() > 0.5 ? "#000" : "#fff";
    ctx.beginPath();
    ctx.arc(Math.random() * 512, Math.random() * 512, 0.6 + Math.random() * 1.8, 0, Math.PI * 2);
    ctx.fill();
  }
  const texture = new CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = RepeatWrapping;
  texture.repeat.set(2.4, 1.6);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

function contactShadowTexture() {
  const { canvas, ctx } = newCanvas(256, 256);
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, "rgba(0,0,0,0.5)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  return new CanvasTexture(canvas);
}

/* ── The scene ───────────────────────────────────────────────── */

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export function createLayers(stage: HTMLElement, canvas: HTMLCanvasElement, options: LayersOptions = {}): LayersHandle {
  const tokens = readTokens();

  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "default" });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = NeutralToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const environment = pmrem.fromScene(room, 0.03).texture;
  scene.environment = environment;
  scene.environmentIntensity = 0.85;
  room.dispose();

  const camera = new PerspectiveCamera(24, 1, 0.5, 30);

  const key = new DirectionalLight(new Color("#fff4e6"), 2.1);
  key.position.set(-2.6, 4.2, 3.1);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  Object.assign(key.shadow.camera, { left: -2.2, right: 2.2, top: 2.2, bottom: -1.6, near: 1, far: 12 });
  key.shadow.bias = -0.0004;
  key.shadow.normalBias = 0.02;
  key.shadow.radius = 4;
  scene.add(key);

  // Disposable resources
  const geometries: BufferGeometry[] = [];
  const materials: Material[] = [];
  const textures: Texture[] = [environment];
  const track = <T extends BufferGeometry | Material | Texture>(item: T): T => {
    if ((item as Texture).isTexture) textures.push(item as Texture);
    else if ((item as Material).isMaterial) materials.push(item as Material);
    else geometries.push(item as BufferGeometry);
    return item;
  };
  const maxAniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  const texture = (canvasEl: HTMLCanvasElement) => {
    const tex = track(new CanvasTexture(canvasEl));
    tex.colorSpace = SRGBColorSpace;
    tex.anisotropy = maxAniso;
    return tex;
  };

  // Materials
  const concreteMap = track(concreteTexture(tokens));
  const concrete = track(
    new MeshStandardMaterial({ map: concreteMap, bumpMap: concreteMap, bumpScale: 0.7, roughness: 0.94, metalness: 0 }),
  );
  const steel = track(new MeshPhysicalMaterial({ color: tokens.steel, metalness: 1, roughness: 0.28 }));
  const glass = track(
    new MeshPhysicalMaterial({
      color: new Color(tokens.glass).lerp(new Color("#ffffff"), 0.55),
      transparent: true,
      opacity: 0.14,
      roughness: 0.04,
      metalness: 0,
      ior: 1.5,
      specularIntensity: 1,
      clearcoat: 1,
      clearcoatRoughness: 0.03,
      envMapIntensity: 2.5,
      depthWrite: false,
    }),
  );
  const glassEdge = track(
    new MeshPhysicalMaterial({
      color: new Color(tokens.glass).lerp(new Color(tokens.ink2), 0.3),
      roughness: 0.22,
      metalness: 0,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      envMapIntensity: 0.8,
    }),
  );
  const paperSheet = track(new MeshStandardMaterial({ map: texture(drawPage(tokens)), roughness: 0.62, metalness: 0 }));
  const paperEdge = track(new MeshStandardMaterial({ color: tokens.stone, roughness: 0.75 }));

  const object = new Group();
  object.rotation.y = BASE_YAW;
  scene.add(object);

  const slabTop = SLAB.h;
  const sheetBase = slabTop + 0.045;
  const sheetCenterY = sheetBase + SHEET_H / 2;

  // Slab
  const slabGeometry = track(new RoundedBoxGeometry(SLAB.w, SLAB.h, SLAB.d, 4, 0.018));
  const slab = new Mesh(slabGeometry, concrete);
  slab.position.y = SLAB.h / 2;
  slab.castShadow = true;
  slab.receiveShadow = true;
  object.add(slab);

  // Ground (shadow catcher) and a soft contact shadow, so the slab sits on the stage
  const ground = new Mesh(track(new PlaneGeometry(10, 10)), track(new ShadowMaterial({ color: "#2a1c10", opacity: 0.2 })));
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);
  const contact = new Mesh(
    track(new PlaneGeometry(SLAB.w * 1.5, SLAB.d * 1.5)),
    track(new MeshBasicMaterial({ map: track(contactShadowTexture()), transparent: true, depthWrite: false, opacity: 0.5 })),
  );
  contact.rotation.x = -Math.PI / 2;
  contact.position.y = 0.002;
  object.add(contact);

  // Shared geometry
  const clipGeometry = track(new RoundedBoxGeometry(0.15, 0.07, GLASS_T + 0.028, 3, 0.012));
  const sheetGeometry = track(new RoundedBoxGeometry(SHEET_W, SHEET_H, SHEET_T, 3, 0.006));
  const glassGeometry = track(new RoundedBoxGeometry(SHEET_W, SHEET_H, GLASS_T, 4, 0.01));
  const barH = track(new RoundedBoxGeometry(SHEET_W, 0.014, GLASS_T + 0.002, 2, 0.005));
  const barV = track(new RoundedBoxGeometry(0.014, SHEET_H, GLASS_T + 0.002, 2, 0.005));
  const decalGeometry = track(new PlaneGeometry(SHEET_W, SHEET_H));

  const decals = [drawStructure, drawSpacing, drawBehaviour, drawMarks];
  const sheets: Group[] = [];

  for (let i = 0; i < LAYER_COUNT; i++) {
    const group = new Group();
    group.position.y = sheetCenterY;
    object.add(group);
    sheets.push(group);

    if (i === 0) {
      // The sheet itself, with the printed page laid just in front of it
      const body = new Mesh(sheetGeometry, paperEdge);
      body.castShadow = true;
      body.receiveShadow = true;
      group.add(body);
      const print = new Mesh(decalGeometry, paperSheet);
      print.position.z = SHEET_T / 2 + 0.0008;
      print.receiveShadow = true;
      group.add(print);
    } else {
      const body = new Mesh(glassGeometry, glass);
      body.renderOrder = i * 3;
      group.add(body);
      for (const [geometry, x, y] of [
        [barH, 0, SHEET_H / 2 - 0.007],
        [barH, 0, -SHEET_H / 2 + 0.007],
        [barV, -SHEET_W / 2 + 0.007, 0],
        [barV, SHEET_W / 2 - 0.007, 0],
      ] as const) {
        const bar = new Mesh(geometry, glassEdge);
        bar.position.set(x, y, 0);
        bar.renderOrder = i * 3 + 1;
        group.add(bar);
      }
      const decal = new Mesh(
        decalGeometry,
        track(new MeshBasicMaterial({ map: texture(withSheen(decals[i - 1](tokens), i)), transparent: true, depthWrite: false, toneMapped: false, side: DoubleSide })),
      );
      decal.position.z = GLASS_T / 2 + 0.0012;
      decal.renderOrder = i * 3 + 2;
      group.add(decal);
    }

    // Two steel clips hold each sheet to the slab
    for (const x of [-SHEET_W * 0.32, SHEET_W * 0.32]) {
      const clip = new Mesh(clipGeometry, steel);
      clip.position.set(x, -SHEET_H / 2 + 0.0, 0);
      clip.castShadow = true;
      clip.receiveShadow = true;
      group.add(clip);
    }
  }

  /* ── Motion state: damped, and only advanced while something is moving ── */

  const s = { spread: 0, spreadTo: 0, scroll: 0, scrollTo: 0, px: 0, pxTo: 0, py: 0, pyTo: 0 };
  let raf = 0;
  let last = 0;
  let visible = false;
  let started = false;
  let ready = false;
  let settledReported = false;
  let introTimer = 0;

  function applyState() {
    const gap = GAP_COLLAPSED + (GAP_SPREAD - GAP_COLLAPSED) * s.spread + GAP_SCROLL * s.scroll;
    const fan = 0.014 * s.spread;
    sheets.forEach((sheet, i) => {
      const offset = i - (LAYER_COUNT - 1) / 2;
      sheet.position.z = offset * gap;
      sheet.rotation.y = offset * fan;
    });
    object.rotation.y = BASE_YAW + s.px * 0.16;
    object.rotation.x = s.py * 0.035;
  }

  function placeCamera() {
    const aspect = camera.aspect;
    const distance = 6.6 * Math.max(1, 1.22 / aspect);
    camera.position.set(0.15, 1.45 + 0.5 * Math.max(0, 1.22 / aspect - 1), distance);
    camera.lookAt(0.05, 0.6, 0);
  }

  function resize() {
    const width = stage.clientWidth;
    const height = stage.clientHeight;
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    placeCamera();
    invalidate();
  }

  const moving = () =>
    Math.abs(s.spread - s.spreadTo) > 0.0006 ||
    Math.abs(s.scroll - s.scrollTo) > 0.0006 ||
    Math.abs(s.px - s.pxTo) > 0.0006 ||
    Math.abs(s.py - s.pyTo) > 0.0006;

  function step(dt: number) {
    const slow = 1 - Math.exp(-dt * 2.4);
    const mid = 1 - Math.exp(-dt * 4.2);
    const fast = 1 - Math.exp(-dt * 5.5);
    s.spread += (s.spreadTo - s.spread) * slow;
    s.scroll += (s.scrollTo - s.scroll) * mid;
    s.px += (s.pxTo - s.px) * fast;
    s.py += (s.pyTo - s.py) * fast;
    if (!moving()) {
      s.spread = s.spreadTo;
      s.scroll = s.scrollTo;
      s.px = s.pxTo;
      s.py = s.pyTo;
    }
  }

  function tick(now: number) {
    raf = 0;
    // Exponential smoothing is stable at any step, so slow frames still finish the motion in the same real time.
    const dt = last ? Math.min((now - last) / 1000, 0.5) : 0.016;
    last = now;
    step(dt);
    applyState();
    renderer.render(scene, camera);
    if (!ready) {
      ready = true;
      options.onReady?.();
    }
    if (moving()) {
      settledReported = false;
      raf = requestAnimationFrame(tick);
    } else {
      last = 0;
      if (!settledReported && s.spreadTo === 1) {
        settledReported = true;
        options.onSettled?.();
      }
    }
  }

  function invalidate() {
    if (raf || !visible || document.hidden) return;
    raf = requestAnimationFrame(tick);
  }

  /* ── Inputs ── */

  const onPointer = (event: PointerEvent) => {
    if (event.pointerType === "touch") return;
    s.pxTo = clamp((event.clientX / window.innerWidth - 0.5) * 2, -1, 1);
    s.pyTo = clamp((event.clientY / window.innerHeight - 0.5) * 2, -1, 1);
    invalidate();
  };
  const onScroll = () => {
    const height = stage.getBoundingClientRect().height || 1;
    s.scrollTo = clamp(window.scrollY / (height * 0.9), 0, 1);
    invalidate();
  };
  window.addEventListener("pointermove", onPointer, { passive: true });
  window.addEventListener("scroll", onScroll, { passive: true });

  const intersection = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) {
      if (!started) {
        started = true;
        onScroll();
        // Show the stacked sheets for a moment, then let them part.
        introTimer = window.setTimeout(() => {
          s.spreadTo = 1;
          invalidate();
        }, 450);
      }
      invalidate();
    } else {
      cancelAnimationFrame(raf);
      raf = 0;
      last = 0;
    }
  });
  intersection.observe(stage);

  const onVisibility = () => {
    if (document.hidden) {
      cancelAnimationFrame(raf);
      raf = 0;
      last = 0;
    } else invalidate();
  };
  document.addEventListener("visibilitychange", onVisibility);

  const resizer = new ResizeObserver(resize);
  resizer.observe(stage);

  const onContextLost = (event: Event) => {
    event.preventDefault();
    cancelAnimationFrame(raf);
    raf = 0;
    options.onContextLost?.();
  };
  canvas.addEventListener("webglcontextlost", onContextLost);

  applyState();
  resize();

  return {
    dispose() {
      window.clearTimeout(introTimer);
      cancelAnimationFrame(raf);
      raf = 0;
      intersection.disconnect();
      resizer.disconnect();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      textures.forEach((t) => t.dispose());
      pmrem.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}
