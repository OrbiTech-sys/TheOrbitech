"use client";

import { useEffect, useRef, useState } from "react";
import { MoveHorizontal, Pause, Play } from "lucide-react";
import GyroscopeDrawing from "./GyroscopeDrawing";
import type { GyroscopeHandle } from "./gyroscope-scene";

type ViewState = "drawing" | "live" | "unavailable";

interface NetworkInformationLike {
  saveData?: boolean;
}

export default function HeroInstrument() {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const handleRef = useRef<GyroscopeHandle | null>(null);
  const [view, setView] = useState<ViewState>("drawing");
  const [canPause, setCanPause] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return;

    const connection = (navigator as Navigator & { connection?: NetworkInformationLike }).connection;
    if (connection?.saveData) return; // keep the drawing on data-saver connections

    const animate = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cancelled = false;

    import("./gyroscope-scene")
      .then(({ createGyroscope }) => {
        if (cancelled) return;
        try {
          handleRef.current = createGyroscope(stage, canvas, {
            animate,
            onReady: () => {
              setView("live");
              setCanPause(animate);
            },
            onContextLost: () => setView("unavailable"),
          });
        } catch {
          setView("unavailable");
        }
      })
      .catch(() => {
        if (!cancelled) setView("unavailable");
      });

    return () => {
      cancelled = true;
      handleRef.current?.dispose();
      handleRef.current = null;
    };
  }, []);

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (view !== "live" || !handleRef.current) return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      handleRef.current.turn(-0.35);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      handleRef.current.turn(0.35);
    }
  };

  const live = view === "live";

  const togglePaused = () => {
    const next = !paused;
    setPaused(next);
    handleRef.current?.setPaused(next);
  };

  return (
    <figure className="instrument" data-view={view}>
      <div
        ref={stageRef}
        className="instrument__stage"
        tabIndex={live ? 0 : -1}
        role={live ? "img" : undefined}
        aria-roledescription={live ? "interactive 3D model" : undefined}
        aria-label={
          live
            ? "Steel and brass gyroscope on a slate plinth. Drag, or use the left and right arrow keys, to turn it."
            : undefined
        }
        onKeyDown={onKeyDown}
      >
        <GyroscopeDrawing className="instrument__drawing" hidden={live} />
        <canvas ref={canvasRef} className="instrument__canvas" aria-hidden="true" />
      </div>
      <figcaption className="instrument__caption">
        <span>
          {view === "unavailable"
            ? "3D view isn’t available on this device, so here is the drawing."
            : "A gyroscope holds its orientation while everything around it moves."}
        </span>
        {live && (
          <span className="instrument__controls">
            <span className="instrument__hint" aria-hidden="true">
              <MoveHorizontal size={14} strokeWidth={1.75} />
              Drag to turn
            </span>
            {canPause && (
              <button type="button" className="instrument__pause" onClick={togglePaused}>
                {paused ? <Play size={13} strokeWidth={1.75} aria-hidden="true" /> : <Pause size={13} strokeWidth={1.75} aria-hidden="true" />}
                {paused ? "Resume motion" : "Pause motion"}
              </button>
            )}
          </span>
        )}
      </figcaption>
    </figure>
  );
}
