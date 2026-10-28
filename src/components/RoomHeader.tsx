import { SceneTitle } from "./TitleArt";

export function RoomHeader({
  chapter,
  title,
  intro,
  navigate,
  titleArt,
}: {
  chapter: string;
  title: string;
  intro: string;
  navigate: (path: string) => void;
  titleArt?: "theatre";
}) {
  return (
    <header className="page-intro module-intro">
      <button
        className="text-button room-return"
        onClick={() => navigate("/rooms")}
      >
        ← 返回夜栖地图
      </button>
      <span className="eyebrow">{chapter}</span>
      {titleArt ? (
        <SceneTitle kind={titleArt} title={title} caption="月下小剧场" />
      ) : (
        <h1 id="page-title" tabIndex={-1}>
          {title}
        </h1>
      )}
      <p>{intro}</p>
    </header>
  );
}
