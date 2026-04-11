document.getElementById("form-cadastro").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.currentTarget;
  const alertEl = document.getElementById("cadastro-alert");
  alertEl.classList.add("d-none");
  const name = document.getElementById("cad-name").value.trim();
  const user_name = document.getElementById("cad-user_name").value.trim();
  const password = document.getElementById("cad-password").value;
  const btn = form.querySelector('button[type="submit"]');
  if (btn) btn.disabled = true;
  try {
    await apiFetch("/api/users", {
      method: "POST",
      body: JSON.stringify({ name, user_name, password }),
    });
    document.getElementById("form-cadastro").reset();
    if (typeof clearToken === "function") clearToken();
    FM.goLoginAfterRegister();
  } catch (err) {
    alertEl.textContent = err.message || "Não foi possível cadastrar.";
    alertEl.classList.remove("d-none");
  } finally {
    if (btn) btn.disabled = false;
  }
});
