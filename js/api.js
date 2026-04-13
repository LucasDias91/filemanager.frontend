function getToken() {
  const raw = localStorage.getItem(CONFIG.TOKEN_KEY);
  if (raw == null) return null;
  const t = String(raw).trim();
  return t ? t : null;
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

function fmBuildAuthFetch(path, options = {}) {
  const headers = options.headers ? new Headers(options.headers) : new Headers();
  const token = getToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (options.body && !(options.body instanceof FormData)) {
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
  }
  const url = `${CONFIG.API_BASE_URL}${path}`;
  const init = {
    method: options.method || "GET",
    headers,
    body: options.body,
    signal: options.signal,
    cache: options.cache,
  };
  return [url, init];
}

async function apiFetch(path, options = {}) {
  fmBeginLoading();
  try {
    const [url, init] = fmBuildAuthFetch(path, options);
    const res = await fetch(url, init);
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

async function apiFetchResponse(path, options = {}) {
  fmBeginLoading();
  try {
    const [url, init] = fmBuildAuthFetch(path, {
      ...options,
      cache: options.cache ?? "no-store",
    });
    const res = await fetch(url, init);
    if (!res.ok) {
      const text = await res.text();
      let data = null;
      if (text) {
        try {
          data = JSON.parse(text);
        } catch {
          data = text;
        }
      }
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
    return res;
  } finally {
    fmEndLoading();
  }
}
