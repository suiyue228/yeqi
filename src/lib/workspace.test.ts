import { describe, it, expect } from "vitest";
import {
  isWorkspace,
  readWorkspace,
  writeWorkspace,
  WORKSPACE_KEY,
} from "./workspace";
import type { Workspace } from "./workspace";
const data: Workspace = {
  drafts: [
    {
      id: "draft",
      title: "碎片",
      body: "还没写完",
      mood: "mist",
      tags: [],
      occurredAt: "2026-10-27T12:00:00Z",
      updatedAt: "2026-10-27T12:00:00Z",
    },
  ],
  wishes: [
    {
      id: "wish",
      text: "去看海",
      done: false,
      createdAt: "2026-10-27T12:00:00Z",
    },
  ],
  favoriteIds: ["entry"],
};
const memory = (initial: string | null = null) => {
  let raw = initial;
  return {
    getItem: (_key: string) => raw,
    setItem: (_key: string, value: string) => {
      raw = value;
    },
  };
};
describe("独立草稿心愿收藏存储", () => {
  it("新用户不迁移或改写既有日记，新增数据可完整往返", () => {
    const s = memory();
    expect(readWorkspace(s).data).toEqual({
      drafts: [],
      wishes: [],
      favoriteIds: [],
    });
    writeWorkspace(data, readWorkspace(s), s);
    expect(readWorkspace(s).data).toEqual(data);
  });
  it("重复ID、无效草稿和无效愿望被拒绝", () => {
    expect(isWorkspace(data)).toBe(true);
    for (const bad of [
      { ...data, drafts: [data.drafts[0], data.drafts[0]] },
      { ...data, wishes: [{ ...data.wishes[0], done: "yes" }] },
      { ...data, drafts: [{ ...data.drafts[0], body: " " }] },
      { ...data, favoriteIds: ["x", "x"] },
    ])
      expect(isWorkspace(bad)).toBe(false);
  });
  it("损坏数据保持原文并阻止覆盖", () => {
    const s = memory("{broken");
    const before = readWorkspace(s);
    expect(before.error).not.toBe("");
    expect(() => writeWorkspace(data, before, s)).toThrow();
    expect(s.getItem(WORKSPACE_KEY)).toBe("{broken");
  });
  it("容量与权限错误不宣称成功", () => {
    const s = memory();
    expect(() =>
      writeWorkspace(data, readWorkspace(s), {
        ...s,
        setItem: () => {
          throw new Error("quota");
        },
      }),
    ).toThrow("未能保存");
    expect(s.getItem(WORKSPACE_KEY)).toBeNull();
    expect(
      readWorkspace({
        getItem: () => {
          throw new Error("denied");
        },
      }).error,
    ).not.toBe("");
  });
  it("其他标签页修改后拒绝旧快照覆盖", () => {
    const s = memory(),
      before = readWorkspace(s);
    writeWorkspace(data, before, s);
    expect(() =>
      writeWorkspace({ drafts: [], wishes: [], favoriteIds: [] }, before, s),
    ).toThrow("另一页");
    expect(readWorkspace(s).data).toEqual(data);
  });
});
