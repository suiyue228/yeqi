import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";
test.use({ reducedMotion: "reduce" });
async function record(page: Page) {
  await page.goto("/#/write");
  await page.getByLabel("标题（可选）", { exact: true }).fill("月历里的散步");
  await page
    .getByLabel("心情正文（必填）", { exact: true })
    .fill("真的走过这一天。");
  await page.getByLabel("记忆发生的时间").fill("2026-10-24T19:00");
  await page.getByRole("button", { name: "封存这段记忆" }).click();
  await expect(page.locator(".entry-body")).toHaveText("真的走过这一天。");
}
test("草稿快速保存、刷新、编辑、转正式与删除", async ({ page }) => {
  await page.goto("/#/drafts");
  await page.getByLabel("草稿标题（可选）", { exact: true }).fill("未完的月亮");
  await page.getByLabel("快速碎片", { exact: true }).fill("先写半句");
  await page.getByRole("button", { name: "存入草稿匣", exact: false }).click();
  await page.reload();
  await expect(page.locator(".draft-fragment")).toContainText("先写半句");
  await page
    .getByRole("button", { name: "继续编辑 / 转为正式记录", exact: false })
    .click();
  await page
    .getByLabel("心情正文（必填）", { exact: true })
    .fill("现在写完整了。");
  await page.getByRole("button", { name: "保存草稿修改", exact: true }).click();
  await expect(page.locator(".draft-fragment")).toContainText("现在写完整了。");
  await page
    .getByRole("button", { name: "继续编辑 / 转为正式记录", exact: false })
    .click();
  await page
    .getByRole("button", { name: "转为正式记录", exact: false })
    .click();
  await expect(page.locator(".entry-body")).toHaveText("现在写完整了。");
  await page.goto("/#/drafts");
  await expect(page.locator(".draft-fragment")).toHaveCount(0);
  await page.getByLabel("快速碎片", { exact: true }).fill("可以删除的碎片");
  await page.getByRole("button", { name: "存入草稿匣", exact: false }).click();
  await page.getByRole("button", { name: "删除草稿", exact: true }).click();
  await page.getByRole("button", { name: "确认删除", exact: true }).click();
  await expect(page.locator(".draft-fragment")).toHaveCount(0);
});
test("档案收藏与独立藏匣，月历标记并打开当天内容", async ({ page }) => {
  await record(page);
  await page
    .getByRole("button", { name: "收藏这封梦笺", exact: false })
    .click();
  await page.goto("/#/collection");
  await expect(page.locator(".entry-slip")).toHaveCount(1);
  await page.reload();
  await expect(page.locator(".entry-slip")).toContainText("月历里的散步");
  await page
    .getByRole("button", { name: "取消收藏：月历里的散步", exact: true })
    .click();
  await expect(page.locator(".entry-slip")).toHaveCount(0);
  await page.goto("/#/archive");
  await page
    .getByRole("button", { name: "收藏：月历里的散步", exact: true })
    .click();
  await page.goto("/#/calendar");
  await page.getByLabel("查看月份", { exact: true }).fill("2026-10");
  await page
    .getByRole("button", { name: "2026-10-24，1条记录", exact: true })
    .click();
  await expect(page.locator(".calendar-day-panel")).toContainText(
    "月历里的散步",
  );
  await page.locator(".calendar-day-panel .entry-slip").click();
  await expect(page.locator(".entry-body")).toHaveText("真的走过这一天。");
});
test("愿望添加、完成切换、状态筛选和刷新恢复", async ({ page }) => {
  await page.goto("/#/wishes");
  await page.getByLabel("给未来的低语", { exact: true }).fill("有一天去看海");
  await page.getByRole("button", { name: "收进心愿瓶", exact: false }).click();
  await page.locator(".wish-list input").click();
  await expect(page.locator(".wish-list li")).toHaveCount(0);
  await page.getByRole("button", { name: "已完成 1", exact: true }).click();
  await expect(page.locator(".wish-list")).toContainText("有一天去看海");
  await page.reload();
  await page.getByRole("button", { name: "已完成 1", exact: true }).click();
  await expect(page.locator(".wish-list input")).toBeChecked();
});
test("完整JSON备份包含正式记录、草稿、愿望和收藏索引", async ({ page }) => {
  await record(page);
  await page
    .getByRole("button", { name: "收藏这封梦笺", exact: false })
    .click();
  await page.goto("/#/drafts");
  await page.getByLabel("快速碎片", { exact: true }).fill("备份中的草稿");
  await page.getByRole("button", { name: "存入草稿匣", exact: false }).click();
  await page.goto("/#/wishes");
  await page.getByLabel("给未来的低语", { exact: true }).fill("备份中的愿望");
  await page.getByRole("button", { name: "收进心愿瓶", exact: false }).click();
  const promise = page.waitForEvent("download");
  await page.getByRole("button", { name: "导出记忆", exact: false }).click();
  const stream = await (await promise).createReadStream(),
    parts: Buffer[] = [];
  for await (const part of stream!) parts.push(part);
  const data = JSON.parse(Buffer.concat(parts).toString());
  expect(data.entries).toHaveLength(1);
  expect(data.workspace.data.drafts).toHaveLength(1);
  expect(data.workspace.data.wishes).toHaveLength(1);
  expect(data.workspace.data.favoriteIds).toHaveLength(1);
});
test("附属数据损坏时阻止覆盖，仍可查看原有正式记录", async ({ page }) => {
  await record(page);
  await page.evaluate(() =>
    localStorage.setItem("yeqi.workspace.v1", "{broken"),
  );
  await page.reload();
  await expect(page.getByRole("alert")).toContainText("暂停");
  await expect(page.locator(".entry-body")).toHaveText("真的走过这一天。");
  await page.goto("/#/drafts");
  await expect(
    page.getByRole("button", { name: "存入草稿匣", exact: false }),
  ).toBeDisabled();
  expect(
    await page.evaluate(() => localStorage.getItem("yeqi.workspace.v1")),
  ).toBe("{broken");
});
