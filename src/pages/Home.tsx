import type { Entry } from "../types";
import { moodOf } from "../types";
import { filterEntries, formatDate } from "../lib/entries";
import { StageArt } from "../components/StageArt";
import { EntrySlip } from "../components/EntrySlip";
import { MoonPhases, TheaterFrame } from "../components/SceneArt";
export function Home({
  entries,
  navigate,
  echo,
}: {
  entries: Entry[];
  navigate: (path: string) => void;
  echo: () => void;
}) {
  const recent = filterEntries(entries, "", "", "", "newest").slice(0, 3);
  const today = entries.filter(
    (e) => new Date(e.occurredAt).toDateString() === new Date().toDateString(),
  ).length;
  return (
    <div className="page home-page">
      <section className="home-stage" aria-labelledby="page-title">
        <TheaterFrame />
        <div className="stage-playbill" aria-hidden="true">
          <span>夜 栖 秘 密 剧 场</span>
          <i>✦</i>
          <span>THE MIDNIGHT THEATRE</span>
        </div>
        <div className="stage-heading">
          <span className="eyebrow">ACT I · 月影深处，门为你留</span>
          <h1 id="page-title" tabIndex={-1}>
            今夜，
            <br />
            让心事<span>有处栖息。</span>
          </h1>
          <p>
            那些无处安放的话，
            <br />
            月亮会替你好好收藏。
          </p>
        </div>
        <div className="art-window">
          <StageArt />
          <button
            className="gate-key"
            onClick={() => navigate("/write")}
            aria-label="推开月影门，写下心情"
          >
            <svg viewBox="0 0 50 50" aria-hidden="true">
              <circle cx="25" cy="13" r="8" />
              <path d="M25 21v23h10v-7H25m0-7h7" />
            </svg>
            <small>推 开 月 影 门</small>
          </button>
        </div>
        <div className="stage-actions">
          <button
            className="button ink-button"
            onClick={() => navigate("/write")}
          >
            <span aria-hidden="true">✎</span> 写下心情{" "}
            <span aria-hidden="true">↗</span>
          </button>
          <button className="text-button" onClick={() => navigate("/archive")}>
            进入记忆档案 <span aria-hidden="true">⟶</span>
          </button>
          <small>不必写得漂亮，真实就好。</small>
        </div>
        <aside className="night-index" aria-label="今夜索引">
          <MoonPhases />
          <h2>今 夜 索 引</h2>
          <span className="micro">NIGHT INDEX</span>
          <div className="index-date">
            {formatDate(new Date().toISOString())}
            <small>以此刻，作为新的起点</small>
          </div>
          <dl>
            <div>
              <dt>已封存的记忆</dt>
              <dd>
                {String(entries.length).padStart(2, "0")}
                <small>封</small>
              </dd>
            </div>
            <div>
              <dt>今日落下的心事</dt>
              <dd>
                {String(today).padStart(2, "0")}
                <small>则</small>
              </dd>
            </div>
          </dl>
          <div className="last-mood">
            <span>最近的心天气</span>
            <p>
              {recent[0]
                ? `${moodOf(recent[0].mood).symbol} ${moodOf(recent[0].mood).name}`
                : "☾ 尚待落笔"}
            </p>
          </div>
          <button className="echo-link" onClick={echo}>
            ✧ 听一段记忆回响 <span aria-hidden="true">↗</span>
          </button>
          <p className="index-note">
            有些答案，
            <br />
            藏在从前的自己那里。
          </p>
        </aside>
        <span className="stage-side-note" aria-hidden="true">
          月光不问来处 · 树洞收留心事
        </span>
      </section>
      <section className="recent-section">
        <div className="collection-ribbon" aria-hidden="true">
          <span>III / THE CABINET</span>
          <i>✧</i>
          <span>月下未寄出的信</span>
        </div>
        <div className="section-heading">
          <div>
            <span className="eyebrow">LETTERS TO THE MOON</span>
            <h2>
              最近落下的梦笺 <span aria-hidden="true">✧</span>
            </h2>
          </div>
          <button className="text-button" onClick={() => navigate("/archive")}>
            翻阅所有记忆 ⟶
          </button>
        </div>
        {recent.length ? (
          <div className="slip-list">
            {recent.map((entry, i) => (
              <EntrySlip
                key={entry.id}
                entry={entry}
                index={i}
                onOpen={() => navigate(`/entry/${entry.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="home-empty">
            <span className="empty-envelope" aria-hidden="true">
              ✉
            </span>
            <div>
              <h3>第一封信，还在等你。</h3>
              <p>
                可以从「今天，有一件很小的事……」开始。
                <br />
                这里没有字数要求，也没有人会评判。
              </p>
            </div>
            <button className="text-button" onClick={() => navigate("/write")}>
              留下第一段记忆 ↗
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
