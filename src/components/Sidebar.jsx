const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: "grid" },
  { key: "files", label: "My Files", icon: "folder" },
  { key: "settings", label: "Settings", icon: "gear" }
];

const ICONS = {
  grid: (
    <svg viewBox="0 0 20 20" width="18" height="18" fill="none">
      <rect x="2.5" y="2.5" width="6" height="6" rx="1.4" stroke="currentColor" strokeWidth="1.6" />
      <rect x="11.5" y="2.5" width="6" height="6" rx="1.4" stroke="currentColor" strokeWidth="1.6" />
      <rect x="2.5" y="11.5" width="6" height="6" rx="1.4" stroke="currentColor" strokeWidth="1.6" />
      <rect x="11.5" y="11.5" width="6" height="6" rx="1.4" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ),
  folder: (
    <svg viewBox="0 0 20 20" width="18" height="18" fill="none">
      <path
        d="M2.5 5.8a1.8 1.8 0 0 1 1.8-1.8H8l1.6 1.8h6.1a1.8 1.8 0 0 1 1.8 1.8v6.4a1.8 1.8 0 0 1-1.8 1.8H4.3a1.8 1.8 0 0 1-1.8-1.8V5.8Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  ),
  gear: (
    <svg viewBox="0 0 20 20" width="18" height="18" fill="none">
      <circle cx="10" cy="10" r="2.6" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M10 2.8v1.6M10 15.6v1.6M17.2 10h-1.6M4.4 10H2.8M15.1 4.9l-1.1 1.1M6 14l-1.1 1.1M15.1 15.1 14 14M6 6 4.9 4.9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
};

export default function Sidebar({ activeSection, onNavigate, isOpen, onClose }) {
  return (
    <>
      {isOpen && <div className="sidebar-scrim" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-brand">
          <span className="sidebar-brand-mark">CS</span>
          <span className="sidebar-brand-name">Cloud Storage</span>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              type="button"
              className={`sidebar-nav-item ${
                activeSection === item.key ? "sidebar-nav-item-active" : ""
              }`}
              onClick={() => {
                onNavigate(item.key);
                onClose?.();
              }}
            >
              {ICONS[item.icon]}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <p className="sidebar-open-note">
            Open access &mdash; no account needed. Anyone with this link can see
            these files.
          </p>
        </div>
      </aside>
    </>
  );
}
