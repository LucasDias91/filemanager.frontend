# FileManager — Frontend

Interface estática (HTML, CSS, JavaScript) para login, cadastro, listagem de usuários e gerenciamento de arquivos contra a API do backend.

## Como iniciar a aplicação

1. **Suba o backend** na porta **8000** (pasta `filemanager.backend`, comando `uvicorn` — veja o README do backend).
2. **Nesta pasta do frontend**, no **Windows**, dê dois cliques em **`start.bat`** ou execute no terminal:

   ```bat
   start.bat
   ```

   O script usa **Python** (`python` ou `py`) para rodar `http.server` na porta **5500**, espera um instante e **abre o navegador** em http://127.0.0.1:5500/ . A página de login é o `index.html` nessa URL.

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

Abrir os HTML via `file://` pode causar problemas com `fetch` na API. Servir a pasta em `http://127.0.0.1:5500` evita isso e espelha um uso mais próximo de produção.

## Configuração da API

Edite `js/config.js`:

```javascript
const CONFIG = {
  API_BASE_URL: "http://127.0.0.1:8000",
  TOKEN_KEY: "filemanager_token",
};
```

`API_BASE_URL` deve ser a URL base do FastAPI (sem barra final). O token JWT fica em `localStorage` com a chave `TOKEN_KEY`.

## Estrutura de páginas

| Caminho | Função |
|---------|--------|
| `index.html` | Login |
| `pages/cadastro.html` | Cadastro de usuário |
| `pages/app.html` | Lista e upload de arquivos (requer login) |
| `pages/usuarios.html` | Lista de usuários (requer login) |

Recursos compartilhados: `css/styles.css`, scripts em `js/` (`api.js`, `core.js`, `layout.js`, etc.). Links entre páginas em `pages/` usam `FM.url()` em `core.js` para funcionar da raiz ou de dentro de `pages/`.

## Depois do login

Cadastre-se em **Cadastre-se** → faça login → use **Arquivos** e **Usuários** na barra superior.
