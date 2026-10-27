import type { Entry } from "../types";
import { moodOf } from "../types";
import { formatDate } from "../lib/entries";
export function EntrySlip({
  entry,
  onOpen,
  index = 0,
}: {
  entry: Entry;
  onOpen: () => void;
  index?: number;
}) {
  const mood = moodOf(entry.mood);
  return (
    <button
      className={`entry-slip slip-${index % 3} mood-${entry.mood}`}
      onClick={onOpen}
    >
      <span className="slip-meta">
        <span>{formatDate(entry.occurredAt)}</span>
        <span>
          {mood.symbol} {mood.name}
        </span>
      </span>
      <strong>{entry.title || "一封无题梦笺"}</strong>
      <p>{entry.body.slice(0, 130)}</p>
      <span className="slip-bottom">
        <span>
          {entry.tags.length
            ? entry.tags.map((t) => `#${t}`).join("  ")
            : "封存于月光里"}
        </span>
        <span aria-hidden="true">↗</span>
      </span>
    </button>
  );
}
