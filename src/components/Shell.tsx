import type { ReactNode } from "react";
import { AudioControls } from "./AudioControls";
type Props = {
  path: string;
  navigate: (path: string) => void;
  echo: () => void;
  backup: () => void;
  children: ReactNode;
  busy: boolean;
};
export function Shell({ path, navigate, echo, backup, children, busy }: Props) {
  return (
    <div className="app-shell" inert={busy}>
      <a
        className="skip-link"
        href="#main-content"
        onClick={(e) => {
          e.preventDefault();
          document.querySelector<HTMLElement>("#page-title")?.focus();
        }}
      >
        跳至主要内容
      </a>
      <aside className="sidebar">
        <button
          className="brand"
          onClick={() => navigate("/")}
          aria-label="夜栖，返回记忆之门"
        >
          <span className="brand-moon">☾</span>
          <span>夜 栖</span>
          <small>YE QI</small>
        </button>
        <span className="rail-line" aria-hidden="true" />
        <nav aria-label="主导航">
          {[
            ["/", "01", "记忆之门", "◐"],
            ["/write", "02", "写下心情", "✎"],
            ["/archive", "03", "记忆档案", "▤"],
          ].map(([url, n, label, icon]) => (
            <button
              key={url}
              className={`nav-item ${path === url ? "active" : ""}`}
              aria-current={path === url ? "page" : undefined}
              onClick={() => navigate(url)}
            >
              <small>{n}</small>
              <span aria-hidden="true">{icon}</span>
              <span>{label}</span>
            </button>
          ))}
          <button
            className={`nav-item ${path.startsWith("/echo") ? "active" : ""}`}
            onClick={echo}
          >
            <small>04</small>
            <span aria-hidden="true">✧</span>
            <span>今夜回响</span>
          </button>
        </nav>
        <div className="sidebar-bottom">
          <span className="private-mark">◈ 只属于你的夜晚</span>
          <button onClick={backup}>↓ 导出记忆</button>
          <button onClick={() => navigate("/privacy")}>隐私与备份</button>
          <small>NOCTURNE / 月下树洞</small>
        </div>
      </aside>
      <div
        className={`world scene-${path === "/" ? "home" : path.split("/")[1]}`}
      >
        <header className="topline">
          <span>
            MOONLIT TREEHOLE <i>／</i> 私 人 记 忆 藏 所
          </span>
          <span>
            <b aria-hidden="true">✦</b> 此处，容得下所有心事
          </span>
          <AudioControls />
        </header>
        <main id="main-content">{children}</main>
        <footer className="world-footer">
          <div className="mobile-tools">
            <button onClick={backup}>↓ 导出记忆</button>
            <button onClick={() => navigate("/privacy")}>隐私与备份</button>
          </div>
          <span>把喧嚣留在门外，把自己还给月亮。</span>
          <span>
            LOCAL ONLY <span aria-hidden="true">✧</span> 慢慢写，不必着急
          </span>
        </footer>
      </div>
    </div>
  );
}
