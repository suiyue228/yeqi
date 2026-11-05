import { expect, test } from "@playwright/test";

for (const width of [1440, 390]) {
  test(`水晶球独立过渡和洗切翻牌动作 ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/#/theatre/astrologer");
    await page.getByRole("button", { name: "触碰水晶球，坐到占卜桌前" }).click();
    const passage = page.getByTestId("ritual-transition");
    await expect(passage).toHaveAttribute("data-kind", "crystal");
    await expect(passage.locator(".ritual-wing")).toHaveCount(0);
    await expect(passage.locator(".crystal-orbits")).toBeVisible();
    await expect(passage).toHaveCount(0);
    await expect(page.locator("#page-title")).toBeFocused();

    await page.getByRole("button", { name: "开始洗牌", exact: true }).click();
    await expect(page.locator(".tarot-table")).toHaveAttribute("aria-busy", "true");
    await expect(page.getByRole("button", { name: "再洗一次", exact: true })).toBeDisabled();
    await expect(page.locator(".tarot-shuffling-pack .tarot-back")).toHaveCount(5);
    // Repeated programmatic activation must not queue several shuffles.
    await page.getByRole("button", { name: "再洗一次", exact: true }).evaluate((b: HTMLButtonElement) => b.click());
    await expect(page.locator(".tarot-step")).toContainText("已经洗牌 1 次");
    await page.getByRole("button", { name: "洗好了，开始切牌" }).click();
    await page.getByRole("button", { name: "选择左叠切牌" }).click();
    await expect(page.locator(".tarot-cut-piles")).toHaveClass(/is-cutting/);
    await expect(page.locator(".tarot-pick")).toHaveCount(0);
    await expect(page.locator(".tarot-pick")).toHaveCount(22);
    for (let n = 1; n <= 3; n++)
      await page.getByRole("button", { name: `选择第 ${n} 张背面牌` }).click();
    const first = page.getByRole("button", { name: "翻开眼前之牌" });
    await first.focus();
    await page.keyboard.press("Enter");
    await expect(first).toHaveClass(/is-face-up/);
    await expect(first).toBeFocused();
    await expect(page.locator(".tarot-reading-grid article")).toHaveCount(0);
    await page.keyboard.press("Enter");
    await expect(page.locator(".tarot-reading-grid article")).toHaveCount(1);
    await expect(page.locator(".tarot-turn.is-open")).toHaveCount(1);
    for (const slot of ["暗处", "下一步"])
      await page.getByRole("button", { name: `翻开${slot}之牌` }).click();
    await expect(page.locator(".tarot-synthesis")).toBeVisible();
  });
}

test("动作途中减少动态效果会完成当前操作，离开后不会残留计时动作", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/#/theatre/astrologer/table");
  await page.getByRole("button", { name: "开始洗牌", exact: true }).click();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".tarot-table")).toHaveAttribute("aria-busy", "false");
  await page.getByRole("button", { name: "洗好了，开始切牌" }).click();
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.getByRole("button", { name: "选择右叠切牌" }).click();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".tarot-pick")).toHaveCount(22);
  for (let n = 1; n <= 3; n++)
    await page.getByRole("button", { name: `选择第 ${n} 张背面牌` }).click();
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.getByRole("button", { name: "翻开眼前之牌" }).click();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".tarot-reading-grid article")).toHaveCount(1);
  await page.getByRole("button", { name: /回到占星小店/ }).click();
  await page.getByRole("button", { name: "触碰水晶球，坐到占卜桌前" }).click();
  await expect(page.getByTestId("ritual-transition")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "开始洗牌", exact: true })).toBeVisible();
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.getByRole("button", { name: "开始洗牌", exact: true }).click();
  await page.getByRole("button", { name: /回到占星小店/ }).click();
  await expect(page.locator("#page-title")).toHaveText("栖星占星小店");
  await expect(page.getByTestId("ritual-transition")).toHaveCount(0);
  await page.getByRole("button", { name: "触碰水晶球，坐到占卜桌前" }).click();
  await expect(page.getByRole("button", { name: "开始洗牌", exact: true })).toBeVisible();
  await expect(page.locator(".tarot-table")).toHaveAttribute("aria-busy", "false");
});

test("22张牌义短句在手机和桌面的下方题签内完整排布", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [1440, 768, 390, 360]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/#/theatre/astrologer/table");
    await page.locator(".tarot-gallery summary").click();
    await page.evaluate(() => document.fonts.ready);
    const captions = await page.locator(".tarot-gallery .tarot-caption").evaluateAll((els) => els.map(el => {
      const band = el.getBoundingClientRect();
      const boxes = [...el.children].map(child => {
        const range = document.createRange();
        range.selectNodeContents(child);
        return range.getBoundingClientRect();
      });
      return { fits: boxes.every(b => b.top >= band.top - 1 && b.bottom <= band.bottom + 1 && b.left >= band.left && b.right <= band.right), text: el.textContent };
    }));
    expect(captions).toHaveLength(22);
    expect(captions.every(c => c.fits)).toBe(true);
    expect(captions[0].text).toContain("向未知启程");
    expect(captions[0].text).not.toContain("纸舟");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});
