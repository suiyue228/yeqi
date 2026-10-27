import { test, expect } from "@playwright/test";
test.use({ reducedMotion: "reduce" });
test("声音默认静音、用户激活、单实例、音量和偏好恢复", async ({ page }) => {
  await page.addInitScript(() => {
    const contexts: AudioContext[] = [];
    Object.defineProperty(window, "__testContexts", { value: contexts });
    const Native = window.AudioContext;
    window.AudioContext = class extends Native {
      constructor(options?: AudioContextOptions) {
        super(options);
        contexts.push(this);
      }
    };
  });
  const inspect = () =>
    page.evaluate(() =>
      (
        window as unknown as { __testContexts: AudioContext[] }
      ).__testContexts.map((c) => c.state),
    );
  await page.goto("/");
  expect(await inspect()).toEqual([]);
  await page.getByLabel("音景设置", { exact: true }).click();
  await page.getByRole("button", { name: "开启背景音乐", exact: true }).click();
  await expect(page.locator(".audio-state")).toContainText("纯音乐播放中");
  expect(await inspect()).toEqual(["running"]);
  await page.getByLabel("音乐音量", { exact: true }).fill("23");
  await page.getByLabel("开启交互音效", { exact: true }).check();
  await page.getByRole("button", { name: "关闭背景音乐", exact: true }).click();
  await expect(page.locator(".audio-state")).toContainText("背景音乐已关闭");
  await page.getByRole("button", { name: "开启背景音乐", exact: true }).click();
  expect((await inspect()).length).toBe(1);
  await page.reload();
  expect(await inspect()).toEqual([]);
  await page.getByLabel("音景设置", { exact: true }).click();
  await expect(page.getByLabel("音乐音量", { exact: true })).toHaveValue("23");
  await expect(page.getByLabel("开启交互音效", { exact: true })).toBeChecked();
  await expect(page.locator(".audio-state")).toContainText("偏好已记住");
  await page.getByRole("button", { name: "恢复交互音效", exact: true }).click();
  expect(await inspect()).toEqual(["running"]);
  await expect(page.locator(".audio-state")).toContainText("背景音乐已关闭");
});
test("后台暂停释放声音，返回后需主动恢复同一音频实例", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("音景设置", { exact: true }).click();
  await page.getByRole("button", { name: "开启背景音乐", exact: true }).click();
  await expect(page.locator(".audio-state")).toContainText("纯音乐播放中");
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      get: () => true,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(page.locator(".audio-state")).toContainText("偏好已记住");
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      get: () => false,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(page.locator(".audio-state")).toContainText("偏好已记住");
  await page.getByRole("button", { name: "恢复背景音乐", exact: true }).click();
  await expect(page.locator(".audio-state")).toContainText("纯音乐播放中");
});
test("不支持音频时明确反馈且记录页面仍可操作", async ({ page }) => {
  await page.addInitScript(() =>
    Object.defineProperty(window, "AudioContext", { value: undefined }),
  );
  await page.goto("/");
  await page.getByLabel("音景设置", { exact: true }).click();
  await page.getByRole("button", { name: "开启背景音乐", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("不支持");
  await page.getByLabel("音景设置", { exact: true }).click();
  await page
    .getByRole("button", { name: "进入记忆档案", exact: false })
    .click();
  await expect(page.locator("#page-title")).toHaveText("记忆，皆有回音。");
});
