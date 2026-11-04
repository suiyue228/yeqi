import { useState } from "react";
import { RoomHeader } from "../components/RoomHeader";
import { PaperProscenium, TheatreImage } from "../components/PaperTheatreArt";
import { TheatrePassage } from "../components/TheatrePassage";
import { usePaperTilt } from "../hooks/usePaperTilt";
import { audio } from "../lib/audio";

const ACTS = {
  tide: {
    chapter: "ACT II · THE TIDE WORKSHOP",
    title: "潮汐裁纸间",
    intro: "纸浪总比海浪慢半拍。点一下线轴裁缝，看他把潮水折成什么。",
    backdrop: "tide-room",
    actor: "tide-tailor",
    name: "线轴裁缝 · 折",
    action: "请线轴裁缝折一层纸浪",
    previous: { path: "/theatre", title: "守灯人的房间" },
    next: { path: "/theatre/post", title: "星图邮局" },
    sound: "index",
    lines: [
      {
        mark: "平潮",
        quote: "先量一量今天的风。够不着的地方，可以留白。",
        note: "折把银线搭在裁尺上，海面平得像一张刚裁好的纸。",
      },
      {
        mark: "涨潮",
        quote: "我给浪尖留一道折痕，它就知道往哪里回。",
        note: "折抬起裁尺，压出一层淡青色的纸浪。",
      },
      {
        mark: "落潮",
        quote: "海退一步，才能把沙滩还给脚印。",
        note: "折松开线轴，纸浪退到舞台边缘。",
      },
    ],
  },
  post: {
    chapter: "ACT III · THE STAR POST",
    title: "星图邮局",
    intro: "信差迢靠星星认路。点一下迢，看看今晚的信会盖上什么邮戳。",
    backdrop: "post-room",
    actor: "star-postmaster",
    name: "星图邮差 · 迢",
    action: "请星图邮差为信笺盖戳",
    previous: { path: "/theatre/tide", title: "潮汐裁纸间" },
    next: { path: "/theatre", title: "守灯人的房间" },
    sound: "letter",
    lines: [
      {
        mark: "待盖戳",
        quote: "地址写一颗星就好。剩下的路，我认得。",
        note: "一封没有写收件人的信，正摊在柜台上。",
      },
      {
        mark: "月弯邮戳",
        quote: "这封寄给明天。晚一点抵达也无妨。",
        note: "迢按下一枚月弯邮戳，连起了星图左边的路。",
      },
      {
        mark: "四芒邮戳",
        quote: "这封寄给走远的自己。就写，回来也有灯。",
        note: "迢换上四芒邮戳，星图的另一条路也亮了。",
      },
    ],
  },
} as const;

export function TheatreAct({
  act,
  navigate,
}: {
  act: keyof typeof ACTS;
  navigate: (path: string) => void;
}) {
  const scene = ACTS[act];
  const [beat, setBeat] = useState(0);
  const line = scene.lines[beat];
  const { stage, tilt, resetTilt } = usePaperTilt();

  function interact() {
    setBeat((current) => (current + 1) % scene.lines.length);
    audio.play(scene.sound);
  }

  return (
    <div className="page module-page theatre-page">
      <RoomHeader
        chapter={scene.chapter}
        title={scene.title}
        intro={scene.intro}
        navigate={navigate}
      />
      <section className="theatre-shell" aria-label={scene.title + "纸艺舞台"}>
        <div className="theatre-titleplate">
          <span>{scene.title}</span>
          <small>{scene.chapter}</small>
        </div>
        <div
          ref={stage}
          className={`paper-stage paper-act paper-act-${act}`}
          data-beat={beat}
          onPointerMove={tilt}
          onPointerLeave={resetTilt}
          onPointerCancel={resetTilt}
        >
          <div className="stage-volume">
            <div className="paper-layer act-back">
              <TheatreImage name={scene.backdrop} />
            </div>
            {act === "tide" ? (
              <svg
                className="act-tide-folds"
                viewBox="0 0 600 118"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path d="M0 49Q65 22 128 48T260 45T390 34T520 37L600 23V118H0Z" />
                <path d="M0 80Q70 57 139 78T275 73T412 63T540 60L600 48V118H0Z" />
                <path d="M0 96Q62 75 127 97T260 93T392 83T523 84L600 74V118H0Z" />
              </svg>
            ) : (
              <>
                <svg
                  className="act-post-chart"
                  viewBox="0 0 180 110"
                  aria-hidden="true"
                >
                  <path
                    className="star-route star-route-moon"
                    d="M16 78L46 39L88 52L120 18"
                  />
                  <path
                    className="star-route star-route-star"
                    d="M35 93L88 52L139 72L169 37"
                  />
                </svg>
                <div className="act-post-letter" aria-hidden="true">
                  <TheatreImage name="letter" />
                  {beat > 0 && <i key={beat}>{beat === 1 ? "☾" : "✧"}</i>}
                </div>
              </>
            )}
            <TheatrePassage
              kind="door"
              destination={scene.previous.title}
              onEnter={() => navigate(scene.previous.path)}
            />
            <button
              className="stage-mechanism act-puppet"
              aria-label={scene.action}
              onClick={interact}
            >
              <TheatreImage name={scene.actor} />
              <small>{scene.name}</small>
            </button>
            <TheatrePassage
              kind="window"
              destination={scene.next.title}
              onEnter={() => navigate(scene.next.path)}
            />
            <div className="paper-layer paper-front">
              <PaperProscenium />
            </div>
          </div>
        </div>
        <div className="theatre-footlights" aria-hidden="true">
          {Array.from({ length: 7 }, (_, i) => (
            <TheatreImage key={i} name="star-gold" />
          ))}
        </div>
      </section>
      <div className="theatre-controls">
        <span>门窗可以换景 · 触摸、Tab 与 Enter 同样可探索</span>
        <button
          className="text-button"
          onClick={() => {
            setBeat(0);
            resetTilt();
          }}
        >
          复位纸景 ↺
        </button>
      </div>
      <div className="theatre-script" role="status">
        <section className="keeper-lines">
          <span className="eyebrow">{scene.name}</span>
          <blockquote>{line.quote}</blockquote>
        </section>
        <section className="prop-notes">
          <span className="eyebrow">{line.mark}</span>
          <p>{line.note}</p>
        </section>
      </div>
    </div>
  );
}
