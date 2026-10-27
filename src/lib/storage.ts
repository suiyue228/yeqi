import type { Entry } from "../types";
import { isEntry } from "./entries";
export const STORAGE_KEY = "yeqi.entries.v1";
export interface Snapshot {
  entries: Entry[];
  raw: string | null;
  error: string;
}
export function readEntries(storage?: Pick<Storage, "getItem">): Snapshot {
  let raw: string | null = null;
  try {
    raw = (storage ?? localStorage).getItem(STORAGE_KEY);
    if (raw === null) return { entries: [], raw, error: "" };
    const parsed = JSON.parse(raw);
    if (
      parsed.schemaVersion !== 1 ||
      !Array.isArray(parsed.entries) ||
      !parsed.entries.every(isEntry) ||
      new Set(parsed.entries.map((e: Entry) => e.id)).size !==
        parsed.entries.length
    )
      throw new Error("invalid");
    return { entries: parsed.entries, raw, error: "" };
  } catch {
    return {
      entries: [],
      raw,
      error:
        "记忆匣暂时无法读取。为保护原数据，已暂停写入。请先导出原始数据备份，再检查浏览器存储权限或恢复备份。",
    };
  }
}
export function writeEntries(
  entries: Entry[],
  previous: Snapshot,
  storage: Pick<Storage, "getItem" | "setItem"> = localStorage,
): Snapshot {
  if (previous.error) throw new Error(previous.error);
  if (!entries.every(isEntry)) throw new Error("记录格式无效，尚未保存。");
  try {
    if (storage.getItem(STORAGE_KEY) !== previous.raw)
      throw new Error("CONFLICT");
    const raw = JSON.stringify({ schemaVersion: 1, entries });
    storage.setItem(STORAGE_KEY, raw);
    return { entries, raw, error: "" };
  } catch (error) {
    if (error instanceof Error && error.message === "CONFLICT")
      throw new Error(
        "另一个标签页已修改记忆。请复制未保存的文字，然后刷新此页再继续。",
      );
    throw new Error(
      "未能保存：浏览器存储可能已满或被禁用。你的输入仍在，请复制文字并导出已有记录。",
    );
  }
}
export function downloadText(text: string, name: string) {
  const url = URL.createObjectURL(
    new Blob([text], { type: "application/json;charset=utf-8" }),
  );
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
