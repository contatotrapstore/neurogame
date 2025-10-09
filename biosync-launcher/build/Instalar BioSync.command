#!/bin/bash

# Script de Instalação Automática - NeuroGame Launcher
# Clique duas vezes para instalar automaticamente

clear
echo "╔════════════════════════════════════════╗"
echo "║   NeuroGame Launcher - Instalador     ║"
echo "║        Instalação Automática          ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Obter o diretório onde o script está (dentro do DMG)
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
APP_SOURCE="$SCRIPT_DIR/NeuroGame Launcher.app"
APP_DEST="/Applications/NeuroGame Launcher.app"

# Passo 1: Copiar para Applications
echo "📦 Passo 1/2: Instalando o aplicativo..."
if [ -d "$APP_SOURCE" ]; then
    # Remover instalação antiga se existir
    if [ -d "$APP_DEST" ]; then
        echo "   Removendo versão anterior..."
        rm -rf "$APP_DEST"
    fi

    # Copiar novo app
    cp -R "$APP_SOURCE" "/Applications/"

    if [ $? -eq 0 ]; then
        echo "   ✅ App instalado em /Applications"
    else
        echo "   ❌ Erro ao copiar. Tente arrastar manualmente para Applications."
        exit 1
    fi
else
    # Verificar se já está em Applications
    if [ ! -d "$APP_DEST" ]; then
        echo "   ❌ App não encontrado. Arraste NeuroGame Launcher.app para Applications."
        exit 1
    else
        echo "   ℹ️  App já está instalado em /Applications"
    fi
fi

echo ""
echo "🔓 Passo 2/2: Removendo bloqueio de segurança do macOS..."

# Remover todos os atributos de quarentena
xattr -cr "$APP_DEST" 2>/dev/null

# Remover especificamente o atributo de quarentena
xattr -d com.apple.quarantine "$APP_DEST" 2>/dev/null

# Dar permissões de execução
chmod -R +x "$APP_DEST/Contents/MacOS/"* 2>/dev/null

if [ $? -eq 0 ]; then
    echo "   ✅ Bloqueio removido com sucesso!"
else
    echo "   ⚠️  Aviso: Algumas permissões podem precisar de confirmação"
fi

echo ""
echo "════════════════════════════════════════"
echo "✅ INSTALAÇÃO CONCLUÍDA COM SUCESSO! ✅"
echo "════════════════════════════════════════"
echo ""
echo "🎮 O NeuroGame Launcher está pronto para uso!"
echo ""
echo "   Você pode:"
echo "   • Fechar esta janela"
echo "   • Encontrar o app em Applications"
echo "   • Abrir pelo Launchpad ou Spotlight"
echo ""
echo "⚠️  Se ainda aparecer aviso de segurança:"
echo "   1. Vá em Configurações do Sistema"
echo "   2. Privacidade e Segurança"
echo "   3. Clique em 'Abrir Mesmo Assim'"
echo ""

# Tentar abrir o app
sleep 2
open "$APP_DEST" 2>/dev/null

echo "Pressione qualquer tecla para fechar..."
read -n 1 -s
