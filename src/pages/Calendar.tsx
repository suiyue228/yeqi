import { useMemo, useState } from "react";
import type { Entry } from "../types";
import { moodOf } from "../types";
import { localInput } from "../lib/entries";
import { RoomHeader } from "../components/RoomHeader";
import { EntrySlip } from "../components/EntrySlip";
import { audio } from "../lib/audio";
export function Calendar({
  entries,
  navigate,
}: {
  entries: Entry[];
  navigate: (path: string) => void;
}) {
  const [month, setMonth] = useState(localInput().slice(0, 7));
  const [selected, setSelected] = useState(localInput().slice(0, 10));
  const [year, number] = month.split("-").map(Number);
  const days = new Date(year, number, 0).getDate();
  const offset = (new Date(year, number - 1, 1).getDay() + 6) % 7;
  const groups = useMemo(() => {
    const map = new Map<string, Entry[]>();
    for (const e of entries) {
      const key = localInput(e.occurredAt).slice(0, 10);
      map.set(key, [...(map.get(key) || []), e]);
    }
    return map;
  }, [entries]);
  const currentEntries = entries.filter((e) =>
    localInput(e.occurredAt).startsWith(month),
  );
  const chosen = groups.get(selected) || [];
  function pickMonth(value: string) {
    if (!/^\d{4}-\d{2}$/.test(value)) return;
    setMonth(value);
    setSelected(value + "-01");
    audio.play("index");
  }
  function step(delta: number) {
    const d = new Date(year, number - 1 + delta, 1);
    pickMonth(localInput(d.toISOString()).slice(0, 7));
  }
  return (
    <div className="page module-page calendar-page">
      <RoomHeader
        chapter="THE LUNAR ALMANAC · 心情月历"
        title="日子，也有自己的月相。"
        intro="按月翻看真实记录。点亮的日期，藏着那一天的你。"
        navigate={navigate}
      />
      <div className="calendar-layout">
        <section className="almanac">
          <div className="month-toolbar">
            <button aria-label="上个月" onClick={() => step(-1)}>
              ←
            </button>
            <label>
              <span className="sr-only">查看月份</span>
              <input
                type="month"
                min="1900-01"
                max="2100-12"
                value={month}
                onChange={(e) => pickMonth(e.target.value)}
              />
            </label>
            <button aria-label="下个月" onClick={() => step(1)}>
              →
            </button>
          </div>
          <div className="almanac-title">
            <span aria-hidden="true">☾</span>
            <h2>
              {year} 年 · {number} 月
            </h2>
            <small>
              {currentEntries.length} 则记忆 /{" "}
              {
                new Set(
                  currentEntries.map((e) =>
                    localInput(e.occurredAt).slice(0, 10),
                  ),
                ).size
              }{" "}
              个落笔日
            </small>
          </div>
          <div className="week-labels" aria-hidden="true">
            {"一二三四五六日".split("").map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>
          <div className="calendar-grid">
            {Array.from({ length: offset }, (_, i) => (
              <span key={"blank" + i} />
            ))}
            {Array.from({ length: days }, (_, i) => {
              const day = i + 1,
                key = month + "-" + String(day).padStart(2, "0"),
                items = groups.get(key) || [];
              return (
                <button
                  key={key}
                  className={`${items.length ? "has-memory" : ""} ${selected === key ? "selected" : ""}`}
                  aria-pressed={selected === key}
                  aria-label={`${key}，${items.length}条记录`}
                  onClick={() => {
                    setSelected(key);
                    audio.play("index");
                  }}
                >
                  <span>{day}</span>
                  <small>
                    {items.length
                      ? [...new Set(items.map((e) => moodOf(e.mood).symbol))]
                          .slice(0, 3)
                          .join(" ")
                      : "·"}
                  </small>
                </button>
              );
            })}
          </div>
          <p className="almanac-note">符号来自当天的真实心情，并非运势预测。</p>
        </section>
        <section className="calendar-day-panel" aria-live="polite">
          <span className="eyebrow">{selected} / 当日梦笺</span>
          {chosen.length ? (
            chosen.map((entry, i) => (
              <EntrySlip
                key={entry.id}
                entry={entry}
                index={i}
                onOpen={() => navigate("/entry/" + entry.id)}
              />
            ))
          ) : (
            <div className="day-empty">
              <span aria-hidden="true">✧</span>
              <h2>这一天，没有落笔。</h2>
              <p>
                空白也是日子的一部分。
                <br />
                可以继续翻月，或选一个亮起的日期。
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
