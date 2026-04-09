@echo off
cd /d "%~dp0"
set PORT=5500
title FileManager Frontend
echo.
echo   Servindo em http://127.0.0.1:%PORT%/
echo   O navegador abrira em instantes. Ctrl+C para encerrar.
echo.

python --version >nul 2>&1
if %errorlevel%==0 (
  start "" cmd /c "timeout /t 1 /nobreak >nul && start http://127.0.0.1:%PORT%/"
  python -m http.server %PORT%
  goto :eof
)
py --version >nul 2>&1
if %errorlevel%==0 (
  start "" cmd /c "timeout /t 1 /nobreak >nul && start http://127.0.0.1:%PORT%/"
  py -m http.server %PORT%
  goto :eof
)
echo [ERRO] Python nao encontrado no PATH.
echo        Instale Python e marque "Add python.exe to PATH", ou use:
echo        py -m http.server %PORT%
echo        nesta pasta.
pause
exit /b 1
