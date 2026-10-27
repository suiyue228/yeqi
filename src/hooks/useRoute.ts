import { useCallback, useEffect, useRef, useState } from "react";
import type { RitualKind, RitualState } from "../components/RitualTransition";
import { RITUAL_SWAP, RITUAL_TOTAL } from "../lib/ritual";
import { audio } from "../lib/audio";
const current = () => window.location.hash.slice(1) || "/";
interface Destination {
  next: string;
  position?: number;
}
interface Departure {
  next: string;
  delta?: number;
}
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
  const [departure, setDeparture] = useState<Departure | null>(null);
  const dirty = useRef(false);
  const accepted = useRef(current());
  const timers = useRef<number[]>([]);
  const destination = useRef<Destination | null>(null);
  const position = useRef<number>(history.state?.yeqiPosition ?? 0);
  const restoringHistory = useRef(false);
  const setDirty = useCallback((value: boolean) => {
    dirty.current = value;
  }, []);
  const clearTimers = useCallback(() => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
  }, []);
  const commit = useCallback((next: string, historyPosition?: number) => {
    dirty.current = false;
    accepted.current = next;
    if (historyPosition === undefined) {
      position.current += 1;
      history.pushState(
        { ...history.state, yeqiPosition: position.current },
        "",
        "#" + next,
      );
    } else {
      position.current = historyPosition;
    }
    setPath(next);
  }, []);
  const travel = useCallback(
    (next: string, historyPosition?: number) => {
      clearTimers();
      destination.current = { next, position: historyPosition };
      const soundKind = kindFor(next);
      audio.play(
        soundKind === "cabinet"
          ? "drawer"
          : soundKind === "letter"
            ? "letter"
            : soundKind === "oracle"
              ? "chime"
              : "curtain",
      );
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        commit(next, historyPosition);
        destination.current = null;
        setTransition(null);
        return;
      }
      const kind = kindFor(next);
      setTransition({ kind, phase: "closing" });
      timers.current.push(
        window.setTimeout(() => {
          commit(next, historyPosition);
          // Finishing early during the reveal must not push this URL twice.
          destination.current = { next, position: position.current };
          setTransition({ kind, phase: "opening" });
        }, RITUAL_SWAP),
      );
      timers.current.push(
        window.setTimeout(() => {
          setTransition(null);
          destination.current = null;
        }, RITUAL_TOTAL),
      );
    },
    [clearTimers, commit],
  );
  useEffect(() => {
    if (history.state?.yeqiPosition === undefined) {
      history.replaceState(
        { ...history.state, yeqiPosition: position.current },
        "",
      );
    }
    const change = () => {
      const next = current();
      if (restoringHistory.current) {
        restoringHistory.current = false;
        return;
      }
      if (next === accepted.current) {
        clearTimers();
        destination.current = null;
        setTransition(null);
        return;
      }
      const nextPosition = history.state?.yeqiPosition ?? position.current + 1;
      if (history.state?.yeqiPosition === undefined) {
        history.replaceState(
          { ...history.state, yeqiPosition: nextPosition },
          "",
        );
      }
      if (dirty.current) {
        const delta = nextPosition - position.current;
        // Return to the original history entry while asking; never rewrite it.
        restoringHistory.current = true;
        history.go(-delta);
        setDeparture({ next, delta });
        return;
      }
      travel(next, nextPosition);
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
        commit(destination.current.next, destination.current.position);
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
      setDeparture({ next });
      return;
    }
    travel(next);
  }
  function confirmDeparture() {
    if (!departure) return;
    dirty.current = false;
    setDeparture(null);
    if (departure.delta !== undefined) history.go(departure.delta);
    else travel(departure.next);
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
