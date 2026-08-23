import { useRef, useState } from "react";

export default function UploadArea({ onFilesSelected, uploadingFiles }) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files ?? []);
    if (files.length) onFilesSelected(files);
  }

  function handleInputChange(e) {
    const files = Array.from(e.target.files ?? []);
    if (files.length) onFilesSelected(files);
    // reset so selecting the same file again still fires onChange
    e.target.value = "";
  }

  return (
    <div className="upload-area-wrap">
      <div
        className={`upload-area ${isDragging ? "upload-area-dragging" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
      >
        <svg viewBox="0 0 40 40" width="32" height="32" fill="none" aria-hidden="true">
          <path
            d="M20 6.7v18.6M12 15l8-8.3 8 8.3M8 30v1.7A3.3 3.3 0 0 0 11.3 35h17.4a3.3 3.3 0 0 0 3.3-3.3V30"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <p className="upload-area-title">Drag and drop files here</p>
        <p className="upload-area-sub">or click to browse from your computer</p>
        <input
          ref={inputRef}
          id="dashboard-upload-input"
          type="file"
          multiple
          hidden
          onChange={handleInputChange}
        />
      </div>

      {uploadingFiles.length > 0 && (
        <ul className="upload-progress-list">
          {uploadingFiles.map((item) => (
            <li key={item.id} className="upload-progress-item">
              <span className="upload-progress-name">{item.name}</span>
              {item.status === "uploading" && (
                <span className="upload-progress-bar">
                  <span className="upload-progress-bar-fill" />
                </span>
              )}
              {item.status === "error" && (
                <span className="upload-progress-error">{item.error}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
