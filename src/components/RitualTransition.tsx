export type RitualKind = "curtain" | "cabinet" | "letter" | "oracle" | "gate";
export interface RitualState {
  kind: RitualKind;
  phase: "closing" | "opening";
}
const words: Record<RitualKind, [string, string, string]> = {
  curtain: ["II", "展开一张，写给月亮的纸。", "THE WRITING CHAMBER"],
  cabinet: ["III", "轻启暗柜，让旧日重新有声。", "THE CABINET OF MEMORIES"],
  letter: ["✦", "解开封印，听一封信的低语。", "A SEALED FRAGMENT"],
  oracle: ["IV", "拨动星盘，与从前的自己相逢。", "THE LUNAR ORACLE"],
  gate: ["I", "穿过月影，回到树洞深处。", "BEYOND THE MOON GATE"],
};
export function RitualTransition({ state }: { state: RitualState | null }) {
  if (!state) return null;
  const [mark, label, caption] = words[state.kind];
  return (
    <div
      className={`ritual-transition ritual-${state.kind} ritual-${state.phase}`}
      data-testid="ritual-transition"
      data-kind={state.kind}
      aria-hidden="true"
    >
      <div className="ritual-wing ritual-wing-left" />
      <div className="ritual-wing ritual-wing-right" />
      <div className="ritual-emblem">
        <span>{mark}</span>
        <i>☾</i>
        <p>{label}</p>
        <small>{caption}</small>
      </div>
    </div>
  );
}
