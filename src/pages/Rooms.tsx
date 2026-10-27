import { ROOMS } from "../lib/rooms";
export function Rooms({
  navigate,
  echo,
}: {
  navigate: (path: string) => void;
  echo: () => void;
}) {
  return (
    <div className="page rooms-page">
      <header className="page-intro">
        <span className="eyebrow">THE ATLAS OF QUIET ROOMS · 夜栖地图</span>
        <h1 id="page-title" tabIndex={-1}>
          今夜，想在哪一处停留？
        </h1>
        <p>记录、回望、整理，或只是坐一会儿。每一扇门，都有自己的时间。</p>
      </header>
      <div className="atlas-layout">
        <div className="atlas-engraving" aria-hidden="true">
          <span className="atlas-moon">☾</span>
          <div className="atlas-window">
            <span>夜栖</span>
            <small>
              HOUSE OF
              <br />
              QUIET THINGS
            </small>
            <i>✦</i>
          </div>
          <p>
            不必每次来，
            <br />
            都写一封信。
          </p>
        </div>
        <ol className="room-catalog">
          {ROOMS.map((r, i) => (
            <li key={r.path}>
              <button
                disabled={!r.ready}
                onClick={() => (r.path === "/echo" ? echo() : navigate(r.path))}
              >
                <span className="room-number">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="room-icon" aria-hidden="true">
                  {r.symbol}
                </span>
                <span>
                  <strong>{r.name}</strong>
                  <small>{r.subtitle}</small>
                </span>
                <em>{r.ready ? "进入 ⟶" : "筹备中"}</em>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
