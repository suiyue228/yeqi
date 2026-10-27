import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { MOODS } from "../types";
import type { Entry, Mood } from "../types";
import { localInput, MAX_BODY, parseTags, validDate } from "../lib/entries";
import { DeskRelic } from "../components/SceneArt";
import { audio } from "../lib/audio";
import type { Draft } from "../lib/workspace";
interface Props {
  entry?: Entry;
  save: (entry: Entry) => void;
  navigate: (path: string, force?: boolean) => void;
  setDirty: (value: boolean) => void;
  blocked: boolean;
  draft?: Draft;
  saveDraft: (draft: Draft) => void;
  draftBlocked: boolean;
}
export function Editor({
  entry,
  draft,
  saveDraft,
  draftBlocked,
  save,
  navigate,
  setDirty,
  blocked,
}: Props) {
  const initial = entry || draft;
  const [title, setTitle] = useState(initial?.title || "");
  const [body, setBody] = useState(initial?.body || "");
  const [mood, setMood] = useState<Mood>(initial?.mood || "mist");
  const [tags, setTags] = useState(initial?.tags.join("，") || "");
  const [date, setDate] = useState(() => localInput(initial?.occurredAt));
  const [initialDate] = useState(date);
  const [error, setError] = useState("");
  const dirty =
    title !== (initial?.title || "") ||
    body !== (initial?.body || "") ||
    mood !== (initial?.mood || "mist") ||
    tags !== (initial?.tags.join("，") || "") ||
    date !== initialDate;
  useEffect(() => {
    setDirty(dirty);
  }, [dirty, setDirty]);
  function keepDraft() {
    setError("");
    const parsedTags = parseTags(tags);
    if (!body.trim()) {
      setError("先写下一点内容，再存入草稿匣。");
      return;
    }
    if (
      parsedTags.length > 8 ||
      parsedTags.some((t) => t.length > 20) ||
      !validDate(date)
    ) {
      setError("请检查标签数量、长度和有效日期。");
      return;
    }
    try {
      saveDraft({
        id: draft?.id || crypto.randomUUID(),
        title: title.trim(),
        body: body.trim(),
        mood,
        tags: parsedTags,
        occurredAt: new Date(date).toISOString(),
        updatedAt: new Date().toISOString(),
      });
      setDirty(false);
      navigate("/drafts", true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "草稿未能保存。");
    }
  }
  function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    const parsedTags = parseTags(tags);
    if (!body.trim()) {
      setError("还没有写下心事。至少留下一句话吧。");
      document.getElementById("entry-body")?.focus();
      return;
    }
    if (
      !validDate(date) ||
      new Date(date).getFullYear() < 1900 ||
      new Date(date).getFullYear() > 2100
    ) {
      setError("请选择 1900 至 2100 年之间的有效日期与时间。");
      return;
    }
    if (parsedTags.length > 8 || parsedTags.some((t) => t.length > 20)) {
      setError("最多添加 8 个标签，每个标签不超过 20 字。");
      return;
    }
    const now = new Date().toISOString();
    try {
      const next: Entry = {
        id: entry?.id || crypto.randomUUID(),
        title: title.trim(),
        body: body.trim(),
        mood,
        tags: parsedTags,
        occurredAt: new Date(date).toISOString(),
        createdAt: entry?.createdAt || now,
        updatedAt: now,
      };
      save(next);
      setDirty(false);
      navigate(`/entry/${next.id}`, true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "保存失败，请复制文字后重试。");
    }
  }
  return (
    <div className="page writing-page">
      <div className="page-intro">
        <DeskRelic />
        <span className="eyebrow">CHAPTER II · 致月亮的一封信</span>
        <h1 id="page-title" tabIndex={-1}>
          {entry
            ? "重新读懂，那时的自己。"
            : draft
              ? "把未完的句子，接着写下去。"
              : "今夜，你想留下什么？"}
        </h1>
        <p>把此刻摊在纸上。这里的每一种情绪，都值得被轻轻接住。</p>
      </div>
      <form className="writing-paper" onSubmit={submit} noValidate>
        <div className="manuscript-corners" aria-hidden="true">
          <span>✥</span>
          <span>✥</span>
        </div>
        <div className="paper-head">
          <span>DEAR MOON,</span>
          <span className="paper-moon-seal" aria-hidden="true">
            ☾
          </span>
          <span>一封只属于你的梦笺</span>
        </div>
        <label className="sr-only" htmlFor="entry-title">
          标题（可选）
        </label>
        <input
          id="entry-title"
          className="title-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={80}
          placeholder="为这片记忆取个名字（可选）"
        />
        <label className="sr-only" htmlFor="entry-body">
          心情正文（必填）
        </label>
        <textarea
          id="entry-body"
          className="body-input"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          maxLength={MAX_BODY}
          placeholder="今天，有一件很小的事……"
          required
        />
        <div className="word-count">
          {body.length.toLocaleString()} / 20,000 字
        </div>
        <fieldset className="mood-field" data-mood={mood}>
          <legend>
            此刻的心天气 <span>选一个最贴近你的感受</span>
          </legend>
          <div className="mood-astrolabe" aria-hidden="true">
            <span>☾</span>
            <i>✦</i>
          </div>
          <div className="mood-options">
            {MOODS.map((m) => (
              <label
                key={m.id}
                className={`mood-option mood-${m.id} ${mood === m.id ? "selected" : ""}`}
              >
                <input
                  type="radio"
                  name="mood"
                  value={m.id}
                  checked={mood === m.id}
                  onChange={() => {
                    setMood(m.id);
                    audio.play("index");
                  }}
                />
                <span className="mood-symbol" aria-hidden="true">
                  {m.symbol}
                </span>
                <strong>{m.name}</strong>
                <small>{m.meaning}</small>
              </label>
            ))}
          </div>
        </fieldset>
        <div className="form-bottom">
          <label>
            记忆发生的时间
            <input
              type="datetime-local"
              value={date}
              min="1900-01-01T00:00"
              max="2100-12-31T23:59"
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </label>
          <label>
            标签 / 自定义感受 <span>可选，以逗号分隔</span>
            <input
              value={tags}
              maxLength={200}
              onChange={(e) => setTags(e.target.value)}
              placeholder="例如：生活碎片，梦境，想家"
            />
          </label>
        </div>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <div className="paper-actions">
          <button
            type="button"
            className="text-button"
            onClick={() =>
              navigate(entry ? `/entry/${entry.id}` : draft ? "/drafts" : "/")
            }
          >
            ← 放下信笺
          </button>
          <button
            type="button"
            className="text-button save-draft-button"
            disabled={draftBlocked}
            onClick={keepDraft}
          >
            {draft ? "保存草稿修改" : "存入草稿匣"}
          </button>
          <span className="draft-note">
            {dirty ? "尚未封存 · 离开前记得保存" : "仅保存在当前浏览器"}
          </span>
          <button
            className="button ink-button"
            type="submit"
            disabled={blocked}
          >
            {draft ? "转为正式记录" : "封存这段记忆"}{" "}
            <span aria-hidden="true">✦</span>
          </button>
        </div>
      </form>
      <p className="under-paper">
        不必成为完整的故事。一个念头，也可以是一封信。
      </p>
    </div>
  );
}
