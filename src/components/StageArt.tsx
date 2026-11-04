import type { PointerEvent } from "react";

const SIZES =
  "(max-width: 760px) min(97vw, 360px), (max-width: 1000px) min(68vw, 500px), min(55vw, 650px)";
const LAYERS = [
  ["gate-night", "/art/home/gate-night", 640, 630, SIZES],
  ["gate-moon", "/art/theatre/moon-crescent", 192, 192, "118px"],
  ["gate-arch", "/art/home/gate-arch", 640, 630, SIZES],
  ["gate-boughs", "/art/home/gate-boughs", 640, 630, SIZES],
] as const;

function moveLayers(event: PointerEvent<HTMLDivElement>) {
  if (event.pointerType !== "mouse") return;
  const stage = event.currentTarget;
  const { left, top, width, height } = stage.getBoundingClientRect();
  stage.style.setProperty(
    "--gate-x",
    String(((event.clientX - left) / width - 0.5) * 2),
  );
  stage.style.setProperty(
    "--gate-y",
    String(((event.clientY - top) / height - 0.5) * 2),
  );
}

function resetLayers(event: PointerEvent<HTMLDivElement>) {
  event.currentTarget.style.removeProperty("--gate-x");
  event.currentTarget.style.removeProperty("--gate-y");
}

export function StageArt({ onOpen }: { onOpen: () => void }) {
  return (
    <div
      className="art-window"
      onPointerMove={moveLayers}
      onPointerLeave={resetLayers}
      onPointerCancel={resetLayers}
    >
      <div className="stage-art" aria-hidden="true">
        {LAYERS.map(([layer, file, width, height, sizes]) => (
          <img
            key={layer}
            className={`stage-art-layer ${layer}`}
            src={`${file}-1x.webp`}
            srcSet={`${file}-1x.webp ${width}w, ${file}-2x.webp ${width * 2}w`}
            sizes={sizes}
            width={width}
            height={height}
            alt=""
            decoding="async"
            draggable={false}
          />
        ))}
        <div className="stage-art-caption">
          <span>NO SECRET IS TOO SMALL FOR THE MOON</span>
          <div>
            <i />
          </div>
        </div>
      </div>
      <button
        className="gate-key"
        onClick={onOpen}
        aria-label="推开月影门，写下心情"
      >
        <svg viewBox="0 0 50 50" aria-hidden="true">
          <circle cx="25" cy="13" r="8" />
          <path d="M25 21v23h10v-7H25m0-7h7" />
        </svg>
        <small>推 开 月 影 门</small>
      </button>
    </div>
  );
}
