import { useEffect, useRef, useState } from "react";
import { readWorkspace, writeWorkspace, WORKSPACE_KEY } from "../lib/workspace";
import type { Draft, Workspace } from "../lib/workspace";
export function useWorkspace() {
  const [snapshot, setSnapshot] = useState(readWorkspace);
  const live = useRef(snapshot);
  const [conflict, setConflict] = useState(false);
  const stale = useRef(false);
  useEffect(() => {
    const change = (e: StorageEvent) => {
      if (e.key === WORKSPACE_KEY || e.key === null) {
        stale.current = true;
        setConflict(true);
      }
    };
    window.addEventListener("storage", change);
    return () => window.removeEventListener("storage", change);
  }, []);
  function mutate(change: (data: Workspace) => Workspace) {
    if (stale.current)
      throw new Error("另一页已修改草稿/心愿/收藏，请复制输入后刷新。");
    const next = writeWorkspace(change(live.current.data), live.current);
    live.current = next;
    setSnapshot(next);
  }
  return {
    ...snapshot.data,
    error:
      snapshot.error ||
      (conflict ? "另一页已修改草稿/心愿/收藏，请复制输入后刷新。" : ""),
    backup: snapshot.error
      ? { recoveryRaw: snapshot.raw, error: snapshot.error }
      : { schemaVersion: 1, data: snapshot.data },
    saveDraft: (draft: Draft) =>
      mutate((w) => ({
        ...w,
        drafts: [draft, ...w.drafts.filter((d) => d.id !== draft.id)],
      })),
    removeDraft: (id: string) =>
      mutate((w) => ({ ...w, drafts: w.drafts.filter((d) => d.id !== id) })),
    addWish: (text: string) =>
      mutate((w) => ({
        ...w,
        wishes: [
          {
            id: crypto.randomUUID(),
            text: text.trim(),
            done: false,
            createdAt: new Date().toISOString(),
          },
          ...w.wishes,
        ],
      })),
    toggleWish: (id: string) =>
      mutate((w) => ({
        ...w,
        wishes: w.wishes.map((item) =>
          item.id === id ? { ...item, done: !item.done } : item,
        ),
      })),
    toggleFavorite: (id: string) =>
      mutate((w) => ({
        ...w,
        favoriteIds: w.favoriteIds.includes(id)
          ? w.favoriteIds.filter((item) => item !== id)
          : [id, ...w.favoriteIds],
      })),
  };
}
