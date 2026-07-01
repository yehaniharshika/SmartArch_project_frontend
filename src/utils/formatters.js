/**
 * SmartArch — Formatters
 * Utility functions for formatting display values.
 */

/** Format a number to fixed decimals with unit */
export const fmt = {
  m2:    (v) => `${(+v || 0).toFixed(2)} m²`,
  ft2:   (v) => `${(+v || 0).toFixed(0)} ft²`,
  m:     (v) => `${(+v || 0).toFixed(2)} m`,
  pct:   (v) => `${Math.round((+v || 0) * 100)}%`,
  kb:    (v) => `${((+v || 0) / 1024).toFixed(1)} KB`,
  mb:    (v) => `${((+v || 0) / (1024 * 1024)).toFixed(1)} MB`,
  count: (v) => String(+v || 0),
  pad2:  (v) => String(+v || 0).padStart(2, "0"),
};

/** Format ISO date string to readable */
export function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  });
}

/** Format seconds to "Xm Ys" */
export function formatDuration(sec) {
  if (!sec) return "—";
  const s = Math.round(sec);
  if (s < 60) return `${s}s`;
  return `${Math.floor(s / 60)}m ${s % 60}s`;
}

/** Get file extension (uppercase) */
export function fileExt(filename) {
  return (filename || "").split(".").pop().toUpperCase();
}

/** Truncate filename for display */
export function truncFilename(name, max = 30) {
  if (!name || name.length <= max) return name;
  const ext = name.split(".").pop();
  const base = name.slice(0, max - ext.length - 4);
  return `${base}…${ext}`;
}

/** Current time as HH:MM */
export function timeNow() {
  return new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}
