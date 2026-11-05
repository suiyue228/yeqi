import { TheatreImage } from "./PaperTheatreArt";

export function TheatrePassage({
  kind,
  destination,
  onEnter,
  theme = "tide",
}: {
  kind: "door" | "window";
  destination: string;
  onEnter: () => void;
  theme?: "tide" | "post" | "oracle";
}) {
  const action = kind === "window" ? "推开窗扇" : "打开返场门";
  return (
    <button
      type="button"
      className={`stage-mechanism theatre-passage passage-${kind} passage-theme-${theme}`}
      aria-label={`${action}，前往${destination}`}
      onClick={onEnter}
    >
      <TheatreImage
        name={kind === "window" ? "passage-window" : `${theme}-return`}
      />
      <small>
        <span>
          {action} <i aria-hidden="true">↗</i>
        </span>
        <strong>{destination}</strong>
      </small>
    </button>
  );
}
