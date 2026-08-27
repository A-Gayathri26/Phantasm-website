// Base URL for the Express API. In dev, Vite proxies /api to the backend
// (see vite.config.js), so a relative path works out of the box. In
// production you can point this at a deployed API via VITE_API_BASE_URL.
const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

export async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: options.body ? { "Content-Type": "application/json" } : undefined,
    ...options,
  });
  return res;
}
