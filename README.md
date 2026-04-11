# FileManager — Frontend

SPA em **um único** `index.html`: login, cadastro, arquivos e usuários trocam só o conteúdo na tela. **A URL do navegador não muda** (sempre a mesma página, por exemplo `http://127.0.0.1:5500/` ou `.../index.html`).

## Como iniciar a aplicação

1. **Suba o backend** na porta **8000** (pasta `filemanager.backend`, comando `uvicorn` — veja o README do backend).
2. **Nesta pasta do frontend**, no **Windows**, dê dois cliques em **`start.bat`** ou execute no terminal:

   ```bat
   start.bat
   ```

   O script usa **Python** (`python` ou `py`) para rodar `http.server` na porta **5500**, espera um instante e **abre o navegador** em http://127.0.0.1:5500/ .

3. **Sem Windows ou sem `start.bat`:** na pasta do frontend:

   ```bash
   python -m http.server 5500
   ```

   Abra manualmente http://127.0.0.1:5500/ .

## Requisitos

- Navegador moderno
- **Python** no PATH (necessário para o `start.bat` e para o servidor acima)
- Backend FileManager em execução antes de usar o site

## Por que usar um servidor HTTP?

Abrir o `index.html` via `file://` pode causar problemas com `fetch` na API. Servir a pasta em `http://127.0.0.1:5500` evita isso e espelha um uso mais próximo de produção.

## Configuração da API

Edite `js/config.js`:

```javascript
const CONFIG = {
  API_BASE_URL: "http://127.0.0.1:8000",
  TOKEN_KEY: "filemanager_token",
};
```

`API_BASE_URL` deve ser a URL base do FastAPI (sem barra final). O token JWT fica em `localStorage` com a chave `TOKEN_KEY`.

## Estrutura (SPA)

| Recurso | Função |
|---------|--------|
| `index.html` | Única página: todas as “telas” e modais de arquivo |
| `js/core.js` | `FM.showView('login' \| 'cadastro' \| 'files' \| 'users')`, `FM.initApp()` |
| `js/layout.js` | Navbar; links com `data-fm-go` (sem navegação real) |
| `css/styles.css`, `js/*.js` | Estilos e lógica por módulo |

Navegação interna: elementos com `data-fm-go="..."` disparam troca de view via JavaScript, **sem** alterar `location` ou hash.

## Depois do login

Use **Cadastre-se** / **Entrar**, depois **Arquivos** e **Usuários** na barra superior.
