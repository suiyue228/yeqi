import { describe, expect, it } from "vitest";
import { filterEntries, isEntry, parseTags, randomEntry } from "./entries";
import { readEntries, STORAGE_KEY, writeEntries } from "./storage";
import type { Entry } from "../types";
const entry: Entry = {
  id: "one",
  title: "Night WALK",
  body: "下雨了，但回家很安心。",
  mood: "mist",
  tags: ["散步"],
  occurredAt: "2026-10-25T12:00:00Z",
  createdAt: "2026-10-25T12:00:00Z",
  updatedAt: "2026-10-25T12:00:00Z",
};
const second: Entry = {
  ...entry,
  id: "two",
  title: "晴天",
  mood: "sun",
  tags: ["家"],
  occurredAt: "2026-10-26T12:00:00Z",
};
function memory(initial: string | null = null) {
  let raw = initial;
  return {
    getItem: (_key: string) => raw,
    setItem: (_key: string, value: string) => {
      raw = value;
    },
  };
}
describe("记录模型与档案", () => {
  it("拒绝空正文、无效日期、心情、过长标题和标签", () => {
    expect(isEntry(entry)).toBe(true);
    for (const change of [
      { body: "  " },
      { occurredAt: "bad" },
      { mood: "bad" },
      { title: "长".repeat(81) },
      { tags: Array(9).fill("x") },
      { tags: ["x".repeat(21)] },
    ])
      expect(isEntry({ ...entry, ...change })).toBe(false);
  });
  it("去重多种分隔符标签", () =>
    expect(parseTags(" 散步，家,散步、梦\n ")).toEqual(["散步", "家", "梦"]));
  it("搜索标题正文、心情标签组合、升降序及无结果", () => {
    const entries = [entry, second];
    expect(filterEntries(entries, "walk", "mist", "散步", "newest")).toEqual([
      entry,
    ]);
    expect(filterEntries(entries, "回家", "sun", "家", "newest")).toEqual([
      second,
    ]);
    expect(filterEntries(entries, "", "", "", "oldest")).toEqual(entries);
    expect(filterEntries(entries, "", "", "", "newest")).toEqual([
      second,
      entry,
    ]);
    expect(filterEntries(entries, "missing", "", "", "newest")).toEqual([]);
  });
  it("回响无数据为空，多条时避开上次", () => {
    expect(randomEntry([])).toBeUndefined();
    expect(randomEntry([entry, second], "one")).toBe(second);
  });
});
describe("持久化与数据保护", () => {
  it("保存后可读取原始数据，包含版本", () => {
    const store = memory();
    const saved = writeEntries([entry], readEntries(store), store);
    expect(readEntries(store).entries).toEqual([entry]);
    expect(saved.raw).toContain("schemaVersion");
  });
  it("损坏 JSON、未知版本、重复 id 不可静默覆盖", () => {
    for (const raw of [
      "{bad",
      JSON.stringify({ schemaVersion: 2, entries: [] }),
      JSON.stringify({ schemaVersion: 1, entries: [entry, entry] }),
    ]) {
      const store = memory(raw);
      const loaded = readEntries(store);
      expect(loaded.error).not.toBe("");
      expect(loaded.raw).toBe(raw);
      expect(() => writeEntries([], loaded, store)).toThrow();
      expect(store.getItem(STORAGE_KEY)).toBe(raw);
    }
  });
  it("读取权限异常返回受保护状态", () => {
    expect(
      readEntries({
        getItem: () => {
          throw new Error("denied");
        },
      }).error,
    ).toContain("暂停写入");
  });
  it("容量错误保持旧数据，写入失败不返回成功", () => {
    const store = memory();
    const previous = readEntries(store);
    expect(() =>
      writeEntries([entry], previous, {
        ...store,
        setItem: () => {
          throw new Error("quota");
        },
      }),
    ).toThrow("未能保存");
    expect(store.getItem(STORAGE_KEY)).toBeNull();
  });
  it("其他标签页修改后拒绝旧快照覆盖", () => {
    const store = memory();
    const old = readEntries(store);
    writeEntries([entry], old, store);
    expect(() => writeEntries([second], old, store)).toThrow("另一个标签页");
    expect(readEntries(store).entries).toEqual([entry]);
  });
});
