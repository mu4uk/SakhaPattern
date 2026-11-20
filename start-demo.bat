@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo.
echo === SakhaPattern: запуск для демонстрации ===
echo.

rem 1) Портативный Node внутри папки проекта: SakhaPattern\node-portable\node-v22.23.5-win-x64
set "NODE_DIR=%~dp0node-portable\node-v22.23.5-win-x64"

rem 2) Портативный Node рядом с папкой проекта на флешке: E:\node-v22.23.5-win-x64
if not exist "%NODE_DIR%\node.exe" set "NODE_DIR=%~dp0..\node-v22.23.5-win-x64"

if exist "%NODE_DIR%\node.exe" (
  set "PATH=%NODE_DIR%;%PATH%"
  echo Используется портативный Node.js: %NODE_DIR%
) else (
  echo Портативный Node.js не найден, используется системный Node.js.
)

where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo ОШИБКА: Node.js не найден.
  echo Установите Node.js 18+ с https://nodejs.org/
  echo либо положите папку node-v22.23.5-win-x64 рядом с папкой SakhaPattern.
  echo.
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo Устанавливаю зависимости. Нужен интернет при первом запуске.
  call npm install
  if errorlevel 1 (
    echo Не удалось установить зависимости.
    pause
    exit /b 1
  )
)

echo.
echo Запускаю сервер. Откройте в браузере: http://localhost:5173
echo Для остановки нажмите Ctrl+C в этом окне.
echo.

call npm run dev -- --open
pause
