import { expect, test } from "@playwright/test";

test.use({
  reducedMotion: "reduce",
  viewport: { width: 390, height: 844 },
  hasTouch: true,
});

test("从邮局进入占星小店，选牌、逐张翻开、浏览整套和重新洗牌", async ({
  page,
}) => {
  await page.goto("/#/theatre/post");
  await page
    .getByRole("button", { name: "拨动星盘吊摆，进入栖星占星小店" })
    .tap();
  await expect(page.locator("#page-title")).toHaveText("栖星占星小店");
  await page.getByRole("button", { name: "触碰水晶球，坐到占卜桌前" }).tap();
  await expect(page.locator("#page-title")).toBeFocused();
  await expect(page.locator(".tarot-pick")).toHaveCount(6);

  const first = page.locator(".tarot-pick").first();
  await first.focus();
  await page.keyboard.press("Enter");
  await page.keyboard.press("Enter");
  await expect(page.locator(".tarot-pick[aria-pressed=true]")).toHaveCount(1);
  await page.getByRole("button", { name: "收回最后一张" }).click();
  await expect(page.locator(".tarot-pick[aria-pressed=true]")).toHaveCount(0);
  for (const number of [2, 5, 1]) {
    await page.getByRole("button", { name: `选择第 ${number} 张背面牌` }).tap();
  }
  await expect(page.locator("#tarot-step")).toBeFocused();
  await expect(page.locator(".tarot-spread li")).toHaveCount(3);
  await expect(page.locator(".tarot-readings")).toHaveCount(0);
  for (const slot of ["眼前", "暗处", "下一步"]) {
    await page.getByRole("button", { name: `翻开${slot}之牌` }).tap();
  }
  const art = await page
    .locator(".tarot-spread .tarot-face img")
    .evaluateAll((images) =>
      Promise.all(
        images.map(async (image) => {
          const card = image as HTMLImageElement;
          await card.decode();
          return card.getAttribute("src");
        }),
      ),
    );
  expect(new Set(art).size).toBe(3);
  await expect(page.locator(".tarot-readings article")).toHaveCount(3);
  await page.locator(".tarot-gallery summary").tap();
  await expect(page.locator(".tarot-gallery .tarot-face")).toHaveCount(12);

  await page.getByRole("button", { name: /重新洗牌/ }).tap();
  await expect(page.locator(".tarot-pick")).toHaveCount(6);
  await expect(page.locator(".tarot-pick[aria-pressed=true]")).toHaveCount(0);
  await expect(page.locator(".tarot-readings")).toHaveCount(0);
  await page.getByRole("button", { name: /回到占星小店/ }).tap();
  await page.getByRole("button", { name: "打开返场门，前往星图邮局" }).tap();
  await expect(page.locator("#page-title")).toHaveText("星图邮局");
});
