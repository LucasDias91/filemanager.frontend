const ICON_LIXEIRA = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16" aria-hidden="true"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg>`;

const ICON_LAPIS = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16" aria-hidden="true"><path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/></svg>`;

const ICON_DOWNLOAD = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-download" viewBox="0 0 16 16" aria-hidden="true"><path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/><path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/></svg>`;

function fmDownloadBySecretKey(secretKey) {
  if (!secretKey || typeof CONFIG === "undefined") return;
  const url = `${CONFIG.API_BASE_URL}/api/files/download?${new URLSearchParams({ key: secretKey })}`;
  const a = document.createElement("a");
  a.href = url;
  a.rel = "noopener";
  a.target = "_blank";
  a.setAttribute("download", "");
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

let pendingDeleteSecretKey = null;
let editingSecretKey = null;

function fmGetModalUpload() {
  const el = document.getElementById("modalUpload");
  if (!el || typeof bootstrap === "undefined") return null;
  return bootstrap.Modal.getOrCreateInstance(el);
}

function fmGetModalExcluirArquivo() {
  const el = document.getElementById("modalExcluirArquivo");
  if (!el || typeof bootstrap === "undefined") return null;
  return bootstrap.Modal.getOrCreateInstance(el);
}

function resetModalUploadInclusao() {
  editingSecretKey = null;
  const label = document.getElementById("modalUploadLabel");
  if (label) label.textContent = "Incluir arquivo";
  const info = document.getElementById("upload-edit-info");
  if (info) {
    info.classList.add("d-none");
    info.textContent = "";
  }
  const submitBtn = document.querySelector("#form-upload button[type='submit']");
  if (submitBtn) submitBtn.textContent = "Salvar";
}

async function loadFiles() {
  const tbody = document.querySelector("#tabela-arquivos tbody");
  const emptyEl = document.getElementById("lista-vazia-arquivos");
  const errEl = document.getElementById("arquivos-erro");
  if (!tbody || !emptyEl || !errEl) return;

  errEl.classList.add("d-none");
  try {
    const raw = await apiFetch("/api/files");
    const list = Array.isArray(raw) ? raw : [];
    tbody.innerHTML = "";
    if (!list.length) {
      emptyEl.classList.remove("d-none");
      return;
    }
    emptyEl.classList.add("d-none");
    for (const f of list) {
      const tr = document.createElement("tr");
      const nomeArquivo = FM.escapeHtml(f.original_name);
      const openUrl = FM.absoluteApiUrl(f.relative_url || f.url || "");
      const nomeCelula = openUrl
        ? `<a href="${FM.escapeAttr(openUrl)}" target="_blank" rel="noopener noreferrer">${nomeArquivo}</a>`
        : nomeArquivo;
      tr.innerHTML = `
        <td>${nomeCelula}</td>
        <td>${FM.escapeHtml(f.content_type || "—")}</td>
        <td>${FM.formatBytes(f.size)}</td>
        <td>${FM.formatDate(f.create_at)}</td>
        <td><code class="small user-select-all">${FM.escapeHtml(
          String(f.secret_key).toUpperCase()
        )}</code></td>
        <td class="text-end">
          <div class="d-inline-flex gap-1 justify-content-end">
            <button type="button" class="btn btn-outline-secondary btn-sm p-1 lh-1 btn-baixar-arquivo"
              title="Baixar arquivo" aria-label="Baixar arquivo"
              data-secret-key="${FM.escapeAttr(f.secret_key)}">
              ${ICON_DOWNLOAD}
            </button>
            <button type="button" class="btn btn-outline-primary btn-sm p-1 lh-1 btn-editar-arquivo"
              title="Substituir arquivo" aria-label="Editar arquivo"
              data-secret-key="${FM.escapeAttr(f.secret_key)}" data-file-name="${FM.escapeAttr(f.original_name)}">
              ${ICON_LAPIS}
            </button>
            <button type="button" class="btn btn-outline-danger btn-sm p-1 lh-1 btn-excluir-arquivo"
              title="Excluir" aria-label="Excluir arquivo"
              data-secret-key="${FM.escapeAttr(f.secret_key)}" data-file-name="${FM.escapeAttr(f.original_name)}">
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
    if (FM.redirectOnUnauthorized(err)) return;
    errEl.textContent = err.message || "Erro ao listar arquivos.";
    errEl.classList.remove("d-none");
  }
}

window.fmEnterFilesView = function fmEnterFilesView() {
  if (!FM.requireAuth()) return;
  loadFiles();
};

document.getElementById("btn-refresh-arquivos")?.addEventListener("click", () => {
  loadFiles();
});

const excluirArquivoAlertEl = document.getElementById("excluir-arquivo-alert");
const btnConfirmarExclusao = document.getElementById("btn-confirmar-exclusao");

document.querySelector("#tabela-arquivos tbody")?.addEventListener("click", (e) => {
  const btnBaixar = e.target.closest(".btn-baixar-arquivo");
  if (btnBaixar) {
    fmDownloadBySecretKey(btnBaixar.dataset.secretKey);
    return;
  }
  const btnEdit = e.target.closest(".btn-editar-arquivo");
  if (btnEdit) {
    editingSecretKey = btnEdit.dataset.secretKey;
    document.getElementById("modalUploadLabel").textContent = "Substituir arquivo";
    document.getElementById("form-upload").reset();
    document.getElementById("upload-alert").classList.add("d-none");
    const info = document.getElementById("upload-edit-info");
    const nome = btnEdit.dataset.fileName || "este arquivo";
    if (info) {
      info.innerHTML = `Substituindo o arquivo <strong>${FM.escapeHtml(nome)}</strong>. Escolha o novo arquivo e salve.`;
      info.classList.remove("d-none");
    }
    const submitBtn = document.querySelector("#form-upload button[type='submit']");
    if (submitBtn) submitBtn.textContent = "Substituir";
    fmGetModalUpload()?.show();
    return;
  }
  const btn = e.target.closest(".btn-excluir-arquivo");
  if (!btn || !excluirArquivoAlertEl) return;
  pendingDeleteSecretKey = btn.dataset.secretKey;
  const nome = btn.dataset.fileName || "este arquivo";
  excluirArquivoAlertEl.classList.remove("alert-danger");
  excluirArquivoAlertEl.classList.add("alert-warning");
  excluirArquivoAlertEl.innerHTML = `<strong>Atenção:</strong> deseja excluir <strong>${FM.escapeHtml(nome)}</strong>? Esta ação não pode ser desfeita.`;
  fmGetModalExcluirArquivo()?.show();
});

btnConfirmarExclusao?.addEventListener("click", async () => {
  if (!pendingDeleteSecretKey) return;
  const key = pendingDeleteSecretKey;
  btnConfirmarExclusao.disabled = true;
  try {
    const q = new URLSearchParams({ key });
    await apiFetch(`/api/files?${q}`, { method: "DELETE" });
    pendingDeleteSecretKey = null;
    fmGetModalExcluirArquivo()?.hide();
    await loadFiles();
  } catch (err) {
    if (excluirArquivoAlertEl) {
      excluirArquivoAlertEl.classList.remove("alert-warning");
      excluirArquivoAlertEl.classList.add("alert-danger");
      excluirArquivoAlertEl.innerHTML = FM.escapeHtml(err.message || "Não foi possível excluir.");
    }
  } finally {
    btnConfirmarExclusao.disabled = false;
  }
});

document.getElementById("modalExcluirArquivo")?.addEventListener("hidden.bs.modal", () => {
  pendingDeleteSecretKey = null;
  if (excluirArquivoAlertEl) {
    excluirArquivoAlertEl.classList.remove("alert-danger");
    excluirArquivoAlertEl.classList.add("alert-warning");
  }
});

document.getElementById("btn-abrir-upload")?.addEventListener("click", () => {
  resetModalUploadInclusao();
  document.getElementById("form-upload").reset();
  document.getElementById("upload-alert").classList.add("d-none");
  fmGetModalUpload()?.show();
});

document.getElementById("modalUpload")?.addEventListener("hidden.bs.modal", () => {
  resetModalUploadInclusao();
});

document.getElementById("form-upload")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.currentTarget;
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
  const btn = form.querySelector('button[type="submit"]');
  if (btn) btn.disabled = true;
  try {
    const key = editingSecretKey;
    const path = key
      ? `/api/files/upload?${new URLSearchParams({ key })}`
      : "/api/files/upload";
    const method = key ? "PUT" : "POST";
    await apiFetch(path, { method, body: fd });
    fmGetModalUpload()?.hide();
    await loadFiles();
  } catch (err) {
    alertEl.textContent = err.message || "Falha no envio.";
    alertEl.classList.remove("d-none");
  } finally {
    if (btn) btn.disabled = false;
  }
});
