/**
 * Three small decorative scenes for the page. Loaded on demand by SceneCanvas,
 * never on the server. Every scene has a transparent background so the section's
 * own colour shows through, and none of them carries information.
 *
 *   panes   coloured glass sheets drifting in depth (the layers of a website)
 *   orbit   four rings with a node each, one per step of the process
 *   shapes  a row of faceted objects that lean toward the pointer
 */
import {
  AmbientLight,
  BoxGeometry,
  DirectionalLight,
  DodecahedronGeometry,
  DoubleSide,
  EdgesGeometry,
  Float32BufferAttribute,
  BufferGeometry,
  Group,
  IcosahedronGeometry,
  LineBasicMaterial,
  LineSegments,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  OctahedronGeometry,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  PointsMaterial,
  Scene,
  SphereGeometry,
  TorusGeometry,
  WebGLRenderer,
  type Material,
} from "three";
import { readPalette } from "./palette";

export type SceneName = "panes" | "orbit" | "shapes";

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

/* ── Panes ───────────────────────────────────────────────────── */

function createPanes(canvas: HTMLCanvasElement): SceneHandle {
  const colours = readPalette();
  const stage = makeStage(canvas, 35, 9);
  const pointer = makePointer();
  const order = [colours["--color-kiln"], colours["--color-iris"], colours["--color-lagoon"], colours["--color-leaf"], colours["--color-sun"]];

  const COUNT = 8;
  const panes: { group: Group; baseX: number; baseY: number; phase: number; depth: number }[] = [];
  const plane = new PlaneGeometry(1.5, 1);
  const edges = new EdgesGeometry(plane);

  for (let i = 0; i < COUNT; i++) {
    const group = new Group();
    const fill = new Mesh(
      plane.clone(),
      new MeshBasicMaterial({ color: order[i % order.length], transparent: true, opacity: 0.2, side: DoubleSide, depthWrite: false }),
    );
    const outline = new LineSegments(edges.clone(), new LineBasicMaterial({ color: order[i % order.length], transparent: true, opacity: 0.6 }));
    group.add(fill, outline);
    stage.scene.add(group);
    panes.push({ group, baseX: i / (COUNT - 1) - 0.5, baseY: Math.sin(i * 1.7) * 0.28, phase: i * 0.9, depth: ((i * 5) % 7) / 6 });
  }
  plane.dispose();
  edges.dispose();

  return finish(
    stage,
    {
      pointer: (x, y) => pointer.set(x, y),
      frame(t, dt) {
        const p = pointer.step(dt);
        const { w, h } = stage.view;
        const size = h * 0.46;
        panes.forEach((pane, i) => {
          const { group } = pane;
          group.scale.setScalar(size * (0.8 + pane.depth * 0.5));
          group.position.set(
            pane.baseX * w * 0.96 + p.x * (0.15 + pane.depth * 0.5),
            pane.baseY * h * 0.34 + Math.sin(t * 0.5 + pane.phase) * h * 0.04 + p.y * 0.1,
            -1.5 + pane.depth * 3,
          );
          group.rotation.y = -0.65 + Math.sin(t * 0.35 + pane.phase) * 0.22 + p.x * 0.35;
          group.rotation.x = Math.sin(t * 0.3 + i) * 0.06 - p.y * 0.12;
          group.rotation.z = (i % 2 ? 0.05 : -0.05) + Math.sin(t * 0.25 + pane.phase) * 0.03;
        });
        stage.renderer.render(stage.scene, stage.camera);
      },
    },
    canvas,
  );
}

/* ── Orbit ───────────────────────────────────────────────────── */

function createOrbit(canvas: HTMLCanvasElement): SceneHandle {
  const colours = readPalette();
  const stage = makeStage(canvas, 38, 8.5);
  const pointer = makePointer();
  const nodeColours = [colours["--color-kiln-bright"], colours["--color-sun"], colours["--color-lagoon-bright"], colours["--color-iris-bright"]];

  const system = new Group();
  stage.scene.add(system);

  const core = new Mesh(new SphereGeometry(0.38, 32, 24), new MeshBasicMaterial({ color: colours["--color-kiln"] }));
  const halo = new Mesh(new SphereGeometry(0.62, 32, 24), new MeshBasicMaterial({ color: colours["--color-kiln"], transparent: true, opacity: 0.16, depthWrite: false }));
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

/* ── Shapes ──────────────────────────────────────────────────── */

function createShapes(canvas: HTMLCanvasElement): SceneHandle {
  const colours = readPalette();
  const stage = makeStage(canvas, 32, 10);
  const pointer = makePointer();
  const order = [colours["--color-kiln"], colours["--color-iris"], colours["--color-sun"], colours["--color-lagoon"], colours["--color-leaf"]];

  stage.scene.add(new AmbientLight(0xffffff, 1.15));
  const key = new DirectionalLight(0xffffff, 2.4);
  key.position.set(-3, 4, 6);
  stage.scene.add(key);

  const geometries = [
    new IcosahedronGeometry(0.5, 0),
    new OctahedronGeometry(0.58, 0),
    new TorusGeometry(0.4, 0.17, 12, 28),
    new BoxGeometry(0.72, 0.72, 0.72),
    new DodecahedronGeometry(0.52, 0),
  ];

  const COUNT = 9;
  const shapes = Array.from({ length: COUNT }, (_, i) => {
    const mesh = new Mesh(
      geometries[i % geometries.length],
      new MeshStandardMaterial({ color: order[(i * 2) % order.length], roughness: 0.5, metalness: 0.05, flatShading: true }),
    );
    stage.scene.add(mesh);
    return { mesh, x: i / (COUNT - 1) - 0.5, phase: i * 1.3, scale: 0.8 + ((i * 3) % 5) * 0.12, spin: 0.25 + (i % 4) * 0.12 };
  });

  return finish(
    stage,
    {
      pointer: (x, y) => pointer.set(x, y),
      frame(t, dt) {
        const p = pointer.step(dt);
        const { w, h } = stage.view;
        shapes.forEach((shape, i) => {
          const { mesh } = shape;
          const baseX = shape.x * w * 0.84;
          // A shape leans away from the pointer a little when it is close to it.
          const near = Math.max(0, 1 - Math.abs(p.x * w * 0.5 - baseX) / (w * 0.18));
          mesh.position.set(baseX - near * Math.sign(baseX - p.x * w * 0.5) * 0.25, Math.sin(t * 0.7 + shape.phase) * h * 0.1 + p.y * h * 0.1 * (i % 2 ? 1 : -1), 0);
          mesh.scale.setScalar(shape.scale * (h / 3.2) * (1 + near * 0.18));
          mesh.rotation.x = t * shape.spin + p.y * 0.6;
          mesh.rotation.y = t * shape.spin * 0.8 + p.x * 0.6;
        });
        stage.renderer.render(stage.scene, stage.camera);
      },
    },
    canvas,
  );
}

export function createScene(name: SceneName, canvas: HTMLCanvasElement): SceneHandle {
  if (name === "panes") return createPanes(canvas);
  if (name === "orbit") return createOrbit(canvas);
  return createShapes(canvas);
}
