/**
 * Small 3D scenes for the page. Loaded on demand by SceneCanvas, never on the
 * server. Every scene has a transparent background so the section's own colour
 * shows through.
 *
 *   orbit   four rings with a node each, one per step of the process
 */
import {
  Float32BufferAttribute,
  BufferGeometry,
  Group,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  SphereGeometry,
  TorusGeometry,
  WebGLRenderer,
  type Material,
} from "three";
import { readPalette } from "./palette";

export type SceneName = "orbit";

export interface SceneHandle {
  /** Draw one frame. `t` is seconds since the page loaded, `dt` seconds since the last frame. */
  frame(t: number, dt: number): void;
  resize(width: number, height: number): void;
  /** Pointer position over the stage, -1 to 1 on both axes (y up). */
  pointer(x: number, y: number): void;
  onContextLost(callback: () => void): void;
  dispose(): void;
}

/* ── Shared set-up ───────────────────────────────────────────── */

interface Stage {
  renderer: WebGLRenderer;
  scene: Scene;
  camera: PerspectiveCamera;
  /** Size of the visible area at z = 0, in scene units. */
  view: { w: number; h: number };
}

function makeStage(canvas: HTMLCanvasElement, fov: number, distance: number): Stage {
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setClearColor(0x000000, 0);
  const camera = new PerspectiveCamera(fov, 1, 0.1, 100);
  camera.position.z = distance;
  return { renderer, scene: new Scene(), camera, view: { w: 1, h: 1 } };
}

function fit(stage: Stage, width: number, height: number) {
  const { renderer, camera, view } = stage;
  renderer.setSize(width, height, false);
  camera.aspect = width / Math.max(height, 1);
  camera.updateProjectionMatrix();
  view.h = 2 * Math.tan(MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
  view.w = view.h * camera.aspect;
}

/** Eases a pointer value toward its target so movement never snaps. */
function makePointer() {
  const target = { x: 0, y: 0 };
  const eased = { x: 0, y: 0 };
  return {
    set(x: number, y: number) {
      target.x = x;
      target.y = y;
    },
    step(dt: number) {
      const k = 1 - Math.exp(-dt * 4);
      eased.x += (target.x - eased.x) * k;
      eased.y += (target.y - eased.y) * k;
      return eased;
    },
    eased,
  };
}

/** Frees everything in a scene once. Geometry and materials are shared nowhere, so this is safe. */
function disposeScene(scene: Scene, renderer: WebGLRenderer) {
  scene.traverse((object) => {
    const item = object as Mesh;
    item.geometry?.dispose();
    const material = item.material as Material | Material[] | undefined;
    if (Array.isArray(material)) material.forEach((m) => m.dispose());
    else material?.dispose();
  });
  renderer.dispose();
}

function finish(stage: Stage, parts: Pick<SceneHandle, "frame" | "pointer">, canvas: HTMLCanvasElement): SceneHandle {
  let lost: (() => void) | undefined;
  const onLost = (event: Event) => {
    event.preventDefault();
    lost?.();
  };
  canvas.addEventListener("webglcontextlost", onLost);
  return {
    ...parts,
    resize: (w, h) => fit(stage, w, h),
    onContextLost: (callback) => {
      lost = callback;
    },
    dispose() {
      canvas.removeEventListener("webglcontextlost", onLost);
      disposeScene(stage.scene, stage.renderer);
    },
  };
}

/* ── Orbit ───────────────────────────────────────────────────── */

function createOrbit(canvas: HTMLCanvasElement): SceneHandle {
  const colours = readPalette();
  const stage = makeStage(canvas, 38, 8.5);
  const pointer = makePointer();
  const nodeColours = [colours["--color-accent-bright"], colours["--color-sun"], colours["--color-lagoon-bright"], colours["--color-rose-bright"]];

  const system = new Group();
  stage.scene.add(system);

  const core = new Mesh(new SphereGeometry(0.38, 32, 24), new MeshBasicMaterial({ color: colours["--color-accent"] }));
  const halo = new Mesh(new SphereGeometry(0.62, 32, 24), new MeshBasicMaterial({ color: colours["--color-accent"], transparent: true, opacity: 0.16, depthWrite: false }));
  system.add(core, halo);

  const rings = nodeColours.map((colour, i) => {
    const radius = 1.05 + i * 0.62;
    const pivot = new Group();
    pivot.rotation.set(0.5 + i * 0.42, i * 0.9, i * 0.35);
    pivot.add(new Mesh(new TorusGeometry(radius, 0.008, 6, 160), new MeshBasicMaterial({ color: colours["--color-on-night-2"], transparent: true, opacity: 0.42 })));
    const node = new Mesh(new SphereGeometry(0.11 + (i === 3 ? 0.02 : 0), 20, 16), new MeshBasicMaterial({ color: colour }));
    pivot.add(node);
    system.add(pivot);
    return { pivot, node, radius, speed: 0.55 - i * 0.09, phase: i * 1.6 };
  });

  const starCount = 70;
  const positions: number[] = [];
  for (let i = 0; i < starCount; i++) {
    const r = 3.6 + ((i * 37) % 10) * 0.18;
    const theta = i * 2.399963; // golden angle: even spread without Math.random
    const y = 1 - (i / (starCount - 1)) * 2;
    const ring = Math.sqrt(1 - y * y);
    positions.push(Math.cos(theta) * ring * r, y * r * 0.8, Math.sin(theta) * ring * r - 1);
  }
  const starGeometry = new BufferGeometry();
  starGeometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  stage.scene.add(new Points(starGeometry, new PointsMaterial({ color: colours["--color-on-night-2"], size: 0.035, transparent: true, opacity: 0.6, sizeAttenuation: true })));

  return finish(
    stage,
    {
      pointer: (x, y) => pointer.set(x, y),
      frame(t, dt) {
        const p = pointer.step(dt);
        system.rotation.y = t * 0.08 + p.x * 0.45;
        system.rotation.x = -0.35 - p.y * 0.3;
        halo.scale.setScalar(1 + Math.sin(t * 1.4) * 0.06);
        rings.forEach((ring) => {
          const angle = t * ring.speed + ring.phase;
          ring.node.position.set(Math.cos(angle) * ring.radius, Math.sin(angle) * ring.radius, 0);
        });
        stage.renderer.render(stage.scene, stage.camera);
      },
    },
    canvas,
  );
}

export function createScene(name: SceneName, canvas: HTMLCanvasElement): SceneHandle {
  switch (name) {
    case "orbit":
      return createOrbit(canvas);
  }
}
