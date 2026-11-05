import { useEffect, useRef, useState } from "react";
import { dealNightCards, NIGHT_ARCANA, TAROT_SPREAD } from "../lib/tarot";
import type { NightCard } from "../lib/tarot";
import { audio } from "../lib/audio";

function CardBack() {
  return (
    <span className="tarot-back" aria-hidden="true">
      <img
        src="/art/tarot/tarot-back-1x.webp"
        srcSet="/art/tarot/tarot-back-1x.webp 224w, /art/tarot/tarot-back-2x.webp 448w"
        sizes="(max-width: 760px) 110px, 160px"
        width="224"
        height="336"
        alt=""
        draggable={false}
      />
    </span>
  );
}

function CardFace({ card, lazy = false }: { card: NightCard; lazy?: boolean }) {
  return (
    <span className="tarot-face">
      <span className="tarot-number">{card.number}</span>
      <img
        src={`/art/tarot/${card.id}.webp`}
        width="360"
        height="360"
        alt=""
        decoding="async"
        loading={lazy ? "lazy" : "eager"}
        draggable={false}
      />
      <strong>{card.name}</strong>
      <small>{card.motif}</small>
    </span>
  );
}

export function TarotTable({ navigate }: { navigate: (path: string) => void }) {
  const [deck, setDeck] = useState(dealNightCards);
  const [picks, setPicks] = useState<number[]>([]);
  const [revealed, setRevealed] = useState<number[]>([]);
  const stageHeading = useRef<HTMLHeadingElement>(null);
  const complete = picks.length === TAROT_SPREAD.length;
  const allRevealed = revealed.length === TAROT_SPREAD.length;

  useEffect(() => {
    if (complete) stageHeading.current?.focus({ preventScroll: true });
  }, [complete]);

  function pick(index: number) {
    if (complete || picks.includes(index)) return;
    setPicks((previous) =>
      previous.length < TAROT_SPREAD.length && !previous.includes(index)
        ? [...previous, index]
        : previous,
    );
    audio.play("letter");
  }

  function turn(index: number) {
    if (revealed.includes(index)) return;
    setRevealed((previous) =>
      previous.includes(index) ? previous : [...previous, index],
    );
    audio.play("letter");
  }

  function reshuffle() {
    setDeck(dealNightCards());
    setPicks([]);
    setRevealed([]);
    stageHeading.current?.focus({ preventScroll: true });
    audio.play("letter");
  }

  return (
    <div className="page module-page tarot-page">
      <header className="tarot-intro">
        <button
          className="text-button"
          onClick={() => navigate("/theatre/astrologer")}
        >
          ← 回到占星小店
        </button>
        <span className="eyebrow">THE MOTH ORACLE · NIGHT ARCANA</span>
        <h1 id="page-title" tabIndex={-1}>
          水晶球前的牌桌
        </h1>
        <p>在心里留一个问题，或只是带着此刻的心情坐下。</p>
      </header>

      <section className="tarot-table" aria-labelledby="tarot-step">
        <header className="tarot-step">
          <span className="eyebrow">眼 前 · 暗 处 · 下 一 步</span>
          <h2 id="tarot-step" ref={stageHeading} tabIndex={-1}>
            {complete ? "把三张牌慢慢翻开" : "从六张牌里选三张"}
          </h2>
          <p aria-live="polite">
            {complete
              ? allRevealed
                ? "三张牌已翻开。可以从下面的问题里挑一句，留给自己。"
                : `已翻开 ${revealed.length} / 3 张`
              : `已选 ${picks.length} / 3 张，选牌顺序就是牌阵顺序。`}
          </p>
        </header>
        {complete ? (
          <ol className="tarot-spread">
            {TAROT_SPREAD.map((slot, index) => {
              const card = deck[picks[index]];
              const open = revealed.includes(index);
              return (
                <li key={slot.title}>
                  <span className="tarot-slot">
                    {index + 1} · {slot.title}
                  </span>
                  <button
                    className={`tarot-card tarot-turn ${open ? "is-open" : ""}`}
                    aria-label={
                      open
                        ? `${slot.title}：${card.name} · ${card.motif}`
                        : `翻开${slot.title}之牌`
                    }
                    aria-disabled={open}
                    onClick={() => turn(index)}
                  >
                    {open ? <CardFace card={card} /> : <CardBack />}
                  </button>
                  <p className="tarot-slot-question">{slot.detail}</p>
                </li>
              );
            })}
          </ol>
        ) : (
          <div className="tarot-deal" aria-label="待选牌列">
            {deck.map((card, index) => {
              const order = picks.indexOf(index);
              return (
                <button
                  className="tarot-card tarot-pick"
                  key={card.id}
                  aria-label={
                    order < 0
                      ? `选择第 ${index + 1} 张背面牌`
                      : `第 ${index + 1} 张牌已选为${TAROT_SPREAD[order].title}`
                  }
                  aria-pressed={order >= 0}
                  onClick={() => pick(index)}
                >
                  <CardBack />
                  <span className="tarot-selection">
                    {order < 0
                      ? String(index + 1).padStart(2, "0")
                      : TAROT_SPREAD[order].title}
                  </span>
                </button>
              );
            })}
          </div>
        )}
        <div className="tarot-actions">
          {!complete && picks.length > 0 && (
            <button
              className="text-button"
              onClick={() => setPicks((previous) => previous.slice(0, -1))}
            >
              收回最后一张
            </button>
          )}
          <button className="text-button" onClick={reshuffle}>
            重新洗牌 ↺
          </button>
        </div>
      </section>

      {revealed.length > 0 && (
        <section
          className="tarot-readings"
          aria-labelledby="tarot-reading-title"
        >
          <h2 id="tarot-reading-title">岑的解牌笺</h2>
          <div className="tarot-reading-grid">
            {TAROT_SPREAD.map((slot, index) => {
              if (!revealed.includes(index)) return null;
              const card = deck[picks[index]];
              return (
                <article key={slot.title}>
                  <span className="eyebrow">
                    {slot.title} · {card.motif}
                  </span>
                  <h3>{card.name}</h3>
                  <p>{card.reading}</p>
                  <p className="tarot-journal-prompt">{card.prompt}</p>
                </article>
              );
            })}
          </div>
        </section>
      )}
      <details className="tarot-gallery">
        <summary>翻看《夜栖秘仪》十二张牌</summary>
        <div className="tarot-gallery-grid">
          {NIGHT_ARCANA.map((card) => (
            <CardFace key={card.id} card={card} lazy />
          ))}
        </div>
      </details>
      <p className="tarot-note">
        这是一场以牌面意象为线索的自我书写仪式。默想的问题只留在你心里。
      </p>
    </div>
  );
}
