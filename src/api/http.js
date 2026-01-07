// src/lib/http.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
if (!API_BASE_URL) {
    throw new Error("VITE_API_BASE_URL is not defined in .env");
}
/**
 * Generic HTTP helper using Fetch API
 * @param path - endpoint path (e.g., "/leads")
 * @param options - fetch options
 * @returns parsed JSON response of type T
 */
export async function http(path, options = {}) {
    const token = localStorage.getItem("token"); // MUST exist after login
    const res = await fetch(`${API_BASE_URL}/api${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(options.headers || {}),
        },
    });
    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || `HTTP error ${res.status}`);
    }
    return res.json();
}
