import { test, expect } from "@playwright/test";
test.use({ reducedMotion: "reduce" });

test("许可钢琴可解码、循环接缝连续且保持舒适信号范围", async ({ page }) => {
  await page.goto("/");
  const result = await page.evaluate(async () => {
    const music = await import(
      window.location.origin + "/src/lib/musicTrack.ts"
    );
    const buffer = await music.loadMusicBuffer();
    const context = new OfflineAudioContext(2, 12 * 32000, 32000);
    const level = context.createGain();
    level.gain.value = 0.45 * music.MUSIC_LEVEL;
    level.connect(context.destination);
    music.startMusic(
      context,
      level,
      buffer,
      0,
      buffer.duration - 8,
      () => () => {},
    );
    const rendered = await context.startRendering(),
      samples = rendered.getChannelData(0);
    let peak = 0,
      sum = 0;
    for (const v of samples) {
      peak = Math.max(peak, Math.abs(v));
      sum += v * v;
    }
    const seam = 8 * 32000;
    return {
      duration: buffer.duration,
      channels: buffer.numberOfChannels,
      peak,
      rms: Math.sqrt(sum / samples.length),
      finite: samples.every(Number.isFinite),
      seam: Math.abs(samples[seam] - samples[seam - 1]),
    };
  });
  expect(result.duration).toBeGreaterThan(140);
  expect(result.duration).toBeLessThan(190);
  expect(result.channels).toBe(2);
  expect(result.finite).toBe(true);
  expect(result.rms).toBeGreaterThan(0.0001);
  expect(result.peak).toBeLessThan(0.05);
  expect(result.seam).toBeLessThan(0.0015);
});

test("配乐读取失败可重试，不回退嗡鸣且不影响档案", async ({ page }) => {
  let failing = true;
  await page.route("**/audio/sleep-piano-scott-buckley.mp3", async (route) => {
    if (failing) await route.fulfill({ status: 503, body: "unavailable" });
    else await route.continue();
  });
  await page.goto("/");
  await page.getByLabel("音景设置", { exact: true }).click();
  await page.getByRole("button", { name: "开启背景音乐", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("暂时无法读取");
  await expect(page.locator(".audio-state")).not.toContainText("纯音乐播放中");
  failing = false;
  await page.getByRole("button", { name: "开启背景音乐", exact: true }).click();
  await expect(page.locator(".audio-state")).toContainText("纯音乐播放中", {
    timeout: 15000,
  });
  await page.getByLabel("音景设置", { exact: true }).click();
  await page
    .getByRole("navigation", { name: "主导航" })
    .getByRole("button", { name: "记忆档案" })
    .click();
  await expect(page.locator(".archive-count")).toBeVisible();
});

test("延迟加载可取消，完成后不会自行开始播放", async ({ page }) => {
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("**/audio/sleep-piano-scott-buckley.mp3", async (route) => {
    await gate;
    await route.continue();
  });
  await page.goto("/");
  await page.getByLabel("音景设置", { exact: true }).click();
  await page.getByRole("button", { name: "开启背景音乐", exact: true }).click();
  await page
    .getByRole("button", { name: "取消加载背景音乐", exact: true })
    .click();
  release();
  await page.waitForResponse("**/audio/sleep-piano-scott-buckley.mp3");
  await page.waitForTimeout(1500);
  await expect(page.locator(".audio-state")).not.toContainText("纯音乐播放中");
  await page.getByRole("button", { name: "开启背景音乐", exact: true }).click();
  await expect(page.locator(".audio-state")).toContainText("纯音乐播放中", {
    timeout: 15000,
  });
});

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
  await expect(page.locator(".audio-state")).toContainText("纯音乐播放中", {
    timeout: 15000,
  });
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
  await expect(page.locator(".audio-state")).toContainText("纯音乐播放中", {
    timeout: 15000,
  });
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
  await expect(page.locator(".audio-state")).toContainText("纯音乐播放中", {
    timeout: 15000,
  });
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
