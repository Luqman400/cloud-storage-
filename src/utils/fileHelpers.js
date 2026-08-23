// Small, dependency-free helpers used across the file dashboard.

export function formatBytes(bytes) {
  if (bytes === 0 || bytes === undefined || bytes === null) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );
  const value = bytes / Math.pow(1024, exponent);
  return `${exponent === 0 ? value : value.toFixed(1)} ${units[exponent]}`;
}

export function formatDate(dateString) {
  if (!dateString) return "Unknown";
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

export function getFileExtension(fileName) {
  const parts = fileName.split(".");
  if (parts.length === 1) return "";
  return parts[parts.length - 1].toLowerCase();
}

// File types the browser can usually render inline (Open / Print actions).
const PREVIEWABLE_EXTENSIONS = new Set([
  "pdf",
  "png",
  "jpg",
  "jpeg",
  "gif",
  "webp",
  "svg",
  "txt"
]);

export function isPreviewable(fileName) {
  return PREVIEWABLE_EXTENSIONS.has(getFileExtension(fileName));
}

// Only PDFs and images produce a reliable browser print dialog when opened
// in a new tab. Other previewable types (like .txt) can still be opened.
const PRINTABLE_EXTENSIONS = new Set([
  "pdf",
  "png",
  "jpg",
  "jpeg",
  "gif",
  "webp",
  "svg"
]);

export function isPrintable(fileName) {
  return PRINTABLE_EXTENSIONS.has(getFileExtension(fileName));
}

// Sanitize a file name for use in a Storage path: keep letters, numbers,
// dots, dashes and underscores, replace everything else with "-".
export function sanitizeFileName(fileName) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "-");
}

// Given a desired file name and the list of names already in the folder,
// return a name guaranteed not to collide (e.g. "report (1).pdf").
export function getUniqueFileName(desiredName, existingNames) {
  const nameSet = new Set(existingNames);
  if (!nameSet.has(desiredName)) return desiredName;

  const extIndex = desiredName.lastIndexOf(".");
  const base = extIndex === -1 ? desiredName : desiredName.slice(0, extIndex);
  const ext = extIndex === -1 ? "" : desiredName.slice(extIndex);

  let counter = 1;
  let candidate = `${base} (${counter})${ext}`;
  while (nameSet.has(candidate)) {
    counter += 1;
    candidate = `${base} (${counter})${ext}`;
  }
  return candidate;
}
