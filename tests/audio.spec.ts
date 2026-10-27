import { test, expect } from "@playwright/test";
test.use({ reducedMotion: "reduce" });

test("连续背景无静音谷和循环跳变，风铃尾韵与零音量仍正常", async ({ page }) => {
  await page.goto("/");
  const result = await page.evaluate(async () => {
    const design = await import(
      window.location.origin + "/src/lib/soundDesign.ts"
    );
    async function render(kind: "music" | "windchime", muted = false) {
      const context = new OfflineAudioContext(
        2,
        32000 * (kind === "music" ? 80 : 10),
        32000,
      );
      const level = context.createGain();
      level.gain.value =
        kind === "music" ? 0.45 * design.MUSIC_LEVEL : 0.5 * 0.12;
      if (muted) level.gain.setValueAtTime(0, 0.6);
      level.connect(context.destination);
      const room = design.createRoom(
        context,
        level,
        kind === "music" ? design.MUSIC_CUTOFF : 4200,
        kind === "music" ? design.MUSIC_WET : 0.7,
      );
      if (kind === "music") {
        design.createMusicBed(context, room.input, 0.05);
      } else design.scheduleWindChime(context, room.input, 0.05);
      const data = (await context.startRendering()).getChannelData(0);
      function rms(from: number, to: number) {
        const slice = data.subarray(from * 32000, to * 32000);
        return Math.sqrt(
          slice.reduce((sum, v) => sum + v * v, 0) / slice.length,
        );
      }
      let peak = 0;
      for (const sample of data) peak = Math.max(peak, Math.abs(sample));
      const windows =
        kind === "music"
          ? Array.from({ length: 64 }, (_, i) => rms(12 + i, 13 + i))
          : [1];
      let differenceEnergy = 0,
        signalEnergy = 0;
      for (let i = 12 * 32000; i < data.length; i++) {
        differenceEnergy += (data[i] - data[i - 1]) ** 2;
        signalEnergy += data[i] ** 2;
      }
      return {
        peak,
        finite: data.every(Number.isFinite),
        body: rms(0.1, 2),
        tail: rms(5.5, 7),
        afterMute: rms(1, 3),
        variation: Math.max(...windows) / Math.min(...windows),
        seamJump:
          kind === "music"
            ? Math.max(
                ...[32, 64].map((t) =>
                  Math.abs(
                    data[Math.round((t + 0.05) * 32000)] -
                      data[Math.round((t + 0.05) * 32000) - 1],
                  ),
                ),
              )
            : 0,
        sharpness: signalEnergy ? Math.sqrt(differenceEnergy / signalEnergy) : 0,
      };
    }
    return {
      music: await render("music"),
      chime: await render("windchime"),
      muted: await render("windchime", true),
    };
  });
  for (const sound of [result.music, result.chime]) {
    expect(sound.finite).toBe(true);
    expect(sound.peak).toBeGreaterThan(0.0001);
    expect(sound.peak).toBeLessThan(0.12);
  }
  expect(result.chime.tail).toBeGreaterThan(0.00000001);
  expect(result.chime.tail).toBeLessThan(result.chime.body);
  expect(result.muted.afterMute).toBe(0);
  expect(result.music.peak).toBeLessThan(0.005);
  expect(result.music.variation).toBeLessThan(1.2);
  expect(result.music.seamJump).toBeLessThan(0.0002);
  expect(result.music.sharpness).toBeLessThan(0.04);
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
