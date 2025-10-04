# Guia de Início Rápido – NeuroGame

Configure a plataforma completa em poucos passos.

## 1. Preparar o ambiente

- Node.js 18+
- Conta Supabase
- Clonar este repositório

```
git clone <repo>
cd NeuroGame
```

## 2. Supabase (15 minutos)

1. Criar projeto no [Supabase](https://supabase.com)
2. Anotar `SUPABASE_URL`, `anon key` e `service_role key`
3. No SQL Editor, executar os arquivos:
   - `supabase-schema.sql`
   - `supabase-seeds.sql`
4. (Opcional) usar `node generate-password-hashes.js` ou `node update-passwords.js` para atualizar hashes, caso altere as senhas padrão

## 3. Backend API

```
cd neurogame-backend
cp .env.example .env   # preencher com as chaves do Supabase e JWT
npm install
npm run dev
```

- API disponível em `http://localhost:3000/api/v1`
- Health check: `http://localhost:3000/api/v1/health`
- Pasta `Jogos/` deve estar no mesmo nível para servir arquivos estáticos

## 4. Dashboard Admin

```
cd ../neurogame-admin
cp .env.example .env   # opcional, apenas para alterar URL da API
npm install
npm run dev
```

- Acessar `http://localhost:3001`
- Login padrão: `admin / Admin@123456`
- Usar o painel para gerenciar jogos, usuários e planos

## 5. Jogos locais

```
NeuroGame/
+- neurogame-launcher/
+- Jogos/
   +- autorama/
   ¦  +- index.html
   +- balao/
   ¦  +- index.html
   +- ...
```

Certifique-se de que cada jogo possui `index.html` e assets na própria pasta, e que o Supabase tem o campo `folder_path` correspondente (ex.: `autorama`).

## 6. Launcher Desktop

```
cd ../neurogame-launcher
npm install
npm run dev
```

- Vite roda em `http://localhost:5174`
- Electron abre automaticamente
- Login padrão: `demo / Demo@123456`
- Ao clicar em “Play Now”, o launcher valida acesso via API e carrega `../Jogos/<folder>/index.html`

## 7. Checklist rápido

- [ ] Backend rodando (`npm run dev`) – porta 3000
- [ ] Admin acessível (`npm run dev`) – porta 3001
- [ ] Launcher funcionando (`npm run dev`) – janela Electron + porta 5174
- [ ] Login demo realizado
- [ ] Jogo HTML5 abre em WebView

## 8. Produção

- Backend: configure host (Render, Railway, etc.) e variáveis de ambiente
- Admin: `npm run build` e publicar o conteúdo de `dist/`
- Launcher: `npm run build && npm run build:win` (ou mac/linux) para gerar instaladores em `dist-electron/`

## 9. Dicas

- Ajuste `CORS_ORIGIN` no backend para incluir `http://localhost:3001` e `http://localhost:5174`
- Utilize `node update-passwords.js` sempre que mudar as senhas padrão
- Mantenha as chaves do Supabase fora do controle de versão

Com esses passos você terá o ecossistema NeuroGame (backend + admin + launcher) rodando localmente.
