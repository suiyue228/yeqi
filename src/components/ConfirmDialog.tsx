import { useEffect, useRef } from "react";
export function ConfirmDialog({
  onCancel,
  onConfirm,
  error,
}: {
  onCancel: () => void;
  onConfirm: () => void;
  error: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    ref.current?.showModal();
    return () => {
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className="confirm-dialog"
      onCancel={(e) => {
        e.preventDefault();
        onCancel();
      }}
      aria-labelledby="confirm-title"
    >
      <span className="dialog-moon" aria-hidden="true">
        ☾
      </span>
      <h2 id="confirm-title">让这段记忆，随风离开？</h2>
      <p>
        删除后无法从网站找回。
        <br />
        如果仍想留住它，可以先取消并导出备份。
      </p>
      {error && (
        <p role="alert" className="form-error">
          {error}
        </p>
      )}
      <div className="dialog-actions">
        <button className="button outline-button" onClick={onCancel} autoFocus>
          再留一会儿
        </button>
        <button className="button danger-button" onClick={onConfirm}>
          确认删除
        </button>
      </div>
    </dialog>
  );
}
