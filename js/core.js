/**
 * Utilitários e SPA: troca de views sem alterar a URL.
 */
const FM = {
  showView(name) {
    const authShell = document.getElementById("fm-shell-auth");
    const appShell = document.getElementById("fm-shell-app");
    const viewLogin = document.getElementById("fm-view-login");
    const viewCadastro = document.getElementById("fm-view-cadastro");
    const mainFiles = document.getElementById("fm-view-files-main");
    const mainUsers = document.getElementById("fm-view-users-main");
    if (!authShell || !appShell || !viewLogin || !viewCadastro || !mainFiles || !mainUsers) return;

    if (name === "login" || name === "cadastro") {
      if (name === "login" && typeof getToken === "function" && getToken()) {
        this.showView("files");
        return;
      }
      authShell.classList.remove("d-none");
      appShell.classList.add("d-none");
      document.body.className = "fm-auth d-flex align-items-center py-5";
      viewLogin.classList.toggle("d-none", name !== "login");
      viewCadastro.classList.toggle("d-none", name !== "cadastro");
      document.title = name === "login" ? "Entrar — FileManager" : "Cadastro — FileManager";
      return;
    }

    if (name === "files" || name === "users") {
      if (typeof getToken !== "function" || !getToken()) {
        this.showView("login");
        return;
      }
      authShell.classList.add("d-none");
      appShell.classList.remove("d-none");
      document.body.className = "fm-app-body";
      mainFiles.classList.toggle("d-none", name !== "files");
      mainUsers.classList.toggle("d-none", name !== "users");
      document.title =
        name === "files" ? "Arquivos — FileManager" : "Usuários — FileManager";
      if (typeof FM.renderNavbar === "function") {
        FM.renderNavbar(name === "users" ? "users" : "files");
      }
      if (name === "files" && typeof window.fmEnterFilesView === "function") {
        window.fmEnterFilesView();
      }
      if (name === "users" && typeof window.fmEnterUsersView === "function") {
        window.fmEnterUsersView();
      }
    }
  },

  /** Após cadastro bem-sucedido: volta ao login e exibe aviso. */
  goLoginAfterRegister() {
    const success = document.getElementById("login-success");
    if (success) success.classList.remove("d-none");
    this.showView("login");
  },

  initApp() {
    document.body.addEventListener("click", (e) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      const el = t.closest("[data-fm-go]");
      if (!el) return;
      e.preventDefault();
      const go = el.getAttribute("data-fm-go");
      if (go === "login" || go === "cadastro" || go === "files" || go === "users") {
        this.showView(go);
      }
    });
    if (typeof getToken === "function" && getToken()) {
      this.showView("files");
    } else {
      this.showView("login");
    }
  },

  requireAuth() {
    if (typeof getToken !== "function" || getToken()) return true;
    this.showView("login");
    return false;
  },

  redirectOnUnauthorized(err) {
    if (!err || err.status !== 401) return false;
    if (typeof clearToken === "function") clearToken();
    this.showView("login");
    return true;
  },

  bindLogout() {
    const btn = document.getElementById("btn-logout");
    if (!btn) return;
    btn.addEventListener("click", () => {
      if (typeof clearToken === "function") clearToken();
      const success = document.getElementById("login-success");
      if (success) success.classList.add("d-none");
      this.showView("login");
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

  /**
   * URL absoluta do backend (ex.: arquivo em /storage/…) usando CONFIG.API_BASE_URL.
   * Aceita path começando com "/" ou URL já http(s).
   */
  absoluteApiUrl(pathOrFull) {
    if (!pathOrFull) return "";
    const s = String(pathOrFull).trim();
    if (/^https?:\/\//i.test(s)) return s;
    const base =
      typeof CONFIG !== "undefined" && CONFIG.API_BASE_URL
        ? String(CONFIG.API_BASE_URL).replace(/\/$/, "")
        : "";
    if (!base) return s.startsWith("/") ? s : `/${s}`;
    const path = s.startsWith("/") ? s : `/${s}`;
    return `${base}${path}`;
  },
};
