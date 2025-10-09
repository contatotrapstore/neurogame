#!/bin/bash

# Script de Instalação Automática - NeuroGame Launcher para macOS
# Este script remove as restrições do Gatekeeper e instala o app

echo "╔════════════════════════════════════════╗"
echo "║   NeuroGame Launcher - Instalador     ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Encontrar o caminho do app
APP_PATH="/Applications/NeuroGame Launcher.app"

# Verificar se o app está na pasta Applications
if [ ! -d "$APP_PATH" ]; then
    # Procurar no diretório atual (dentro do DMG)
    CURRENT_DIR="$(cd "$(dirname "$0")" && pwd)"
    if [ -d "$CURRENT_DIR/NeuroGame Launcher.app" ]; then
        echo "📦 Copiando NeuroGame Launcher para Applications..."
        cp -R "$CURRENT_DIR/NeuroGame Launcher.app" "/Applications/"
        if [ $? -eq 0 ]; then
            echo "✅ App copiado com sucesso!"
        else
            echo "❌ Erro ao copiar o app. Você pode precisar arrastar manualmente."
            exit 1
        fi
    else
        echo "❌ App não encontrado. Por favor, arraste NeuroGame Launcher.app para Applications primeiro."
        exit 1
    fi
fi

echo ""
echo "🔓 Removendo restrições de segurança do macOS..."

# Remover quarentena e atributos estendidos
xattr -cr "$APP_PATH" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ Restrições removidas com sucesso!"
    echo ""
    echo "🎮 Abrindo NeuroGame Launcher..."
    open "$APP_PATH"
    echo ""
    echo "✅ Instalação concluída!"
    echo ""
    echo "Se ainda aparecer algum aviso:"
    echo "1. Vá em Configurações do Sistema"
    echo "2. Privacidade e Segurança"
    echo "3. Clique em 'Abrir Mesmo Assim'"
else
    echo "⚠️  Não foi possível remover as restrições automaticamente."
    echo ""
    echo "Por favor, execute este comando no Terminal:"
    echo "xattr -cr '/Applications/NeuroGame Launcher.app'"
    echo ""
    echo "Ou vá em:"
    echo "Configurações do Sistema > Privacidade e Segurança > Abrir Mesmo Assim"
fi

echo ""
read -p "Pressione ENTER para fechar..."
