const BASE_URL = "https://whatsapp-automator.onrender.com/api";
export async function http(path, options = {}) {
    const token = localStorage.getItem("token"); // MUST exist after login
    const res = await fetch(`${BASE_URL}${path}`, {
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
