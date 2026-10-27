import { test, expect } from "@playwright/test";
test.use({ reducedMotion: "reduce" });
test("夜栖地图有独立入口，可回看档案与回响而不经过写作", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "展开夜栖地图", exact: false })
    .click();
  await expect(page.locator("#page-title")).toHaveText(
    "今夜，想在哪一处停留？",
  );
  await expect(page.locator(".room-catalog>li")).toHaveCount(8);
  await page.getByRole("button", { name: "记忆档案馆", exact: false }).click();
  await expect(page.locator(".archive-count")).toContainText("0");
  await page.getByRole("button", { name: "夜栖地图", exact: false }).click();
  await page
    .locator(".room-catalog")
    .getByRole("button", { name: "今夜回响", exact: false })
    .click();
  await expect(page.locator("#page-title")).toHaveText("今夜，还没有回响。");
  await page.setViewportSize({ width: 360, height: 800 });
  await page.getByRole("button", { name: "夜栖地图", exact: false }).click();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
