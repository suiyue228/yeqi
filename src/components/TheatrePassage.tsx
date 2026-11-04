import { TheatreImage } from "./PaperTheatreArt";

export function TheatrePassage({
  kind,
  destination,
  onEnter,
}: {
  kind: "door" | "window";
  destination: string;
  onEnter: () => void;
}) {
  const action = kind === "window" ? "推开窗扇" : "打开返场门";
  return (
    <button
      type="button"
      className={`stage-mechanism theatre-passage passage-${kind}`}
      aria-label={`${action}，前往${destination}`}
      onClick={onEnter}
    >
      <TheatreImage name={kind === "window" ? "passage-window" : "door"} />
      <small>
        <span>
          {action} <i aria-hidden="true">↗</i>
        </span>
        <strong>{destination}</strong>
      </small>
    </button>
  );
}
