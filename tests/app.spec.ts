import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";
// Functional regression uses the supported static mode. Normal-motion routing is
// exercised separately, including its interaction lock and focus restoration.
test.use({ reducedMotion: "reduce" });
async function write(
  page: Page,
  title: string,
  body: string,
  mood = "mist",
  tags = "",
) {
  await page.goto("/#/write");
  await page.getByLabel("标题（可选）", { exact: true }).fill(title);
  await page.getByLabel("心情正文（必填）", { exact: true }).fill(body);
  await page.locator(`input[value="${mood}"]`).check();
  await page.getByLabel("标签 / 自定义感受").fill(tags);
  await page.getByRole("button", { name: "封存这段记忆" }).click();
  await expect(page.locator(".entry-body")).toHaveText(body);
}
test("创建、刷新恢复、编辑、取消和确认删除、导出 JSON", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await write(
    page,
    "一小片月光",
    "今晚走了一段安静的路。\n<script>alert(1)</script>",
    "sun",
    "散步，生活",
  );
  await expect(page.locator("#page-title")).toHaveText("一小片月光");
  await page.reload();
  await expect(page.locator(".entry-body")).toContainText("<script>");
  await page.getByRole("button", { name: "重新落笔" }).click();
  await page
    .getByLabel("心情正文（必填）", { exact: true })
    .fill("修改后，还是喜欢这片月光。");
  await page.getByRole("button", { name: "封存这段记忆" }).click();
  await expect(page.locator(".entry-body")).toHaveText(
    "修改后，还是喜欢这片月光。",
  );
  await page.getByRole("button", { name: "删除这封梦笺" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "导出记忆", exact: false }).click();
  const download = await downloadPromise;
  const stream = await download.createReadStream();
  const parts: Buffer[] = [];
  for await (const part of stream!) parts.push(part);
  const backup = JSON.parse(Buffer.concat(parts).toString("utf8"));
  expect(backup.schemaVersion).toBe(1);
  expect(backup.entries[0].tags).toEqual(["散步", "生活"]);
  expect(backup.entries[0].body).toBe("修改后，还是喜欢这片月光。");
  await page.getByRole("button", { name: "删除这封梦笺" }).click();
  await page.getByRole("button", { name: "确认删除", exact: true }).click();
  await expect(page.locator(".archive-count")).toContainText("找到 0 封");
  await page.reload();
  await expect(page.locator(".archive-count")).toContainText("找到 0 封");
  expect(errors).toEqual([]);
});
test("搜索、心情标签组合、排序、清除和真实回响", async ({ page }) => {
  await write(page, "旧梦", "梦里回到小时候。", "mist", "梦境");
  await page.getByRole("button", { name: "今夜回响", exact: false }).click();
  await expect(page.locator("#page-title")).toHaveText("旧梦");
  await page.getByRole("button", { name: "再听一段回响" }).click();
  await expect(page.getByRole("status")).toContainText("只有这一封");
  await page.goto(
    "/#/edit/" +
      (await page.evaluate(
        () =>
          JSON.parse(localStorage.getItem("yeqi.entries.v1")!).entries[0].id,
      )),
  );
  await page.getByLabel("记忆发生的时间").fill("2026-10-20T20:00");
  await page.getByRole("button", { name: "封存这段记忆" }).click();
  await write(page, "今天的光", "散步途中看见一片暖光。", "sun", "散步");
  await page.goto("/#/archive");
  await expect(page.locator(".entry-slip").first()).toContainText("今天的光");
  await page.getByLabel("时间排序").selectOption("oldest");
  await expect(page.locator(".entry-slip").first()).toContainText("旧梦");
  await page
    .getByRole("searchbox", { name: "搜索标题或正文", exact: true })
    .fill("暖光");
  await page.getByLabel("心天气", { exact: true }).selectOption("sun");
  await page.getByLabel("标签", { exact: true }).selectOption("散步");
  await expect(page.locator(".entry-slip")).toHaveCount(1);
  await page.getByLabel("心天气", { exact: true }).selectOption("mist");
  await expect(page.locator(".entry-slip")).toHaveCount(0);
  await page.getByRole("button", { name: "清除筛选", exact: true }).click();
  await expect(page.locator(".entry-slip")).toHaveCount(2);
  await page.getByRole("button", { name: "今夜回响", exact: false }).click();
  const first = await page.locator("#page-title").innerText();
  expect(["旧梦", "今天的光"]).toContain(first);
  await page.getByRole("button", { name: "再听一段回响" }).click();
  await expect(page.locator("#page-title")).not.toHaveText(first);
});
test("校验、未保存离开确认与浏览器返回", async ({ page }) => {
  await page.goto("/#/write");
  await page.getByRole("button", { name: "封存这段记忆" }).click();
  await expect(page.getByRole("alert")).toContainText("至少留下一句话");
  await page.getByLabel("心情正文（必填）", { exact: true }).fill("还没写完");
  await page.getByRole("button", { name: "放下信笺" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "继续写信", exact: true }).click();
  await expect(page).toHaveURL(/write/);
  await expect(
    page.getByLabel("心情正文（必填）", { exact: true }),
  ).toHaveValue("还没写完");
  await page.getByRole("button", { name: "放下信笺" }).click();
  await page
    .getByRole("button", { name: "放弃修改并离开", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { level: 1, name: "夜栖 · 月下树洞" }),
  ).toBeVisible();
  await page.goto("/#/write");
  await page.getByLabel("心情正文（必填）", { exact: true }).fill("退回也提醒");
  await page.goBack();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page).toHaveURL(/write/);
});
test("存储损坏保护、导出原文、容量失败保留输入", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.setItem("yeqi.entries.v1", "{broken"));
  await page.reload();
  await expect(page.getByRole("alert")).toContainText("暂停写入");
  await page.goto("/#/write");
  await expect(
    page.getByRole("button", { name: "封存这段记忆" }),
  ).toBeDisabled();
  const promise = page.waitForEvent("download");
  await page.getByRole("button", { name: "导出备份", exact: true }).click();
  const stream = await (await promise).createReadStream();
  const chunks: Buffer[] = [];
  for await (const x of stream!) chunks.push(x);
  expect(Buffer.concat(chunks).toString()).toBe("{broken");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.evaluate(() => {
    Storage.prototype.setItem = () => {
      throw new DOMException("full", "QuotaExceededError");
    };
  });
  await page
    .getByLabel("心情正文（必填）", { exact: true })
    .fill("保留这段未保存的话");
  await page.getByRole("button", { name: "封存这段记忆" }).click();
  await expect(page.getByRole("alert")).toContainText("未能保存");
  await expect(
    page.getByLabel("心情正文（必填）", { exact: true }),
  ).toHaveValue("保留这段未保存的话");
});
test("多标签页冲突不会覆盖新记录", async ({ page, context }) => {
  await page.goto("/#/write");
  const other = await context.newPage();
  await other.goto("/");
  await page.getByLabel("心情正文（必填）", { exact: true }).fill("还在写");
  await write(other, "另一页", "另一页先保存了。");
  await expect(page.getByRole("alert")).toContainText("其他标签页");
  await expect(
    page.getByRole("button", { name: "封存这段记忆" }),
  ).toBeDisabled();
  await expect(
    page.getByLabel("心情正文（必填）", { exact: true }),
  ).toHaveValue("还在写");
});
test("桌面、平板、手机布局和减少动态效果、键盘入口", async ({ page }) => {
  for (const width of [1440, 1000, 768, 640, 390, 360]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const path of ["/", "/write", "/archive", "/privacy", "/echo"]) {
      await page.goto(`/#${path}`);
      await expect(page.locator("#page-title")).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `${width} ${path}`,
      ).toBe(true);
    }
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  // A fresh document starts before the first tab stop, unlike hash navigation.
  await page.reload();
  const gate = page.getByRole("button", { name: "推开月影门，写下心情" });
  await expect(gate).toBeVisible();
  await page.keyboard.press("Tab");
  await expect(page.locator(".skip-link")).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#page-title")).toBeFocused();
  await gate.focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByLabel("心情正文（必填）", { exact: true }),
  ).toBeVisible();
  await expect(page.locator(".ritual-transition")).toBeHidden();
});
test("视觉检查截图（无预设记录）", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 1080 });
  await page.goto("/");
  await page.screenshot({ path: "outputs/yeqi-desktop.png", fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: "outputs/yeqi-mobile.png", fullPage: true });
  await page.goto("/#/write");
  await page.screenshot({
    path: "outputs/yeqi-writing-mobile.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 1440, height: 1080 });
  await page.screenshot({ path: "outputs/yeqi-writing.png", fullPage: true });
  await write(
    page,
    "雨停以后的傍晚",
    "这是一段自动化视觉检查用文字，不是预设日记。\n雨停了，窗边有一点安静的光。",
    "mist",
    "测试，生活碎片",
  );
  await page.screenshot({ path: "outputs/yeqi-reading.png", fullPage: true });
  await write(
    page,
    "一件很小的好事",
    "这是第二封自动化检查用梦笺。",
    "sun",
    "测试",
  );
  await page.goto("/#/archive");
  await page.screenshot({ path: "outputs/yeqi-archive.png", fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({
    path: "outputs/yeqi-archive-mobile.png",
    fullPage: true,
  });
});
test("手机端隐私与备份入口真实可用", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "隐私与备份", exact: true }).click();
  await expect(page.locator("#page-title")).toHaveText(
    "你的心事，留在你这里。",
  );
  const promise = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "导出全部记忆", exact: false })
    .click();
  expect((await promise).suggestedFilename()).toMatch(/^yeqi-.*\.json$/);
});
