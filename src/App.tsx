import { useEffect, useRef, useState } from "react";
import { useEntries } from "./hooks/useEntries";
import { useRoute } from "./hooks/useRoute";
import { randomEntry } from "./lib/entries";
import { Shell } from "./components/Shell";
import { Home } from "./pages/Home";
import { Editor } from "./pages/Editor";
import { Archive } from "./pages/Archive";
import { Reader } from "./pages/Reader";
import { Privacy } from "./pages/Privacy";
export default function App() {
  const data = useEntries();
  const { path, navigate, setDirty } = useRoute();
  const [notice, setNotice] = useState("");
  const [actionError, setActionError] = useState("");
  const lastEcho = useRef<string | undefined>(undefined);
  const previousPath = useRef(path);
  useEffect(() => {
    if (previousPath.current !== path)
      document
        .querySelector<HTMLElement>("#page-title")
        ?.focus({ preventScroll: true });
    previousPath.current = path;
    window.scrollTo(0, 0);
  }, [path]);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 6000);
    return () => clearTimeout(timer);
  }, [notice]);
  function echo() {
    const picked = randomEntry(data.entries, lastEcho.current);
    lastEcho.current = picked?.id;
    if (picked && path === `/echo/${picked.id}`) {
      setNotice("今夜只有这一封梦笺。再写一段记忆，就会有新的回响。");
      return;
    }
    navigate(picked ? `/echo/${picked.id}` : "/echo");
  }
  function backup() {
    try {
      data.exportData();
      setNotice("记忆备份已生成，请在浏览器下载中妥善保存。");
      setActionError("");
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "导出失败，请重试。");
    }
  }
  const id = path.split("/")[2];
  const entry = data.entries.find((e) => e.id === id);
  let page;
  if (path === "/")
    page = <Home entries={data.entries} navigate={navigate} echo={echo} />;
  else if (path === "/write" || (path.startsWith("/edit/") && entry))
    page = (
      <Editor
        key={path}
        entry={path.startsWith("/edit/") ? entry : undefined}
        save={(e) => {
          data.save(e);
          setNotice("梦笺已封存，月亮替你记得。");
        }}
        navigate={navigate}
        setDirty={setDirty}
        blocked={!!data.error}
      />
    );
  else if (path === "/archive")
    page = <Archive entries={data.entries} navigate={navigate} />;
  else if (path === "/privacy") page = <Privacy backup={backup} />;
  else
    page = (
      <Reader
        key={path}
        entry={entry}
        isEcho={path.startsWith("/echo")}
        navigate={navigate}
        remove={(id) => {
          data.remove(id);
          setNotice("这封梦笺已删除。");
        }}
        echo={echo}
        blocked={!!data.error}
      />
    );
  return (
    <Shell path={path} navigate={navigate} echo={echo} backup={backup}>
      {data.error && (
        <div className="storage-alert" role="alert">
          {data.error}
          <button onClick={backup}>导出备份</button>
        </div>
      )}
      {actionError && (
        <div className="storage-alert" role="alert">
          {actionError}
          <button onClick={() => setActionError("")}>关闭提示</button>
        </div>
      )}
      {page}
      <div className={`toast ${notice ? "visible" : ""}`} role="status">
        {notice}
      </div>
    </Shell>
  );
}
