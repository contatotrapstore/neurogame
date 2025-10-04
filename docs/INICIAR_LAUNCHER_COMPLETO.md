# Guia Completo – Iniciar o Launcher NeuroGame

Este passo a passo garante que o launcher desktop funcione corretamente após as últimas correções.

## 1. Pré-requisitos

- Backend (`neurogame-backend`) configurado com Supabase e rodando
- Admin dashboard (`neurogame-admin`) acessível em `http://localhost:3001`
- Pasta `Jogos/` no mesmo nível do launcher contendo os jogos HTML5 (`index.html` em cada subpasta)

## 2. Ordem de inicialização

Abra três terminais separados e execute:

### Terminal 1 – Backend
```bash
cd C:\Users\GouveiaRx\Downloads\NeuroGame\neurogame-backend
npm run dev
```
Saída esperada (resumo):
- Conexão Supabase bem-sucedida
- Server rodando em `http://localhost:3000`

### Terminal 2 – Admin Dashboard
```bash
cd C:\Users\GouveiaRx\Downloads\NeuroGame\neurogame-admin
npm run dev
```
Saída esperada:
- Vite rodando em `http://localhost:3001`

### Terminal 3 – Launcher
```bash
cd C:\Users\GouveiaRx\Downloads\NeuroGame\neurogame-launcher
npm run dev
```
Fluxo interno do script:
1. Vite inicia em `http://localhost:5174`
2. `wait-on` aguarda a porta 5174
3. `cross-env` define `NODE_ENV=development`
4. `npx electron .` abre a janela Electron com DevTools ativos

## 3. O que mudou no launcher

- `main.js` detecta se `ELECTRON_RUN_AS_NODE=1` está ativo e relança o binário do Electron removendo a flag. Isso elimina o erro “`app.whenReady` undefined” observado antes.
- Logs adicionais registram falhas de carregamento e mensagens da camada React para facilitar o debug.
- CORS do backend agora inclui `http://localhost:5174`, evitando bloqueios ao fazer login via launcher.

## 4. Validação rápida

1. **Backend:**
   ```bash
   curl http://localhost:3000/api/v1/health
   ```
   Resposta esperada: JSON com `success: true`.

2. **Admin:** acessar `http://localhost:3001`, logar com `admin / Admin@123456` e confirmar navegação.

3. **Launcher:**
   - Tela de login deve aparecer (React DevTools podem abrir automaticamente).
   - Login com `demo / Demo@123456` deve carregar a biblioteca com os jogos.
   - Escolher um jogo e clicar em “Play Now” deve validar acesso e abrir o WebView com o HTML correspondente (por exemplo `../Jogos/autorama/index.html`).

## 5. Problemas comuns

| Sintoma | Possível causa | Ação sugerida |
|--------|----------------|---------------|
| Tela branca ao iniciar com `npm start` | Build React ausente | Rode `npm run build` antes de `npm start` |
| Erro CORS ao logar (`Access-Control-Allow-Origin`) | Backend não inclui origem do launcher | Ajuste `CORS_ORIGIN` no `.env` do backend para incluir `http://localhost:5174` |
| “Falha ao carregar dist/index.html” no console | Build não gerado ou `dist/` removido | Execute `npm run build` novamente |
| WebView exibe erro “Failed to load game” | Caminho local incorreto ou arquivos faltando | Verifique valor `folder_path` no Supabase e a existência de `index.html` dentro de `Jogos/<pasta>` |

## 6. Produção

1. `npm run build` – gera `dist/`
2. `npm run build:win` (ou `build:mac` / `build:linux`) – empacota com `electron-builder`
3. Executáveis são salvos em `dist-electron/`

Durante execução com `npm start`, o launcher lê `dist/index.html`; portanto mantenha a pasta `dist/` atualizada após mudanças no React.

## 7. Credenciais de referência

| Ambiente | Usuário | Senha |
|----------|---------|-------|
| Admin dashboard | `admin` | `Admin@123456` |
| Launcher | `demo` | `Demo@123456` |

> **Importante:** altere essas credenciais em produção e mantenha as chaves do Supabase fora do controle de versão.

## 8. Checklist final

- [ ] Backend `npm run dev`
- [ ] Admin `npm run dev`
- [ ] Launcher `npm run dev`
- [ ] Login realizado no launcher
- [ ] Jogo HTML5 abre dentro do WebView

Com esses passos o launcher permanece estável e alinhado com o backend Supabase e o dashboard admin.
