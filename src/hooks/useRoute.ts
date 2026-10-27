import { useCallback, useEffect, useRef, useState } from "react";
import type { RitualKind, RitualState } from "../components/RitualTransition";
const current = () => window.location.hash.slice(1) || "/";
function kindFor(path: string): RitualKind {
  if (path.startsWith("/write") || path.startsWith("/edit")) return "curtain";
  if (path.startsWith("/archive")) return "cabinet";
  if (path.startsWith("/entry")) return "letter";
  if (path.startsWith("/echo")) return "oracle";
  return "gate";
}
export function useRoute() {
  const [path, setPath] = useState(current);
  const [transition, setTransition] = useState<RitualState | null>(null);
  const [departure, setDeparture] = useState<string | null>(null);
  const dirty = useRef(false);
  const accepted = useRef(current());
  const timers = useRef<number[]>([]);
  const destination = useRef<string | null>(null);
  const setDirty = useCallback((value: boolean) => {
    dirty.current = value;
  }, []);
  const clearTimers = useCallback(() => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
  }, []);
  const commit = useCallback((next: string) => {
    dirty.current = false;
    accepted.current = next;
    if (current() !== next) window.location.hash = next;
    setPath(next);
  }, []);
  const travel = useCallback(
    (next: string) => {
      clearTimers();
      destination.current = next;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        commit(next);
        destination.current = null;
        setTransition(null);
        return;
      }
      const kind = kindFor(next);
      setTransition({ kind, phase: "closing" });
      timers.current.push(
        window.setTimeout(() => {
          commit(next);
          setTransition({ kind, phase: "opening" });
        }, 340),
      );
      timers.current.push(
        window.setTimeout(() => {
          setTransition(null);
          destination.current = null;
        }, 900),
      );
    },
    [clearTimers, commit],
  );
  useEffect(() => {
    const change = () => {
      const next = current();
      if (next === accepted.current) return;
      if (dirty.current) {
        history.replaceState(null, "", "#" + accepted.current);
        setDeparture(next);
        return;
      }
      travel(next);
    };
    const unload = (event: BeforeUnloadEvent) => {
      if (dirty.current) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reduce = () => {
      if (media.matches && destination.current) {
        clearTimers();
        commit(destination.current);
        destination.current = null;
        setTransition(null);
      }
    };
    window.addEventListener("hashchange", change);
    window.addEventListener("beforeunload", unload);
    media.addEventListener("change", reduce);
    return () => {
      clearTimers();
      window.removeEventListener("hashchange", change);
      window.removeEventListener("beforeunload", unload);
      media.removeEventListener("change", reduce);
    };
  }, [clearTimers, commit, travel]);
  function navigate(next: string, force = false) {
    if (next === accepted.current || destination.current) return;
    if (!force && dirty.current) {
      setDeparture(next);
      return;
    }
    travel(next);
  }
  function confirmDeparture() {
    if (!departure) return;
    dirty.current = false;
    setDeparture(null);
    travel(departure);
  }
  return {
    path,
    navigate,
    setDirty,
    transition,
    departure,
    confirmDeparture,
    cancelDeparture: () => setDeparture(null),
  };
}
