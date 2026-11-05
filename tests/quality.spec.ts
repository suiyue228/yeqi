import { test, expect } from "@playwright/test";
test.use({ reducedMotion: "reduce" });
test.setTimeout(60000);

test("直达回响地址时能抽取已有记录，不误报没有记忆", async ({ page }) => {
  await page.goto("/#/write");
  await page
    .getByLabel("心情正文（必填）", { exact: true })
    .fill("留给回响的真实旧信");
  await page.getByRole("button", { name: "封存这段记忆" }).click();
  await expect(page.locator(".entry-body")).toHaveText("留给回响的真实旧信");
  await page.goto("/#/echo");
  await expect(page.locator("#page-title")).toHaveText("今夜，有旧信等你。");
  await page
    .getByRole("button", { name: "抽一段今夜回响", exact: true })
    .click();
  await expect(page.locator(".entry-body")).toHaveText("留给回响的真实旧信");
});
test("全部独立模块在六档宽度可达且不溢出，无浏览器错误或外部请求", async ({
  page,
}) => {
  const errors: string[] = [],
    external: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  page.on("request", (r) => {
    if (!r.url().startsWith("http://127.0.0.1:5173/")) external.push(r.url());
  });
  for (const width of [1440, 1000, 768, 640, 390, 360]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of [
      "/",
      "/rooms",
      "/write",
      "/archive",
      "/calendar",
      "/drafts",
      "/echo",
      "/wishes",
      "/collection",
      "/theatre",
      "/theatre/tide",
      "/theatre/post",
      "/theatre/astrologer",
      "/theatre/astrologer/table",
      "/privacy",
    ]) {
      await page.goto("/#" + path);
      await expect(page.locator("#page-title")).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        width + " " + path,
      ).toBe(true);
    }
  }
  await page.goto("/#/rooms");
  for (const button of await page.locator(".room-catalog button").all())
    await expect(button).toBeEnabled();
  expect(errors).toEqual([]);
  expect(external).toEqual([]);
});
test("快速草稿与未提交心愿离开会提醒，取消保留输入", async ({ page }) => {
  for (const [path, label, text] of [
    ["/drafts", "快速碎片", "未保存的碎片"],
    ["/wishes", "给未来的低语", "尚未收进瓶子的愿望"],
  ]) {
    await page.goto("/#" + path);
    await page.getByLabel(label, { exact: true }).fill(text);
    await page
      .getByRole("button", { name: "返回夜栖地图", exact: false })
      .click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByRole("dialog")).toHaveAttribute("open", "");
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(page.getByLabel(label, { exact: true })).toHaveValue(text);
    await page
      .getByRole("button", { name: "返回夜栖地图", exact: false })
      .click();
    await page
      .getByRole("button", { name: "放弃修改并离开", exact: true })
      .click();
    await expect(page).toHaveURL(/#\/rooms$/);
  }
});
test("记忆损坏后的完整恢复包仍包含草稿心愿收藏资料", async ({ page }) => {
  await page.goto("/#/wishes");
  await page
    .getByLabel("给未来的低语", { exact: true })
    .fill("必须留在恢复包里");
  await page.getByRole("button", { name: "收进心愿瓶", exact: false }).click();
  await page.evaluate(() => localStorage.setItem("yeqi.entries.v1", "{broken"));
  await page.reload();
  const pending = page.waitForEvent("download");
  await page.getByRole("button", { name: "导出记忆", exact: false }).click();
  const stream = await (await pending).createReadStream();
  const pieces: Buffer[] = [];
  for await (const p of stream!) pieces.push(p);
  const data = JSON.parse(Buffer.concat(pieces).toString());
  expect(data.entriesRecoveryRaw).toBe("{broken");
  expect(data.workspace.data.wishes[0].text).toBe("必须留在恢复包里");
});
