import { DecorativeArt } from "./DecorativeArt";
/** Original scene props, kept decorative so all controls stay in semantic HTML. */
export function MoonPhases() {
  return (
    <div className="moon-procession" aria-hidden="true">
      <span>●</span>
      <span>◕</span>
      <span>◐</span>
      <span>☾</span>
      <i>✦</i>
      <span>☽</span>
      <span>◑</span>
      <span>◔</span>
      <span>●</span>
    </div>
  );
}
export function TheaterFrame() {
  return (
    <svg
      className="theater-frame"
      viewBox="0 0 1200 660"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <pattern id="lace" width="32" height="24" patternUnits="userSpaceOnUse">
          <path
            d="M0 0q0 22 16 22T32 0M4 0q0 16 12 16T28 0"
            fill="none"
            stroke="#d8bce8"
            strokeWidth=".8"
          />
          <circle cx="16" cy="12" r="2" fill="#f3d7df" />
        </pattern>
      </defs>
      <path
        d="M0 0h1200v30Q1090 117 1000 42q-100 78-200-5Q700 105 600 35 500 105 400 37 300 120 200 42 100 120 0 30Z"
        fill="#30204c"
      />
      <path
        d="M0 20Q120 128 210 35m190 0q100 87 200 0m200 0q100 83 200 0"
        stroke="#92735f"
        fill="none"
      />
      <path
        d="M0 0h82Q74 110 29 189L0 260ZM1200 0h-82q8 110 53 189l29 71Z"
        fill="#120f18"
      />
      <path
        d="M20 0Q85 66 12 195m1168-195q-65 66 8 195"
        stroke="#49306f"
        strokeWidth="10"
        fill="none"
      />
      <path d="M0 5h1200v24H0Z" fill="url(#lace)" />
      <path
        d="M1 630q80-15 130 20l43 10H0Zm1199-20q-90 12-143 50h143Z"
        fill="#120f18"
      />
      <path
        d="m30 211 17 9-19 6-9 24-5-27-13-9 19-1 10-20Zm1140 0 16 10-18 4-7 27-6-25-19-10 23-2Z"
        fill="#b83d43"
      />
      <path d="M80 16v54m1040-54v60" stroke="#92735f" />
      <path d="m80 67 5 12-5 12-5-12Zm1040 7 5 12-5 12-5-12Z" fill="#f3d978" />
    </svg>
  );
}
export function DeskRelic() {
  return <DecorativeArt kind="writing-relic" className="desk-relic" />;
}
export function CabinetCrest() {
  return <DecorativeArt kind="archive-cabinet" className="cabinet-crest" />;
}
export function EchoDial({ empty = false }: { empty?: boolean }) {
  return (
    <div
      className={`oracle-device ${empty ? "oracle-empty" : ""}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 340 340" fill="none">
        <circle cx="170" cy="170" r="149" stroke="#92735f" />
        <circle
          cx="170"
          cy="170"
          r="139"
          stroke="#d8bce8"
          strokeDasharray="1 10"
        />
        <g className="oracle-orbit">
          <circle cx="170" cy="170" r="115" stroke="#92735f" />
          <path d="m170 37 116 200H54Zm0 266L54 103h232Z" stroke="#92735f" />
          <circle cx="170" cy="38" r="7" fill="#f3d978" />
          <circle cx="56" cy="235" r="5" fill="#b83d43" />
        </g>
        <circle cx="170" cy="170" r="75" fill="#120f18" stroke="#d8bce8" />
        <path
          d="M187 121a49 49 0 1 0 16 79c-44 8-67-35-16-79Z"
          fill="#f3d978"
        />
        <path d="m205 132 4 11 11 4-11 4-4 11-4-11-11-4 11-4Z" fill="#d8bce8" />
        <path d="M170 5v24m0 282v24M5 170h24m282 0h24" stroke="#f3d7df" />
        <path d="M110 319h120l25 18H85Z" fill="#92735f" />
      </svg>
      <span>MEMORIA · LUNAE</span>
    </div>
  );
}
export function ReleaseSeal() {
  return (
    <svg
      className="release-seal"
      viewBox="0 0 200 120"
      aria-hidden="true"
      fill="none"
    >
      <ellipse
        cx="100"
        cy="86"
        rx="67"
        ry="17"
        fill="#120f18"
        stroke="#92735f"
      />
      <ellipse cx="100" cy="86" rx="46" ry="8" stroke="#49306f" />
      <path d="m71 23 59 8-6 45-58-9Z" fill="#d8bce8" stroke="#92735f" />
      <path d="m71 23 25 28 34-20m-64 36 26-20m32 29-22-26" stroke="#49306f" />
      <circle cx="97" cy="51" r="7" fill="#b83d43" />
      <path d="m151 24 3 8 9 3-9 3-3 9-3-9-8-3 8-3Z" fill="#f3d978" />
      <path d="m45 39 2 5 6 2-6 2-2 6-2-6-5-2 5-2Z" fill="#d8bce8" />
    </svg>
  );
}
