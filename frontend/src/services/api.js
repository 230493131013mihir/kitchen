const API_URL =
  import.meta.env.VITE_API_URL || `${window.location.protocol}//${window.location.hostname}:5000/api`;

export function getToken() {
  return localStorage.getItem("kitcheniq_token");
}

export function saveSession(data) {
  localStorage.setItem("kitcheniq_token", data.token);
  localStorage.setItem("kitcheniq_user", JSON.stringify(data.user));
}

export function clearSession() {
  localStorage.removeItem("kitcheniq_token");
  localStorage.removeItem("kitcheniq_user");
}

export function getUser() {
  const value = localStorage.getItem("kitcheniq_user");
  return value ? JSON.parse(value) : null;
}

export async function api(path, options = {}) {
  const token = getToken();
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }
  return data;
}
