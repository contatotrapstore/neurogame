# 📦 Sistema de Instalador e Auto-Atualização - NeuroGame

## ✅ O Que Foi Implementado

### 1. Sistema de Build e Distribuição

✅ **Electron Builder configurado** para criar instaladores profissionais
- Suporte para Windows (NSIS)
- Suporte para macOS (DMG)
- Suporte para Linux (AppImage/DEB)

✅ **Instalador Windows (NSIS)** com:
- Escolha de pasta de instalação
- Criação de atalhos (Desktop + Menu Iniciar)
- Desinstalador automático
- Execução após instalação

### 2. Sistema de Auto-Atualização

✅ **electron-updater** integrado no launcher
- Verifica atualizações ao iniciar (após 5 segundos)
- Download em background com barra de progresso
- Instalação com reinicialização automática
- Suporte a updates incrementais

✅ **Backend preparado** para servir updates
- Rota `/api/v1/downloads/` para listar arquivos
- Rota `/api/v1/downloads/latest.yml` para metadata
- Rota `/api/v1/downloads/:filename` para download
- Pasta `releases/` para armazenar instaladores

### 3. Gerenciamento de Versões

✅ **Script automatizado** (`release.js`) para:
- Incrementar versão automaticamente (patch/minor/major)
- Build do instalador
- Copiar arquivos para pasta de releases
- Gerar notas de release

✅ **Versionamento semântico** implementado:
- Patch: Bug fixes (1.0.0 → 1.0.1)
- Minor: Novas features (1.0.0 → 1.1.0)
- Major: Breaking changes (1.0.0 → 2.0.0)

### 4. Documentação Completa

✅ **Guias criados:**
- `GUIA_BUILD_INSTALADOR.md` - Guia completo técnico
- `SISTEMA_COMPLETO.md` - Visão geral da arquitetura
- `COMO_CRIAR_INSTALADOR.md` - Guia rápido para criar instalador
- `neurogame-launcher/build/README.md` - Instruções para ícones

---

## 🚀 Como Usar

### Criar Primeiro Instalador

```bash
# 1. Adicionar ícones (primeira vez)
# Coloque icon.ico, icon.icns, icon.png em neurogame-launcher/build/

# 2. Instalar dependências
cd neurogame-launcher
npm install

# 3. Voltar e criar release
cd ..
node release.js build
```

**Instalador gerado em:**
```
neurogame-backend/releases/NeuroGame Launcher Setup 1.0.0.exe
```

### Criar Nova Versão (Update)

```bash
# Bug fix
node release.js build patch

# Nova feature
node release.js build minor

# Grande atualização
node release.js build major
```

### Listar Releases Disponíveis

```bash
node release.js list
```

---

## 📁 Estrutura de Arquivos

### Arquivos Criados/Modificados

```
NeuroGame/
│
├── neurogame-launcher/
│   ├── main.js                          ✅ MODIFICADO
│   │   └── Sistema de auto-update integrado
│   │
│   ├── package.json                     ✅ MODIFICADO
│   │   ├── electron-updater adicionado
│   │   └── Configuração de build/publish
│   │
│   └── build/                           ✅ NOVA PASTA
│       └── README.md                    ✅ NOVO
│           └── Instruções para ícones
│
├── neurogame-backend/
│   ├── src/routes/
│   │   ├── downloads.js                 ✅ NOVO
│   │   │   └── Rotas para servir updates
│   │   │
│   │   └── index.js                     ✅ MODIFICADO
│   │       └── Rota downloads registrada
│   │
│   └── releases/                        ✅ NOVA PASTA
│       └── (instaladores ficam aqui)
│
├── release.js                           ✅ NOVO
│   └── Script de automação de releases
│
├── GUIA_BUILD_INSTALADOR.md            ✅ NOVO
│   └── Documentação técnica completa
│
├── SISTEMA_COMPLETO.md                 ✅ NOVO
│   └── Visão geral da arquitetura
│
├── COMO_CRIAR_INSTALADOR.md            ✅ NOVO
│   └── Guia rápido para criar instalador
│
└── README_INSTALADOR.md                ✅ NOVO (este arquivo)
    └── Resumo de tudo implementado
```

---

## 🔄 Fluxo de Auto-Atualização

### Como Funciona

1. **Usuário inicia o launcher** instalado (versão 1.0.0)

2. **Launcher verifica updates** (5s após iniciar)
   ```
   GET http://localhost:3000/api/v1/downloads/latest.yml
   ```

3. **Backend retorna metadata** da versão mais recente:
   ```yaml
   version: 1.0.1
   path: NeuroGame Launcher Setup 1.0.1.exe
   sha512: [hash]
   releaseDate: 2025-10-04
   ```

4. **Launcher compara versões**:
   - Atual: 1.0.0
   - Disponível: 1.0.1
   - Update disponível? ✅ SIM

5. **Mostra notificação** ao usuário:
   ```
   "Nova versão disponível: 1.0.1
    Deseja atualizar agora?"
   ```

6. **Usuário aceita**, launcher:
   - Baixa instalador em background
   - Mostra progresso: [████████░░] 80%
   - Ao completar, pergunta: "Instalar agora?"

7. **Usuário confirma**, launcher:
   - Fecha aplicação
   - Executa novo instalador
   - Instalador sobrescreve versão antiga
   - Launcher reabre automaticamente
   - Agora rodando versão 1.0.1 ✅

### Diagrama do Fluxo

```
┌─────────────┐
│  Launcher   │
│  (v1.0.0)   │
└──────┬──────┘
       │
       │ 1. Check updates
       ▼
┌─────────────────┐
│    Backend      │
│ GET latest.yml  │
└────────┬────────┘
         │
         │ 2. version: 1.0.1
         ▼
┌─────────────────────┐
│  Compara versões    │
│  1.0.0 < 1.0.1 ✅   │
└──────────┬──────────┘
           │
           │ 3. Notifica usuário
           ▼
┌────────────────────────┐
│  "Atualizar para       │
│   versão 1.0.1?"       │
│  [Sim]  [Depois]       │
└──────────┬─────────────┘
           │
           │ 4. Download
           ▼
┌────────────────────────┐
│  Download em background │
│  [████████░░] 80%      │
└──────────┬─────────────┘
           │
           │ 5. Completo
           ▼
┌────────────────────────┐
│  "Instalar agora?"     │
│  [Instalar] [Depois]   │
└──────────┬─────────────┘
           │
           │ 6. Instala
           ▼
┌────────────────────────┐
│  Reinicia launcher     │
│  Versão 1.0.1 ✅       │
└────────────────────────┘
```

---

## 🎯 Próximos Passos

### Obrigatório (antes de distribuir)

1. **Criar ícones oficiais** do NeuroGame
   - Contratar designer ou criar você mesmo
   - Formatos: ICO (Windows), ICNS (macOS), PNG (Linux)
   - Colocar em `neurogame-launcher/build/`

2. **Primeiro build de produção**
   ```bash
   node release.js build
   ```

3. **Testar instalador**
   - Instalar em máquina limpa (Windows)
   - Verificar se inicia corretamente
   - Testar todas as funcionalidades

### Opcional (melhorias)

1. **Code Signing** (Assinatura de Código)
   - Evita warning "Publisher desconhecido"
   - Requer certificado digital (~$300/ano)
   - Mais confiança dos usuários

2. **Configurar servidor de produção**
   - Hospedar backend em VPS/Cloud
   - Domínio próprio (ex: api.neurogame.com)
   - SSL/HTTPS obrigatório

3. **CDN para downloads**
   - AWS CloudFront, Cloudflare
   - Downloads mais rápidos globalmente
   - Reduz carga no servidor

---

## 📊 Comparação: Antes vs Depois

### ❌ Antes (Sem Instalador)

```
- Usuário baixa pasta ZIP
- Extrai manualmente
- Procura executável
- Cria atalho manual (se quiser)
- Updates manuais (baixar nova versão)
- Sem controle de versão
- Experiência não profissional
```

### ✅ Depois (Com Instalador)

```
- Usuário baixa instalador .exe
- Executa instalador (próximo, próximo, instalar)
- Atalhos criados automaticamente
- Launcher inicia automaticamente
- Updates automáticos notificados
- Controle de versão completo
- Experiência profissional (estilo Steam, Epic Games)
```

---

## 🛠️ Comandos de Referência Rápida

### Build e Release

```bash
# Criar release (incrementa versão)
node release.js build [patch|minor|major]

# Build manual (sem incrementar versão)
cd neurogame-launcher
npm run build:win

# Listar releases criados
node release.js list

# Apenas copiar arquivos para releases/
node release.js copy
```

### Desenvolvimento

```bash
# Instalar dependências
cd neurogame-launcher && npm install

# Rodar em modo dev
cd neurogame-launcher && npm run dev

# Build de produção
cd neurogame-launcher && npm run build
```

### Backend

```bash
# Iniciar backend (servir updates)
cd neurogame-backend && npm run dev

# Listar releases disponíveis
curl http://localhost:3000/api/v1/downloads/

# Baixar instalador específico
curl http://localhost:3000/api/v1/downloads/NeuroGame%20Launcher%20Setup%201.0.0.exe -o installer.exe
```

---

## 📈 Métricas e Monitoramento

### Rastrear Versões Instaladas

```sql
-- Quantos usuários em cada versão
SELECT
  launcher_version,
  COUNT(DISTINCT user_id) as usuarios
FROM launcher_sessions
WHERE last_heartbeat > NOW() - INTERVAL '24 hours'
GROUP BY launcher_version
ORDER BY launcher_version DESC;
```

### Rastrear Taxa de Atualização

```sql
-- Velocidade de adoção de nova versão
SELECT
  DATE(last_heartbeat) as dia,
  launcher_version,
  COUNT(DISTINCT user_id) as usuarios
FROM launcher_sessions
WHERE launcher_version IN ('1.0.0', '1.0.1')
GROUP BY dia, launcher_version
ORDER BY dia, launcher_version;
```

---

## 🔧 Troubleshooting

### Update não funciona

**Verificar:**
1. Backend está rodando? `npm run dev`
2. Arquivo `latest.yml` existe em `releases/`?
3. URL correta no `package.json`?
4. Versão instalada < versão no `latest.yml`?

**Debug:**
```bash
# Ver logs do launcher (DevTools)
# Procurar por: [updater]

# Testar URL manualmente
curl http://localhost:3000/api/v1/downloads/latest.yml
```

### Build falha

**Soluções:**
```bash
# Limpar e reconstruir
rm -rf neurogame-launcher/dist*
rm -rf neurogame-launcher/node_modules
cd neurogame-launcher
npm install
cd ..
node release.js build
```

### Instalador com warning de segurança

**Normal!** Windows mostra warning para apps não assinados.

**Solução permanente:**
- Comprar certificado code signing (~$300/ano)
- Assinar executável com certificado
- Windows não mostrará mais warning

**Solução temporária:**
- Usuários clicam "Mais informações" → "Executar assim mesmo"

---

## 📚 Recursos Adicionais

### Documentação

- [GUIA_BUILD_INSTALADOR.md](GUIA_BUILD_INSTALADOR.md) - Guia técnico completo
- [SISTEMA_COMPLETO.md](SISTEMA_COMPLETO.md) - Arquitetura do sistema
- [COMO_CRIAR_INSTALADOR.md](COMO_CRIAR_INSTALADOR.md) - Guia rápido

### Links Úteis

- [Electron Builder](https://www.electron.build/)
- [electron-updater](https://www.electron.build/auto-update)
- [Ícone Converter](https://www.icoconverter.com/)
- [Code Signing Certificate](https://www.digicert.com/signing/code-signing-certificates)

---

## ✅ Checklist Final

Antes de distribuir para usuários:

- [ ] Ícones oficiais adicionados
- [ ] Versão testada em dev
- [ ] Instalador criado com `node release.js build`
- [ ] Instalador testado em máquina limpa
- [ ] Backend configurado para servir updates
- [ ] URL de updates correta no `package.json`
- [ ] Documentação para usuários criada
- [ ] Canal de suporte definido (email, Discord, etc.)

---

## 🎉 Conclusão

Você agora tem um **sistema completo de distribuição** para o NeuroGame Launcher!

### O que foi entregue:

✅ Instalador profissional estilo Steam/Epic Games
✅ Sistema de auto-atualização automático
✅ Processo de release automatizado
✅ Backend pronto para servir updates
✅ Documentação completa
✅ Scripts de automação

### Como usar:

```bash
# Criar instalador
node release.js build

# Distribuir
# Arquivo gerado: neurogame-backend/releases/NeuroGame Launcher Setup 1.0.0.exe

# Updates futuros
node release.js build patch
# Usuários receberão notificação automática!
```

**Sistema pronto para produção!** 🚀

---

*Desenvolvido com ❤️ para o NeuroGame*
*Data: Outubro 2025*
