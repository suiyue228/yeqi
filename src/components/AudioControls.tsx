import { useEffect, useSyncExternalStore } from "react";
import { audio } from "../lib/audio";
import { MUSIC_TRACK } from "../lib/musicTrack";
export function AudioControls() {
  const state = useSyncExternalStore(audio.subscribe, audio.getSnapshot);
  useEffect(() => {
    const change = () => {
      if (document.hidden) audio.pause();
    };
    document.addEventListener("visibilitychange", change);
    return () => document.removeEventListener("visibilitychange", change);
  }, []);
  return (
    <details className="audio-console">
      <summary aria-label="音景设置">
        ♫ <span>{state.playing ? "月下曲正在流淌" : "音景 · 静候开启"}</span>
      </summary>
      <div className="audio-panel">
        <span className="eyebrow">MOONLIGHT / 月下钢琴</span>
        <p>
          柔和的钢琴，陪你在月光里慢慢写。
          <br />
          声音由你开启，随时可以关掉。
        </p>
        <button
          className="button outline-button"
          onClick={() => void audio.toggleMusic()}
        >
          {state.loading
            ? "取消加载背景音乐"
            : state.playing
              ? "关闭背景音乐"
              : state.preferences.music
                ? "恢复背景音乐"
                : "开启背景音乐"}
        </button>
        <p className="music-credit">
          <a href={MUSIC_TRACK.source} target="_blank" rel="noreferrer">
            {MUSIC_TRACK.title} — {MUSIC_TRACK.artist}
          </a>
          <br />
          <a href={MUSIC_TRACK.license} target="_blank" rel="noreferrer">
            CC BY 4.0
          </a>{" "}
          · 已做音量与循环衔接处理
        </p>
        <label>
          音乐音量
          <input
            aria-label="音乐音量"
            type="range"
            min="0"
            max="100"
            value={Math.round(state.preferences.musicVolume * 100)}
            onChange={(e) =>
              audio.configure({ musicVolume: Number(e.target.value) / 100 })
            }
          />
        </label>
        <label className="sound-checkbox">
          <input
            type="checkbox"
            checked={state.preferences.effects}
            onChange={() => void audio.toggleEffects()}
          />
          开启交互音效
        </label>
        {state.preferences.effects && !state.unlocked && (
          <button
            className="text-button"
            onClick={() => void audio.resumeEffects()}
          >
            恢复交互音效
          </button>
        )}
        <label>
          音效音量
          <input
            aria-label="音效音量"
            type="range"
            min="0"
            max="100"
            value={Math.round(state.preferences.effectsVolume * 100)}
            onChange={(e) =>
              audio.configure({ effectsVolume: Number(e.target.value) / 100 })
            }
          />
        </label>
        <p className="audio-state" aria-live="polite">
          {state.loading
            ? "正在准备月下钢琴，可随时取消。"
            : state.playing
              ? "纯音乐播放中"
              : state.unlocked
                ? "背景音乐已关闭"
                : state.preferences.music || state.preferences.effects
                  ? "偏好已记住，点击音乐或恢复交互音效以继续。"
                  : "尚未开启声音"}
          {state.error && <span role="alert">{state.error}</span>}
        </p>
      </div>
    </details>
  );
}
