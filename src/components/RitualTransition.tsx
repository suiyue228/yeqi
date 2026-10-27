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
      style={
        {
          "--ritual-close": `${RITUAL_TIMING.close}ms`,
          "--ritual-reveal": `${RITUAL_TIMING.reveal}ms`,
        } as CSSProperties
      }
    >
      <div className="ritual-wing ritual-wing-left">
        <Embroidery />
      </div>
      <div className="ritual-wing ritual-wing-right">
        <Embroidery />
      </div>
      <div className="ritual-emblem">
        <span>{mark}</span>
        <i>☾</i>
        <p>{label}</p>
        <small>{caption}</small>
      </div>
    </div>
  );
}
import { useId } from "react";
import type { CSSProperties } from "react";
import { RITUAL_TIMING } from "../lib/ritual";
function Embroidery() {
  const id = useId();
  return (
    <svg
      className="curtain-embroidery"
      viewBox="0 0 400 800"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <pattern id={id} width="66" height="110" patternUnits="userSpaceOnUse">
          <path
            d="M33 110C-14 76 80 44 33 0M33 110C80 76-14 44 33 0m0 25q-24-10-15 12 19 8 15-12m0 42q25-12 16 12-20 7-16-12"
            fill="none"
            stroke="#b49a93"
            strokeWidth=".8"
          />
          <path d="m33 42 5 7-5 7-5-7Z" fill="#92735f" />
        </pattern>
      </defs>
      <path d="M20 0h360v800H20Z" fill={`url(#${id})`} opacity=".38" />
      <path
        d="M29 17v741q170 49 342 0V17M44 17v729q155 43 312 0V17"
        stroke="#b49a93"
        fill="none"
      />
      <path
        d="M0 30q95 102 200 0 105 102 200 0M0 40q95 102 200 0 105 102 200 0"
        stroke="#b49a93"
        fill="none"
      />
      <path
        d="M200 38v93m-8 0 8 23 8-23-8-14Z"
        fill="#f3d978"
        stroke="#92735f"
      />
      <circle cx="200" cy="100" r="12" stroke="#d8bce8" />
      <path
        d="M76 741v38m62-30v42m62-37v44m62-49v42m62-50v38"
        stroke="#d8bce8"
        strokeDasharray="2 3"
      />
    </svg>
  );
}
