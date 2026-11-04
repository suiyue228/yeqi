import { useEffect, useRef } from "react";
import type { PointerEvent } from "react";

export function usePaperTilt() {
  const stage = useRef<HTMLDivElement>(null);
  const frame = useRef<number | null>(null);

  function cancelFrame() {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
  }

  useEffect(() => cancelFrame, []);

  function tilt(event: PointerEvent<HTMLDivElement>) {
    if (
      event.pointerType === "touch" ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const { left, top, width, height } =
      event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - left) / width - 0.5;
    const y = (event.clientY - top) / height - 0.5;
    cancelFrame();
    frame.current = requestAnimationFrame(() => {
      frame.current = null;
      stage.current?.style.setProperty("--tilt-x", `${-y * 3}deg`);
      stage.current?.style.setProperty("--tilt-y", `${x * 4}deg`);
    });
  }

  function resetTilt() {
    cancelFrame();
    stage.current?.style.setProperty("--tilt-x", "0deg");
    stage.current?.style.setProperty("--tilt-y", "0deg");
  }

  return { stage, tilt, resetTilt };
}
