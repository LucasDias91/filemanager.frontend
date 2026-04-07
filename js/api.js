function getToken() {
  return localStorage.getItem(CONFIG.TOKEN_KEY);
}

function setToken(token) {
  localStorage.setItem(CONFIG.TOKEN_KEY, token);
}

function clearToken() {
  localStorage.removeItem(CONFIG.TOKEN_KEY);
}

async function apiFetch(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  if (options.body && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  const res = await fetch(`${CONFIG.API_BASE_URL}${path}`, {
    ...options,
    headers,
  });
  const text = await res.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }
  if (!res.ok) {
    const detail =
      typeof data === "object" && data !== null && data.detail !== undefined
        ? Array.isArray(data.detail)
          ? data.detail.map((d) => d.msg || d).join(", ")
          : String(data.detail)
        : res.statusText;
    const err = new Error(detail || `HTTP ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return data;
}
