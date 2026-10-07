/**
 * Procedural gyroscope on a slate plinth — no model files, no textures to download.
 * Loaded on demand by HeroInstrument; never imported on the server.
 */
import {
  CanvasTexture,
  Color,
  ConeGeometry,
  CylinderGeometry,
  DirectionalLight,
  Group,
  LatheGeometry,
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
  SphereGeometry,
  SRGBColorSpace,
  Vector2,
  WebGLRenderer,
  type BufferGeometry,
  type Material,
  type Texture,
} from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

export interface GyroscopeOptions {
  /** false when the visitor prefers reduced motion: no spin, no drift, render on demand. */
  animate: boolean;
  onReady?: () => void;
  onContextLost?: () => void;
}

export interface GyroscopeHandle {
  /** Turn the model by an angle in radians (keyboard control). */
  turn(radians: number): void;
  /** Stop or resume the gyroscope's own motion (WCAG 2.2.2). Dragging still works. */
  setPaused(paused: boolean): void;
  dispose(): void;
}

// Physical palette for the model. These are material properties, not page colours.
const MATERIAL = {
  steel: "#c3c6c8",
  brass: "#d0a964",
  brassAged: "#b38c55",
  slate: "#3f3b38",
  shadow: "#2b2118",
  light: "#fff3e2",
} as const;

const TILT = 0.3; // ~17° lean from vertical
const SPIN_RATE = Math.PI * 2 * 1.4; // rotor, rev/s
const PRECESSION_RATE = 0.32; // rad/s
const YAW_LIMIT = Math.PI; // free to turn all the way round
const PITCH_LIMIT = { min: -0.12, max: 0.22 };

function slateTexture(): CanvasTexture {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = MATERIAL.slate;
  ctx.fillRect(0, 0, size, size);
  const image = ctx.getImageData(0, 0, size, size);
  for (let i = 0; i < image.data.length; i += 4) {
    const grain = (Math.random() - 0.5) * 14;
    image.data[i] += grain;
    image.data[i + 1] += grain;
    image.data[i + 2] += grain;
  }
  ctx.putImageData(image, 0, 0);
  // A few faint mineral veins.
  ctx.globalAlpha = 0.06;
  ctx.strokeStyle = "#d9d2c8";
  for (let v = 0; v < 5; v++) {
    ctx.lineWidth = 0.6 + Math.random();
    ctx.beginPath();
    ctx.moveTo(Math.random() * size, 0);
    ctx.bezierCurveTo(
      Math.random() * size, size * 0.3,
      Math.random() * size, size * 0.7,
      Math.random() * size, size,
    );
    ctx.stroke();
  }
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(3, 1);
  return texture;
}

function contactShadowTexture(): CanvasTexture {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, "rgba(0,0,0,0.55)");
  gradient.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  return new CanvasTexture(canvas);
}

/** Closed lathe profile for a flat, machined band ring around the Y axis. */
function bandRing(radius: number, width: number, depth: number): LatheGeometry {
  const inner = radius - depth / 2;
  const outer = radius + depth / 2;
  const h = width / 2;
  const points = [
    new Vector2(inner, -h),
    new Vector2(outer, -h),
    new Vector2(outer, h),
    new Vector2(inner, h),
    new Vector2(inner, -h),
  ];
  return new LatheGeometry(points, 160);
}

export function createGyroscope(
  container: HTMLElement,
  canvas: HTMLCanvasElement,
  options: GyroscopeOptions,
): GyroscopeHandle {
  const renderer = new WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = NeutralToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const environment = pmrem.fromScene(room, 0.04).texture;
  scene.environment = environment;
  scene.environmentIntensity = 0.9;
  room.dispose();

  const camera = new PerspectiveCamera(28, 1, 0.1, 20);

  // ── Light ────────────────────────────────────────────────
  const key = new DirectionalLight(new Color(MATERIAL.light), 2.4);
  key.position.set(-1.5, 3.2, 1.8);
  key.castShadow = true;
  key.shadow.mapSize.set(container.clientWidth < 520 ? 1024 : 2048, container.clientWidth < 520 ? 1024 : 2048);
  key.shadow.camera.left = -1.1;
  key.shadow.camera.right = 1.1;
  key.shadow.camera.top = 1.4;
  key.shadow.camera.bottom = -0.6;
  key.shadow.camera.near = 0.5;
  key.shadow.camera.far = 7;
  key.shadow.bias = -0.0004;
  key.shadow.normalBias = 0.015;
  scene.add(key);

  // ── Materials ────────────────────────────────────────────
  const slateMap = slateTexture();
  const shadowMap = contactShadowTexture();
  const steel = new MeshPhysicalMaterial({ color: MATERIAL.steel, metalness: 1, roughness: 0.24 });
  const brass = new MeshPhysicalMaterial({ color: MATERIAL.brass, metalness: 1, roughness: 0.27 });
  const brassAged = new MeshPhysicalMaterial({ color: MATERIAL.brassAged, metalness: 1, roughness: 0.36 });
  const slate = new MeshStandardMaterial({ map: slateMap, roughness: 0.88, metalness: 0 });

  const stage = new Group();
  scene.add(stage);

  const add = (geometry: BufferGeometry, material: Material, parent: Group = stage) => {
    const mesh = new Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  };

  // ── Ground (shadow catcher on the page's paper) ─────────
  const ground = new Mesh(
    new PlaneGeometry(8, 8),
    new ShadowMaterial({ color: MATERIAL.shadow, opacity: 0.2 }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const contact = new Mesh(
    new PlaneGeometry(1.5, 1.5),
    new MeshBasicMaterial({ map: shadowMap, transparent: true, depthWrite: false, opacity: 0.55 }),
  );
  contact.rotation.x = -Math.PI / 2;
  contact.position.y = 0.002;
  scene.add(contact);

  // ── Slate plinth with a softened top edge ───────────────
  add(
    new LatheGeometry(
      [
        new Vector2(0, 0),
        new Vector2(0.5, 0),
        new Vector2(0.522, 0.008),
        new Vector2(0.527, 0.122),
        new Vector2(0.52, 0.136),
        new Vector2(0.505, 0.14),
        new Vector2(0, 0.14),
      ],
      128,
    ),
    slate,
  );

  // ── Turned brass pedestal ────────────────────────────────
  add(
    new LatheGeometry(
      [
        new Vector2(0, 0.14),
        new Vector2(0.165, 0.14),
        new Vector2(0.168, 0.152),
        new Vector2(0.15, 0.166),
        new Vector2(0.075, 0.188),
        new Vector2(0.042, 0.23),
        new Vector2(0.03, 0.29),
        new Vector2(0.028, 0.5),
        new Vector2(0.04, 0.522),
        new Vector2(0.056, 0.545),
        new Vector2(0.054, 0.556),
        new Vector2(0.02, 0.552),
        new Vector2(0, 0.55),
      ],
      96,
    ),
    brassAged,
  );

  // ── Gyroscope: precession → tilt → assembly ─────────────
  const precession = new Group();
  precession.position.y = 0.552;
  stage.add(precession);
  const tilt = new Group();
  tilt.rotation.z = TILT;
  precession.add(tilt);

  const foot = add(new ConeGeometry(0.013, 0.05, 32), steel, tilt);
  foot.rotation.x = Math.PI;
  foot.position.y = 0.025;
  add(new CylinderGeometry(0.009, 0.009, 0.64, 32), steel, tilt).position.y = 0.37;
  add(new SphereGeometry(0.017, 32, 16), steel, tilt).position.y = 0.69;

  const cageY = 0.37;
  const cageR = 0.25;
  add(bandRing(cageR, 0.026, 0.012), steel, tilt).position.y = cageY; // equator
  const meridian = add(bandRing(cageR, 0.018, 0.012), steel, tilt);
  meridian.rotation.x = Math.PI / 2;
  meridian.position.y = cageY;

  const rotor = new Group();
  rotor.position.y = cageY;
  tilt.add(rotor);
  add(new CylinderGeometry(0.205, 0.205, 0.046, 160), brass, rotor);
  add(new CylinderGeometry(0.192, 0.192, 0.054, 160), brass, rotor);
  add(new CylinderGeometry(0.036, 0.036, 0.074, 48), steel, rotor);
  for (let i = 0; i < 3; i++) {
    const angle = (i / 3) * Math.PI * 2;
    const screw = add(new CylinderGeometry(0.009, 0.009, 0.06, 20), steel, rotor);
    screw.position.set(Math.cos(angle) * 0.13, 0, Math.sin(angle) * 0.13);
  }

  // ── Interaction state ────────────────────────────────────
  let yaw = -0.5;
  let targetYaw = yaw;
  let velocity = 0;
  let pitch = 0.06;
  let targetPitch = pitch;
  let dragging = false;
  let lastX = 0;
  let lastY = 0;
  let spin = 0;
  let precess = 0.9;
  let elapsed = 0;
  let animating = options.animate;

  const clampYaw = (v: number) => Math.max(-YAW_LIMIT * 4, Math.min(YAW_LIMIT * 4, v));
  const clampPitch = (v: number) => Math.max(PITCH_LIMIT.min, Math.min(PITCH_LIMIT.max, v));

  function placeCamera() {
    // Narrower frames need more distance so the plinth never crops at the sides.
    const distance = camera.aspect >= 1 ? 3.45 : 3.45 + (1 - camera.aspect) * 1.6;
    const target = { y: 0.6 };
    camera.position.set(
      0,
      target.y + Math.sin(0.2 + pitch) * distance,
      Math.cos(0.2 + pitch) * distance,
    );
    camera.lookAt(0, target.y, 0);
  }

  function resize() {
    const width = container.clientWidth;
    const height = container.clientHeight;
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.fov = width / height > 1 ? 24 : 28;
    camera.updateProjectionMatrix();
    placeCamera();
    if (!running) requestFrame();
  }

  function update(dt: number) {
    if (animating) {
      elapsed += dt;
      spin += SPIN_RATE * dt;
      precess += PRECESSION_RATE * dt;
      tilt.rotation.z = TILT + Math.sin(elapsed * 2.3) * 0.012;
      if (!dragging) {
        targetYaw = clampYaw(targetYaw + velocity);
        velocity *= Math.pow(0.9, dt * 60);
      }
      const ease = 1 - Math.exp(-dt * 9);
      yaw += (targetYaw - yaw) * ease;
      pitch += (targetPitch - pitch) * ease;
    } else {
      yaw = targetYaw;
      pitch = targetPitch;
    }
    rotor.rotation.y = spin;
    precession.rotation.y = precess;
    stage.rotation.y = yaw;
    placeCamera();
  }

  // ── Loop: only runs while visible ────────────────────────
  let running = false;
  let frameId = 0;
  let last = 0;
  let ready = false;
  let visible = false;

  function render() {
    renderer.render(scene, camera);
    if (!ready) {
      ready = true;
      options.onReady?.();
    }
  }

  function loop(now: number) {
    const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
    last = now;
    update(dt);
    render();
    if (running) frameId = requestAnimationFrame(loop);
  }

  function setRunning(next: boolean) {
    if (next === running) return;
    running = next;
    if (running) {
      last = 0;
      frameId = requestAnimationFrame(loop);
    } else {
      cancelAnimationFrame(frameId);
    }
  }

  function requestFrame() {
    if (running) return;
    cancelAnimationFrame(frameId);
    frameId = requestAnimationFrame(() => {
      update(0);
      render();
    });
  }

  function syncRunning() {
    setRunning(animating && visible && !document.hidden);
  }

  const intersection = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    syncRunning();
    if (visible && !running) requestFrame();
  });
  intersection.observe(container);
  const onVisibility = () => syncRunning();
  document.addEventListener("visibilitychange", onVisibility);

  const resizer = new ResizeObserver(resize);
  resizer.observe(container);

  // ── Pointer: horizontal drag turns, vertical drag tilts the view ──
  const onPointerDown = (event: PointerEvent) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    dragging = true;
    velocity = 0;
    lastX = event.clientX;
    lastY = event.clientY;
    canvas.setPointerCapture(event.pointerId);
    container.dataset.dragging = "true";
  };
  const onPointerMove = (event: PointerEvent) => {
    if (!dragging) return;
    const dx = event.clientX - lastX;
    const dy = event.clientY - lastY;
    lastX = event.clientX;
    lastY = event.clientY;
    const step = dx * 0.009;
    targetYaw = clampYaw(targetYaw + step);
    velocity = step;
    if (event.pointerType === "mouse") targetPitch = clampPitch(targetPitch + dy * 0.003);
    if (!running) requestFrame();
  };
  const endDrag = (event: PointerEvent) => {
    if (!dragging) return;
    dragging = false;
    delete container.dataset.dragging;
    if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
    if (!animating) velocity = 0;
  };
  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerup", endDrag);
  canvas.addEventListener("pointercancel", endDrag);

  const onContextLost = (event: Event) => {
    event.preventDefault();
    setRunning(false);
    options.onContextLost?.();
  };
  canvas.addEventListener("webglcontextlost", onContextLost);

  resize();
  requestFrame();

  return {
    turn(radians: number) {
      velocity = 0;
      targetYaw = clampYaw(targetYaw + radians);
      if (!running) requestFrame();
    },
    setPaused(paused: boolean) {
      animating = options.animate && !paused;
      velocity = 0;
      syncRunning();
      if (!running) requestFrame();
    },
    dispose() {
      setRunning(false);
      cancelAnimationFrame(frameId);
      intersection.disconnect();
      resizer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", endDrag);
      canvas.removeEventListener("pointercancel", endDrag);
      canvas.removeEventListener("webglcontextlost", onContextLost);

      const textures = new Set<Texture>([slateMap, shadowMap, environment]);
      scene.traverse((object) => {
        if (object instanceof Mesh) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((m: Material) => m.dispose());
        }
      });
      textures.forEach((t) => t.dispose());
      pmrem.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}
