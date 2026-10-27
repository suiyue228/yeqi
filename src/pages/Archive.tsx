import { useMemo, useState } from "react";
import { MOODS } from "../types";
import type { Entry, Mood } from "../types";
import { filterEntries } from "../lib/entries";
import { EntrySlip } from "../components/EntrySlip";
export function Archive({
  entries,
  navigate,
}: {
  entries: Entry[];
  navigate: (path: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [mood, setMood] = useState<Mood | "">("");
  const [tag, setTag] = useState("");
  const [order, setOrder] = useState<"newest" | "oldest">("newest");
  const tags = useMemo(
    () => [...new Set(entries.flatMap((e) => e.tags))].sort(),
    [entries],
  );
  const found = useMemo(
    () => filterEntries(entries, query, mood, tag, order),
    [entries, query, mood, tag, order],
  );
  function clear() {
    setQuery("");
    setMood("");
    setTag("");
    setOrder("newest");
  }
  return (
    <div className="page archive-page">
      <div className="page-intro archive-intro">
        <div>
          <span className="eyebrow">CHAPTER III · 那些被月光收藏的日子</span>
          <h1 id="page-title" tabIndex={-1}>
            记忆，皆有回音。
          </h1>
          <p>不必急着向前。偶尔，也翻翻从前的自己。</p>
        </div>
        <div className="archive-seal" aria-hidden="true">
          月 下<br />
          <span>藏</span>笺
        </div>
      </div>
      <div className="archive-tools">
        <label className="search-field">
          <span className="sr-only">搜索标题或正文</span>
          <span aria-hidden="true">⌕</span>
          <input
            aria-label="搜索标题或正文"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="循着一个词，找回一段记忆……"
          />
        </label>
        <div className="filter-row">
          <label>
            心天气
            <select
              aria-label="心天气"
              value={mood}
              onChange={(e) => setMood(e.target.value as Mood | "")}
            >
              <option value="">全部心情</option>
              {MOODS.map((m) => (
                <option value={m.id} key={m.id}>
                  {m.symbol} {m.name} · {m.meaning}
                </option>
              ))}
            </select>
          </label>
          <label>
            标签
            <select
              aria-label="标签"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
            >
              <option value="">全部标签</option>
              {tags.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
          <label>
            时间排序
            <select
              aria-label="时间排序"
              value={order}
              onChange={(e) => setOrder(e.target.value as "newest" | "oldest")}
            >
              <option value="newest">由近至远</option>
              <option value="oldest">由远至近</option>
            </select>
          </label>
          <button className="text-button" onClick={clear}>
            清除筛选
          </button>
        </div>
      </div>
      <div className="archive-count">
        <span aria-live="polite">
          找到 {found.length} 封梦笺 <small>／共 {entries.length} 封</small>
        </span>
        <button className="text-button" onClick={() => navigate("/write")}>
          ＋ 写一封新信
        </button>
      </div>
      {found.length ? (
        <div className="archive-letters">
          {found.map((entry, i) => (
            <EntrySlip
              key={entry.id}
              entry={entry}
              index={i}
              onOpen={() => navigate(`/entry/${entry.id}`)}
            />
          ))}
        </div>
      ) : (
        <div className="full-empty">
          <span aria-hidden="true">{entries.length ? "⌕" : "✉"}</span>
          <h2>
            {entries.length
              ? "这条线索，暂时没有回音。"
              : "记忆的书架，正为你留着。"}
          </h2>
          <p>
            {entries.length
              ? "换一个词，或让所有心天气一起出现。"
              : "不需要特别的一天，平凡也值得被珍藏。"}
          </p>
          <button
            className="button ink-button"
            onClick={entries.length ? clear : () => navigate("/write")}
          >
            {entries.length ? "清除筛选，看看全部" : "写下第一封梦笺"}
          </button>
        </div>
      )}
    </div>
  );
}
