function requireAuth() {
  if (!getToken()) {
    window.location.href = "index.html";
  }
}

function formatBytes(n) {
  if (n === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(n) / Math.log(k));
  return `${parseFloat((n / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

function formatDate(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("pt-BR");
  } catch {
    return iso;
  }
}

async function loadFiles() {
  const tbody = document.querySelector("#tabela-arquivos tbody");
  const emptyEl = document.getElementById("lista-vazia");
  const errEl = document.getElementById("arquivos-erro");
  errEl.classList.add("d-none");
  try {
    const list = await apiFetch("/api/files");
    tbody.innerHTML = "";
    if (!list.length) {
      emptyEl.classList.remove("d-none");
      tbody.innerHTML = "";
      return;
    }
    emptyEl.classList.add("d-none");
    for (const f of list) {
      const tr = document.createElement("tr");
      const nomeArquivo = escapeHtml(f.original_name);
      const nomeCelula = f.url
        ? `<a href="${escapeAttr(f.url)}" target="_blank" rel="noopener">${nomeArquivo}</a>`
        : nomeArquivo;
      tr.innerHTML = `
        <td>${nomeCelula}</td>
        <td>${escapeHtml(f.content_type || "—")}</td>
        <td>${formatBytes(f.size)}</td>
        <td>${formatDate(f.create_at)}</td>
        <td><code class="small user-select-all">${escapeHtml(
          String(f.secret_key).toUpperCase()
        )}</code></td>
        <td class="text-end">
          <div class="d-inline-flex gap-1 justify-content-end">
            <button type="button" class="btn btn-outline-primary btn-sm p-1 lh-1 btn-editar-arquivo"
              title="Substituir arquivo" aria-label="Editar arquivo"
              data-secret-key="${escapeAttr(f.secret_key)}" data-file-name="${escapeAttr(f.original_name)}">
              ${ICON_LAPIS}
            </button>
            <button type="button" class="btn btn-outline-danger btn-sm p-1 lh-1 btn-excluir-arquivo"
              title="Excluir" aria-label="Excluir arquivo"
              data-secret-key="${escapeAttr(f.secret_key)}" data-file-name="${escapeAttr(f.original_name)}">
              ${ICON_LIXEIRA}
            </button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    }
  } catch (err) {
    tbody.innerHTML = "";
    emptyEl.classList.add("d-none");
    errEl.textContent = err.message || "Erro ao listar arquivos.";
    errEl.classList.remove("d-none");
    if (err.status === 401) {
      clearToken();
      window.location.href = "index.html";
    }
  }
}

function escapeHtml(s) {
  const d = document.createElement("div");
  d.textContent = s;
  return d.innerHTML;
}

function escapeAttr(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const ICON_LIXEIRA = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16" aria-hidden="true"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg>`;

const ICON_LAPIS = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16" aria-hidden="true"><path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/></svg>`;

let pendingDeleteSecretKey = null;
let editingSecretKey = null;

function resetModalUploadInclusao() {
  editingSecretKey = null;
  document.getElementById("modalUploadLabel").textContent = "Incluir arquivo";
  const info = document.getElementById("upload-edit-info");
  info.classList.add("d-none");
  info.textContent = "";
  const submitBtn = document.querySelector("#form-upload button[type='submit']");
  if (submitBtn) submitBtn.textContent = "Salvar";
}

document.getElementById("btn-logout").addEventListener("click", () => {
  clearToken();
  window.location.href = "index.html";
});

document.getElementById("btn-refresh").addEventListener("click", () => {
  loadFiles();
});

const modalUpload = new bootstrap.Modal(document.getElementById("modalUpload"));
const modalExcluirArquivo = new bootstrap.Modal(document.getElementById("modalExcluirArquivo"));
const excluirArquivoAlertEl = document.getElementById("excluir-arquivo-alert");
const btnConfirmarExclusao = document.getElementById("btn-confirmar-exclusao");

document.querySelector("#tabela-arquivos tbody").addEventListener("click", (e) => {
  const btnEdit = e.target.closest(".btn-editar-arquivo");
  if (btnEdit) {
    editingSecretKey = btnEdit.dataset.secretKey;
    document.getElementById("modalUploadLabel").textContent = "Substituir arquivo";
    document.getElementById("form-upload").reset();
    document.getElementById("upload-alert").classList.add("d-none");
    const info = document.getElementById("upload-edit-info");
    const nome = btnEdit.dataset.fileName || "este arquivo";
    info.innerHTML = `Substituindo o arquivo <strong>${escapeHtml(nome)}</strong>. Escolha o novo arquivo e salve.`;
    info.classList.remove("d-none");
    const submitBtn = document.querySelector("#form-upload button[type='submit']");
    if (submitBtn) submitBtn.textContent = "Substituir";
    modalUpload.show();
    return;
  }
  const btn = e.target.closest(".btn-excluir-arquivo");
  if (!btn) return;
  pendingDeleteSecretKey = btn.dataset.secretKey;
  const nome = btn.dataset.fileName || "este arquivo";
  excluirArquivoAlertEl.classList.remove("alert-danger");
  excluirArquivoAlertEl.classList.add("alert-warning");
  excluirArquivoAlertEl.innerHTML = `<strong>Atenção:</strong> deseja excluir <strong>${escapeHtml(nome)}</strong>? Esta ação não pode ser desfeita.`;
  modalExcluirArquivo.show();
});

btnConfirmarExclusao.addEventListener("click", async () => {
  if (!pendingDeleteSecretKey) return;
  const key = pendingDeleteSecretKey;
  btnConfirmarExclusao.disabled = true;
  try {
    const q = new URLSearchParams({ key });
    await apiFetch(`/api/files?${q}`, { method: "DELETE" });
    pendingDeleteSecretKey = null;
    modalExcluirArquivo.hide();
    await loadFiles();
  } catch (err) {
    excluirArquivoAlertEl.classList.remove("alert-warning");
    excluirArquivoAlertEl.classList.add("alert-danger");
    excluirArquivoAlertEl.innerHTML = escapeHtml(err.message || "Não foi possível excluir.");
  } finally {
    btnConfirmarExclusao.disabled = false;
  }
});

document.getElementById("modalExcluirArquivo").addEventListener("hidden.bs.modal", () => {
  pendingDeleteSecretKey = null;
  excluirArquivoAlertEl.classList.remove("alert-danger");
  excluirArquivoAlertEl.classList.add("alert-warning");
});

document.getElementById("btn-abrir-upload").addEventListener("click", () => {
  resetModalUploadInclusao();
  document.getElementById("form-upload").reset();
  document.getElementById("upload-alert").classList.add("d-none");
  modalUpload.show();
});

document.getElementById("modalUpload").addEventListener("hidden.bs.modal", () => {
  resetModalUploadInclusao();
});

document.getElementById("form-upload").addEventListener("submit", async (e) => {
  e.preventDefault();
  const alertEl = document.getElementById("upload-alert");
  alertEl.classList.add("d-none");
  const input = document.getElementById("arquivo");
  if (!input.files || !input.files[0]) {
    alertEl.textContent = "Selecione um arquivo.";
    alertEl.classList.remove("d-none");
    return;
  }
  const file = input.files[0];
  const fd = new FormData();
  fd.append("file", file, file.name);
  const btn = e.target.querySelector('button[type="submit"]');
  btn.disabled = true;
  try {
    const key = editingSecretKey;
    const path = key
      ? `/api/files/upload?${new URLSearchParams({ key })}`
      : "/api/files/upload";
    const method = key ? "PUT" : "POST";
    await apiFetch(path, { method, body: fd });
    modalUpload.hide();
    await loadFiles();
  } catch (err) {
    alertEl.textContent = err.message || "Falha no envio.";
    alertEl.classList.remove("d-none");
  } finally {
    btn.disabled = false;
  }
});

requireAuth();
loadFiles();
