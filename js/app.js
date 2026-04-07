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
  tbody.innerHTML =
    '<tr><td colspan="6" class="text-center text-muted py-4">Carregando…</td></tr>';
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
      const link = f.url
        ? `<a href="${f.url}" target="_blank" rel="noopener">Abrir</a>`
        : "—";
      tr.innerHTML = `
        <td>${escapeHtml(f.original_name)}</td>
        <td>${escapeHtml(f.content_type || "—")}</td>
        <td>${formatBytes(f.size)}</td>
        <td>${formatDate(f.create_at)}</td>
        <td>${link}</td>
        <td><code class="small user-select-all">${escapeHtml(f.secret_key)}</code></td>
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

document.getElementById("btn-logout").addEventListener("click", () => {
  clearToken();
  window.location.href = "index.html";
});

document.getElementById("btn-refresh").addEventListener("click", () => {
  loadFiles();
});

const modalUpload = new bootstrap.Modal(document.getElementById("modalUpload"));

document.getElementById("btn-abrir-upload").addEventListener("click", () => {
  document.getElementById("form-upload").reset();
  document.getElementById("upload-alert").classList.add("d-none");
  modalUpload.show();
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
    await apiFetch("/api/files/upload", {
      method: "POST",
      body: fd,
    });
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
