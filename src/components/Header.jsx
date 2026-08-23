import SearchBar from "./SearchBar";

export default function Header({
  title,
  searchValue,
  onSearchChange,
  onUploadClick,
  onMenuClick
}) {
  return (
    <header className="header">
      <button
        type="button"
        className="header-menu-btn"
        onClick={onMenuClick}
        aria-label="Open navigation"
      >
        <svg viewBox="0 0 20 20" width="20" height="20" fill="none">
          <path
            d="M3 5.5h14M3 10h14M3 14.5h14"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </button>

      <h1 className="header-title">{title}</h1>

      <div className="header-actions">
        <SearchBar value={searchValue} onChange={onSearchChange} />
        <button type="button" className="btn btn-primary" onClick={onUploadClick}>
          <svg viewBox="0 0 20 20" width="16" height="16" fill="none" aria-hidden="true">
            <path
              d="M10 3.3v9.4M6 7.7 10 3.3l4 4.4M4 15.5v.7a1.3 1.3 0 0 0 1.3 1.3h9.4a1.3 1.3 0 0 0 1.3-1.3v-.7"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Upload</span>
        </button>
      </div>
    </header>
  );
}
