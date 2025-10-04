# Solução – Launcher Desktop NeuroGame

## Situação atual

- Scripts `npm run dev` e `npm start` utilizam `wait-on`, `cross-env` e `npx electron` para garantir que o processo correto seja iniciado em Windows, macOS e Linux.
- `main.js` detecta `ELECTRON_RUN_AS_NODE` e relança o binário do Electron quando necessário, evitando o erro `app.whenReady is not a function`.
- Logs adicionais (`[launcher] isDev…` e handlers `did-fail-load` / `console-message`) ajudam a diagnosticar problemas de build ou de carregamento de jogos.

## Checklist de saúde do launcher

1. **Dependências instaladas** – `npm install`
2. **Frontend em modo dev** – porta `5174` livre
3. **Backend rodando** – `http://localhost:3000`
4. **CORS** – `CORS_ORIGIN` inclui `http://localhost:5174`
5. **Pasta `Jogos/`** – contém subpastas com `index.html`
6. **Credenciais válidas** – login `demo/Demo@123456` disponível

## Fluxo recomendado

```bash
# Backend
cd neurogame-backend
npm run dev

# Admin dashboard
cd ../neurogame-admin
npm run dev

# Launcher
cd ../neurogame-launcher
npm run dev
```

## Troubleshooting rápido

| Sintoma | Ação |
|--------|------|
| Terminal mostra `Failed to load dist/index.html` ao usar `npm start` | Rode `npm run build` antes de `npm start` |
| Login falha com erro CORS | Ajuste `CORS_ORIGIN` no backend para incluir a origem do launcher |
| WebView exibe mensagem de erro | Verifique se `Jogos/<folder>/index.html` existe e se `folder_path` no Supabase corresponde |
| Nada acontece ao rodar `npm run dev` | Confirme instalação de dependências e se `wait-on`/`cross-env` estão presentes em `devDependencies` |

## Referência rápida de arquivos importantes

- `main.js` – janela principal, fix `ELECTRON_RUN_AS_NODE`, IPCs
- `preload.js` – API exposta ao renderer
- `src/services/api.js` – cliente Axios com leitura das configurações em `electron-store`
- `src/services/storage.js` – persistência de token/usuário/configuração
- `src/pages/GameDetail.jsx` – validação de acesso e montagem do caminho local do jogo

## Próximos passos sugeridos

- Automatizar update de CORS e variáveis via documentação atualizada
- Implementar rotina de auto-update (placeholder no IPC `check-for-updates`)
- Adicionar testes end-to-end (ex.: Playwright) para validar login e abertura de jogos

Com essas correções o launcher está funcional e alinhado ao backend Supabase e ao dashboard admin.
