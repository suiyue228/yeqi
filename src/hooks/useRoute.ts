import { useCallback, useEffect, useRef, useState } from "react";
const current = () => window.location.hash.slice(1) || "/";
export function useRoute() {
  const [path, setPath] = useState(current);
  const dirty = useRef(false);
  const accepted = useRef(current());
  const bypass = useRef(false);
  const setDirty = useCallback((value: boolean) => {
    dirty.current = value;
  }, []);
  useEffect(() => {
    const change = () => {
      if (
        !bypass.current &&
        dirty.current &&
        !window.confirm("这封梦笺尚未保存。确定放下这些修改并离开吗？")
      ) {
        history.replaceState(null, "", `#${accepted.current}`);
        return;
      }
      bypass.current = false;
      dirty.current = false;
      accepted.current = current();
      setPath(current());
    };
    const unload = (e: BeforeUnloadEvent) => {
      if (dirty.current) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("hashchange", change);
    window.addEventListener("beforeunload", unload);
    return () => {
      window.removeEventListener("hashchange", change);
      window.removeEventListener("beforeunload", unload);
    };
  }, []);
  function navigate(next: string, force = false) {
    if (next === current()) return;
    bypass.current = force;
    window.location.hash = next;
  }
  return { path, navigate, setDirty };
}
