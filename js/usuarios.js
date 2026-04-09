async function loadUsers() {
  const tbody = document.querySelector("#tabela-usuarios tbody");
  const emptyEl = document.getElementById("lista-vazia");
  const errEl = document.getElementById("usuarios-erro");
  errEl.classList.add("d-none");
  try {
    const list = await apiFetch("/api/users");
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

document.getElementById("btn-refresh").addEventListener("click", () => {
  loadUsers();
});

const linkNovo = document.getElementById("fm-link-novo-usuario");
if (linkNovo) linkNovo.href = FM.url("pages/cadastro.html");

FM.requireAuth();
loadUsers();
