import { test, expect } from "@playwright/test";

test("纸艺图片在桌面和手机加载，三种月相与幕后同步", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [1440, 360]) {
    await page.setViewportSize({ width, height: 960 });
    await page.goto("/#/theatre");
    const moon = page.getByRole("button", {
      name: "切换悬挂月相",
      exact: false,
    });
    for (const phase of ["crescent", "half", "full"]) {
      await expect(moon.locator("img")).toHaveAttribute(
        "src",
        `/art/theatre/moon-${phase}-1x.webp`,
      );
      await expect(page.locator(".sky-moon")).toHaveAttribute(
        "src",
        `/art/theatre/moon-${phase}-1x.webp`,
      );
      await page
        .locator(".theatre-shell img")
        .evaluateAll((images) =>
          Promise.all(
            images.map((image) => (image as HTMLImageElement).decode()),
          ),
        );
      expect(
        await page
          .locator(".theatre-shell img")
          .evaluateAll((images) =>
            images.every(
              (image) => (image as HTMLImageElement).naturalWidth > 0,
            ),
          ),
      ).toBe(true);
      await moon.click();
    }
    for (const button of await page
      .locator(".stage-mechanism, .pendant")
      .all()) {
      const box = await button.boundingBox();
      expect(box!.width).toBeGreaterThanOrEqual(44);
      expect(box!.height).toBeGreaterThanOrEqual(44);
    }
    const keeperImage = await page.locator(".paper-keeper > img").boundingBox();
    expect(keeperImage!.height / keeperImage!.width).toBeCloseTo(448 / 256, 2);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
});

test("剧场图片加载失败时，文字、键盘机关和草稿入口仍可用", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 360, height: 800 });
  await page.route("**/art/theatre/*.webp", (route) => route.abort());
  await page.goto("/#/theatre");
  const keeper = page.getByRole("button", {
    name: "与纸灯守夜人缄说话",
    exact: true,
  });
  await expect(keeper.locator("small")).toBeVisible();
  await keeper.focus();
  await keeper.press("Enter");
  await expect(keeper).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".keeper-lines blockquote")).toContainText(
    "没写完",
  );
  const drawer = page.getByRole("button", { name: "拉开纸抽屉", exact: true });
  await drawer.focus();
  await drawer.press("Enter");
  await expect(drawer).toHaveAttribute("aria-expanded", "true");
  await page.getByRole("button", { name: "打开草稿匣", exact: false }).click();
  await expect(page.getByLabel("快速碎片", { exact: true })).toBeVisible();
});
