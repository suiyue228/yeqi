/** Local soundscape: licensed piano and synthesized interaction sounds. */
import {
  createRoom,
  scheduleQuietCue,
  scheduleWindChime,
  WIND_CHIME_COOLDOWN_MS,
  STAR_BELL_ROOM,
} from "./soundDesign";
import type { TrackVoice, ChimeTouch } from "./soundDesign";
import { loadMusicBuffer, startMusic, MUSIC_LEVEL } from "./musicTrack";
export type Sound =
  | "curtain"
  | "drawer"
  | "letter"
  | "index"
  | "save"
  | "favorite"
  | "delete"
  | "chime"
  | "windchime";
interface Preferences {
  music: boolean;
  effects: boolean;
  musicVolume: number;
  effectsVolume: number;
}
interface AudioState {
  preferences: Preferences;
  playing: boolean;
  loading: boolean;
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
    loading: false,
    unlocked: false,
    error: "",
  };
  private listeners = new Set<() => void>();
  private context: AudioContext | null = null;
  private musicBus: GainNode | null = null;
  private musicDuck: GainNode | null = null;
  private chimeRoom: ReturnType<typeof createRoom> | null = null;
  private effectsBus: GainNode | null = null;
  private musicBuffer: AudioBuffer | null = null;
  private musicRequest = 0;
  private effectsRoom: ReturnType<typeof createRoom> | null = null;
  private musicPosition = 0;
  private musicStartedAt: number | null = null;
  private voices = new Map<
    AudioScheduledSourceNode,
    { kind: "music" | "effect"; gain: GainNode }
  >();
  private recent = new Map<Sound, number>();
  private chimeVoices = new Set<AudioScheduledSourceNode>();
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
    this.updateLevels();
    try {
      localStorage.setItem(KEY, JSON.stringify(preferences));
    } catch {
      this.emit({ error: "声音偏好无法保存，本次控制仍然有效。" });
    }
  }
  private updateLevels() {
    const c = this.context;
    if (!c) return;
    const { preferences, playing, unlocked } = this.state;
    // These gains follow dry AND reverberant signals: muting cannot leave a tail.
    this.musicBus?.gain.setTargetAtTime(
      playing ? preferences.musicVolume * MUSIC_LEVEL : 0,
      c.currentTime,
      0.08,
    );
    this.effectsBus?.gain.setTargetAtTime(
      unlocked && preferences.effects ? preferences.effectsVolume * 0.12 : 0,
      c.currentTime,
      0.06,
    );
  }
  private async activate() {
    if (typeof AudioContext === "undefined")
      throw new Error("当前浏览器不支持合成音景，网站仍可静音使用。");
    if (!this.context) {
      this.context = new AudioContext();
      this.musicBus = this.context.createGain();
      this.effectsBus = this.context.createGain();
      this.musicDuck = this.context.createGain();
      this.musicBus.connect(this.musicDuck).connect(this.context.destination);
      this.effectsBus.connect(this.context.destination);
      this.musicBus.gain.value = 0;
      this.effectsBus.gain.value = 0;
      this.effectsRoom = createRoom(this.context, this.effectsBus, 4200, 0.7);
      this.chimeRoom = createRoom(
        this.context,
        this.effectsBus,
        STAR_BELL_ROOM.cutoff,
        STAR_BELL_ROOM.wet,
      );
    }
    await this.context.resume();
    if (this.context.state !== "running")
      throw new Error("浏览器暂未允许声音，请再次点击开启。");
    this.emit({ unlocked: true, error: "" });
    this.updateLevels();
  }
  private trackVoice: TrackVoice = ({ source, gain, kind }) => {
    this.voices.set(source, { gain, kind });
    return () => {
      this.voices.delete(source);
    };
  };
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
  async toggleMusic() {
    if (this.state.loading) {
      this.musicRequest++;
      this.configure({ music: false });
      this.emit({ loading: false });
      return;
    }
    if (this.state.playing) {
      this.configure({ music: false });
      this.stopMusic();
      return;
    }
    const request = ++this.musicRequest;
    this.emit({ loading: true, error: "" });
    try {
      await this.activate();
      if (request !== this.musicRequest) return;
      const buffer = this.musicBuffer ?? (await loadMusicBuffer());
      this.musicBuffer = buffer;
      if (request !== this.musicRequest) return;
      if (document.hidden) {
        this.pause();
        return;
      }
      this.configure({ music: true });
      if (this.state.playing) return;
      this.musicStartedAt = this.context!.currentTime + 0.05;
      startMusic(
        this.context!,
        this.musicBus!,
        buffer,
        this.musicStartedAt,
        this.musicPosition,
        this.trackVoice,
      );
      this.emit({ playing: true, loading: false });
      this.updateLevels();
    } catch (e) {
      if (request === this.musicRequest)
        this.emit({
          error: e instanceof Error ? e.message : "声音暂不可用。",
          playing: false,
          loading: false,
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
      this.effectsRoom!.reset();
      this.chimeRoom!.reset();
      this.configure({ effects: true });
      this.play("chime");
    } catch (e) {
      this.emit({ error: e instanceof Error ? e.message : "音效暂不可用。" });
    }
  }
  play(kind: Sound, touch?: ChimeTouch) {
    if (
      !this.context ||
      this.context.state !== "running" ||
      !this.state.unlocked ||
      !this.state.preferences.effects ||
      this.state.preferences.effectsVolume === 0 ||
      (kind === "windchime" && this.chimeVoices.size >= 2) ||
      document.hidden
    )
      return;
    const now = performance.now();
    if (
      now - (this.recent.get(kind) ?? -Infinity) <
      (kind === "windchime"
        ? WIND_CHIME_COOLDOWN_MS
        : kind === "chime"
          ? 900
          : 250)
    )
      return;
    this.recent.set(kind, now);
    const c = this.context;
    if (kind === "windchime") {
      scheduleWindChime(
        c,
        this.chimeRoom!.input,
        c.currentTime + 0.015,
        (voice) => {
          this.chimeVoices.add(voice.source);
          const untrack = this.trackVoice(voice);
          return () => {
            this.chimeVoices.delete(voice.source);
            untrack();
          };
        },
        touch,
      );
      if (this.state.playing && this.musicDuck) {
        const gain = this.musicDuck.gain,
          now = c.currentTime;
        gain.cancelAndHoldAtTime(now);
        gain.linearRampToValueAtTime(0.85, now + 0.06);
        gain.setValueAtTime(0.85, now + 0.4);
        gain.linearRampToValueAtTime(1, now + 1.1);
      }
    } else
      scheduleQuietCue(
        c,
        this.effectsRoom!.input,
        kind,
        c.currentTime + 0.015,
        this.trackVoice,
      );
  }
  async resumeEffects() {
    try {
      await this.activate();
      this.effectsRoom!.reset();
      this.chimeRoom!.reset();
      this.configure({ effects: true });
      this.play("chime");
    } catch (e) {
      this.emit({ error: e instanceof Error ? e.message : "无法恢复音效。" });
    }
  }
  private stopMusic() {
    if (this.context && this.musicDuck) {
      this.musicDuck.gain.cancelAndHoldAtTime(this.context.currentTime);
      this.musicDuck.gain.setTargetAtTime(1, this.context.currentTime, 0.08);
    }
    if (this.context && this.musicStartedAt !== null) {
      this.musicPosition =
        (this.musicPosition +
          Math.max(0, this.context.currentTime - this.musicStartedAt)) %
        (this.musicBuffer?.duration ?? 1);
      this.musicStartedAt = null;
    }
    this.fade("music");
    this.emit({ playing: false });
    this.updateLevels();
  }
  pause = () => {
    this.musicRequest++;
    this.emit({ loading: false });
    this.stopMusic();
    for (const [voice, group] of this.voices) {
      try {
        voice.disconnect();
        group.gain.disconnect();
        voice.stop(this.context!.currentTime);
      } catch {
        /* already stopped */
      }
    }
    this.voices.clear();
    this.chimeVoices.clear();
    this.effectsRoom?.reset();
    this.chimeRoom?.reset();
    this.emit({ unlocked: false });
    this.updateLevels();
    void this.context?.suspend().catch(() => {});
  };
}
export const audio = new Soundscape();
// Release the previous graph when a development edit replaces this module.
// Otherwise a suspended/playing old instance can outlive the new controls.
import.meta.hot?.dispose(() => audio.pause());
