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
  return (
    <svg
      className="desk-relic"
      viewBox="0 0 300 220"
      aria-hidden="true"
      fill="none"
    >
      <ellipse cx="165" cy="190" rx="117" ry="12" fill="#120f18" />
      <path
        d="m28 179 109-22 111 25-108 24Z"
        fill="#92735f"
        stroke="#120f18"
        strokeWidth="3"
      />
      <path
        d="m33 168 107-19 108 24-108 20Z"
        fill="#d8bce8"
        stroke="#120f18"
        strokeWidth="3"
      />
      <path
        d="m37 173 103 18 103-17m-102 19v10m-84-33 84-14 72 17-72 14Z"
        stroke="#49306f"
      />
      <path
        d="M181 99h37v65q-18 13-37 0Z"
        fill="#fff5e9"
        stroke="#120f18"
        strokeWidth="3"
      />
      <path d="M185 99q5 17 10 3 3-6 7 3t12-6" stroke="#92735f" />
      <path d="M199 94V75" stroke="#120f18" strokeWidth="3" />
      <path d="M199 34q-22 26 0 41 21-11 0-41Z" fill="#f3d978" />
      <path d="M199 51q-9 15 0 22 9-5 0-22Z" fill="#b83d43" />
      <path d="M166 168h68l-13 12h-41Z" fill="#120f18" />
      <path
        d="m86 145 33-5 11 15-1 20-42 1-9-19Z"
        fill="#120f18"
        stroke="#92735f"
      />
      <ellipse cx="103" cy="144" rx="16" ry="6" fill="#49306f" />
      <path
        d="M104 143Q93 76 153 17q9 73-44 109"
        fill="#f3d7df"
        stroke="#120f18"
        strokeWidth="2"
      />
      <path
        d="m104 143 47-121m-37 89-15-15m23-7-16-15m26-9-8-12m-16 72 25-11m-17-11 25-14m-16-7 23-15"
        stroke="#92735f"
      />
      <path
        d="M245 68v53m-12-17 12 17 12-17m-19 27h14m-11 7h8"
        stroke="#d8bce8"
      />
      <circle cx="245" cy="62" r="9" stroke="#d8bce8" />
      <path d="m36 65 4 11 12 4-12 4-4 12-4-12-11-4 11-4Z" fill="#d8bce8" />
    </svg>
  );
}
export function CabinetCrest() {
  return (
    <svg
      className="cabinet-crest"
      viewBox="0 0 220 180"
      aria-hidden="true"
      fill="none"
    >
      <path
        d="M25 166V62L55 31l22 25 33-44 34 44 22-25 29 31v104Z"
        fill="#120f18"
        stroke="#92735f"
      />
      <path
        d="M38 153V68l17-18 22 24 33-44 34 44 22-24 16 18v85Z"
        stroke="#d8bce8"
      />
      <path
        d="M51 95h118m-118 28h118m-59-48v73"
        stroke="#49306f"
        strokeWidth="2"
      />
      <circle cx="110" cy="88" r="22" fill="#49306f" stroke="#92735f" />
      <path d="M116 75a12 12 0 1 0 6 21c-14 2-20-12-6-21Z" fill="#f3d978" />
      <path d="M102 124v17h17v-7h-8v-10" stroke="#f3d978" strokeWidth="3" />
      <path
        d="m23 17 4 11 11 4-11 4-4 11-4-11-11-4 11-4Zm171 8 3 8 8 3-8 3-3 8-3-8-8-3 8-3Z"
        fill="#d8bce8"
      />
    </svg>
  );
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
