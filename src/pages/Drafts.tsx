import { useEffect, useState } from "react";
import type { Draft } from "../lib/workspace";
import { RoomHeader } from "../components/RoomHeader";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { formatDate } from "../lib/entries";
import { audio } from "../lib/audio";
import { DecorativeArt } from "../components/DecorativeArt";
export function Drafts({
  drafts,
  save,
  remove,
  navigate,
  blocked,
  setDirty,
}: {
  drafts: Draft[];
  save: (d: Draft) => void;
  remove: (id: string) => void;
  navigate: (p: string) => void;
  blocked: boolean;
  setDirty: (dirty: boolean) => void;
}) {
  const [title, setTitle] = useState(""),
    [body, setBody] = useState(""),
    [error, setError] = useState(""),
    [deleting, setDeleting] = useState<string | null>(null);
  useEffect(() => {
    setDirty(!!(title.trim() || body.trim()));
  }, [title, body, setDirty]);
  function quick() {
    setError("");
    if (!body.trim()) {
      setError("先留下一小段文字，再放进草稿匣。");
      return;
    }
    try {
      const now = new Date().toISOString();
      save({
        id: crypto.randomUUID(),
        title: title.trim(),
        body: body.trim(),
        mood: "mist",
        tags: [],
        occurredAt: now,
        updatedAt: now,
      });
      setTitle("");
      setBody("");
      audio.play("save");
    } catch (e) {
      setError(e instanceof Error ? e.message : "未能保存草稿。");
    }
  }
  return (
    <div className="page module-page drafts-page">
      <RoomHeader
        chapter="THE UNFINISHED LETTERS · 草稿匣"
        title="还没想好的话，也收下。"
        intro="碎片先留在这里。等它长成一句完整的话，再转为正式梦笺。"
        navigate={navigate}
      />
      <div className="drafts-layout">
        <section className="fragment-desk">
          <span className="eyebrow">A FRAGMENT IS ENOUGH</span>
          <label htmlFor="fragment-title">草稿标题（可选）</label>
          <input
            id="fragment-title"
            maxLength={80}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="给碎片一个小名字"
          />
          <label htmlFor="fragment-body">快速碎片</label>
          <textarea
            id="fragment-body"
            maxLength={20000}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="不必写完，也可以保存……"
          />
          <button
            className="button ink-button"
            disabled={blocked}
            onClick={quick}
          >
            存入草稿匣 ✉
          </button>
          {error && !deleting && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <p className="small-note">
            手动保存后可刷新恢复；尚未点保存的快速输入不会自动备份。
          </p>
        </section>
        <section className="fragment-stack">
          <h2>匣中有 {drafts.length} 片未完待续</h2>
          {drafts.length ? (
            drafts.map((d) => (
              <article key={d.id} className="draft-fragment">
                <time>{formatDate(d.updatedAt, true)}</time>
                <h3>{d.title || "无题碎片"}</h3>
                <p>{d.body.slice(0, 180)}</p>
                <div>
                  <button
                    className="text-button"
                    onClick={() => navigate("/draft/" + d.id)}
                  >
                    继续编辑 / 转为正式记录 ↗
                  </button>
                  <button
                    className="text-button danger-text"
                    disabled={blocked}
                    onClick={() => {
                      setError("");
                      setDeleting(d.id);
                    }}
                  >
                    删除草稿
                  </button>
                </div>
              </article>
            ))
          ) : (
            <div className="room-empty">
              <DecorativeArt kind="sealed-letter" className="empty-letter" lazy />
              <p>
                匣子还空着。
                <br />
                在左边留下一句话，便有了第一片。
              </p>
            </div>
          )}
        </section>
      </div>
      {deleting && (
        <ConfirmDialog
          error={error}
          onCancel={() => {
            setDeleting(null);
            setError("");
          }}
          onConfirm={() => {
            try {
              remove(deleting);
              setDeleting(null);
              setError("");
            } catch (e) {
              setError(e instanceof Error ? e.message : "未能删除草稿。");
            }
          }}
        />
      )}
    </div>
  );
}
