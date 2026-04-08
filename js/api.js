function getToken() {
  return localStorage.getItem(CONFIG.TOKEN_KEY);
}

function setToken(token) {
  localStorage.setItem(CONFIG.TOKEN_KEY, token);
}

function clearToken() {
  localStorage.removeItem(CONFIG.TOKEN_KEY);
}

let fmLoadingCount = 0;

function getFMLoadingOverlay() {
  let el = document.getElementById("fm-global-loading");
  if (!el && typeof document !== "undefined" && document.body) {
    el = document.createElement("div");
    el.id = "fm-global-loading";
    el.className = "fm-global-loading d-none";
    el.setAttribute("aria-live", "polite");
    el.innerHTML =
      '<div class="d-flex flex-column align-items-center gap-2">' +
      '<div class="spinner-border text-primary" style="width: 3rem; height: 3rem" role="status">' +
      '<span class="visually-hidden">Carregando…</span></div>' +
      '<span class="small text-muted" aria-hidden="true">Carregando…</span></div>';
    document.body.appendChild(el);
  }
  return el;
}

function fmBeginLoading() {
  fmLoadingCount += 1;
  const el = getFMLoadingOverlay();
  if (el) {
    el.classList.remove("d-none");
    document.body.classList.add("fm-loading");
  }
}

function fmEndLoading() {
  fmLoadingCount = Math.max(0, fmLoadingCount - 1);
  if (fmLoadingCount === 0) {
    const el = document.getElementById("fm-global-loading");
    if (el) el.classList.add("d-none");
    document.body.classList.remove("fm-loading");
  }
}

async function apiFetch(path, options = {}) {
  fmBeginLoading();
  try {
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
  } finally {
    fmEndLoading();
  }
}
