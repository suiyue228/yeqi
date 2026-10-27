import type { Mood } from "../types";
import { isEntry, validDate } from "./entries";
export interface Draft {
  id: string;
  title: string;
  body: string;
  mood: Mood;
  tags: string[];
  occurredAt: string;
  updatedAt: string;
}
export interface Wish {
  id: string;
  text: string;
  done: boolean;
  createdAt: string;
}
export interface Workspace {
  drafts: Draft[];
  wishes: Wish[];
  favoriteIds: string[];
}
export interface WorkspaceSnapshot {
  data: Workspace;
  raw: string | null;
  error: string;
}
export const WORKSPACE_KEY = "yeqi.workspace.v1";
const empty = (): Workspace => ({ drafts: [], wishes: [], favoriteIds: [] });
const unique = (values: string[]) => new Set(values).size === values.length;
export function isWorkspace(value: unknown): value is Workspace {
  if (!value || typeof value !== "object") return false;
  const w = value as Workspace;
  return (
    Array.isArray(w.drafts) &&
    w.drafts.every((d) => d && isEntry({ ...d, createdAt: d.updatedAt })) &&
    unique(w.drafts.map((d) => d.id)) &&
    Array.isArray(w.wishes) &&
    w.wishes.every(
      (w) =>
        w &&
        typeof w.id === "string" &&
        !!w.id &&
        typeof w.text === "string" &&
        !!w.text.trim() &&
        w.text.length <= 300 &&
        typeof w.done === "boolean" &&
        validDate(w.createdAt),
    ) &&
    unique(w.wishes.map((w) => w.id)) &&
    Array.isArray(w.favoriteIds) &&
    w.favoriteIds.every(
      (id) => typeof id === "string" && !!id && id.length <= 100,
    ) &&
    unique(w.favoriteIds)
  );
}
export function readWorkspace(
  storage?: Pick<Storage, "getItem">,
): WorkspaceSnapshot {
  let raw: string | null = null;
  try {
    raw = (storage ?? localStorage).getItem(WORKSPACE_KEY);
    if (raw === null) return { data: empty(), raw, error: "" };
    const parsed = JSON.parse(raw);
    if (parsed.schemaVersion !== 1 || !isWorkspace(parsed.data))
      throw new Error("invalid");
    return { data: parsed.data, raw, error: "" };
  } catch {
    return {
      data: empty(),
      raw,
      error:
        "草稿、心愿与收藏匣无法读取，已暂停这些模块的写入。请导出备份，勿清空存储。",
    };
  }
}
export function writeWorkspace(
  data: Workspace,
  previous: WorkspaceSnapshot,
  storage: Pick<Storage, "getItem" | "setItem"> = localStorage,
): WorkspaceSnapshot {
  if (previous.error) throw new Error(previous.error);
  if (!isWorkspace(data)) throw new Error("草稿或心愿格式无效，尚未保存。");
  try {
    if (storage.getItem(WORKSPACE_KEY) !== previous.raw)
      throw new Error("conflict");
    const raw = JSON.stringify({ schemaVersion: 1, data });
    storage.setItem(WORKSPACE_KEY, raw);
    return { data, raw, error: "" };
  } catch (e) {
    throw new Error(
      e instanceof Error && e.message === "conflict"
        ? "另一页已修改草稿/心愿/收藏，请复制输入后刷新。"
        : "未能保存草稿/心愿/收藏，请保留输入并检查存储空间与权限。",
    );
  }
}
