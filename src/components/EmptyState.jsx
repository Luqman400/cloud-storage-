export default function EmptyState({ title, description }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon" aria-hidden="true">
        <svg viewBox="0 0 48 48" width="40" height="40" fill="none">
          <path
            d="M10 16a6 6 0 0 1 6-6h8l6 6h8a6 6 0 0 1 6 6v14a6 6 0 0 1-6 6H16a6 6 0 0 1-6-6V16Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <p className="empty-state-title">{title}</p>
      {description && <p className="empty-state-desc">{description}</p>}
    </div>
  );
}
