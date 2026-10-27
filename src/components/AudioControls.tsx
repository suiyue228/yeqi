import { useEffect, useSyncExternalStore } from "react";
import { audio } from "../lib/audio";
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
        <span className="eyebrow">NOCTURNE / 原创月下曲</span>
        <p>
          无词的钟琴与低音，陪你慢慢写。
          <br />
          声音由你开启，随时可以关掉。
        </p>
        <button
          className="button outline-button"
          onClick={() => void audio.toggleMusic()}
        >
          {state.playing
            ? "关闭背景音乐"
            : state.preferences.music
              ? "恢复背景音乐"
              : "开启背景音乐"}
        </button>
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
          {state.playing
            ? "纯音乐播放中"
            : state.unlocked
              ? "背景音乐已关闭"
              : state.preferences.music || state.preferences.effects
                ? "偏好已记住，点击音乐或重新开启音效以恢复声音。"
                : "尚未开启声音"}
          {state.error && <span role="alert">{state.error}</span>}
        </p>
      </div>
    </details>
  );
}
