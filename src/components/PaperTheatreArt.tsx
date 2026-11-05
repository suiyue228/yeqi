/** Generated paper cutouts; interaction remains on the surrounding HTML buttons. */
const ART = {
  backdrop: [768, 512],
  "window-cutout": [768, 512],
  woods: [768, 512],
  curtain: [768, 512],
  keeper: [256, 448],
  door: [192, 320],
  book: [256, 160],
  drawer: [256, 160],
  letter: [192, 128],
  "star-gold": [96, 96],
  "star-lilac": [96, 96],
  "moon-crescent": [192, 192],
  "moon-half": [192, 192],
  "moon-full": [192, 192],
  "tide-room": [768, 512],
  "post-room": [768, 512],
  "tide-tailor": [288, 432],
  "star-postmaster": [288, 432],
  "passage-window": [224, 224],
  "keeper-moths": [224, 224],
  "keeper-candles": [224, 224],
  "tide-vane": [224, 224],
  "tide-kit": [224, 224],
  "post-instrument": [224, 224],
  "post-satchel": [224, 224],
  "astrologer-room": [768, 512],
  "astrologer-witch": [320, 480],
  "astrologer-counter": [400, 260],
} as const;
export type TheatreAsset = keyof typeof ART;
const MOONS = ["moon-crescent", "moon-half", "moon-full"] as const;
export function TheatreImage({
  name,
  className = "",
}: {
  name: TheatreAsset;
  className?: string;
}) {
  const [width, height] = ART[name];
  const sizes =
    className === "sky-moon"
      ? "(max-width: 760px) 56px, 150px"
      : width === 768
        ? "(max-width: 760px) 100vw, 1200px"
        : name === "astrologer-witch"
          ? "(max-width: 760px) 220px, 380px"
          : name === "astrologer-counter"
            ? "(max-width: 760px) 220px, 430px"
            : name === "keeper"
              ? "(max-width: 760px) 120px, 230px"
              : name === "door"
                ? "(max-width: 760px) 160px, 320px"
                : width === 96 || name.startsWith("moon-")
                  ? "(max-width: 760px) 48px, 68px"
                  : "(max-width: 760px) 100px, 210px";
  return (
    <img
      className={`theatre-image ${className}`}
      src={`/art/theatre/${name}-1x.webp`}
      srcSet={`/art/theatre/${name}-1x.webp ${width}w, /art/theatre/${name}-2x.webp ${width * 2}w`}
      sizes={sizes}
      width={width}
      height={height}
      alt=""
      aria-hidden="true"
      decoding="async"
      draggable={false}
    />
  );
}
export function PaperSky({ phase }: { phase: number }) {
  return <TheatreImage name={MOONS[phase]} className="sky-moon" />;
}
export function PaperWindow() {
  return <TheatreImage name="window-cutout" />;
}
export function PaperFloor() {
  return (
    <div className="paper-floor-cut">
      <TheatreImage name="backdrop" />
    </div>
  );
}
export function PaperWoods() {
  return <TheatreImage name="woods" />;
}
export function PaperProscenium() {
  return <TheatreImage name="curtain" />;
}
export function KeeperArt({ lit }: { lit: boolean }) {
  return <TheatreImage name="keeper" className={lit ? "lantern-awake" : ""} />;
}
export function PaperBook() {
  return <TheatreImage name="book" />;
}
export function HangingMoon({ phase }: { phase: number }) {
  return <TheatreImage name={MOONS[phase]} />;
}

const SCENERY = {
  keeper: { hanging: "keeper-moths", floor: "keeper-candles" },
  tide: { hanging: "tide-vane", floor: "tide-kit" },
  post: { hanging: "post-instrument", floor: "post-satchel" },
} as const;

export function PaperScenery({
  scene,
  onHangingClick,
}: {
  scene: keyof typeof SCENERY;
  onHangingClick?: () => void;
}) {
  const { hanging, floor } = SCENERY[scene];
  return (
    <>
      {onHangingClick ? (
        <button
          type="button"
          className={`stage-mechanism scenery-hanging scenery-${scene} shop-portal`}
          onClick={onHangingClick}
          aria-label="拨动星盘吊摆，进入栖星占星小店"
        >
          <TheatreImage name={hanging} />
          <small>占星小店 ↗</small>
        </button>
      ) : (
        <div className={`scenery-hanging scenery-${scene}`} aria-hidden="true">
          <TheatreImage name={hanging} />
        </div>
      )}
      <div className={`scenery-floor scenery-${scene}`} aria-hidden="true">
        <TheatreImage name={floor} />
      </div>
    </>
  );
}
