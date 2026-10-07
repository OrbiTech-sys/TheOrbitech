"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { LayersHandle } from "./layers-scene";

type SceneState = "poster" | "live" | "failed";

export interface PosterImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

interface DeviceNavigator extends Navigator {
  connection?: { saveData?: boolean };
  deviceMemory?: number;
}

/**
 * The still poster is what everyone sees first, and what some people only ever see:
 * visitors who prefer reduced motion, have Save-Data on, are on a low-power device
 * or have no WebGL. The live 3D scene loads after the page is idle.
 */
export default function HeroScene({ poster }: { poster: PosterImage }) {
  const stageRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<SceneState>("poster");

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return;

    const device = navigator as DeviceNavigator;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const eligible = () =>
      !reduce.matches &&
      !device.connection?.saveData &&
      (device.hardwareConcurrency ?? 8) > 2 &&
      (device.deviceMemory ?? 8) > 2;

    let handle: LayersHandle | null = null;
    let cancelled = false;
    let idleId = 0;
    let timerId = 0;

    const start = () => {
      if (cancelled || handle || !eligible()) return;
      import("./layers-scene")
        .then(({ createLayers }) => {
          if (cancelled || handle || !eligible()) return;
          try {
            handle = createLayers(stage, canvas, {
              onReady: () => setState("live"),
              onSettled: () => {
                stage.dataset.settled = "true";
              },
              onContextLost: () => setState("failed"),
            });
          } catch {
            setState("failed");
          }
        })
        .catch(() => setState("failed"));
    };

    const stop = () => {
      handle?.dispose();
      handle = null;
      delete stage.dataset.settled;
      setState("poster");
    };

    const afterFirstPaint = () => {
      if (typeof window.requestIdleCallback === "function") {
        idleId = window.requestIdleCallback(start, { timeout: 2500 });
      } else {
        timerId = window.setTimeout(start, 700);
      }
    };
    if (document.readyState === "complete") afterFirstPaint();
    else window.addEventListener("load", afterFirstPaint, { once: true });

    const onPreferenceChange = () => (reduce.matches ? stop() : afterFirstPaint());
    reduce.addEventListener("change", onPreferenceChange);

    return () => {
      cancelled = true;
      window.removeEventListener("load", afterFirstPaint);
      reduce.removeEventListener("change", onPreferenceChange);
      if (idleId) window.cancelIdleCallback(idleId);
      window.clearTimeout(timerId);
      handle?.dispose();
      handle = null;
    };
  }, []);

  return (
    <figure ref={stageRef} className="stage" data-state={state}>
      <Image
        className="stage__poster"
        src={poster.src}
        alt={poster.alt}
        width={poster.width}
        height={poster.height}
        sizes="(min-width: 60rem) 58vw, 100vw"
        priority
      />
      <canvas ref={canvasRef} className="stage__canvas" aria-hidden="true" />
    </figure>
  );
}
