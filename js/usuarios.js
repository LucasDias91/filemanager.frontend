async function loadUsers() {
  const tbody = document.querySelector("#tabela-usuarios tbody");
  const emptyEl = document.getElementById("lista-vazia-usuarios");
  const errEl = document.getElementById("usuarios-erro");
  if (!tbody || !emptyEl || !errEl) return;

  errEl.classList.add("d-none");
  try {
    const raw = await apiFetch("/api/users");
    const list = Array.isArray(raw) ? raw : [];
    tbody.innerHTML = "";
    if (!list.length) {
      emptyEl.classList.remove("d-none");
      return;
    }
    emptyEl.classList.add("d-none");
    for (const u of list) {
      const tr = document.createElement("tr");
      const ativo = u.is_active === true;
      const badge = ativo
        ? '<span class="badge text-bg-success">Ativo</span>'
        : '<span class="badge text-bg-secondary">Inativo</span>';
      tr.innerHTML = `
        <td>${FM.escapeHtml(String(u.id))}</td>
        <td>${FM.escapeHtml(u.name)}</td>
        <td><code class="small">${FM.escapeHtml(u.user_name)}</code></td>
        <td>${badge}</td>
        <td>${FM.formatDate(u.create_at)}</td>
      `;
      tbody.appendChild(tr);
    }
  } catch (err) {
    tbody.innerHTML = "";
    emptyEl.classList.add("d-none");
    if (FM.redirectOnUnauthorized(err)) return;
    errEl.textContent = err.message || "Erro ao listar usuários.";
    errEl.classList.remove("d-none");
  }
}

window.fmEnterUsersView = function fmEnterUsersView() {
  if (!FM.requireAuth()) return;
  loadUsers();
};

document.getElementById("btn-refresh-usuarios")?.addEventListener("click", () => {
  loadUsers();
});
