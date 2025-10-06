# 📦 Instaladores do NeuroGame Launcher

## ℹ️ Sobre esta Pasta

Os instaladores `.exe` do NeuroGame Launcher **não estão versionados no Git** devido ao tamanho (>80MB cada).

## 📥 Como Obter os Instaladores

### Opção 1: Compilar Localmente
```bash
cd neurogame-launcher
npm run build:win
```

O instalador será gerado em: `neurogame-launcher/dist-electron/`

### Opção 2: GitHub Releases (Recomendado para Produção)
Os instaladores oficiais serão disponibilizados nas [Releases do GitHub](https://github.com/GouveiaZx/NeuroGame/releases).

## 📋 Arquivos Nesta Pasta

### ✅ Versionados no Git:
- `README.md` - Este arquivo
- `LEIA-ME.txt` - Instruções para usuários finais
- `latest.yml` - Metadados para auto-atualização

### ❌ NÃO Versionados (muito grandes):
- `NeuroGame Launcher Setup 1.0.0.exe` - 82MB
- `NeuroGame Launcher Setup 1.0.1.exe` - 82MB

## 🚀 Versões Disponíveis

### v1.0.1 (Mais Recente) ⭐
- ✅ Conecta automaticamente ao backend de produção
- ✅ URL: `https://neurogame.onrender.com/api/v1`
- ✅ Favicon atualizado
- ✅ Sistema de auto-atualização funcionando

### v1.0.0 (Antiga)
- ⚠️ Configurado para localhost
- ⚠️ Requer configuração manual da URL

## 📝 Como Gerar Nova Versão

1. **Atualizar versão no package.json:**
   ```json
   "version": "1.0.2"
   ```

2. **Compilar:**
   ```bash
   cd neurogame-launcher
   npm run build:win
   ```

3. **Copiar para INSTALADORES:**
   ```bash
   cp "dist-electron/NeuroGame Launcher Setup 1.0.2.exe" ../INSTALADORES/
   cp dist-electron/latest.yml ../INSTALADORES/
   ```

4. **Criar GitHub Release:**
   - Vá em [Releases](https://github.com/GouveiaZx/NeuroGame/releases)
   - Click em "Draft a new release"
   - Tag: `v1.0.2`
   - Anexe o arquivo `.exe`
   - Publish release

## 🔄 Sistema de Auto-Atualização

O launcher verifica atualizações em:
```
https://neurogame.onrender.com/api/v1/downloads/latest.yml
```

Quando há nova versão, baixa de:
```
https://neurogame.onrender.com/api/v1/downloads/NeuroGame%20Launcher%20Setup%20{version}.exe
```

## 📊 Tamanho dos Instaladores

| Versão | Tamanho | Data |
|--------|---------|------|
| 1.0.0  | 82MB    | 2025-10-06 |
| 1.0.1  | 82MB    | 2025-10-06 |

## 💡 Dicas

- Use **Git LFS** se quiser versionar os instaladores
- Ou use **GitHub Releases** (recomendado)
- Mantenha pelo menos as 2 últimas versões para rollback

---

**Desenvolvido por NeuroGame Team**
