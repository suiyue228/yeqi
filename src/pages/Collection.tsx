import type { Entry } from "../types";
import { RoomHeader } from "../components/RoomHeader";
import { EntrySlip } from "../components/EntrySlip";
export function Collection({
  entries,
  favoriteIds,
  toggle,
  navigate,
  blocked,
}: {
  entries: Entry[];
  favoriteIds: string[];
  toggle: (id: string) => void;
  navigate: (p: string) => void;
  blocked: boolean;
}) {
  const found = favoriteIds
    .map((id) => entries.find((e) => e.id === id))
    .filter((e): e is Entry => !!e);
  return (
    <div className="page module-page collection-page">
      <RoomHeader
        chapter="THE KEEPSAKE CASKET · 秘密收藏"
        title="重要的记忆，留近一些。"
        intro="收藏从档案与阅读页挑出的重要梦笺。这里是收纳匣，没有密码加密。"
        navigate={navigate}
      />
      <section className="keepsake-casket">
        <div className="casket-clasp" aria-hidden="true">
          ◇
        </div>
        <div className="collection-count">
          匣中藏有 {found.length} 封重要梦笺
        </div>
        {found.length ? (
          <div className="archive-letters">
            {found.map((entry, i) => (
              <div className="drawer-unit" key={entry.id}>
                <EntrySlip
                  entry={entry}
                  index={i}
                  onOpen={() => navigate("/entry/" + entry.id)}
                />
                <button
                  className="favorite-toggle"
                  aria-label={`取消收藏：${entry.title || "无题梦笺"}`}
                  aria-pressed="true"
                  disabled={blocked}
                  onClick={() => toggle(entry.id)}
                >
                  ◆ 已收藏
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="room-empty">
            <span aria-hidden="true">◇</span>
            <h2>重要的事，会慢慢聚在这里。</h2>
            <p>从档案或阅读页点“收藏”，即可独立收纳。</p>
            <button
              className="button ink-button"
              onClick={() => navigate("/archive")}
            >
              去档案馆挑一封 ⟶
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
