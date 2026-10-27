import { useEffect, useRef } from "react";
import { ReleaseSeal } from "./SceneArt";
export function ConfirmDialog({
  onCancel,
  onConfirm,
  error,
  mode = "delete",
}: {
  onCancel: () => void;
  onConfirm: () => void;
  error: string;
  mode?: "delete" | "discard";
}) {
  const ref = useRef<HTMLDialogElement>(null);
  // Capture the opener before React applies autoFocus to the dialog's button.
  const returnFocus = useRef(document.activeElement as HTMLElement | null);
  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    return () => {
      dialog?.close();
      if (returnFocus.current?.isConnected) returnFocus.current.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className={`confirm-dialog ritual-dialog dialog-${mode}`}
      onCancel={(e) => {
        e.preventDefault();
        onCancel();
      }}
      aria-labelledby="confirm-title"
    >
      <span className="eyebrow">
        {mode === "delete" ? "THE HOLLOW KEEPS NO ASHES" : "AN UNSEALED LETTER"}
      </span>
      <ReleaseSeal />
      <h2 id="confirm-title">
        {mode === "delete" ? "把这封梦笺，交还树洞？" : "这封信，还没有封好。"}
      </h2>
      <p>
        {mode === "delete"
          ? "投入树洞后，将永久删除这段记录。"
          : "离开后，尚未保存的内容将被放弃。"}
        <br />
        {mode === "delete"
          ? "若仍有不舍，请先取消并导出备份。"
          : "可以继续落笔，再把心事交给月亮。"}
      </p>
      {error && (
        <p role="alert" className="form-error">
          {error}
        </p>
      )}
      <div className="dialog-actions">
        <button className="button outline-button" onClick={onCancel} autoFocus>
          {mode === "delete" ? "再留一会儿" : "继续写信"}
        </button>
        <button className="button danger-button" onClick={onConfirm}>
          {mode === "delete" ? "确认删除" : "放弃修改并离开"}
        </button>
      </div>
    </dialog>
  );
}
