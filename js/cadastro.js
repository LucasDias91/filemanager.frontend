document.getElementById("form-cadastro").addEventListener("submit", async (e) => {
  e.preventDefault();
  const alertEl = document.getElementById("cadastro-alert");
  alertEl.classList.add("d-none");
  const name = document.getElementById("name").value.trim();
  const user_name = document.getElementById("user_name").value.trim();
  const password = document.getElementById("password").value;
  const btn = e.target.querySelector('button[type="submit"]');
  btn.disabled = true;
  try {
    await apiFetch("/api/users", {
      method: "POST",
      body: JSON.stringify({ name, user_name, password }),
    });
    window.location.href = `${FM.url("index.html")}?cadastro=ok`;
  } catch (err) {
    alertEl.textContent = err.message || "Não foi possível cadastrar.";
    alertEl.classList.remove("d-none");
  } finally {
    btn.disabled = false;
  }
});
