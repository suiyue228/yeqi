import { expect, test } from "@playwright/test";

declare global {
  interface Window { __defaultAudio: { contexts: number; tracks: number } }
}
test.use({ reducedMotion: "reduce" });
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    const stats = { contexts: 0, tracks: 0 };
    Object.defineProperty(window, "__defaultAudio", { value: stats });
    const Native = window.AudioContext;
    window.AudioContext = class extends Native {
      constructor(options?: AudioContextOptions) { super(options); stats.contexts++; }
    };
    const create = Native.prototype.createBufferSource;
    Native.prototype.createBufferSource = function () {
      const source = create.call(this), start = source.start;
      source.start = function (...args: Parameters<AudioBufferSourceNode["start"]>) {
        if (source.loop) stats.tracks++;
        return start.apply(source, args);
      };
      return source;
    };
  });
});

test("新用户音乐默认开启，可信操作才起播且切页不叠加", async ({ page }) => {
  let requests = 0;
  page.on("request", r => { if (r.url().includes("/audio/sleep-piano")) requests++; });
  await page.goto("/");
  await expect(page.locator(".audio-console summary")).toContainText("等待轻触");
  await page.evaluate(() => {
    document.body.click();
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
  });
  expect(requests).toBe(0);
  expect(await page.evaluate(() => window.__defaultAudio)).toEqual({ contexts: 0, tracks: 0 });
  await page.getByRole("navigation", { name: "主导航" }).getByRole("button", { name: "记忆档案" }).click();
  await expect(page.locator(".audio-state")).toContainText("纯音乐播放中", { timeout: 15000 });
  await page.getByRole("navigation", { name: "主导航" }).getByRole("button", { name: "记忆之门" }).click();
  expect(await page.evaluate(() => window.__defaultAudio)).toEqual({ contexts: 1, tracks: 1 });
  expect(requests).toBe(1);
  await page.getByLabel("音景设置", { exact: true }).click();
  await expect(page.getByLabel("开启交互音效", { exact: true })).not.toBeChecked();
  await page.reload();
  expect(await page.evaluate(() => window.__defaultAudio)).toEqual({ contexts: 0, tracks: 0 });
  await page.keyboard.press("a");
  await expect(page.locator(".audio-state")).toContainText("纯音乐播放中", { timeout: 15000 });
  expect(await page.evaluate(() => window.__defaultAudio)).toEqual({ contexts: 1, tracks: 1 });
});

test("已保存的关闭和音量偏好不被默认开启覆盖", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("yeqi.audio.v1", JSON.stringify({
    music: false, effects: false, musicVolume: .23, effectsVolume: .31,
  })));
  await page.goto("/");
  await page.keyboard.press("Enter");
  await page.getByLabel("音景设置", { exact: true }).click();
  await expect(page.getByRole("button", { name: "开启背景音乐", exact: true })).toBeVisible();
  await expect(page.getByLabel("音乐音量", { exact: true })).toHaveValue("23");
  expect(await page.evaluate(() => window.__defaultAudio)).toEqual({ contexts: 0, tracks: 0 });
});

test("可在默认音乐发声前关闭，后续操作与刷新保持关闭", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("音景设置", { exact: true }).click();
  await page.getByRole("button", { name: "关闭背景音乐", exact: true }).click();
  await page.keyboard.press("Escape");
  await page.getByRole("navigation", { name: "主导航" }).getByRole("button", { name: "记忆档案" }).click();
  expect(await page.evaluate(() => window.__defaultAudio)).toEqual({ contexts: 0, tracks: 0 });
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("yeqi.audio.v1")!).music)).toBe(false);
  await page.reload();
  await page.keyboard.press("a");
  expect(await page.evaluate(() => window.__defaultAudio)).toEqual({ contexts: 0, tracks: 0 });
});
