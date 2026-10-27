export function RoomHeader({
  chapter,
  title,
  intro,
  navigate,
}: {
  chapter: string;
  title: string;
  intro: string;
  navigate: (path: string) => void;
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
      <h1 id="page-title" tabIndex={-1}>
        {title}
      </h1>
      <p>{intro}</p>
    </header>
  );
}
