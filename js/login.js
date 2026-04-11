document.getElementById("form-login").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.currentTarget;
  const alertEl = document.getElementById("login-alert");
  alertEl.classList.add("d-none");
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const btn = form.querySelector('button[type="submit"]');
  if (btn) btn.disabled = true;
  try {
    const data = await apiFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    setToken(data.access_token);
    FM.showView("files");
  } catch (err) {
    alertEl.textContent = err.message || "Falha no login.";
    alertEl.classList.remove("d-none");
  } finally {
    if (btn) btn.disabled = false;
  }
});
