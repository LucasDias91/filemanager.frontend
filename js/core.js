/**
 * Utilitários e resolução de URLs (index na raiz; demais HTML em pages/).
 */
const FM = {
  /**
   * Caminho para HTML: use caminho desde a raiz do frontend (ex.: index.html, pages/app.html).
   * Dentro de pages/, links para outras páginas em pages/ ficam no mesmo diretório.
   */
  url(path) {
    const p = String(path).replace(/^\//, "");
    const inPages = window.location.pathname.replace(/\\/g, "/").includes("/pages/");
    if (inPages) {
      if (p === "index.html") return "../index.html";
      if (p.startsWith("pages/")) return p.slice(6);
      return "../" + p;
    }
    return p;
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
