# FileManager — Frontend

SPA num único **`index.html`**: login, cadastro, arquivos e utilizadores. A URL do navegador não muda (ex.: `http://127.0.0.1:5500/`).

A API FastAPI deve estar em execução antes de usar o site (ver **`filemanager.backend/README.md`** — `start.bat` ou execução manual do Uvicorn).

## Início rápido com `start.bat` (Windows)

Na pasta deste projeto (`filemanager.frontend`), execute **`start.bat`**. O script usa `python` ou `py` para servir a pasta na porta **5500** e abre o navegador em http://127.0.0.1:5500/ .

## Se o `start.bat` não funcionar (execução manual)

1. **Terminal** na pasta `filemanager.frontend` (onde está `index.html`).

2. **Python** no PATH. Experimente, por esta ordem:

   ```bash
   python -m http.server 5500
   ```

   Se falhar:

   ```bash
   py -m http.server 5500
   ```

3. **Abrir no browser:** http://127.0.0.1:5500/

4. **Parar o servidor:** `Ctrl+C` no terminal.

**Nota:** Abrir só o `index.html` com `file://` pode fazer o `fetch` à API falhar; por isso convém sempre um servidor HTTP local como acima.

## Requisitos

- Navegador moderno
- Python no PATH (para o servidor HTTP local)
- Backend FileManager a correr (por defeito em http://127.0.0.1:8000)

## Configuração da API

Edite `js/config.js`:

```javascript
const CONFIG = {
  API_BASE_URL: "http://127.0.0.1:8000",
  TOKEN_KEY: "filemanager_token",
};
```

`API_BASE_URL` é a URL base do FastAPI (sem barra final). O JWT fica em `localStorage` com a chave `TOKEN_KEY`.

## Estrutura (SPA)

| Recurso | Função |
|---------|--------|
| `index.html` | Página única: vistas e modais |
| `js/core.js` | `FM.showView(...)`, `FM.initApp()` |
| `js/layout.js` | Navbar; `data-fm-go` |
| `css/styles.css`, `js/*.js` | Estilos e lógica |

Navegação interna via `data-fm-go="..."` em JavaScript, sem alterar `location` ou hash.

## Depois do login

Use **Cadastre-se** / **Entrar**, depois **Arquivos** e **Usuários** na barra superior.
