/** Real, selectable Chinese typesetting. SVG strokes are purely decorative. */
export function TitleFlourish({
  kind,
}: {
  kind: "branch" | "binding" | "valance";
}) {
  return (
    <svg
      className={`title-flourish title-flourish--${kind}`}
      viewBox="0 0 300 40"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {kind === "branch" ? (
        <>
          <path d="M8 29c32-20 58 9 99-3 33-10 66-6 102-13 23-4 50-8 81 0M43 26l-8-10m48 14 10-13m36 3-4-13m62 10 6-11m48 1 4-6" />
          <path d="M53 25q-14-16-21-10 5 12 21 10M158 18q-13-14-20-7 5 10 20 7M214 11q8-13 18-9-4 10-18 9" />
          <path
            d="m109 25 9 5-5 7-9-6zm59-7 4-6 6 3-3 7z"
            fill="currentColor"
            stroke="none"
          />
        </>
      ) : kind === "binding" ? (
        <>
          <path d="M4 20h112m68 0h112M4 12v16m292-16v16M15 15h92m86 10h92M127 20l23-13 23 13-23 13z" />
          <path d="M144 13q12 3 5 14 11-2 9-12" />
        </>
      ) : (
        <>
          <path d="M4 8q38 29 73 0 36 30 73 0 36 30 73 0 36 29 73 0M4 3q38 29 73 0 36 30 73 0 36 30 73 0 36 29 73 0M77 8v20m73-20v25m73-25v20" />
          <path
            d="m73 30 4-6 4 6-4 6zm73 4 4-6 4 6-4 6zm73-4 4-6 4 6-4 6z"
            fill="currentColor"
            stroke="none"
          />
        </>
      )}
    </svg>
  );
}

export function MoonlitWordmark() {
  return (
    <h1
      id="page-title"
      tabIndex={-1}
      className="moonlit-wordmark"
      aria-label="夜栖 · 月下树洞"
    >
      <span className="wordmark-name">
        <span>夜</span>
        <span>栖</span>
      </span>
      <span className="wordmark-subtitle">月下树洞</span>
      <TitleFlourish kind="branch" />
      <span className="wordmark-colophon" aria-hidden="true">
        MOONLIT TREEHOLE
      </span>
    </h1>
  );
}

export function SceneTitle({
  title,
  kind,
  caption,
}: {
  title: string;
  kind: "cabinet" | "theatre";
  caption: string;
}) {
  const divider = kind === "cabinet" ? title.indexOf("，") + 1 : 0;
  return (
    <div className={`scene-title scene-title--${kind}`}>
      <span className="title-caption">{caption}</span>
      <h1 id="page-title" tabIndex={-1}>
        <span className="title-initial">{title.slice(0, 1)}</span>
        {divider ? (
          <>
            {title.slice(1, divider)}
            <span className="title-tail">{title.slice(divider)}</span>
          </>
        ) : (
          title.slice(1)
        )}
      </h1>
      <TitleFlourish kind={kind === "cabinet" ? "binding" : "valance"} />
    </div>
  );
}
