FM.renderNavbar = function renderNavbar(active) {
  const root = document.getElementById("fm-navbar-root");
  if (!root) return;

  const isUsers = active === "users";

  root.className =
    "fm-content px-3 px-lg-4 d-flex flex-wrap align-items-center justify-content-between";

  const arquivosLi = isUsers
    ? `<li class="nav-item"><a class="nav-link" href="#" data-fm-go="files">Arquivos</a></li>`
    : `<li class="nav-item"><span class="nav-link active" aria-current="page">Arquivos</span></li>`;

  const usuariosLi = isUsers
    ? `<li class="nav-item"><span class="nav-link active" aria-current="page">Usuários</span></li>`
    : `<li class="nav-item"><a class="nav-link" href="#" data-fm-go="users">Usuários</a></li>`;

  root.innerHTML = `
      <a class="navbar-brand fm-brand" href="#" data-fm-go="files">FileManager</a>
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
};
