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
import { RitualTransition } from "./components/RitualTransition";
import { ConfirmDialog } from "./components/ConfirmDialog";
import { audio } from "./lib/audio";
import { Rooms } from "./pages/Rooms";
import { useWorkspace } from "./hooks/useWorkspace";
import { Calendar } from "./pages/Calendar";
import { Drafts } from "./pages/Drafts";
import { Wishes } from "./pages/Wishes";
import { Collection } from "./pages/Collection";
import { Theatre } from "./pages/Theatre";
import { TheatreAct } from "./pages/TheatreAct";
export default function App() {
  const data = useEntries();
  const workspace = useWorkspace();
  const {
    path,
    navigate,
    setDirty,
    transition,
    departure,
    confirmDeparture,
    cancelDeparture,
  } = useRoute();
  const [notice, setNotice] = useState("");
  const [actionError, setActionError] = useState("");
  const lastEcho = useRef<string | undefined>(undefined);
  const previousPath = useRef(path);
  useEffect(() => {
    if (transition) return;
    if (previousPath.current !== path)
      document
        .querySelector<HTMLElement>("#page-title")
        ?.focus({ preventScroll: true });
    previousPath.current = path;
    window.scrollTo(0, 0);
  }, [path, transition]);
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
      data.exportData(workspace.backup);
      setNotice("记忆备份已生成，请在浏览器下载中妥善保存。");
      setActionError("");
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "导出失败，请重试。");
    }
  }
  function rawBackup() {
    try {
      data.exportData();
      setNotice("原始记忆数据已导出，请妥善保管。");
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "无法导出原始数据。");
    }
  }
  const id = path.split("/")[2];
  const entry = data.entries.find((e) => e.id === id);
  const draft = workspace.drafts.find((d) => d.id === id);
  function favorite(id: string) {
    try {
      workspace.toggleFavorite(id);
      audio.play("favorite");
      setActionError("");
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "未能更新收藏。");
    }
  }
  let page;
  if (path === "/")
    page = <Home entries={data.entries} navigate={navigate} echo={echo} />;
  else if (
    path === "/write" ||
    (path.startsWith("/edit/") && entry) ||
    (path.startsWith("/draft/") && draft)
  )
    page = (
      <Editor
        key={path}
        entry={path.startsWith("/edit/") ? entry : undefined}
        draft={path.startsWith("/draft/") ? draft : undefined}
        saveDraft={(d) => {
          workspace.saveDraft(d);
          audio.play("save");
          setNotice("碎片已存入草稿匣，可随时回来续写。");
        }}
        draftBlocked={!!workspace.error}
        save={(e) => {
          data.save(e);
          audio.play("save");
          setNotice("梦笺已封存，月亮替你记得。");
          if (path.startsWith("/draft/")) {
            try {
              workspace.removeDraft(id);
            } catch {
              setNotice("正式梦笺已保存；草稿副本暂未移除，请在草稿匣处理。");
            }
          }
        }}
        navigate={navigate}
        setDirty={setDirty}
        blocked={!!data.error}
      />
    );
  else if (path === "/archive")
    page = (
      <Archive
        entries={data.entries}
        navigate={navigate}
        favoriteIds={workspace.favoriteIds}
        favorite={favorite}
        favoriteBlocked={!!workspace.error}
      />
    );
  else if (path === "/rooms") page = <Rooms navigate={navigate} echo={echo} />;
  else if (path === "/calendar")
    page = <Calendar entries={data.entries} navigate={navigate} />;
  else if (path === "/drafts")
    page = (
      <Drafts
        drafts={workspace.drafts}
        save={workspace.saveDraft}
        setDirty={setDirty}
        remove={workspace.removeDraft}
        navigate={navigate}
        blocked={!!workspace.error}
      />
    );
  else if (path === "/wishes")
    page = (
      <Wishes
        wishes={workspace.wishes}
        add={workspace.addWish}
        setDirty={setDirty}
        toggle={workspace.toggleWish}
        navigate={navigate}
        blocked={!!workspace.error}
      />
    );
  else if (path === "/collection")
    page = (
      <Collection
        entries={data.entries}
        favoriteIds={workspace.favoriteIds}
        toggle={favorite}
        navigate={navigate}
        blocked={!!workspace.error}
      />
    );
  else if (path === "/privacy") page = <Privacy backup={backup} />;
  else if (path === "/theatre/tide" || path === "/theatre/post")
    page = (
      <TheatreAct
        key={path}
        act={path === "/theatre/tide" ? "tide" : "post"}
        navigate={navigate}
      />
    );
  else if (path === "/theatre")
    page = (
      <Theatre
        entries={data.entries}
        drafts={workspace.drafts}
        wishes={workspace.wishes}
        navigate={navigate}
        echo={echo}
      />
    );
  else
    page = (
      <Reader
        key={path}
        entry={entry}
        isEcho={path.startsWith("/echo")}
        hasMemories={data.entries.length > 0}
        navigate={navigate}
        remove={(id) => {
          data.remove(id);
          setNotice("这封梦笺已删除。");
        }}
        echo={echo}
        blocked={!!data.error}
        favorite={favorite}
        isFavorite={!!entry && workspace.favoriteIds.includes(entry.id)}
        favoriteBlocked={!!workspace.error}
      />
    );
  return (
    <>
      <Shell
        path={path}
        navigate={navigate}
        echo={echo}
        backup={backup}
        busy={!!transition}
      >
        {data.error && (
          <div className="storage-alert" role="alert">
            {data.error}
            <button onClick={rawBackup}>导出备份</button>
            <button onClick={backup}>导出全部恢复资料</button>
          </div>
        )}
        {workspace.error && (
          <div className="storage-alert" role="alert">
            {workspace.error}
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
      <RitualTransition state={transition} />
      {departure && (
        <ConfirmDialog
          mode="discard"
          onCancel={cancelDeparture}
          onConfirm={confirmDeparture}
          error=""
        />
      )}
    </>
  );
}
