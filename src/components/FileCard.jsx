import { useState } from "react";
import {
  formatBytes,
  formatDate,
  getFileExtension,
  isPreviewable,
  isPrintable
} from "../utils/fileHelpers";

export default function FileCard({ file, onDownload, onDelete, onOpen, onPrint }) {
  const [busy, setBusy] = useState(null); // 'download' | 'delete' | 'open' | 'print' | null
  const ext = getFileExtension(file.name) || "file";
  const previewable = isPreviewable(file.name);
  const printable = isPrintable(file.name);

  async function run(action, fn) {
    setBusy(action);
    try {
      await fn();
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="file-card">
      <div className="file-card-top">
        <span className="file-card-badge" aria-hidden="true">
          {ext.slice(0, 4)}
        </span>
        <div className="file-card-meta">
          <p className="file-card-name" title={file.name}>
            {file.name}
          </p>
          <p className="file-card-sub">
            {ext.toUpperCase()} &middot; {formatBytes(file.size)}
          </p>
        </div>
      </div>

      <p className="file-card-date">Uploaded {formatDate(file.createdAt)}</p>

      <div className="file-card-actions">
        <button
          type="button"
          className="btn btn-ghost"
          disabled={busy !== null}
          onClick={() => run("download", () => onDownload(file))}
        >
          {busy === "download" ? "Downloading..." : "Download"}
        </button>

        {previewable && (
          <button
            type="button"
            className="btn btn-ghost"
            disabled={busy !== null}
            onClick={() => run("open", () => onOpen(file))}
          >
            Open
          </button>
        )}

        {printable && (
          <button
            type="button"
            className="btn btn-ghost"
            disabled={busy !== null}
            onClick={() => run("print", () => onPrint(file))}
          >
            Print
          </button>
        )}

        <button
          type="button"
          className="btn btn-ghost btn-danger"
          disabled={busy !== null}
          onClick={() => {
            if (window.confirm(`Delete "${file.name}"? This cannot be undone.`)) {
              run("delete", () => onDelete(file));
            }
          }}
        >
          {busy === "delete" ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
}
