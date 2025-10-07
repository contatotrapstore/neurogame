#!/bin/bash

# Instalador NeuroGame para macOS
# Este script usa AppleScript para pedir senha do usuário e instalar automaticamente

osascript <<'APPLESCRIPT'
tell application "Terminal"
    activate
    set currentPath to POSIX path of ((path to me as text) & "::")

    do script "clear && echo '╔════════════════════════════════════════╗' && echo '║   NeuroGame Launcher - Instalador     ║' && echo '╚════════════════════════════════════════╝' && echo '' && echo 'Instalando NeuroGame Launcher...' && echo '' && sleep 1"

    delay 1

    do script "sudo xattr -cr '/Applications/NeuroGame Launcher.app' 2>/dev/null; sudo chmod -R 755 '/Applications/NeuroGame Launcher.app' 2>/dev/null && echo '✅ Instalação concluída!' && echo '' && echo 'Abrindo NeuroGame Launcher...' && sleep 2 && open '/Applications/NeuroGame Launcher.app' && sleep 2 && exit" in front window

end tell
APPLESCRIPT
