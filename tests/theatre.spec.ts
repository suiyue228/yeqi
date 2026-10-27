import { test, expect } from "@playwright/test";
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
test("星铃悬停摇摆，声音需主动启用且连续触碰受节流", async ({ page }) => {
  await page.addInitScript(() => {
    let count = 0;
    const original = AudioContext.prototype.createOscillator;
    AudioContext.prototype.createOscillator = function () {
      count++;
      return original.call(this);
    };
    Object.defineProperty(window, "__noteCount", { get: () => count });
  });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/#/theatre");
  const count = () =>
    page.evaluate(
      () => (window as unknown as { __noteCount: number }).__noteCount,
    );
  await page.getByRole("button", { name: "摇动左侧星铃", exact: true }).hover();
  await expect(page.locator(".pendant-left")).toHaveClass(/swaying/);
  expect(await count()).toBe(0);
  await page.getByLabel("音景设置", { exact: true }).click();
  await page.getByLabel("开启交互音效", { exact: true }).check();
  await page.getByLabel("音景设置", { exact: true }).click();
  await page.waitForTimeout(1000);
  const before = await count();
  await page.getByRole("button", { name: "摇动右侧星铃", exact: true }).hover();
  expect(await count()).toBeGreaterThan(before);
  const after = await count();
  await page.getByRole("button", { name: "摇动左侧星铃", exact: true }).hover();
  expect(await count()).toBe(after);
  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(
    await page
      .locator(".pendant-left")
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe("none");
});
