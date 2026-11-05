import { useEffect, useRef, useState } from "react";

type Motion = { kind: "shuffle" | "fan" | "cut" | "turn"; index?: number };
export const TAROT_MOTION_MS = { shuffle: 1450, fan: 650, cut: 1100, turn: 900 };

/** One bounded gesture at a time. Reducing motion finishes the pending action. */
export function useTarotMotion() {
  const [motion, setMotion] = useState<Motion | null>(null);
  const pending = useRef<{ finish: () => void; timer: number } | null>(null);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reduce = () => {
      if (!media.matches || !pending.current) return;
      const action = pending.current;
      window.clearTimeout(action.timer);
      action.finish();
    };
    media.addEventListener("change", reduce);
    return () => {
      media.removeEventListener("change", reduce);
      if (pending.current) window.clearTimeout(pending.current.timer);
      pending.current = null;
    };
  }, []);
  function run(next: Motion, done: () => void = () => {}) {
    if (pending.current) return false;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      done();
      return true;
    }
    const finish = () => {
      pending.current = null;
      done();
      setMotion(null);
    };
    pending.current = {
      finish,
      timer: window.setTimeout(finish, TAROT_MOTION_MS[next.kind]),
    };
    setMotion(next);
    return true;
  }
  return { motion, run, isBusy: () => pending.current !== null };
}
