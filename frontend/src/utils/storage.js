// Small wrappers around localStorage. Private browsing can block it entirely,
// so every call is guarded and simply falls back to "no saved progress".

export function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage unavailable: progress just will not persist.
  }
}
