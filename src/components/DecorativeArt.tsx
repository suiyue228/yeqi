/** Locally bundled illustrations; labels and actions remain in semantic HTML. */
const ART = {
  "writing-relic": {
    width: 264,
    height: 198,
    sizes:
      "(max-width: 760px) 160px, (max-width: 1000px) 205px, (max-width: 1200px) 235px, 265px",
  },
  "archive-cabinet": {
    width: 180,
    height: 180,
    sizes: "(max-width: 420px) 87px, (max-width: 760px) 96px, 180px",
  },
  "sealed-letter": {
    width: 128,
    height: 96,
    sizes: "(max-width: 760px) 80px, 112px",
  },
} as const;

export function DecorativeArt({
  kind,
  className = "",
  lazy = false,
}: {
  kind: keyof typeof ART;
  className?: string;
  lazy?: boolean;
}) {
  const art = ART[kind];
  const image = `${import.meta.env.BASE_URL}art/${kind}`;
  return (
    <img
      className={`decorative-art ${className}`}
      src={`${image}-1x.webp`}
      srcSet={`${image}-1x.webp ${art.width}w, ${image}-2x.webp ${art.width * 2}w`}
      sizes={art.sizes}
      width={art.width}
      height={art.height}
      alt=""
      aria-hidden="true"
      decoding="async"
      loading={lazy ? "lazy" : "eager"}
      draggable={false}
    />
  );
}
