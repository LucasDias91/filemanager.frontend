/**
 * Navbar das páginas autenticadas (Arquivos / Usuários).
 * Espera um elemento #fm-navbar-root com data-fm-nav="files" | "users".
 */
(function initFmLayout() {
  function render() {
    const root = document.getElementById("fm-navbar-root");
    if (!root) return;

    const active = root.getAttribute("data-fm-nav") === "users" ? "users" : "files";
    const appHref = FM.url("app.html");
    const usuariosHref = FM.url("usuarios.html");

    root.className =
      "fm-content px-3 px-lg-4 d-flex flex-wrap align-items-center justify-content-between";

    const arquivosLi =
      active === "files"
        ? `<li class="nav-item"><a class="nav-link active" href="${FM.escapeAttr(appHref)}" aria-current="page">Arquivos</a></li>`
        : `<li class="nav-item"><a class="nav-link" href="${FM.escapeAttr(appHref)}">Arquivos</a></li>`;

    const usuariosLi =
      active === "users"
        ? `<li class="nav-item"><span class="nav-link active" aria-current="page">Usuários</span></li>`
        : `<li class="nav-item"><a class="nav-link" href="${FM.escapeAttr(usuariosHref)}">Usuários</a></li>`;

    root.innerHTML = `
      <a class="navbar-brand fm-brand" href="${FM.escapeAttr(appHref)}">FileManager</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMain" aria-controls="navMain" aria-expanded="false" aria-label="Menu">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navMain">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          ${arquivosLi}
          ${usuariosLi}
        </ul>
        <button type="button" class="btn btn-outline-secondary btn-sm" id="btn-logout">Sair</button>
      </div>
    `;

    FM.bindLogout();
  }

  render();
})();
