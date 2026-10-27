import { useEffect, useState } from "react";
import type { Wish } from "../lib/workspace";
import { RoomHeader } from "../components/RoomHeader";
import { audio } from "../lib/audio";
export function Wishes({
  wishes,
  add,
  toggle,
  navigate,
  blocked,
  setDirty,
}: {
  wishes: Wish[];
  add: (text: string) => void;
  toggle: (id: string) => void;
  navigate: (p: string) => void;
  blocked: boolean;
  setDirty: (dirty: boolean) => void;
}) {
  const [text, setText] = useState(""),
    [filter, setFilter] = useState("active"),
    [error, setError] = useState("");
  useEffect(() => {
    setDirty(!!text.trim());
  }, [text, setDirty]);
  const shown = wishes.filter(
    (w) => filter === "all" || w.done === (filter === "done"),
  );
  function submit() {
    setError("");
    if (!text.trim()) {
      setError("请先写下一件想慢慢实现的事。");
      return;
    }
    try {
      add(text);
      setText("");
      audio.play("save");
    } catch (e) {
      setError(e instanceof Error ? e.message : "愿望未能保存。");
    }
  }
  return (
    <div className="page module-page wishes-page">
      <RoomHeader
        chapter="WHISPERS IN A BOTTLE · 心愿瓶"
        title="愿望，慢一点也会发芽。"
        intro="记下尚未抵达的地方。实现的那天，再轻轻点亮它。"
        navigate={navigate}
      />
      <div className="wishes-layout">
        <div className="wish-bottle" aria-hidden="true">
          <svg viewBox="0 0 280 420" fill="none">
            <path
              d="M108 30h64v22l-10 10v72q72 47 72 102v124q-95 62-188 0V236q0-55 72-102V62l-10-10Z"
              fill="#120f18"
              stroke="#92735f"
              strokeWidth="3"
            />
            <path
              d="M119 68h42m-42 11h42m-57 260q37-42 76-1m-41-5V202m0 64q-52 5-42-30 38-8 42 30m0-26q47-2 41-34-34-6-41 34"
              stroke="#d8bce8"
            />
            <path
              d="M156 168a39 39 0 1 0 13 63c-35 6-53-30-13-63Z"
              fill="#f3d978"
            />
            <path d="m140 370 9 14-9 14-9-14Z" fill="#b83d43" />
            <path
              d="m76 158 4 12 12 4-12 4-4 12-4-12-12-4 12-4Zm129-60 3 8 8 3-8 3-3 8-3-8-8-3 8-3Z"
              fill="#d8bce8"
            />
          </svg>
          <p>{wishes.filter((w) => !w.done).length} 个愿望，还在发芽。</p>
        </div>
        <section className="wish-ledger">
          <label htmlFor="wish-text">给未来的低语</label>
          <textarea
            id="wish-text"
            maxLength={300}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="例如：学会一首一直喜欢的曲子……"
          />
          <button
            className="button ink-button"
            disabled={blocked}
            onClick={submit}
          >
            收进心愿瓶 ◇
          </button>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <div className="wish-filters" aria-label="心愿状态">
            {[
              ["active", "进行中"],
              ["done", "已完成"],
              ["all", "全部"],
            ].map(([id, label]) => (
              <button
                key={id}
                aria-pressed={filter === id}
                onClick={() => {
                  setFilter(id);
                  audio.play("index");
                }}
              >
                {label}{" "}
                {
                  wishes.filter(
                    (w) => id === "all" || w.done === (id === "done"),
                  ).length
                }
              </button>
            ))}
          </div>
          <ul className="wish-list">
            {shown.map((w) => (
              <li key={w.id} className={w.done ? "fulfilled" : ""}>
                <label>
                  <input
                    type="checkbox"
                    checked={w.done}
                    disabled={blocked}
                    onChange={() => {
                      try {
                        toggle(w.id);
                        audio.play("favorite");
                        setError("");
                      } catch (e) {
                        setError(
                          e instanceof Error ? e.message : "未能更新愿望。",
                        );
                      }
                    }}
                  />
                  <span>{w.text}</span>
                  <small>{w.done ? "已点亮" : "等待发芽"}</small>
                </label>
              </li>
            ))}
          </ul>
          {!shown.length && (
            <p className="wish-empty">
              {filter === "done"
                ? "还没有点亮的愿望，慢慢来。"
                : "这一页还很安静。可以先收下一件小小的期盼。"}
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
