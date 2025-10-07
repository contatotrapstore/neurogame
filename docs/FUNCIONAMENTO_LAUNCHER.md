# 🎮 Como Funciona o Launcher - Download Automático

**Data:** 06/10/2025
**Status:** ✅ Implementado e Funcionando

---

## 🚀 Comportamento do Launcher

### **1ª Vez (Após Instalar o Launcher)**

```
1. Usuário instala o launcher
2. Abre o launcher pela primeira vez
3. Faz login (admin@neurogame.com / Admin123)
4. Launcher detecta que não tem nenhum jogo instalado
5. Verifica no servidor quantos jogos existem
6. Encontra 13 jogos novos
7. BAIXA AUTOMATICAMENTE todos os 13 jogos
8. Mostra barra de progresso durante download
9. Valida checksums SHA-256
10. Instala os jogos em AppData/NeuroGame/Jogos/
11. Usuário já pode jogar!
```

**Tempo estimado:** ~5-10 minutos (depende da conexão, 237MB total)

---

### **Próximas Vezes (Uso Normal)**

```
1. Usuário abre o launcher
2. Faz login
3. Launcher verifica se há jogos NOVOS no servidor

   SE HOUVER JOGOS NOVOS:
   - Baixa automaticamente os novos jogos
   - Mostra notificação
   - Atualiza biblioteca

   SE NÃO HOUVER JOGOS NOVOS:
   - Prossegue normalmente
   - Mostra biblioteca com jogos já instalados
```

**Tempo:** Instantâneo (se não houver jogos novos)

---

## 📋 Fluxo Técnico

### **Ao Abrir o Launcher**

```javascript
// App.jsx - useEffect após autenticação

1. useEffect detecta que usuário está autenticado
2. Chama checkContentUpdates()
3. contentUpdater.checkAndDownloadNewGames() é executado:

   a) Busca jogos no servidor (API /games/updates)
   b) Compara com versão local (localStorage)
   c) Identifica jogos novos

   d) SE houver jogos novos:
      - downloadNewGames() para cada jogo
      - Download do ZIP do Render
      - Validação de checksum
      - Descompactação
      - Registro como instalado

   e) SE NÃO houver jogos novos:
      - Retorna hasNewGames: false
      - Nada é baixado
```

---

## 🔍 Verificação de Jogos Novos

### **Como o Launcher Sabe se Há Jogos Novos?**

O launcher mantém uma **versão do conteúdo** localmente:

```javascript
// localStorage ou electron-store
{
  "contentVersion": 1759798330700,  // Timestamp do último update
  "installedGames": [
    {
      "id": "93be773c-b20c-480b-86d4-7377fc55e247",
      "version": "1.2.0",
      "installedAt": "2025-10-06T12:00:00Z",
      "filePath": "C:/Users/.../Jogos/autorama/"
    },
    // ... outros jogos
  ]
}
```

### **Processo de Verificação:**

1. Launcher envia para API: `lastSyncVersion: 1759798330700`
2. API compara com versão atual no Supabase
3. API retorna:
   ```json
   {
     "hasUpdates": true,
     "newGames": 3,
     "contentVersion": 1759850000000,
     "games": [/* jogos novos */]
   }
   ```

---

## 📦 Download Automático

### **Método: checkAndDownloadNewGames()**

```javascript
// neurogame-launcher/src/services/contentUpdater.js

async checkAndDownloadNewGames(options = {}) {
  // 1. Verificar updates
  const updates = await this.checkForUpdates();

  // 2. Se não houver, retornar
  if (!updates.hasUpdates) {
    return { hasNewGames: false };
  }

  // 3. Se houver, baixar automaticamente
  const results = await this.downloadNewGames(updates.games);

  // 4. Atualizar versão local
  await this.updateContentVersion(updates.contentVersion);

  return {
    hasNewGames: true,
    downloadedCount: results.filter(r => r.success).length,
    games: updates.games
  };
}
```

---

## 🎯 Casos de Uso

### **Caso 1: Primeira Instalação**

| Passo | Ação | Resultado |
|-------|------|-----------|
| 1 | Instala launcher | Nenhum jogo instalado |
| 2 | Abre launcher | Tela de login |
| 3 | Faz login | Autenticado |
| 4 | Verifica jogos | 13 jogos novos detectados |
| 5 | Download automático | Todos os 13 jogos baixados |
| 6 | Biblioteca | 13 jogos prontos para jogar |

### **Caso 2: Admin Adiciona Jogo Novo**

| Passo | Ação | Resultado |
|-------|------|-----------|
| 1 | Admin adiciona "Jogo 14" | Banco atualizado |
| 2 | Usuário abre launcher | Login |
| 3 | Verifica jogos | 1 jogo novo detectado |
| 4 | Download automático | Jogo 14 baixado |
| 5 | Biblioteca | 14 jogos disponíveis |

### **Caso 3: Uso Normal (Sem Jogos Novos)**

| Passo | Ação | Resultado |
|-------|------|-----------|
| 1 | Abre launcher | Login |
| 2 | Verifica jogos | Nenhum jogo novo |
| 3 | Biblioteca | Jogos já instalados aparecem |
| 4 | Pode jogar | Imediatamente |

---

## ⚙️ Configuração

### **Onde Configurar:**

```javascript
// App.jsx - linha 53-56

const result = await contentUpdater.checkAndDownloadNewGames({
  autoDownload: true,   // true = download automático, false = só verificar
  showProgress: true    // true = mostrar progresso, false = silencioso
});
```

### **Opções:**

| Opção | Valor | Comportamento |
|-------|-------|---------------|
| autoDownload | `true` | Baixa automaticamente jogos novos |
| autoDownload | `false` | Só verifica, não baixa (mostra dialog) |
| showProgress | `true` | Mostra barra de progresso |
| showProgress | `false` | Download silencioso (background) |

---

## 📊 Verificação Periódica

Além da verificação ao fazer login, o launcher também verifica periodicamente:

```javascript
// App.jsx - linha 30

contentUpdater.startPeriodicCheck(30);  // 30 minutos
```

**Comportamento:**
- A cada 30 minutos, verifica se há jogos novos
- **NÃO** baixa automaticamente (só notifica)
- Usuário pode baixar manualmente quando quiser

---

## 🔧 Troubleshooting

### **Jogos não baixam automaticamente**

**Verificar:**
1. Conexão com internet
2. Backend está online: https://neurogame.onrender.com/api/v1/health
3. Downloads funcionam: https://neurogame.onrender.com/downloads/labirinto.zip
4. Logs do launcher (Console do Electron)

**Logs esperados:**
```
[ContentUpdater] Verificando novos jogos...
[ContentUpdater] 13 jogos novos encontrados
[ContentUpdater] Iniciando download automático de jogos novos...
[ContentUpdater] Baixando Autorama...
[ContentUpdater] Progresso download: 45.2%
[ContentUpdater] Download concluído: 13/13 jogos
[App] 13 jogos novos foram baixados automaticamente
```

### **Download travou**

**Causa:** Download grande ou conexão lenta

**Solução:**
- Aguardar (pode demorar 5-10min para 237MB)
- Verificar progresso no console
- Reiniciar launcher se necessário (retomará download)

---

## 📁 Estrutura de Arquivos

### **Onde os Jogos São Salvos:**

```
Windows:
C:\Users\{Usuario}\AppData\Local\NeuroGame\Jogos\
├── autorama\
│   └── autorama.exe
├── balao\
│   └── balao.exe
├── labirinto\
│   └── labirinto.exe
└── ...

Dados do Launcher:
C:\Users\{Usuario}\AppData\Roaming\NeuroGame\
├── config.json          # Configurações
├── installedGames.json  # Jogos instalados
└── contentVersion       # Versão do conteúdo
```

---

## ✅ Testes Realizados

### **Teste 1: Primeira Instalação**
- ✅ Launcher baixou todos os 13 jogos automaticamente
- ✅ Validação de checksum funcionou
- ✅ Jogos instalados corretamente
- ✅ Usuário pode jogar

### **Teste 2: Jogos Novos**
- ✅ Admin adiciona jogo novo no painel
- ✅ Launcher detecta jogo novo ao abrir
- ✅ Download automático executado
- ✅ Jogo aparece na biblioteca

### **Teste 3: Sem Jogos Novos**
- ✅ Launcher abre rapidamente
- ✅ Não faz downloads desnecessários
- ✅ Biblioteca carrega instantaneamente

---

## 📝 Resumo

| Situação | O Que Acontece |
|----------|----------------|
| **1ª vez** | Baixa TODOS os jogos (13) automaticamente |
| **Jogos novos** | Baixa APENAS os novos automaticamente |
| **Sem jogos novos** | Não baixa nada, abre direto |
| **Verificação periódica** | A cada 30min, verifica mas NÃO baixa |

---

## 🎉 Benefícios

✅ **Usuário não precisa baixar manualmente**
✅ **Jogos sempre atualizados**
✅ **Experiência seamless (sem fricção)**
✅ **Admin adiciona jogo → usuários recebem automaticamente**
✅ **Primeira vez: tudo pronto para jogar**

---

**Última atualização:** 06/10/2025
**Status:** ✅ Implementado e Funcionando
**Repositórios:** GitHub + GitLab
