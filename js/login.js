if (getToken()) {
  window.location.href = FM.url("app.html");
}

document.getElementById("form-login").addEventListener("submit", async (e) => {
  e.preventDefault();
  const alertEl = document.getElementById("login-alert");
  alertEl.classList.add("d-none");
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const btn = e.target.querySelector('button[type="submit"]');
  btn.disabled = true;
  try {
    const data = await apiFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    setToken(data.access_token);
    window.location.href = FM.url("app.html");
  } catch (err) {
    alertEl.textContent = err.message || "Falha no login.";
    alertEl.classList.remove("d-none");
  } finally {
    btn.disabled = false;
  }
});
