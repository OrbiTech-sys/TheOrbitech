"use client";

import { useEffect, useRef, useState } from "react";
import type { SceneHandle, SceneName } from "./scenes";

interface DeviceNavigator extends Navigator {
  connection?: { saveData?: boolean };
  deviceMemory?: number;
}

/**
 * A decorative 3D scene. The CSS behind it (the `.scene` fallback) is what visitors
 * see first, and all that some ever see: Save-Data, low-power devices and no WebGL.
 * With reduced motion the scene draws once and holds still. It only runs while on
 * screen and is released when the component unmounts.
 */
export default function SceneCanvas({ scene, className = "" }: { scene: SceneName; className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<"idle" | "live">("idle");

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;

    const device = navigator as DeviceNavigator;
    const lowPower = device.connection?.saveData || (device.hardwareConcurrency ?? 8) <= 2 || (device.deviceMemory ?? 8) <= 2;
    if (lowPower) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    let handle: SceneHandle | null = null;
    let loading = false;
    let cancelled = false;
    let visible = false;
    let raf = 0;
    let last = 0;

    const measure = () => {
      const { width, height } = host.getBoundingClientRect();
      return { width: Math.max(1, Math.round(width)), height: Math.max(1, Math.round(height)) };
    };

    const tick = (now: number) => {
      raf = 0;
      if (!handle || !visible || document.hidden) return;
      const dt = last ? Math.min((now - last) / 1000, 0.1) : 0.016;
      last = now;
      handle.frame(now / 1000, dt);
      if (!reduce.matches) raf = requestAnimationFrame(tick);
    };
    const kick = () => {
      if (!raf && handle && visible && !document.hidden) {
        last = 0;
        raf = requestAnimationFrame(tick);
      }
    };

    const load = () => {
      if (loading || handle || cancelled) return;
      loading = true;
      import("./scenes")
        .then(({ createScene }) => {
          if (cancelled) return;
          try {
            handle = createScene(scene, canvas);
          } catch {
            return; // no WebGL: the CSS fallback stays
          }
          handle.onContextLost(() => {
            cancelAnimationFrame(raf);
            raf = 0;
            handle?.dispose();
            handle = null;
            setState("idle");
          });
          const { width, height } = measure();
          handle.resize(width, height);
          setState("live");
          kick();
        })
        .catch(() => {
          loading = false;
        });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) {
          load();
          kick();
        }
      },
      { rootMargin: "160px 0px" },
    );
    observer.observe(host);

    const resizer = new ResizeObserver(() => {
      if (!handle) return;
      const { width, height } = measure();
      handle.resize(width, height);
      if (reduce.matches || !raf) {
        last = 0;
        raf = requestAnimationFrame(tick);
      }
    });
    resizer.observe(host);

    const onPointer = (event: PointerEvent) => {
      if (!handle || !visible || reduce.matches) return;
      const rect = host.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
      handle.pointer(Math.max(-1, Math.min(1, x)), Math.max(-1, Math.min(1, y)));
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    const onVisibility = () => kick();
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelled = true;
      observer.disconnect();
      resizer.disconnect();
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
      cancelAnimationFrame(raf);
      handle?.dispose();
      handle = null;
    };
  }, [scene]);

  return (
    <div ref={hostRef} className={`scene scene--${scene} ${className}`.trim()} data-state={state} aria-hidden="true">
      <canvas ref={canvasRef} className="scene__canvas" />
    </div>
  );
}
