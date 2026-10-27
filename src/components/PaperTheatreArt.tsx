/** Original cut-paper scenery and the lantern-headed keeper, created for 夜栖. */
export function PaperSky({ phase }: { phase: number }) {
  return (
    <svg
      viewBox="0 0 1000 640"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <path d="M0 0h1000v640H0Z" fill="#30243f" />
      <path
        d="M198 560V204Q198 88 500 23q302 65 302 181v356Z"
        fill={phase === 2 ? "#baa4cc" : phase === 1 ? "#9680ae" : "#76628d"}
        stroke="#120f18"
        strokeWidth="24"
      />
      <path
        d="M221 549V207Q221 112 500 48q279 64 279 159v342Z"
        fill="none"
        stroke="#d8bce8"
        strokeWidth="2"
      />
      <path
        d="M238 212q262-78 524 0M500 49v140M330 103l170 86 170-86m-340 0v88m340-88v88"
        stroke="#120f18"
        strokeWidth="8"
      />
      <circle cx="508" cy="280" r="88" fill="#f3d978" />
      {phase !== 2 && (
        <path
          d={
            phase === 1
              ? "M508 192a88 88 0 0 1 0 176Z"
              : "M547 195a88 88 0 0 1 26 151c-93 10-127-87-26-151Z"
          }
          fill="#76628d"
        />
      )}
      <g fill="#fff5e9">
        {[
          [302, 268],
          [701, 304],
          [647, 199],
          [377, 387],
          [615, 376],
        ].map(([x, y]) => (
          <path key={x} d={`m${x} ${y} 3 10 10 3-10 3-3 10-3-10-10-3 10-3Z`} />
        ))}
      </g>
      <path
        d="M0 497q115-59 227-22 179-63 303-17 193-45 470 25v157H0Z"
        fill="#594365"
      />
      <path d="M0 558q215-55 397-16 174-59 603 17v81H0Z" fill="#927b91" />
      <path
        d="M75 619q420-78 850 0M146 599q354-58 708 0"
        stroke="#d8bce8"
        fill="none"
        strokeWidth="2"
      />
    </svg>
  );
}
export function PaperWoods() {
  return (
    <svg
      viewBox="0 0 1000 640"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <path
        d="M77 578Q8 422 62 315q10-47-32-114 64 35 57 99l41-63-23 90q-18 50 1 96 45-73 36-135 47 64-14 172l62 118Zm780 0q94-118 51-255-25-55 13-127-10 62 18 101 40-32 48-66 12 60-35 108 30 74-21 191l44-20-26 68Z"
        fill="#120f18"
        stroke="#92735f"
        strokeWidth="3"
      />
      <path
        d="M92 441Q39 427 8 390m120 59q50-19 72-69m719 64q64-8 81-48M91 330q-55-8-60-53m897 51q-53-10-60-52"
        stroke="#120f18"
        strokeWidth="12"
      />
      <path
        d="M103 575q50-52 90-19l-23 25m646-6q-47-58-83-13l22 17"
        fill="#30204c"
        stroke="#120f18"
        strokeWidth="4"
      />
      <path
        d="M184 571v-26m-17 0q17-35 34 0Zm605 8v-29m-16 0q16-37 32 0Z"
        fill="#f3d7df"
        stroke="#120f18"
        strokeWidth="3"
      />
      <path
        d="M237 568q-3-51 21-77-4 53 22 73m466 3q13-53-10-85-1 49-28 83"
        stroke="#120f18"
        strokeWidth="9"
        fill="none"
      />
    </svg>
  );
}
export function PaperProscenium() {
  return (
    <svg viewBox="0 0 1000 640" preserveAspectRatio="none" aria-hidden="true">
      <path
        d="M0 0h1000v51Q873 135 761 43 642 132 500 39 358 133 239 43 127 136 0 51Z"
        fill="#49305d"
        stroke="#92735f"
        strokeWidth="3"
      />
      <path
        d="M0 0h76q48 96-24 249L0 357Zm1000 0h-76q-48 96 24 249l52 108Z"
        fill="#120f18"
        stroke="#92735f"
        strokeWidth="3"
      />
      <path
        d="M23 17q73 76-3 247m957-247q-73 76 3 247M1 24q126 100 238 0 130 93 261 0 137 94 261 0 114 101 239 0"
        fill="none"
        stroke="#d8bce8"
        strokeWidth="1.4"
      />
      <path
        d="M0 595q78-41 163 14l60 31H0Zm1000 0q-78-41-163 14l-60 31h223Z"
        fill="#120f18"
        stroke="#92735f"
        strokeWidth="3"
      />
      <path d="M0 627h1000v13H0Z" fill="#120f18" />
      <g fill="#fff5e9" stroke="#92735f">
        {[111, 890].map((x) => (
          <g key={x}>
            <path
              d={`M${x} 586q-23-12-9-26 18-4 14 16 12-20 24-5 3 18-18 16 22 11 7 23-20-1-15-18-11 19-24 4-3-16 21-10Z`}
            />
            <circle cx={x + 4} cy="585" r="3" fill="#f3d978" />
          </g>
        ))}
      </g>
    </svg>
  );
}
export function KeeperArt({ lit }: { lit: boolean }) {
  return (
    <svg viewBox="0 0 170 290" aria-hidden="true" fill="none">
      <path
        d="m76 8 48 24-6 57-36 20-37-28 3-51Z"
        fill={lit ? "#f3d978" : "#fff5e9"}
        stroke="#120f18"
        strokeWidth="4"
      />
      <path
        d="m76 8 4 43 44-19M48 30l32 21 38 38m-73-8 35-30 2 58"
        stroke="#92735f"
        strokeWidth="2"
      />
      <path d="m60 61 15 3m15 1 14-4" stroke="#120f18" strokeWidth="4" />
      <path
        d="m72 110-25 8-28 122 57 30 63-24-31-127Z"
        fill="#30204c"
        stroke="#120f18"
        strokeWidth="5"
      />
      <path
        d="m72 110 4 160 31-151-13 17Zm4 160 63-24-31-127-5 106Z"
        fill="#49306f"
      />
      <path
        d="m47 118 28 22 33-21-13-10-20 14-12-15Z"
        fill="#f3d7df"
        stroke="#120f18"
        strokeWidth="2"
      />
      <path
        d="m26 219 20 14 19-5 12 16 20-15 20 3 17-12"
        stroke="#d8bce8"
        strokeWidth="3"
      />
      <path d="m76 140-9 15 9 15 9-15Z" fill="#b83d43" stroke="#92735f" />
      <path
        d="m47 139-23 23-14-9-7 8 22 24 30-20m52-26 18 30 27-7 5 11-38 14-20-19"
        fill="#49306f"
        stroke="#120f18"
        strokeWidth="4"
      />
      <circle
        cx="17"
        cy="151"
        r="9"
        fill="#f3d978"
        stroke="#120f18"
        strokeWidth="3"
      />
      <path d="M17 159v27h11v-7H17m0-6h8" stroke="#f3d978" strokeWidth="4" />
      <path
        d="m133 145 28 4-2 28-28-5Z"
        fill="#f3d7df"
        stroke="#120f18"
        strokeWidth="3"
      />
      <path
        d="m52 263-5 19 25-2 6-12m18 0 4 14 29-1-12-22"
        fill="#120f18"
        stroke="#92735f"
        strokeWidth="2"
      />
    </svg>
  );
}
export function PaperBook() {
  return (
    <svg viewBox="0 0 160 100" aria-hidden="true">
      <path
        d="m8 24 62-13 77 19-7 60-71-18-63 9Z"
        fill="#92735f"
        stroke="#120f18"
        strokeWidth="4"
      />
      <path
        d="m13 15 57-8 74 16-7 54-68-16-58 11Z"
        fill="#fff5e9"
        stroke="#120f18"
        strokeWidth="3"
      />
      <path
        d="m70 7-1 54m-42-35 28-4m-30 16 28-4m-29 16 28-4m33-24 39 8m-40 4 39 8m-40 4 39 8"
        stroke="#92735f"
        fill="none"
      />
      <path d="m101 28-3 35 9-6 6 10 3-35Z" fill="#b83d43" />
    </svg>
  );
}
