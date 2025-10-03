@echo off
echo ============================================
echo   NeuroGame Platform - Inicializacao Rapida
echo ============================================
echo.

echo [1/3] Iniciando Backend API...
start "NeuroGame Backend" cmd /k "cd neurogame-backend && npm run dev"
timeout /t 5 /nobreak >nul

echo [2/3] Iniciando Admin Dashboard...
start "NeuroGame Admin" cmd /k "cd neurogame-admin && npm run dev"
timeout /t 5 /nobreak >nul

echo [3/3] Iniciando Desktop Launcher...
start "NeuroGame Launcher" cmd /k "cd neurogame-launcher && npm run dev"

echo.
echo ============================================
echo   Todos os servicos foram iniciados!
echo ============================================
echo.
echo Backend API:        http://localhost:3000
echo Admin Dashboard:    http://localhost:5173
echo Launcher:           Janela Electron
echo.
echo Credenciais:
echo   Admin: admin / Admin@123456
echo   Demo:  demo / Demo@123456
echo.
echo Pressione qualquer tecla para fechar...
pause >nul
