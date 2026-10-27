import { useState } from "react";
import type { Entry } from "../types";
import { moodOf } from "../types";
import { formatDate } from "../lib/entries";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { EchoDial, MoonPhases } from "../components/SceneArt";
export function Reader({
  entry,
  isEcho,
  navigate,
  remove,
  echo,
  blocked,
  favorite,
  isFavorite,
  favoriteBlocked,
}: {
  entry?: Entry;
  isEcho: boolean;
  navigate: (path: string) => void;
  remove: (id: string) => void;
  echo: () => void;
  blocked: boolean;
  favorite: (id: string) => void;
  isFavorite: boolean;
  favoriteBlocked: boolean;
}) {
  const [confirm, setConfirm] = useState(false);
  const [error, setError] = useState("");
  if (!entry)
    return (
      <div
        className={`page full-empty ${isEcho ? "echo-empty" : "missing-letter"}`}
      >
        {isEcho ? <EchoDial empty /> : <span aria-hidden="true">☾</span>}
        <h1 id="page-title" tabIndex={-1}>
          {isEcho ? "今夜，还没有回响。" : "这封梦笺不在这里。"}
        </h1>
        <p>
          {isEcho
            ? "等你写下第一段记忆，月亮便会记得。"
            : "它可能已被删除，或这个地址已经失效。"}
        </p>
        <button
          className="button ink-button"
          onClick={() => navigate(isEcho ? "/write" : "/archive")}
        >
          {isEcho ? "写下第一段记忆" : "回到记忆档案"}
        </button>
      </div>
    );
  const mood = moodOf(entry.mood);
  function destroy() {
    try {
      remove(entry!.id);
      setConfirm(false);
      navigate("/archive");
    } catch (e) {
      setError(e instanceof Error ? e.message : "删除失败，记录仍保留。");
    }
  }
  return (
    <div className={`page reading-page ${isEcho ? "echo-page" : ""}`}>
      <div className="reader-top">
        <button className="text-button" onClick={() => navigate("/archive")}>
          ← 返回记忆档案
        </button>
        <span className="eyebrow">
          {isEcho ? "CHAPTER IV · 今夜回响" : "A LETTER KEPT BY THE MOON"}
        </span>
      </div>
      {isEcho && (
        <div className="echo-heading">
          <EchoDial />
          <div className="oracle-description">
            <span className="eyebrow">THE LUNAR ORACLE · 月下抽笺台</span>
            <p>
              月亮替你翻到了这一页。
              <br />
              听听那时的自己，留下了什么。
            </p>
            <button className="text-button" onClick={echo}>
              再听一段回响 ⟶
            </button>
          </div>
        </div>
      )}
      <article className={`reading-paper mood-${entry.mood}`}>
        <div className="letter-fold" aria-hidden="true" />
        <header>
          <div className="reader-meta">
            <time dateTime={entry.occurredAt}>
              {formatDate(entry.occurredAt, true)}
            </time>
            <span>
              {mood.symbol} {mood.name} · {mood.meaning}
            </span>
          </div>
          <h1 id="page-title" tabIndex={-1}>
            {entry.title || "一封无题梦笺"}
          </h1>
          <MoonPhases />
        </header>
        <div className="entry-body">{entry.body}</div>
        <div className="reader-tags">
          {entry.tags.map((t) => (
            <span key={t}>#{t}</span>
          ))}
        </div>
        <footer className="reader-foot">
          <span>
            封存于 {formatDate(entry.createdAt, true)}
            <br />
            {entry.updatedAt !== entry.createdAt &&
              `最后修改 ${formatDate(entry.updatedAt, true)}`}
          </span>
          <span aria-hidden="true">☾</span>
        </footer>
      </article>
      <div className="reader-actions">
        <button
          className="text-button"
          aria-pressed={isFavorite}
          disabled={favoriteBlocked}
          onClick={() => favorite(entry.id)}
        >
          {isFavorite ? "◆ 已收藏，取消收藏" : "◇ 收藏这封梦笺"}
        </button>
        <button
          className="text-button danger-text"
          onClick={() => setConfirm(true)}
          disabled={blocked}
        >
          删除这封梦笺
        </button>
        <button
          className="button ink-button"
          onClick={() => navigate(`/edit/${entry.id}`)}
          disabled={blocked}
        >
          重新落笔 ✎
        </button>
      </div>
      {confirm && (
        <ConfirmDialog
          onCancel={() => setConfirm(false)}
          onConfirm={destroy}
          error={error}
        />
      )}
    </div>
  );
}
