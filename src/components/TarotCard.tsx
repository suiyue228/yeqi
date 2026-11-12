import type { NightCard } from "../lib/tarot";

const ART = `${import.meta.env.BASE_URL}art/tarot`;

export function CardBack() {
  return (
    <span className="tarot-back" aria-hidden="true">
      <img
        src={`${ART}/tarot-back-1x.webp`}
        srcSet={`${ART}/tarot-back-1x.webp 224w, ${ART}/tarot-back-2x.webp 448w`}
        sizes="(max-width: 760px) 90px, 160px"
        width="224"
        height="336"
        alt=""
        draggable={false}
      />
    </span>
  );
}

export function CardFace({
  card,
  lazy = false,
}: {
  card: NightCard;
  lazy?: boolean;
}) {
  return (
    <span className="tarot-face">
      <img
        className="tarot-face-art"
        src={`${ART}/${card.id}.webp`}
        width="360"
        height="360"
        alt=""
        decoding="async"
        loading={lazy ? "lazy" : "eager"}
        draggable={false}
      />
      <img
        className="tarot-face-frame"
        src={`${ART}/front-frame-1x.webp`}
        srcSet={`${ART}/front-frame-1x.webp 240w, ${ART}/front-frame-2x.webp 480w`}
        sizes="(max-width: 760px) 115px, 190px"
        width="240"
        height="360"
        alt=""
        loading={lazy ? "lazy" : "eager"}
        draggable={false}
      />
      <span className="tarot-number">{card.number}</span>
      <span className="tarot-caption">
        <strong>{card.name}</strong>
        <small>{card.essence}</small>
      </span>
    </span>
  );
}
