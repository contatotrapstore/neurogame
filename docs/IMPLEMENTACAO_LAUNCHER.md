# Guia de Implementação - Launcher Desktop (Electron + React)

Este documento descreve a estrutura atual do launcher NeuroGame, os pontos principais do código e como executar o projeto.

## Estrutura de Arquivos

```
neurogame-launcher/
+- main.js               # Processo principal do Electron
+- preload.js            # Bridge segura entre Electron e o renderer
+- vite.config.js        # Configuração Vite (porta 5174)
+- package.json
+- .env                  # (opcional) override de API URL/local dos jogos
+- src/
   +- main.jsx           # Entrada React
   +- App.jsx            # Rotas e layout principal
   +- index.css
   +- components/
   ¦  +- GameCard.jsx
   ¦  +- GameWebView.jsx
   ¦  +- Header.jsx
   +- pages/
   ¦  +- GameDetail.jsx
   ¦  +- GameLibrary.jsx
   ¦  +- Login.jsx
   +- services/
   ¦  +- api.js         # Cliente Axios com interceptores
   ¦  +- storage.js     # Wrapper para electron-store
   +- utils/
      +- auth.js        # Helpers de autenticação
```

## Processo Principal (`main.js`)

- Verifica se o processo está rodando como Node puro (quando `ELECTRON_RUN_AS_NODE=1`) e reexecuta o binário do Electron removendo a flag. Esse workaround evita o erro `app.whenReady is not a function` em ambientes Windows.
- Cria a janela principal com `BrowserWindow`, carregando `http://localhost:5174` em desenvolvimento ou `dist/index.html` após build.
- Registra handlers IPC (`store-*`, `get-games-path`, etc.) usando `electron-store` para persistir tokens e configurações.
- Restringe navegação e abertura de novas janelas por segurança.

## Preload (`preload.js`)

Expõe uma API controlada em `window.electronAPI` com operações de storage, paths e listeners. A renderização React usa esses métodos para persistir dados sem abrir mão do `contextIsolation`.

## Front-end (React)

- `App.jsx` gerencia autenticação e rotas (`/login`, `/library`, `/game/:id`).
- `pages/Login.jsx` realiza login e salva token/usuário via `storage.js`.
- `pages/GameLibrary.jsx` busca os jogos do usuário autenticado em `/api/v1/games/user/games`, com filtros e pesquisa.
- `pages/GameDetail.jsx` busca detalhes do jogo e, ao clicar em “Play Now”, valida o acesso (`/api/v1/games/:id/validate`) antes de montar o caminho local (`../Jogos/{folderPath}/index.html`). Pagina exibe o jogo via `<webview>`.
- `components/GameWebView.jsx` encapsula o `<webview>` e oferece controles de fullscreen/exit, exibindo mensagem de erro quando o arquivo local não é encontrado.

## Configuração e Scripts

- Porta Vite: `5174` (`vite.config.js`).
- Scripts principais (`package.json`):
  - `npm run dev`: inicia Vite + Electron (usa `wait-on` e `cross-env`)
  - `npm run start`: roda Electron carregando arquivos de build
  - `npm run build`: gera `dist/`
  - `npm run build:win|mac|linux|all`: empacota via `electron-builder`
- Variáveis opcionais (`.env`):
  - `VITE_API_URL` – base da API (default `http://localhost:3000/api/v1`)
  - `VITE_GAMES_PATH` – caminho relativo dos jogos (default `../Jogos`)

## Dependências externas

- `electron-store`: armazenamento persistente de tokens/usuário
- `axios`: comunicação com o backend
- `@mui/material` e `@emotion/*`: UI
- `react-router-dom`: roteamento

## Fluxo de Execução

1. `npm run dev`
2. Vite sobe `http://localhost:5174`
3. Script aguarda a porta (`wait-on tcp:5174`) e inicia `npx electron .`
4. Electron carrega `main.js`, cria janela e abre DevTools em modo dev
5. React renderiza tela de login; ao autenticar, biblioteca e jogos são consumidos da API

## Requisitos para os jogos

- Pasta `Jogos/<folder>/index.html`
- Assets incluídos na mesma pasta
- O backend retorna `folder_path` compatível com essa estrutura

## Dicas de Debug

- Use `npm run dev` para ter DevTools abertos automaticamente
- Logs do processo principal aparecem no terminal (`console.log` em `main.js`)
- Logs do renderer podem ser vistos no DevTools ou capturados por `mainWindow.webContents.on('console-message', ...)`
- Se o WebView mostrar tela preta, valide o caminho retornado por `getGamesPath` e se o arquivo existe

## Build

Antes de `npm run build:win`, execute `npm run build` para gerar os assets React. Os executáveis ficam em `dist-electron/`.

## Segurança

- `contextIsolation: true`, `nodeIntegration: false`
- Navegação limitada a `localhost` (dev) ou arquivos `file://`
- Novas janelas bloqueadas com `setWindowOpenHandler`

## Troubleshooting rápido

| Sintoma | Causa provável | Ação |
|--------|----------------|------|
| Janela totalmente branca em dev | Vite não iniciou ou build ausente | Verifique terminal do `npm run dev`; rode `npm run build` para uso com `npm start` |
| Erro CORS ao logar | Backend não permite origem do launcher | Ajuste `CORS_ORIGIN` no backend (`.env`) para incluir `http://localhost:5174` |
| Jogo não abre (webview) | Caminho local inexistente | Verifique pasta `Jogos/<folder>` e se `folder_path` está correto no Supabase |
| `app.whenReady` undefined | `ELECTRON_RUN_AS_NODE=1` ativo | Corrigido no bootstrap; se persistir, zerar var ambiente e reinstalar deps |

