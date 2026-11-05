import { useEffect, useRef, useState } from "react";
import { CardBack, CardFace } from "../components/TarotCard";
import {
  cutNightDeck,
  dealNightCards,
  meaningOf,
  NIGHT_ARCANA,
  summarizeReading,
  TAROT_SPREADS,
} from "../lib/tarot";
import type { DrawnCard, SpreadId } from "../lib/tarot";
import { downloadText } from "../lib/storage";
import { audio } from "../lib/audio";

type ReadingPhase = "prepare" | "shuffle" | "cut" | "draw" | "reveal";
interface Session {
  phase: ReadingPhase;
  deck: DrawnCard[];
  picks: number[];
  revealed: number[];
  shuffles: number;
  cutLabel: string;
}
const emptySession = (): Session => ({
  phase: "prepare",
  deck: [],
  picks: [],
  revealed: [],
  shuffles: 0,
  cutLabel: "",
});
const PHASES: { id: ReadingPhase; label: string }[] = [
  { id: "prepare", label: "定意" },
  { id: "shuffle", label: "洗牌" },
  { id: "cut", label: "切牌" },
  { id: "draw", label: "选牌" },
  { id: "reveal", label: "解牌" },
];

export function TarotTable({ navigate }: { navigate: (path: string) => void }) {
  const [spreadId, setSpreadId] = useState<SpreadId>("moon");
  const [question, setQuestion] = useState("");
  const [includeReversed, setIncludeReversed] = useState(true);
  const [session, setSession] = useState<Session>(emptySession);
  const [exportError, setExportError] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);
  const previousPhase = useRef(session.phase);
  const spread = TAROT_SPREADS[spreadId];
  const draws = session.picks.map((index) => session.deck[index]);
  const allRevealed = session.revealed.length === spread.positions.length;
  const reading = allRevealed ? summarizeReading(draws, spreadId) : "";

  useEffect(() => {
    if (previousPhase.current !== session.phase)
      heading.current?.focus({ preventScroll: true });
    previousPhase.current = session.phase;
  }, [session.phase]);

  function shuffle() {
    const deck = dealNightCards(includeReversed);
    setSession((previous) => ({
      ...previous,
      phase: "shuffle",
      deck,
      picks: [],
      revealed: [],
      shuffles: previous.shuffles + 1,
    }));
    audio.play("letter");
  }
  function cut(index: number) {
    setSession((previous) =>
      previous.phase === "cut"
        ? {
            ...previous,
            phase: "draw",
            deck: cutNightDeck(previous.deck, [5, 11, 17][index]),
            cutLabel: ["左叠", "中叠", "右叠"][index],
          }
        : previous,
    );
    audio.play("letter");
  }
  function pick(index: number) {
    if (session.phase !== "draw" || session.picks.includes(index)) return;
    setSession((previous) => {
      if (previous.phase !== "draw" || previous.picks.includes(index))
        return previous;
      const picks = [...previous.picks, index];
      return {
        ...previous,
        picks,
        phase: picks.length === spread.positions.length ? "reveal" : "draw",
      };
    });
    audio.play("letter");
  }
  function turn(index: number) {
    if (session.phase !== "reveal" || index !== session.revealed.length) return;
    setSession((previous) =>
      previous.phase === "reveal" && index === previous.revealed.length
        ? { ...previous, revealed: [...previous.revealed, index] }
        : previous,
    );
    audio.play("letter");
  }
  function restart() {
    setSession(emptySession());
    setExportError("");
  }
  function exportReading() {
    try {
      downloadText(
        JSON.stringify(
          {
            deck: "夜栖秘仪 · 22张大阿卡纳",
            createdAt: new Date().toISOString(),
            question: question.trim(),
            spread: spread.title,
            cards: draws.map((draw, index) => ({
              position: spread.positions[index].title,
              name: draw.card.name,
              motif: draw.card.motif,
              orientation: draw.reversed ? "逆位" : "正位",
              meaning: meaningOf(draw),
              positionLens: spread.positions[index].lens,
            })),
            synthesis: reading,
          },
          null,
          2,
        ),
        "夜栖占卜-" + new Date().toISOString().slice(0, 10) + ".json",
      );
      setExportError("");
    } catch {
      setExportError("解牌笺暂时无法下载，请稍后再试。当前牌阵仍在这里。");
    }
  }
  const titles = {
    prepare: "先把问题放到桌上",
    shuffle: "让二十二张牌重新相遇",
    cut: "选一叠，完成切牌",
    draw: `选出${spread.positions.length === 5 ? "五" : "三"}张属于此刻的牌`,
    reveal: allRevealed ? "把牌连成一段话" : "按牌位，慢慢翻开",
  };

  return (
    <div className="page module-page tarot-page">
      <header className="tarot-intro">
        <button
          className="text-button"
          onClick={() => navigate("/theatre/astrologer")}
        >
          ← 回到占星小店
        </button>
        <span className="eyebrow">THE MOTH ORACLE · XXII MAJOR ARCANA</span>
        <h1 id="page-title" tabIndex={-1}>
          水晶球前的牌桌
        </h1>
        <p>岑把星纹牌布铺平。「先留一个问题，再把余下的交给牌面。」</p>
      </header>
      <ol className="tarot-ritual-steps" aria-label="占卜进程">
        {PHASES.map((phase, index) => (
          <li
            key={phase.id}
            aria-current={session.phase === phase.id ? "step" : undefined}
          >
            <span>{index + 1}</span>
            {phase.label}
          </li>
        ))}
      </ol>
      <section
        className={`tarot-table tarot-phase-${session.phase}`}
        aria-labelledby="tarot-step"
      >
        <header className="tarot-step">
          <span className="eyebrow">
            {spread.title} ·{" "}
            {spread.positions.map((position) => position.title).join(" / ")}
          </span>
          <h2 id="tarot-step" ref={heading} tabIndex={-1}>
            {titles[session.phase]}
          </h2>
          <p aria-live="polite">
            {session.phase === "draw"
              ? `已选 ${session.picks.length} / ${spread.positions.length} 张，选牌顺序就是牌位顺序。`
              : session.phase === "reveal"
                ? `已翻开 ${session.revealed.length} / ${spread.positions.length} 张`
                : session.phase === "shuffle"
                  ? `已经洗牌 ${session.shuffles} 次。准备好后继续。`
                  : session.phase === "cut"
                    ? "三叠来自同一副牌，切牌会改变牌序。"
                    : "可以写下问题，也可以只在心里默想。"}
          </p>
        </header>

        {session.phase === "prepare" && (
          <form
            className="tarot-preparation"
            onSubmit={(event) => {
              event.preventDefault();
              shuffle();
            }}
          >
            <label>
              此刻想问的事（可选）
              <textarea
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                maxLength={240}
                rows={2}
                placeholder="例如：我想怎样面对眼前的选择？"
              />
            </label>
            <fieldset className="tarot-spread-choice">
              <legend>选择牌阵</legend>
              {Object.entries(TAROT_SPREADS).map(([id, item]) => (
                <label key={id} className="tarot-spread-option">
                  <input
                    type="radio"
                    name="spread"
                    value={id}
                    checked={spreadId === id}
                    onChange={() => setSpreadId(id as SpreadId)}
                  />
                  <span>
                    <strong>{item.title}</strong>
                    <small>{item.description}</small>
                  </span>
                </label>
              ))}
            </fieldset>
            <label className="tarot-reverse-toggle">
              <input
                type="checkbox"
                checked={includeReversed}
                onChange={(event) => setIncludeReversed(event.target.checked)}
              />
              使用正逆位（逆位关注受阻、过量或向内的课题）
            </label>
            <button className="button ink-button" type="submit">
              开始洗牌
            </button>
          </form>
        )}

        {session.phase === "shuffle" && (
          <div className="tarot-shuffle-stage">
            <div
              className="tarot-shuffling-pack"
              key={session.shuffles}
              aria-hidden="true"
            >
              <CardBack />
              <CardBack />
              <CardBack />
            </div>
            <p>让问题停在心里。想再洗一次，也可以。</p>
            <div className="tarot-actions">
              <button className="text-button" onClick={shuffle}>
                再洗一次
              </button>
              <button
                className="button ink-button"
                onClick={() =>
                  setSession((previous) => ({ ...previous, phase: "cut" }))
                }
              >
                洗好了，开始切牌
              </button>
            </div>
          </div>
        )}

        {session.phase === "cut" && (
          <div className="tarot-cut-piles">
            {["左叠", "中叠", "右叠"].map((label, index) => (
              <button
                className="tarot-card"
                key={label}
                onClick={() => cut(index)}
                aria-label={`选择${label}切牌`}
              >
                <CardBack />
                <span className="tarot-selection">{label}</span>
              </button>
            ))}
          </div>
        )}

        {session.phase === "draw" && (
          <>
            <div className="tarot-deal" aria-label="二十二张待选牌">
              {session.deck.map((draw, index) => {
                const order = session.picks.indexOf(index);
                return (
                  <button
                    className="tarot-card tarot-pick"
                    key={draw.card.id}
                    aria-label={
                      order < 0
                        ? `选择第 ${index + 1} 张背面牌`
                        : `第 ${index + 1} 张牌已选为${spread.positions[order].title}`
                    }
                    aria-pressed={order >= 0}
                    onClick={() => pick(index)}
                  >
                    <CardBack />
                    <span className="tarot-selection">
                      {order < 0
                        ? String(index + 1).padStart(2, "0")
                        : spread.positions[order].title}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="tarot-actions">
              {session.picks.length > 0 && (
                <button
                  className="text-button"
                  onClick={() =>
                    setSession((previous) => ({
                      ...previous,
                      picks: previous.picks.slice(0, -1),
                    }))
                  }
                >
                  收回最后一张
                </button>
              )}
              <button className="text-button" onClick={restart}>
                重新定意
              </button>
            </div>
          </>
        )}

        {session.phase === "reveal" && (
          <>
            <ol
              className={`tarot-spread spread-size-${spread.positions.length}`}
            >
              {spread.positions.map((slot, index) => {
                const draw = draws[index],
                  open = session.revealed.includes(index);
                return (
                  <li key={slot.title}>
                    <span className="tarot-slot">
                      {index + 1} · {slot.title}
                    </span>
                    <button
                      className={`tarot-card tarot-turn ${open ? "is-open" : ""} ${open && draw.reversed ? "is-reversed" : ""}`}
                      aria-label={
                        open
                          ? `${slot.title}：${draw.card.name} · ${draw.reversed ? "逆位" : "正位"}`
                          : `翻开${slot.title}之牌`
                      }
                      aria-disabled={open}
                      disabled={!open && index !== session.revealed.length}
                      onClick={() => turn(index)}
                    >
                      {open ? <CardFace card={draw.card} /> : <CardBack />}
                    </button>
                    <span className="tarot-orientation">
                      {open
                        ? draw.reversed
                          ? "逆位 · 向内看"
                          : "正位 · 顺势看"
                        : "待揭示"}
                    </span>
                    <p className="tarot-slot-question">{slot.question}</p>
                  </li>
                );
              })}
            </ol>
            <div className="tarot-actions">
              <button className="text-button" onClick={restart}>
                开始新一局
              </button>
            </div>
          </>
        )}
      </section>

      {session.phase === "reveal" && session.revealed.length > 0 && (
        <section
          className="tarot-readings"
          aria-labelledby="tarot-reading-title"
        >
          <h2 id="tarot-reading-title">岑的解牌笺</h2>
          {question.trim() && (
            <p className="tarot-question-echo">这一问 · {question.trim()}</p>
          )}
          <div className="tarot-reading-grid">
            {spread.positions.map((slot, index) => {
              if (!session.revealed.includes(index)) return null;
              const draw = draws[index],
                meaning = meaningOf(draw);
              return (
                <article key={slot.title}>
                  <span className="eyebrow">
                    {slot.title} · {draw.reversed ? "逆位" : "正位"} ·{" "}
                    {draw.card.motif}
                  </span>
                  <h3>{draw.card.name}</h3>
                  <span className="tarot-keywords">{meaning.keywords}</span>
                  <p>
                    {slot.lens} {meaning.message}
                  </p>
                  <p className="tarot-journal-prompt">{meaning.practice}</p>
                </article>
              );
            })}
          </div>
          {allRevealed && (
            <section
              className="tarot-synthesis"
              aria-labelledby="synthesis-title"
            >
              <span className="eyebrow">把牌位、方向与牌义放在一起</span>
              <h3 id="synthesis-title">这一局的线索</h3>
              <p>{reading}</p>
              <p className="tarot-closing-question">
                回到你的问题，哪一句最贴近实际？又有哪一句值得暂时保留？
              </p>
              <button className="text-button" onClick={exportReading}>
                下载这份解牌笺 ↓
              </button>
              {exportError && <p role="alert">{exportError}</p>}
            </section>
          )}
        </section>
      )}
      <details className="tarot-gallery">
        <summary>翻看《夜栖秘仪》二十二张大阿卡纳</summary>
        <div className="tarot-gallery-grid">
          {NIGHT_ARCANA.map((card) => (
            <CardFace key={card.id} card={card} lazy />
          ))}
        </div>
      </details>
      <p className="tarot-note">
        牌面是一组帮助理解处境的象征，解读为可能性。问题与本局牌阵留在当前页面，下载可保留解牌笺。
      </p>
    </div>
  );
}
