import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";

test.use({ reducedMotion: "reduce" });

async function platformFonts(page: Page, selector: string) {
  const session = await page.context().newCDPSession(page);
  await session.send("DOM.enable");
  await session.send("CSS.enable");
  const { root } = await session.send("DOM.getDocument");
  const { nodeId } = await session.send("DOM.querySelector", { nodeId: root.nodeId, selector });
  const { fonts } = await session.send("CSS.getPlatformFontsForNode", { nodeId });
  await session.detach();
  return fonts;
}

test("中文手写字体实际用于保存后的文字，编辑、重开与摘要保持一致", async ({ page }) => {
  const body = "今天，风轻轻拂过窗边。\n\n「你好，月亮！」\nI am here, slowly. 2026 / 10 / 28\n龘、𠮷与emoji 🌙 可以回退，文字仍保留。";
  await page.goto("/#/write");
  await page.getByLabel("标题（可选）", { exact: true }).fill("留一束温柔的光");
  await page.getByLabel("心情正文（必填）", { exact: true }).fill(body);
  await page.evaluate(() => document.fonts.ready);
  const family = await page.locator("#entry-body").evaluate(e => getComputedStyle(e).fontFamily);
  expect(family).toContain("Moonlit Hand");
  expect(await page.locator("#entry-title").evaluate(e => getComputedStyle(e).fontFamily)).toBe(family);
  await page.getByRole("button", { name: "封存这段记忆", exact: false }).click();
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator(".entry-body")).toHaveText(body);
  expect(await page.locator(".entry-body").evaluate(e => getComputedStyle(e).fontFamily)).toBe(family);
  const actual = await platformFonts(page, ".entry-body");
  expect(actual.some(f => f.isCustomFont && f.familyName === "Moonlit Hand" && f.glyphCount > 20)).toBe(true);
  await page.reload();
  await expect(page.locator(".entry-body")).toHaveText(body);
  await page.getByRole("button", { name: "重新落笔", exact: false }).click();
  await expect(page.locator("#entry-body")).toHaveValue(body);
  await page.getByRole("button", { name: "放下信笺", exact: false }).click();
  await page.goto("/#/archive");
  expect(await page.locator(".entry-slip p").evaluate(e => getComputedStyle(e).fontFamily)).toBe(family);
  await page.evaluate(() => document.fonts.ready);
  expect((await platformFonts(page, ".entry-slip p")).some(f => f.isCustomFont && f.familyName === "Moonlit Hand")).toBe(true);
});

test("字体读取失败时仍能输入和保存，中英文内容完整", async ({ page }) => {
  await page.route("**/fonts/*.woff2", route => route.abort());
  await page.goto("/#/write");
  const text = "字体加载失败，也不丢失这封信。Hello 123，晚安。";
  await page.getByLabel("心情正文（必填）", { exact: true }).fill(text);
  await page.getByRole("button", { name: "封存这段记忆", exact: false }).click();
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator(".entry-body")).toHaveText(text);
  expect((await platformFonts(page, ".entry-body")).some(f => f.glyphCount > 0 && !f.isCustomFont)).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
