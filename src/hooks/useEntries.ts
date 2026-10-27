import { useEffect, useState } from "react";
import type { Entry } from "../types";
import {
  downloadText,
  readEntries,
  STORAGE_KEY,
  writeEntries,
} from "../lib/storage";
export function useEntries() {
  const [snapshot, setSnapshot] = useState(readEntries);
  const [conflict, setConflict] = useState(false);
  useEffect(() => {
    const handler = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY || event.key === null) setConflict(true);
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);
  function persist(entries: Entry[]) {
    if (conflict)
      throw new Error("另一个标签页已修改数据。请复制未保存的文字，然后刷新。");
    setSnapshot(writeEntries(entries, snapshot));
  }
  function save(entry: Entry) {
    persist([...snapshot.entries.filter((e) => e.id !== entry.id), entry]);
  }
  function remove(id: string) {
    persist(snapshot.entries.filter((e) => e.id !== id));
  }
  function exportData() {
    const raw = snapshot.error
      ? snapshot.raw
      : JSON.stringify(
          {
            schemaVersion: 1,
            exportedAt: new Date().toISOString(),
            entries: snapshot.entries,
          },
          null,
          2,
        );
    if (raw === null)
      throw new Error(
        "浏览器拒绝读取数据，暂时无法导出。请检查存储权限后重试。",
      );
    downloadText(
      raw,
      `yeqi-${snapshot.error ? "recovery-" : ""}${new Date().toISOString().slice(0, 10)}.json`,
    );
  }
  return {
    entries: snapshot.entries,
    error:
      snapshot.error ||
      (conflict
        ? "检测到其他标签页的修改。请先复制未保存的文字，再刷新页面，以免覆盖新记录。"
        : ""),
    save,
    remove,
    exportData,
  };
}
