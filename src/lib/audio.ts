/** Original instrumental score and small synthesized foley. No audio/network assets. */
export type Sound =
  | "curtain"
  | "drawer"
  | "letter"
  | "index"
  | "save"
  | "favorite"
  | "delete"
  | "chime";
interface Preferences {
  music: boolean;
  effects: boolean;
  musicVolume: number;
  effectsVolume: number;
}
interface AudioState {
  preferences: Preferences;
  playing: boolean;
  unlocked: boolean;
  error: string;
}
const KEY = "yeqi.audio.v1";
const defaults: Preferences = {
  music: false,
  effects: false,
  musicVolume: 0.45,
  effectsVolume: 0.5,
};
function load(): Preferences {
  try {
    const p = JSON.parse(localStorage.getItem(KEY) || "null");
    if (
      p &&
      typeof p.music === "boolean" &&
      typeof p.effects === "boolean" &&
      [p.musicVolume, p.effectsVolume].every(
        (v) => typeof v === "number" && Number.isFinite(v) && v >= 0 && v <= 1,
      )
    )
      return p;
  } catch {
    /* Preferences do not contain private records. */
  }
  return { ...defaults };
}
class Soundscape {
  private state: AudioState = {
    preferences: load(),
    playing: false,
    unlocked: false,
    error: "",
  };
  private listeners = new Set<() => void>();
  private context: AudioContext | null = null;
  private musicBus: GainNode | null = null;
  private effectsBus: GainNode | null = null;
  private timer: number | null = null;
  private step = 0;
  private nextNote = 0;
  private voices = new Map<
    OscillatorNode,
    { kind: "music" | "effect"; gain: GainNode }
  >();
  private recent = new Map<Sound, number>();
  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };
  getSnapshot = () => this.state;
  private emit(patch: Partial<AudioState>) {
    this.state = { ...this.state, ...patch };
    this.listeners.forEach((f) => f());
  }
  configure(patch: Partial<Preferences>) {
    const preferences = { ...this.state.preferences, ...patch };
    this.emit({ preferences });
    if (this.context) {
      this.musicBus?.gain.setTargetAtTime(
        preferences.musicVolume * 0.14,
        this.context.currentTime,
        0.08,
      );
      this.effectsBus?.gain.setTargetAtTime(
        preferences.effectsVolume * 0.12,
        this.context.currentTime,
        0.08,
      );
    }
    try {
      localStorage.setItem(KEY, JSON.stringify(preferences));
    } catch {
      this.emit({ error: "声音偏好无法保存，本次控制仍然有效。" });
    }
  }
  private async activate() {
    if (typeof AudioContext === "undefined")
      throw new Error("当前浏览器不支持合成音景，网站仍可静音使用。");
    if (!this.context) {
      this.context = new AudioContext();
      this.musicBus = this.context.createGain();
      this.effectsBus = this.context.createGain();
      this.musicBus.connect(this.context.destination);
      this.effectsBus.connect(this.context.destination);
      this.musicBus.gain.value = this.state.preferences.musicVolume * 0.14;
      this.effectsBus.gain.value = this.state.preferences.effectsVolume * 0.12;
    }
    await this.context.resume();
    if (this.context.state !== "running")
      throw new Error("浏览器暂未允许声音，请再次点击开启。");
    this.emit({ unlocked: true, error: "" });
  }
  private tone(
    frequency: number,
    time: number,
    duration: number,
    kind: "music" | "effect",
    volume = 0.14,
    type: OscillatorType = "sine",
  ) {
    const c = this.context;
    if (!c) return;
    const voice = c.createOscillator(),
      gain = c.createGain();
    voice.type = type;
    voice.frequency.value = frequency;
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(volume, time + 0.035);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);
    voice.connect(gain);
    gain.connect(kind === "music" ? this.musicBus! : this.effectsBus!);
    this.voices.set(voice, { kind, gain });
    voice.onended = () => {
      voice.disconnect();
      gain.disconnect();
      this.voices.delete(voice);
    };
    voice.start(time);
    voice.stop(time + duration + 0.03);
  }
  private fade(kind?: "music" | "effect") {
    const c = this.context;
    if (!c) return;
    for (const [voice, group] of this.voices)
      if (!kind || group.kind === kind) {
        try {
          group.gain.gain.cancelAndHoldAtTime(c.currentTime);
          group.gain.gain.setTargetAtTime(0.0001, c.currentTime, 0.06);
          voice.stop(c.currentTime + 0.28);
        } catch {
          /* already ended */
        }
      }
  }
  private schedule = () => {
    const c = this.context;
    if (!c || c.state !== "running") return;
    const melody = [
      0, 2, 4, 2, 1, 3, 2, 0, 4, 5, 3, 2, 1, 2, 0, -1, 0, 3, 4, 2, 5, 4, 2, 1,
      3, 2, 1, 0, 2, 1, 0, -1,
    ];
    const scale = [196, 233.0819, 261.6256, 293.6648, 349.2282, 392];
    while (this.nextNote < c.currentTime + 0.45) {
      const n = melody[this.step % melody.length];
      if (n >= 0) this.tone(scale[n], this.nextNote, 3.5, "music", 0.13);
      if (this.step % 4 === 0)
        this.tone(
          this.step % 8 === 0 ? 98 : 116.5409,
          this.nextNote,
          6.2,
          "music",
          0.09,
          "triangle",
        );
      this.nextNote += 1.8;
      this.step++;
    }
  };
  async toggleMusic() {
    if (this.state.playing) {
      this.configure({ music: false });
      this.stopMusic();
      return;
    }
    try {
      await this.activate();
      this.configure({ music: true });
      if (this.timer !== null) return;
      this.nextNote = this.context!.currentTime + 0.1;
      this.emit({ playing: true });
      this.schedule();
      this.timer = window.setInterval(this.schedule, 250);
    } catch (e) {
      this.emit({
        error: e instanceof Error ? e.message : "声音暂不可用。",
        playing: false,
      });
    }
  }
  async toggleEffects() {
    const enabled = !this.state.preferences.effects;
    if (!enabled) {
      this.configure({ effects: false });
      this.fade("effect");
      return;
    }
    try {
      await this.activate();
      this.configure({ effects: true });
      this.play("chime");
    } catch (e) {
      this.emit({ error: e instanceof Error ? e.message : "音效暂不可用。" });
    }
  }
  play(kind: Sound) {
    if (
      !this.context ||
      !this.state.unlocked ||
      !this.state.preferences.effects ||
      document.hidden
    )
      return;
    const now = performance.now();
    if (
      now - (this.recent.get(kind) ?? -Infinity) <
      (kind === "chime" ? 900 : 250)
    )
      return;
    this.recent.set(kind, now);
    const notes: Record<Sound, number[]> = {
      curtain: [110, 164.81],
      drawer: [146.83, 220],
      letter: [261.63, 329.63],
      index: [523.25],
      save: [392, 493.88, 587.33],
      favorite: [659.25, 987.77],
      delete: [146.83, 196],
      chime: [783.99, 1174.66, 1567.98],
    };
    notes[kind].forEach((f, i) =>
      this.tone(
        f,
        this.context!.currentTime + i * 0.08,
        kind === "chime" ? 1.65 : 0.65,
        "effect",
        0.15 / (i + 1),
        kind === "curtain" ? "triangle" : "sine",
      ),
    );
  }
  private stopMusic() {
    if (this.timer !== null) window.clearInterval(this.timer);
    this.timer = null;
    this.fade("music");
    this.emit({ playing: false });
  }
  pause = () => {
    this.stopMusic();
    this.fade();
    this.emit({ unlocked: false });
    void this.context?.suspend().catch(() => {});
  };
}
export const audio = new Soundscape();
