import { useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";
import type { Entry } from "../types";
import type { Draft, Wish } from "../lib/workspace";
import { RoomHeader } from "../components/RoomHeader";
import {
  PaperSky,
  PaperWoods,
  PaperProscenium,
  KeeperArt,
  PaperBook,
} from "../components/PaperTheatreArt";
import { audio } from "../lib/audio";
const sayings = [
  "我是缄，替没说完的话守一盏灯。你可以只坐一会儿。",
  "没写完的句子，也有留下来的资格。",
  "旧日记不替你决定明天，它只是记得你走过。",
  "愿望可以很小，小到只有你自己听见。",
  "今晚没有答案也没关系，灯会再亮一会儿。",
];
export function Theatre({
  entries,
  drafts,
  wishes,
  navigate,
  echo,
}: {
  entries: Entry[];
  drafts: Draft[];
  wishes: Wish[];
  navigate: (p: string) => void;
  echo: () => void;
}) {
  const [phase, setPhase] = useState(0),
    [line, setLine] = useState(0),
    [panel, setPanel] = useState("book"),
    [lit, setLit] = useState(false),
    [swinging, setSwinging] = useState<string[]>([]),
    [message, setMessage] = useState(
      "轻碰星铃、月亮或纸艺道具。这里不需要完成任何事。",
    );
  const stage = useRef<HTMLDivElement>(null),
    frame = useRef<number | null>(null),
    timers = useRef<Record<string, number>>({});
  useEffect(
    () => () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
      Object.values(timers.current).forEach(clearTimeout);
    },
    [],
  );
  function sway(id: string) {
    setSwinging((old) => (old.includes(id) ? old : [...old, id]));
    window.clearTimeout(timers.current[id]);
    timers.current[id] = window.setTimeout(
      () => setSwinging((old) => old.filter((x) => x !== id)),
      1250,
    );
    audio.play("windchime");
  }
  function tilt(event: PointerEvent<HTMLDivElement>) {
    if (
      event.pointerType === "touch" ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const bounds = event.currentTarget.getBoundingClientRect(),
      x = (event.clientX - bounds.left) / bounds.width - 0.5,
      y = (event.clientY - bounds.top) / bounds.height - 0.5;
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      stage.current?.style.setProperty("--tilt-x", `${-y * 3}deg`);
      stage.current?.style.setProperty("--tilt-y", `${x * 4}deg`);
    });
  }
  function resetTilt() {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    stage.current?.style.setProperty("--tilt-x", "0deg");
    stage.current?.style.setProperty("--tilt-y", "0deg");
  }
  return (
    <div className="page module-page theatre-page">
      <RoomHeader
        chapter="THE THEATRE OF FOLDED NIGHT · 纸艺小剧场"
        title="月下，有人替微光守夜。"
        intro="一座可以轻轻拨动的纸景。每一层剪影，都为你的停留留出一点深度。"
        navigate={navigate}
      />
      <section className="theatre-shell" aria-label="月下秘密纸艺剧院">
        <div className="theatre-titleplate">
          <span>夜 栖 · 纸 灯 剧 院</span>
          <small>THE KEEPER OF UNFINISHED THINGS</small>
        </div>
        <div
          ref={stage}
          className="paper-stage"
          data-phase={phase}
          onPointerMove={tilt}
          onPointerLeave={resetTilt}
        >
          <div className="stage-volume">
            <div className="paper-layer paper-sky">
              <PaperSky phase={phase} />
            </div>
            <div className="paper-layer paper-woods">
              <PaperWoods />
            </div>
            <button
              className="paper-door stage-mechanism"
              aria-label="推开纸门，寻找一封旧信"
              onClick={() => {
                audio.play("drawer");
                if (entries.length) echo();
                else {
                  setPanel("door");
                  setMessage("门后还没有旧信，但档案馆一直为你保留着位置。");
                }
              }}
            >
              <span className="door-pane" aria-hidden="true">
                ☾<i />
              </span>
              <small>记 忆 之 门</small>
            </button>
            <button
              className={`paper-keeper stage-mechanism ${lit ? "keeper-lit" : ""}`}
              aria-label="与纸灯守夜人缄说话"
              aria-pressed={lit}
              onClick={() => {
                setLit(!lit);
                setLine((line + 1) % sayings.length);
                setMessage("守灯人轻轻转过身，把灯又点亮了一些。");
                audio.play("index");
              }}
            >
              <KeeperArt lit={lit} />
              <small>守灯人 · 缄</small>
            </button>
            <button
              className="paper-book stage-mechanism"
              aria-label="翻开守灯人的道具册"
              aria-expanded={panel === "book"}
              onClick={() => {
                setPanel("book");
                setMessage("道具册摊开了，写着这座小屋正在收藏的真实生活。");
                audio.play("letter");
              }}
            >
              <PaperBook />
              <small>道 具 册</small>
            </button>
            <button
              className={`paper-drawer stage-mechanism ${panel === "drawer" ? "drawer-open" : ""}`}
              aria-label="拉开纸抽屉"
              aria-expanded={panel === "drawer"}
              onClick={() => {
                setPanel(panel === "drawer" ? "book" : "drawer");
                setMessage("抽屉里，是还可以接着写的碎片。");
                audio.play("drawer");
              }}
            >
              <span className="drawer-paper" aria-hidden="true">
                ✉
              </span>
              <span className="mini-drawer-front">
                <i />未 完 待 续
              </span>
            </button>
            <div className="paper-layer paper-front">
              <PaperProscenium />
            </div>
            {["left", "right"].map((id) => (
              <button
                key={id}
                className={`pendant pendant-${id} ${swinging.includes(id) ? "swaying" : ""}`}
                aria-label={`摇动${id === "left" ? "左" : "右"}侧星铃`}
                onPointerEnter={() => sway(id)}
                onFocus={() => sway(id)}
                onClick={() => {
                  sway(id);
                  setMessage(
                    "星铃轻轻摇动。开启音效后，可以听到一声空灵的回应。",
                  );
                }}
              >
                <span className="hanging-string" />
                <svg viewBox="0 0 80 80" aria-hidden="true">
                  <path
                    d="m40 3 9 24 26 1-20 17 7 27-22-16-22 16 7-27L5 28l26-1Z"
                    fill={id === "left" ? "#f3d978" : "#d8bce8"}
                    stroke="#120f18"
                    strokeWidth="3"
                  />
                  <path
                    d="m40 3 0 53M5 28l50 17m20-17L25 45"
                    stroke="#92735f"
                  />
                </svg>
                <small>星铃</small>
              </button>
            ))}
            <button
              className={`pendant pendant-moon ${swinging.includes("moon") ? "swaying" : ""}`}
              aria-label={`切换悬挂月相，当前${["残月", "半月", "满月"][phase]}`}
              onPointerEnter={() => sway("moon")}
              onClick={() => {
                sway("moon");
                setPhase((phase + 1) % 3);
                setMessage(
                  `悬挂月亮与幕后纸窗一起变成${["残月", "半月", "满月"][(phase + 1) % 3]}。`,
                );
              }}
            >
              <span className="hanging-string" />
              <svg viewBox="0 0 80 80" aria-hidden="true">
                {phase === 2 ? (
                  <circle
                    cx="40"
                    cy="40"
                    r="31"
                    fill="#fff5e9"
                    stroke="#92735f"
                    strokeWidth="2"
                  />
                ) : phase === 1 ? (
                  <path
                    d="M40 9a31 31 0 0 1 0 62Z"
                    fill="#fff5e9"
                    stroke="#92735f"
                    strokeWidth="2"
                  />
                ) : (
                  <path
                    d="M53 10a32 32 0 1 0 10 52C24 69 12 25 53 10Z"
                    fill="#fff5e9"
                    stroke="#92735f"
                    strokeWidth="2"
                  />
                )}
              </svg>
              <small>{["残月", "半月", "满月"][phase]}</small>
            </button>
          </div>
        </div>
        <div className="theatre-footlights" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
          <i />
          <i />
          <i />
        </div>
      </section>
      <div className="theatre-controls">
        <span>星铃声音受顶栏音效开关控制 · 触摸、Tab 与 Enter 同样可探索</span>
        <button
          className="text-button"
          onClick={() => {
            setPhase(0);
            setLit(false);
            setLine(0);
            setPanel("book");
            setMessage("纸景已复位，灯还在。");
            resetTilt();
          }}
        >
          复位纸景 ↺
        </button>
      </div>
      <div className="theatre-script">
        <section className="keeper-lines">
          <span className="eyebrow">缄 / THE PAPER LANTERN KEEPER</span>
          <blockquote>{sayings[line]}</blockquote>
          <p aria-live="polite">{message}</p>
        </section>
        <section className="prop-notes" aria-live="polite">
          <span className="eyebrow">
            {panel === "book"
              ? "道具册 · 小屋里的真实生活"
              : panel === "drawer"
                ? "纸抽屉 · 未完待续"
                : "纸门背后"}
          </span>
          {panel === "book" ? (
            <>
              <p>
                已封存 <b>{entries.length}</b> 封梦笺 · 留下{" "}
                <b>{drafts.length}</b> 片草稿
                <br />
                仍有 <b>{wishes.filter((w) => !w.done).length}</b>{" "}
                个愿望，正在慢慢发芽。
              </p>
              <button
                className="text-button"
                onClick={() => navigate("/wishes")}
              >
                去看心愿瓶 ⟶
              </button>
            </>
          ) : panel === "drawer" ? (
            <>
              <p>
                {drafts[0]
                  ? drafts[0].title || drafts[0].body.slice(0, 55)
                  : "抽屉里暂时没有碎片。可以去草稿匣留下一句话。"}
              </p>
              <button
                className="text-button"
                onClick={() =>
                  navigate(drafts[0] ? "/draft/" + drafts[0].id : "/drafts")
                }
              >
                {drafts[0] ? "接着写这片草稿" : "打开草稿匣"} ⟶
              </button>
            </>
          ) : (
            <>
              <p>这里不会凭空编出你的记忆。</p>
              <button
                className="text-button"
                onClick={() => navigate("/archive")}
              >
                走进记忆档案馆 ⟶
              </button>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
