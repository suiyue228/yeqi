import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";

test("纸艺三幕通过门窗往返，角色改变各自的布景", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#/theatre");
  const title = page.locator("#page-title");
  const windowToTide = page.getByRole("button", {
    name: "推开窗扇，前往潮汐裁纸间",
  });
  await windowToTide.focus();
  await page.keyboard.press("Enter");
  await expect(title).toHaveText("潮汐裁纸间");
  await expect(title).toBeFocused();
  const tide = page.getByRole("button", { name: "请线轴裁缝折一层纸浪" });
  expect((await tide.locator("img").boundingBox())?.height).toBeGreaterThan(90);
  await tide.click();
  await expect(
    page.getByRole("status").filter({ hasText: "涨潮" }),
  ).toBeVisible();
  await expect(page.locator(".paper-act-tide")).toHaveAttribute(
    "data-beat",
    "1",
  );
  await tide.click();
  await expect(page.locator(".prop-notes")).toContainText("落潮");

  await page.getByRole("button", { name: "推开窗扇，前往星图邮局" }).click();
  await expect(title).toHaveText("星图邮局");
  const postmaster = page.getByRole("button", { name: "请星图邮差为信笺盖戳" });
  expect(
    (await postmaster.locator("img").boundingBox())?.height,
  ).toBeGreaterThan(90);
  await postmaster.click();
  await expect(page.locator(".act-post-letter i")).toHaveText("☾");
  await postmaster.click();
  await expect(page.locator(".act-post-letter i")).toHaveText("✧");
  await page.getByRole("button", { name: "复位纸景", exact: false }).click();
  await expect(page.locator(".act-post-letter i")).toHaveCount(0);
  await page.reload();
  await expect(title).toHaveText("星图邮局");

  await page
    .getByRole("button", { name: "打开返场门，前往潮汐裁纸间" })
    .click();
  await expect(title).toHaveText("潮汐裁纸间");
  await page.goBack();
  await expect(title).toHaveText("星图邮局");
  await page
    .getByRole("button", { name: "推开窗扇，前往守灯人的房间" })
    .click();
  await expect(windowToTide).toBeVisible();
  await expect(
    page.getByRole("button", { name: "推开纸门，寻找一封旧信" }),
  ).toBeVisible();
});

test("剧场纸门读取真实旧信，抽屉进入真实草稿", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#/write");
  await page
    .getByLabel("心情正文（必填）", { exact: true })
    .fill("纸门后面的真实记录");
  await page
    .getByRole("button", { name: "封存这段记忆", exact: false })
    .click();
  await expect(page.locator(".entry-body")).toHaveText("纸门后面的真实记录");
  await page.goto("/#/drafts");
  await page.getByLabel("快速碎片", { exact: true }).fill("抽屉里的真实碎片");
  await page.getByRole("button", { name: "存入草稿匣", exact: false }).click();
  await page.goto("/#/theatre");
  await page.getByRole("button", { name: "拉开纸抽屉", exact: true }).click();
  await expect(page.locator(".prop-notes")).toContainText("抽屉里的真实碎片");
  await page
    .getByRole("button", { name: "接着写这片草稿", exact: false })
    .click();
  await expect(
    page.getByLabel("心情正文（必填）", { exact: true }),
  ).toHaveValue("抽屉里的真实碎片");
  await page.goto("/#/theatre");
  await page
    .getByRole("button", { name: "推开纸门，寻找一封旧信", exact: true })
    .click();
  await expect(page.locator(".entry-body")).toHaveText("纸门后面的真实记录");
});
test("纸艺舞台的悬挂星月、人物、书本、抽屉和纸门真实可交互", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#/theatre");
  await expect(page.locator(".paper-layer")).toHaveCount(3);
  await expect(page.locator(".hanging-string")).toHaveCount(3);
  await page
    .getByRole("button", { name: "切换悬挂月相", exact: false })
    .click();
  await expect(page.locator(".paper-stage")).toHaveAttribute("data-phase", "1");
  await page
    .getByRole("button", { name: "与纸灯守夜人缄说话", exact: true })
    .focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".keeper-lines blockquote")).toContainText(
    "没写完",
  );
  await page.getByRole("button", { name: "拉开纸抽屉", exact: true }).click();
  await expect(page.locator(".prop-notes")).toContainText("抽屉里暂时没有碎片");
  await expect(page.locator(".paper-drawer")).toHaveClass(/drawer-open/);
  await page
    .getByRole("button", { name: "翻开守灯人的道具册", exact: true })
    .click();
  await expect(page.locator(".prop-notes")).toContainText("0");
  await page
    .getByRole("button", { name: "推开纸门，寻找一封旧信", exact: true })
    .click();
  await expect(page.locator(".prop-notes")).toContainText(
    "这里不会凭空编出你的记忆",
  );
  await page.getByRole("button", { name: "复位纸景", exact: false }).click();
  await expect(page.locator(".paper-stage")).toHaveAttribute("data-phase", "0");
  await page.setViewportSize({ width: 360, height: 800 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
async function monitorChimes(page: Page) {
  await page.addInitScript(() => {
    const stats = { starts: 0, active: 0, maxActive: 0 };
    Object.defineProperty(window, "__chimeStats", { value: stats });
    const create = AudioContext.prototype.createBufferSource;
    AudioContext.prototype.createBufferSource = function () {
      const source = create.call(this),
        start = source.start;
      source.start = function (
        ...args: Parameters<AudioBufferSourceNode["start"]>
      ) {
        if (!source.loop) {
          stats.starts++;
          stats.active++;
          stats.maxActive = Math.max(stats.maxActive, stats.active);
          source.addEventListener(
            "ended",
            () => {
              stats.active--;
            },
            { once: true },
          );
        }
        return start.apply(source, args);
      };
      return source;
    };
  });
}
async function stats(page: Page) {
  return page.evaluate(
    () =>
      (
        window as unknown as {
          __chimeStats: { starts: number; active: number; maxActive: number };
        }
      ).__chimeStats,
  );
}

test("星铃一次扰动只响一次，停留不重播，聚焦点击去重且并发有界", async ({
  page,
}) => {
  await monitorChimes(page);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/#/theatre");
  const left = page.getByRole("button", { name: "摇动左侧星铃", exact: true });
  const right = page.getByRole("button", { name: "摇动右侧星铃", exact: true });
  await left.hover();
  await expect(page.locator(".pendant-left")).toHaveClass(/swaying/);
  expect((await stats(page)).starts).toBe(0);
  await page.getByLabel("音景设置", { exact: true }).click();
  await page.getByLabel("开启交互音效", { exact: true }).check();
  await page.getByLabel("音景设置", { exact: true }).click();
  await right.hover();
  expect((await stats(page)).starts).toBe(1);
  await right.focus();
  await right.press("Enter");
  expect((await stats(page)).starts).toBe(1);
  const crossing = await left.boundingBox();
  await page.mouse.move(crossing!.x + crossing!.width / 2, crossing!.y + 35);
  expect((await stats(page)).starts).toBe(1);
  await page.waitForTimeout(1900);
  await expect(page.locator(".pendant-right")).not.toHaveClass(/swaying/);
  // Staying on the pendant and tiny pointer movements cannot strike again.
  const box = await left.boundingBox();
  await page.mouse.move(box!.x + box!.width / 2 + 1, box!.y + 30);
  expect((await stats(page)).starts).toBe(1);
  await right.hover();
  expect((await stats(page)).starts).toBe(2);
  await page.waitForTimeout(1900);
  await left.focus();
  expect((await stats(page)).starts).toBe(3);
  await left.press("Enter");
  expect((await stats(page)).starts).toBe(3);
  expect((await stats(page)).maxActive).toBeLessThanOrEqual(2);
  await page.waitForTimeout(2800);
  expect((await stats(page)).active).toBe(0);
});

test.describe("触屏与减少动态效果", () => {
  test.use({
    hasTouch: true,
    reducedMotion: "reduce",
    viewport: { width: 390, height: 844 },
  });
  test("轻触不因焦点重复响，关闭音效或音量零后安静", async ({ page }) => {
    await monitorChimes(page);
    await page.goto("/#/theatre");
    await page.getByLabel("音景设置", { exact: true }).tap();
    await page.getByLabel("开启交互音效", { exact: true }).check();
    await page.getByLabel("音景设置", { exact: true }).tap();
    const left = page.getByRole("button", {
      name: "摇动左侧星铃",
      exact: true,
    });
    await left.tap();
    await left.tap();
    expect((await stats(page)).starts).toBe(1);
    expect(
      await page
        .locator(".pendant-left")
        .evaluate((e) => getComputedStyle(e).animationName),
    ).toBe("none");
    await page.getByLabel("音景设置", { exact: true }).tap();
    await page.getByLabel("开启交互音效", { exact: true }).uncheck();
    await page.getByLabel("音景设置", { exact: true }).tap();
    await page.getByRole("button", { name: "摇动右侧星铃", exact: true }).tap();
    expect((await stats(page)).starts).toBe(1);
    await page.getByLabel("音景设置", { exact: true }).tap();
    await page.getByLabel("开启交互音效", { exact: true }).check();
    await page.getByLabel("音效音量", { exact: true }).fill("0");
    await page.getByLabel("音景设置", { exact: true }).tap();
    await page.waitForTimeout(1900);
    await left.tap();
    expect((await stats(page)).starts).toBe(1);
  });
});
