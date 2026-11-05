import { expect, test } from "@playwright/test";
test.use({
  reducedMotion: "reduce",
  viewport: { width: 390, height: 844 },
  hasTouch: true,
});

test("从邮局完成定意洗切、22张选牌、正逆位解读、导出与返场", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Math.random = () => 0.25;
  });
  await page.goto("/#/theatre/post");
  await page
    .getByRole("button", { name: "拨动星盘吊摆，进入栖星占星小店" })
    .tap();
  await expect(page.locator("#page-title")).toHaveText("栖星占星小店");
  await page.getByRole("button", { name: "触碰水晶球，坐到占卜桌前" }).tap();
  await page.getByLabel("此刻想问的事（可选）").fill("怎样照料接下来的创作？");
  await page.getByRole("button", { name: "开始洗牌", exact: true }).tap();
  await expect(page.locator("#tarot-step")).toBeFocused();
  await page.getByRole("button", { name: "再洗一次", exact: true }).tap();
  await expect(page.locator(".tarot-step")).toContainText("已经洗牌 2 次");
  await page.getByRole("button", { name: "洗好了，开始切牌" }).tap();
  await page.getByRole("button", { name: "选择中叠切牌" }).tap();
  await expect(page.locator(".tarot-pick")).toHaveCount(22);
  const first = page.locator(".tarot-pick").first();
  await first.focus();
  await page.keyboard.press("Enter");
  await page.keyboard.press("Enter");
  await expect(page.locator(".tarot-pick[aria-pressed=true]")).toHaveCount(1);
  await page.getByRole("button", { name: "收回最后一张" }).tap();
  await expect(page.locator(".tarot-pick[aria-pressed=true]")).toHaveCount(0);
  for (const n of [2, 15, 21])
    await page.getByRole("button", { name: `选择第 ${n} 张背面牌` }).tap();
  await expect(page.locator(".tarot-spread li")).toHaveCount(3);
  await expect(
    page.getByRole("button", { name: "翻开暗处之牌" }),
  ).toBeDisabled();
  for (const slot of ["眼前", "暗处", "下一步"])
    await page.getByRole("button", { name: `翻开${slot}之牌` }).tap();
  await expect(page.locator(".tarot-turn.is-reversed")).toHaveCount(3);
  await expect(page.locator(".tarot-synthesis")).toContainText("3 张逆位");
  await expect(page.locator(".tarot-reading-grid article")).toHaveCount(3);
  const images = await page
    .locator(".tarot-spread .tarot-face-art")
    .evaluateAll((imgs) => imgs.map((img) => img.getAttribute("src")));
  expect(new Set(images).size).toBe(3);
  const promise = page.waitForEvent("download");
  await page.getByRole("button", { name: "下载这份解牌笺 ↓" }).tap();
  const download = await promise;
  const stream = await download.createReadStream();
  const parts: Buffer[] = [];
  for await (const part of stream!) parts.push(part);
  const report = JSON.parse(Buffer.concat(parts).toString("utf8"));
  expect(report.question).toBe("怎样照料接下来的创作？");
  expect(report.cards).toHaveLength(3);
  expect(
    report.cards.every(
      (card: { orientation: string }) => card.orientation === "逆位",
    ),
  ).toBe(true);
  await page.locator(".tarot-gallery summary").tap();
  await expect(page.locator(".tarot-gallery .tarot-face")).toHaveCount(22);
  await page.getByRole("button", { name: "开始新一局" }).tap();
  await expect(
    page.getByRole("button", { name: "开始洗牌", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: /回到占星小店/ }).tap();
  await page.getByRole("button", { name: "打开返场门，前往星图邮局" }).tap();
  await expect(page.locator("#page-title")).toHaveText("星图邮局");
});

test("五张岔路牌阵可只用正位，解读包含两条路与盲点", async ({ page }) => {
  await page.goto("/#/theatre/astrologer/table");
  await page.getByRole("radio", { name: /岔路星盘/ }).check();
  await page.getByRole("checkbox", { name: /使用正逆位/ }).uncheck();
  await page.getByRole("button", { name: "开始洗牌", exact: true }).tap();
  await page.getByRole("button", { name: "洗好了，开始切牌" }).tap();
  await page.getByRole("button", { name: "选择右叠切牌" }).tap();
  for (const n of [1, 4, 8, 12, 22])
    await page.getByRole("button", { name: `选择第 ${n} 张背面牌` }).tap();
  for (const slot of ["现状", "道路 A", "道路 B", "盲点", "建议"])
    await page.getByRole("button", { name: `翻开${slot}之牌` }).tap();
  await expect(page.locator(".tarot-turn.is-reversed")).toHaveCount(0);
  await expect(page.locator(".tarot-reading-grid article")).toHaveCount(5);
  await expect(page.locator(".tarot-synthesis")).toContainText("道路 A");
  await expect(page.locator(".tarot-synthesis")).toContainText("道路 B");
  await expect(page.locator(".tarot-synthesis")).toContainText("盲点");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
