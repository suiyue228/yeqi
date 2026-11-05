import type { NightCard } from "../lib/tarot";

export function CardBack() {
  return (
    <span className="tarot-back" aria-hidden="true">
      <img
        src="/art/tarot/tarot-back-1x.webp"
        srcSet="/art/tarot/tarot-back-1x.webp 224w, /art/tarot/tarot-back-2x.webp 448w"
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
        src={`/art/tarot/${card.id}.webp`}
        width="360"
        height="360"
        alt=""
        decoding="async"
        loading={lazy ? "lazy" : "eager"}
        draggable={false}
      />
      <img
        className="tarot-face-frame"
        src="/art/tarot/front-frame-1x.webp"
        srcSet="/art/tarot/front-frame-1x.webp 240w, /art/tarot/front-frame-2x.webp 480w"
        sizes="(max-width: 760px) 115px, 190px"
        width="240"
        height="360"
        alt=""
        loading={lazy ? "lazy" : "eager"}
        draggable={false}
      />
      <span className="tarot-number">{card.number}</span>
      <strong>{card.name}</strong>
      <small>{card.motif}</small>
    </span>
  );
}
