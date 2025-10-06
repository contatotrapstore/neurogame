# 🚀 Como Testar o NeuroGame em Produção

**3 passos simples para criar o instalador e testar tudo funcionando**

---

## 📦 1. CRIAR O INSTALADOR

### **Comando único:**
```bash
cd neurogame-launcher
npm run build:launcher
```

### **Resultado:**
Instalador criado em: `neurogame-launcher/release/NeuroGame Launcher Setup 1.0.0.exe`

**Tempo:** ~2-5 minutos

---

## 🧪 2. TESTAR TUDO FUNCIONANDO

### **Passo 1: Iniciar o Backend**
```bash
cd neurogame-backend
npm run dev
```
✅ Backend rodando em: http://localhost:3000

### **Passo 2: Iniciar o Admin**
```bash
cd neurogame-admin
npm run dev
```
✅ Admin rodando em: http://localhost:3001

### **Passo 3: Instalar e Abrir o Launcher**
1. Vá em `neurogame-launcher/release/`
2. Execute `NeuroGame Launcher Setup 1.0.0.exe`
3. Siga o instalador (Next, Next, Finish)
4. Abra o "NeuroGame Launcher" instalado

### **Passo 4: Fazer Login**
- **Email:** `admin@neurogame.com`
- **Senha:** `Admin123`

---

## ✅ 3. O QUE TESTAR

### **No Admin Panel (http://localhost:3001):**
1. ✅ Login funcionando
2. ✅ Dashboard com métricas
3. ✅ Adicionar um jogo de teste
4. ✅ Criar usuário de teste
5. ✅ Ver solicitações de jogos

### **No Launcher (App Instalado):**
1. ✅ Login funcionando
2. ✅ Biblioteca de jogos aparece
3. ✅ Capas dos jogos carregam
4. ✅ Solicitar um jogo novo
5. ✅ Verificar atualização de conteúdo

### **Teste Completo (End-to-End):**
1. **Admin:** Adiciona jogo "Teste Game"
2. **Launcher:** Atualiza conteúdo (espera 30s ou reinicia)
3. **Launcher:** Jogo "Teste Game" aparece
4. **Launcher:** Clica em "Jogar" (se tiver instalado)
5. **Launcher:** Solicita jogo "Super Mario"
6. **Admin:** Vê solicitação pendente
7. **Admin:** Aprova solicitação
8. **Launcher:** Vê aprovação

---

## 🎯 CREDENCIAIS

### **Admin:**
- Email: `admin@neurogame.com`
- Senha: `Admin123`

### **Demo User (criar no admin):**
- Email: `teste@neurogame.com`
- Senha: `Teste123`

---

## 🔧 SE DER ERRO

### **Erro: "Port 3000 in use"**
```bash
npx kill-port 3000 3001 5173 5174
```

### **Launcher não conecta ao backend**
- Verifique se backend está rodando (http://localhost:3000/api/v1/health)
- Reinicie o launcher

### **Login dá erro 401**
- Use senha `Admin123` (não `Admin@123456`)
- Verifique se backend está rodando

---

## 📁 ONDE ESTÁ O INSTALADOR

Após rodar `npm run build:launcher`:
```
neurogame-launcher/
└── release/
    └── NeuroGame Launcher Setup 1.0.0.exe  ← AQUI!
```

---

## 🚀 PARA DISTRIBUIR

1. **Upload o instalador** para Google Drive, Dropbox, ou seu servidor
2. **Compartilhe o link** com usuários
3. **Usuários baixam e instalam**
4. **Backend precisa estar online** (localhost NÃO funciona para outros)

### **Para Backend Online (Produção):**
Ver documentação completa em: `neurogame-backend/DEPLOY_VERCEL.md`

---

## ✅ CHECKLIST RÁPIDO

- [ ] Backend rodando (port 3000)
- [ ] Admin rodando (port 3001)
- [ ] Instalador criado (release/)
- [ ] Launcher instalado e aberto
- [ ] Login funcionando com `Admin123`
- [ ] Jogos aparecendo no launcher
- [ ] Teste de solicitação funcionando

---

**🎮 Pronto! Sistema funcionando 100%**

📚 Mais detalhes: [README.md](README.md) | [ACESSO_RAPIDO.md](ACESSO_RAPIDO.md)
