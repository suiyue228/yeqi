import { MOODS } from "../types";
import type { Entry, Mood } from "../types";
export const MAX_BODY = 20000;
export function validDate(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length > 0 &&
    Number.isFinite(Date.parse(value))
  );
}
export function isEntry(value: unknown): value is Entry {
  if (!value || typeof value !== "object") return false;
  const e = value as Entry;
  return (
    typeof e.id === "string" &&
    e.id.length > 0 &&
    e.id.length <= 100 &&
    typeof e.title === "string" &&
    e.title.length <= 80 &&
    typeof e.body === "string" &&
    !!e.body.trim() &&
    e.body.length <= MAX_BODY &&
    MOODS.some((m) => m.id === e.mood) &&
    Array.isArray(e.tags) &&
    e.tags.length <= 8 &&
    e.tags.every(
      (t) => typeof t === "string" && !!t.trim() && t.length <= 20,
    ) &&
    validDate(e.occurredAt) &&
    validDate(e.createdAt) &&
    validDate(e.updatedAt)
  );
}
export function parseTags(text: string): string[] {
  return [
    ...new Set(
      text
        .split(/[,，、\n]/)
        .map((t) => t.trim())
        .filter(Boolean),
    ),
  ];
}
export function filterEntries(
  entries: Entry[],
  query: string,
  mood: Mood | "",
  tag: string,
  order: "newest" | "oldest",
) {
  const q = query.trim().toLocaleLowerCase();
  return entries
    .filter(
      (e) =>
        (!q || `${e.title}\n${e.body}`.toLocaleLowerCase().includes(q)) &&
        (!mood || e.mood === mood) &&
        (!tag || e.tags.includes(tag)),
    )
    .sort(
      (a, b) =>
        (Date.parse(b.occurredAt) - Date.parse(a.occurredAt)) *
        (order === "newest" ? 1 : -1),
    );
}
export function randomEntry(
  entries: Entry[],
  previous?: string,
): Entry | undefined {
  const pool =
    entries.length > 1 ? entries.filter((e) => e.id !== previous) : entries;
  return pool[Math.floor(Math.random() * pool.length)];
}
export function formatDate(date: string, time = false) {
  return new Date(date).toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    ...(time ? { hour: "2-digit", minute: "2-digit", hour12: false } : {}),
  });
}
export function localInput(date: string = new Date().toISOString()) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}T${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}
