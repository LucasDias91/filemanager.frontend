/**
 * Utilitários e resolução de URLs (raiz vs pasta pages/).
 */
const FM = {
  pathPrefix() {
    const p = window.location.pathname.replace(/\\/g, "/");
    return p.includes("/pages/") ? "../" : "";
  },

  /** Caminho para um ficheiro HTML ou recurso relativo à raiz do frontend. */
  url(path) {
    const p = String(path).replace(/^\//, "");
    return this.pathPrefix() + p;
  },

  requireAuth() {
    if (typeof getToken !== "function" || getToken()) return;
    window.location.href = this.url("index.html");
  },

  redirectOnUnauthorized(err) {
    if (!err || err.status !== 401) return false;
    if (typeof clearToken === "function") clearToken();
    window.location.href = this.url("index.html");
    return true;
  },

  bindLogout() {
    const btn = document.getElementById("btn-logout");
    if (!btn) return;
    btn.addEventListener("click", () => {
      if (typeof clearToken === "function") clearToken();
      window.location.href = this.url("index.html");
    });
  },

  escapeHtml(s) {
    const d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  },

  escapeAttr(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  },

  formatDate(iso) {
    if (!iso) return "—";
    try {
      return new Date(iso).toLocaleString("pt-BR");
    } catch {
      return iso;
    }
  },

  formatBytes(n) {
    if (n === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(n) / Math.log(k));
    return `${parseFloat((n / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  },
};
