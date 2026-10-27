export function StageArt() {
  return (
    <svg
      className="stage-art"
      viewBox="0 0 640 630"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <pattern id="dots" width="13" height="13" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r=".8" fill="#49306f" opacity=".15" />
        </pattern>
        <pattern id="beads" width="5" height="9" patternUnits="userSpaceOnUse">
          <circle cx="2.5" cy="4" r="1.8" fill="#49306f" />
        </pattern>
        <symbol id="star" viewBox="0 0 20 20">
          <path
            d="m10 0 2.5 7.5L20 10l-7.5 2.5L10 20l-2.5-7.5L0 10l7.5-2.5Z"
            fill="currentColor"
          />
        </symbol>
        <symbol id="leaf" viewBox="0 0 30 50">
          <path
            d="M15 48C-8 30 4 13 28 0c-2 20 9 30-13 48Z"
            fill="currentColor"
          />
        </symbol>
      </defs>
      <path d="M108 80Q300-2 532 83L567 473Q330 575 70 488Z" fill="#d8bce8" />
      <path
        d="M130 83Q310 27 520 92L544 473Q325 544 94 476Z"
        fill="url(#dots)"
      />
      <circle
        cx="318"
        cy="243"
        r="157"
        stroke="#92735f"
        strokeWidth="1"
        strokeDasharray="2 8"
      />
      <path d="M193 458V248C190 64 451 47 453 249L465 463Z" fill="#120f18" />
      <path
        d="M212 452V249C208 91 433 78 434 250L444 454"
        stroke="#f3d7df"
        strokeWidth="1.5"
      />
      <path d="M230 444V253C230 119 414 110 416 255L425 447Z" fill="#30204c" />
      <path
        d="M230 444V253C230 119 414 110 416 255L425 447Z"
        fill="url(#dots)"
      />
      <path
        d="M357 174a70 70 0 1 0 23 113c-63 13-95-50-23-113Z"
        fill="#f3d978"
      />
      <path d="M237 432q63-92 180-24l10 49H229Z" fill="#49306f" />
      <path d="M239 449q88-69 178-17l8 30H233Z" fill="#d8bce8" />
      <path
        d="M283 450q-7-98-31-157l-27-29 22 5-9-54 19 60 24 28 21-40-10 60 19 63 38-67-3-38 13 26 27-42-16 48-1 39-44 78 3 32Z"
        fill="#120f18"
      />
      <path
        d="m251 316-33-2-19-24 27 12 19-3m63 83 39-5 23-25-10 30-44 17"
        stroke="#120f18"
        strokeWidth="9"
      />
      <path
        d="M173 473q-40-59-53-138l-22-30 19 12-8-64 25 82 18-33-9 61 26 61 8-47 8 63 21 41m255-13q59-46 58-100l18-44-4 62 34-29-31 46-31 56"
        fill="#120f18"
      />
      <path
        d="M83 497q44-24 81-15 46-25 90-7 63-16 114 2 70-21 110 4 39-13 77 7l-11 26q-15 21-24-2-13-20-17 12-5 32-17 1-6-19-16-7-9 17-14 0-10-13-20 0-10 40-22 2-7-16-13 5-10 24-19 0-11-10-20 5-8 16-16-3-16-23-27 2-9 27-19-1-9-17-23-4-10 20-18-6-12-20-20-1-13 23-20-4-12-12-19 6-11 24-20-3-9-17-20 2-12 22-19-2-7-20-19-5-13 14-20-11Z"
        fill="#120f18"
      />
      <path
        d="M147 0v117m354-99v157M91 95v83"
        stroke="#49306f"
        strokeWidth="1"
      />
      <path d="M145 0h5v100h-5m354-82h5v132h-5" fill="url(#beads)" />
      <g color="#fff5e9">
        <use href="#star" x="132" y="100" width="31" height="31" />
        <use href="#star" x="484" y="149" width="35" height="35" />
      </g>
      <g color="#49306f">
        <use href="#star" x="83" y="173" width="16" height="16" />
        <use href="#star" x="464" y="286" width="16" height="16" />
        <use href="#star" x="176" y="218" width="13" height="13" />
      </g>
      <g color="#fff5e9">
        <use href="#star" x="369" y="228" width="14" height="14" />
        <use href="#star" x="273" y="177" width="9" height="9" />
        <use href="#star" x="393" y="300" width="9" height="9" />
      </g>
      <g className="floating-letter">
        <path d="m116 223 64 14-11 44-65-15Z" fill="#fff5e9" stroke="#49306f" />
        <path
          d="m116 223 24 32 40-18m-76 29 29-17m36 32-20-30"
          stroke="#92735f"
        />
        <circle cx="140" cy="255" r="6" fill="#b83d43" />
      </g>
      <g className="floating-letter second">
        <path d="m470 353 59-15 10 41-58 16Z" fill="#fff5e9" stroke="#49306f" />
        <path
          d="m470 353 36 17 23-32m-48 57 18-28m40 12-30-15"
          stroke="#92735f"
        />
        <circle cx="506" cy="368" r="6" fill="#b83d43" />
      </g>
      <g color="#b83d43">
        <use
          href="#leaf"
          x="174"
          y="368"
          width="15"
          height="26"
          transform="rotate(-30 181 380)"
        />
        <use
          href="#leaf"
          x="460"
          y="222"
          width="13"
          height="23"
          transform="rotate(35 466 233)"
        />
      </g>
      <path d="M304 103h36m-18-15v31" stroke="#f3d978" />
      <circle cx="322" cy="104" r="10" stroke="#f3d978" />
      <text
        x="322"
        y="567"
        textAnchor="middle"
        fill="#49306f"
        fontSize="10"
        letterSpacing="5"
        fontFamily="Georgia,serif"
      >
        THE THINGS WE LEAVE TO THE MOON
      </text>
      <path d="M200 591h95m54 0h95" stroke="#92735f" opacity=".5" />
      <path d="m322 584 7 7-7 7-7-7Z" fill="#b83d43" />
    </svg>
  );
}
