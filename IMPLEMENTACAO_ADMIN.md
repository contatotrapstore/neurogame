# Guia de Implementação – Dashboard Admin (React + Vite)

Resumo da estrutura atual do painel administrativo NeuroGame.

## Estrutura de diretórios

```
neurogame-admin/
+- src/
¦  +- App.jsx
¦  +- main.jsx
¦  +- assets/
¦  +- components/
¦  ¦  +- GameCard.jsx
¦  ¦  +- GameForm.jsx
¦  ¦  +- Header.jsx
¦  ¦  +- Layout.jsx
¦  ¦  +- PlanCard.jsx
¦  ¦  +- PlanForm.jsx
¦  ¦  +- Sidebar.jsx
¦  ¦  +- UserForm.jsx
¦  ¦  +- UserTable.jsx
¦  +- contexts/
¦  ¦  +- AuthContext.jsx
¦  +- pages/
¦  ¦  +- Dashboard.jsx
¦  ¦  +- Games.jsx
¦  ¦  +- Login.jsx
¦  ¦  +- Subscriptions.jsx
¦  ¦  +- Users.jsx
¦  +- services/
¦  ¦  +- api.js
¦  +- utils/
¦     +- auth.js
+- vite.config.js
+- package.json
+- .env (opcional)
```

## Fluxo principal (`App.jsx`)

- Estado global (`user`, `setUser`) armazenado pelo `AuthContext`.
- `useEffect` inicial busca `localStorage` via `getUser()`.
- Componente `ProtectedRoute` é definido dentro de `App.jsx` e verifica:
  1. `loading` (exibe spinner);
  2. existência de usuário logado;
  3. flag `is_admin`.
- Rotas:
  - `/login` ? `pages/Login.jsx`
  - `/` (dentro do `Layout`) ? `Dashboard`, `Games`, `Users`, `Subscriptions`.

## Autenticação

- `pages/Login.jsx` chama `authAPI.login` (em `services/api.js`).
- Resposta populada com `token`, `refreshToken` e `user`.
- Persistência feita por `utils/auth` (`setAuthData` usa `localStorage`).
- Interceptor Axios renova tokens via `/api/v1/auth/refresh-token` quando recebe 401.

## Serviços (`services/api.js`)

- `API_BASE_URL` vem de `import.meta.env.VITE_API_URL` (por padrão `http://localhost:3000/api/v1`).
- Interceptores cuidam de anexar `Authorization: Bearer <token>` e tentam refresh automático.
- Objetos helpers (`authAPI`, `usersAPI`, `gamesAPI`, `subscriptionsAPI`) normalizam respostas do Supabase para a UI (campos como `isAdmin`, `folderPath`, `durationDays`).

## Componentes-chave

- `Layout.jsx`: combina `Sidebar`, `Header` e `Outlet` do React Router.
- `Sidebar.jsx`: navegação entre seções, destaca rota ativa.
- `Header.jsx`: exibe usuário logado e botão de logout (limpa storage e redireciona para `/login`).
- `GameForm.jsx`, `PlanForm.jsx`, `UserForm.jsx`: formulários com validação básica para CRUD.
- `UserTable.jsx`: tabela de usuários com paginação e ações.

## Páginas

- `Dashboard.jsx`: métricas resumidas (usuários ativos, jogos, planos, etc.).
- `Games.jsx`: listagem com filtros, modal de criação/edição, acionando `gamesAPI`.
- `Users.jsx`: gerenciamento de usuários e concessão de acesso individual.
- `Subscriptions.jsx`: CRUD de planos + associação de jogos ao plano.
- `Login.jsx`: tela estilizada com MUI, ícones e toggles de visibilidade de senha.

## Ambiente e scripts

- Copiar `.env.example` ? `.env` para definir `VITE_API_URL` e `VITE_API_TIMEOUT`.
- Scripts (`package.json`):
  - `npm run dev` – Vite em `http://localhost:3001`
  - `npm run build` – build produção em `dist/`
  - `npm run preview` – serve build gerado

## Integração com backend

- Depende do backend Express/Supabase em `http://localhost:3000`.
- Necessário que CORS inclua `http://localhost:3001`.
- Dados devem coincidir com as tabelas do Supabase (`games`, `subscription_plans`, etc.)

## Fluxo de logout

1. `Header` ? `logout` (função em `utils/auth`).
2. Remove `token`, `refreshToken` e `user` do `localStorage`.
3. Limpa dados extras no backend (`electronAPI` não é usado aqui) e redireciona para `/login`.

## Pontos de atenção

- O dashboard assume que os campos retornados pelo Supabase seguem os nomes utilizados na normalização (`full_name`, `folder_path`, `is_active`).
- Atualize `VITE_API_URL` ao publicar o backend em outro host.
- Tokens gravados em `localStorage`; considere cookies HttpOnly em produção se necessário.

## Execução típica

```bash
# Instalar dependências
npm install

# Desenvolvimento
npm run dev

# Build
npm run build
```

Abra `http://localhost:3001`, faça login com `admin / Admin@123456` (criado via seeds do Supabase) e gerencie usuários, jogos e planos.
