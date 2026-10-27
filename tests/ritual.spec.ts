import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";
test.use({ reducedMotion: "no-preference" });
test.setTimeout(60000);
async function finished(page: Page) {
  await expect(page.getByTestId("ritual-transition")).toHaveCount(0);
  await expect(page.locator(".app-shell")).not.toHaveAttribute("inert", "");
  await expect(page.locator("#page-title")).toBeFocused();
}
async function crossing(page: Page, kind: string) {
  await expect(page.getByTestId("ritual-transition")).toHaveAttribute(
    "data-kind",
    kind,
  );
  await expect(page.locator(".app-shell")).toHaveAttribute("inert", "");
  await finished(page);
}
for (const width of [1280, 390])
  test(`正常动画 ${width}px：月影门、帷幕、柜门、信笺、星盘都结束并恢复操作`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 720 });
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    await page.goto("/");
    await page
      .getByRole("button", { name: "推开月影门，写下心情", exact: true })
      .click();
    await crossing(page, "curtain");
    await page
      .getByLabel("标题（可选）", { exact: true })
      .fill("正常动画中的信");
    await page
      .getByLabel("心情正文（必填）", { exact: true })
      .fill("过渡完成后，安静地写。");
    await page.getByRole("button", { name: "封存这段记忆" }).click();
    await crossing(page, "letter");
    await expect(page.locator(".entry-body")).toHaveText(
      "过渡完成后，安静地写。",
    );
    await page
      .getByRole("button", { name: "返回记忆档案", exact: false })
      .click();
    await crossing(page, "cabinet");
    await page.locator(".entry-slip").click();
    await crossing(page, "letter");
    await page.getByRole("button", { name: "重新落笔" }).click();
    await crossing(page, "curtain");
    await page
      .getByLabel("心情正文（必填）", { exact: true })
      .fill("修改后也能完整保存。");
    await page.getByRole("button", { name: "封存这段记忆" }).click();
    await crossing(page, "letter");
    await expect(page.locator(".entry-body")).toHaveText(
      "修改后也能完整保存。",
    );
    await page.getByRole("button", { name: "今夜回响", exact: false }).click();
    await crossing(page, "oracle");
    await expect(page.locator(".entry-body")).toHaveText(
      "修改后也能完整保存。",
    );
    await page
      .getByRole("button", { name: "夜栖，返回记忆之门", exact: true })
      .click();
    await crossing(page, "gate");
    expect(errors).toEqual([]);
  });
test("浏览器返回取消不丢草稿，确认后仍保留正常的前进历史", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "推开月影门，写下心情", exact: true })
    .click();
  await finished(page);
  await page
    .getByLabel("心情正文（必填）", { exact: true })
    .fill("不能被后退丢掉");
  await page.goBack();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "继续写信", exact: true }).click();
  await expect(page).toHaveURL(/#\/write$/);
  await expect(
    page.getByLabel("心情正文（必填）", { exact: true }),
  ).toHaveValue("不能被后退丢掉");
  await page.goBack();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page
    .getByRole("button", { name: "放弃修改并离开", exact: true })
    .click();
  await finished(page);
  await expect(page).toHaveURL(/\/$|#\/$/);
  await page.goForward();
  await finished(page);
  await expect(page).toHaveURL(/#\/write$/);
});
test("过渡途中启用减少动态效果会立即收尾，之后导航无锁定", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "进入记忆档案", exact: false })
    .click();
  await expect(page.getByTestId("ritual-transition")).toBeVisible();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await finished(page);
  await expect(page).toHaveURL(/#\/archive$/);
  await page.getByRole("button", { name: "写一封新信", exact: false }).click();
  await finished(page);
  await expect(page).toHaveURL(/#\/write$/);
  // The second immediate navigation also proves the previous timer cannot relock the app.
  await page.getByRole("button", { name: "放下信笺", exact: false }).click();
  await finished(page);
  await expect(page).toHaveURL(/#\/$/);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page
    .getByRole("button", { name: "进入记忆档案", exact: false })
    .click();
  await expect(page.getByTestId("ritual-transition")).toHaveClass(
    /ritual-opening/,
  );
  const historyLength = await page.evaluate(() => history.length);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await finished(page);
  expect(await page.evaluate(() => history.length)).toBe(historyLength);
  await page.goBack();
  await finished(page);
  await expect(page).toHaveURL(/#\/$/);
});
test("删除存储失败时保留记录和确认框，Escape 恢复删除按钮焦点", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#/write");
  await page.getByLabel("心情正文（必填）", { exact: true }).fill("保留原记录");
  await page.getByRole("button", { name: "封存这段记忆" }).click();
  await finished(page);
  await page.evaluate(() => {
    Storage.prototype.setItem = () => {
      throw new DOMException("quota", "QuotaExceededError");
    };
  });
  await page.getByRole("button", { name: "删除这封梦笺", exact: true }).click();
  await page.getByRole("button", { name: "确认删除", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("alert")).toContainText("未能保存");
  expect(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem("yeqi.entries.v1")!).entries.length,
    ),
  ).toBe(1);
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "删除这封梦笺", exact: true }),
  ).toBeFocused();
  await expect(page.locator(".entry-body")).toHaveText("保留原记录");
});
