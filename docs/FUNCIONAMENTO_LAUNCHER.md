# 🎮 Como Funciona o Launcher - Download Automático e Fullscreen

**Data:** 07/10/2025
**Status:** ✅ Implementado e Funcionando
**Versão:** 1.0.5

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

## 🖥️ Sistema de Fullscreen (v1.0.5)

### **Características do Fullscreen**

O launcher possui um sistema avançado de fullscreen com controles inteligentes:

#### **1. Ativação do Fullscreen**
- **Botão:** Click no ícone de fullscreen (canto superior direito)
- **Tecla:** Pressione F11 a qualquer momento
- **Automático:** Alguns jogos podem ativar fullscreen internamente

#### **2. Controles Auto-Hide**
```
Ao entrar em fullscreen:
1. Hint aparece: "Pressione ESC para sair do jogo" (4 segundos)
2. Controles ficam visíveis por 3 segundos
3. Controles desaparecem automaticamente
4. Mover o mouse traz os controles de volta
5. Controles desaparecem novamente após 3s de inatividade
```

#### **3. Saída do Fullscreen**
- **ESC:** Sai do jogo completamente
- **F11:** Sai apenas do fullscreen (continua no jogo)
- **Botão X:** Fecha o jogo
- **Botão Fullscreen:** Alterna entre fullscreen/normal

### **Implementação Técnica**

#### **a) Auto-Hide de Controles**
```javascript
// GameWebView.jsx
- Overlay com opacity 0-1 (não display none)
- z-index máximo: 2147483647
- Timer de 3 segundos de inatividade
- Reaparece instantaneamente com movimento do mouse
```

#### **b) ESC em Múltiplos Níveis**
```javascript
// Captura em TODOS os níveis:
1. window.addEventListener('keydown', handler, true) // useCapture=true
2. Script injetado no webview com useCapture=true
3. Dupla proteção para garantir funcionalidade
```

#### **c) Indicador Visual**
```javascript
// Hint de ESC
- Aparece por 4 segundos ao entrar em fullscreen
- Fade in/out suave
- position: fixed com z-index máximo
- Não bloqueia interação
```

### **Estados do Fullscreen**

| Estado | Overlay Visível | ESC Funciona | F11 Funciona |
|--------|-----------------|--------------|--------------|
| Normal | ✅ Sempre | ✅ Sim | ✅ Sim |
| Fullscreen (mouse parado) | ⚠️ Oculto (3s) | ✅ Sim | ✅ Sim |
| Fullscreen (mouse movendo) | ✅ Visível | ✅ Sim | ✅ Sim |
| Fullscreen (hover botão) | ✅ Visível | ✅ Sim | ✅ Sim |

### **Troubleshooting Fullscreen**

#### **Controles não aparecem ao mover mouse**
**Causa:** Mouse não está se movendo suficientemente

**Solução:**
- Mova o mouse mais vigorosamente
- Os controles devem aparecer instantaneamente
- Se não aparecerem, pressione ESC (sempre funciona)

#### **ESC não funciona**
**Causa:** Muito raro, mas pode acontecer se o jogo capturar o evento

**Solução:**
1. Pressione ESC novamente (múltiplas vezes se necessário)
2. Pressione F11 para sair do fullscreen
3. Click no botão X vermelho (mova o mouse para aparecer)
4. Alt+Tab para sair do launcher

#### **Fullscreen não ativa**
**Causa:** Navegador do jogo pode bloquear fullscreen

**Solução:**
- Use F11 ao invés do botão
- Alguns jogos precisam de interação do usuário primeiro
- Click dentro do jogo antes de tentar fullscreen

### **Benefícios do Sistema**

✅ **Imersão total** - Controles desaparecem para não distrair
✅ **Sempre acessível** - ESC funciona em TODOS os cenários
✅ **UX intuitiva** - Movimento do mouse traz controles de volta
✅ **Feedback visual** - Hint mostra como sair
✅ **Performance** - Usando opacity, não display (sem reflow)
✅ **Compatibilidade** - Funciona com todos os jogos

---

## 📁 Estrutura de Arquivos v1.0.5

### **Onde os Jogos São Salvos:**

```
Windows:
C:\Users\{Usuario}\AppData\Roaming\neurogame-launcher\
├── config.json              # Configurações (electron-store)
└── Jogos\
    ├── autorama\
    │   └── index.html
    ├── balao\
    │   └── index.html
    ├── batalha-de-tanques\
    │   └── index.html
    ├── cabeca-de-metal\
    │   └── index.html
    ├── coleta-de-lixo\
    │   └── index.html
    ├── jogo-da-velha\
    │   └── index.html
    ├── labirinto\
    │   └── index.html
    ├── memoria\
    │   └── index.html
    ├── quebra-cabeca\
    │   └── index.html
    ├── quiz\
    │   └── index.html
    ├── snake\
    │   └── index.html
    ├── space-invaders\
    │   └── index.html
    └── tetris\
        └── index.html

Downloads Temporários:
C:\Users\{Usuario}\AppData\Local\Temp\neurogame-downloads\
└── {game-slug}.zip  # Removido após extração
```

**Nota:** Os jogos agora são salvos em `%APPDATA%\Roaming\neurogame-launcher\Jogos` ao invés de `Program Files`, eliminando a necessidade de permissões de administrador.

---

**Última atualização:** 07/10/2025
**Status:** ✅ v1.0.5 - Implementado e Funcionando
**Repositório:** https://github.com/GouveiaZx/NeuroGame
