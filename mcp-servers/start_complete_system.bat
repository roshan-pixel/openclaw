@echo off
echo ========================================
echo OPENCLAW COMPLETE SYSTEM STARTUP
echo ========================================
echo.

REM Check if running in correct directory
if not exist "openclaw_enhanced_gateway.py" (
    echo Error: Please run this script from the mcp-servers directory
    echo Location: %~dp0
    pause
    exit /b 1
)

echo Step 1: Starting Ollama (if not running)...
echo ========================================
tasklist /FI "IMAGENAME eq ollama.exe" 2>NUL | find /I /N "ollama.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo Ollama already running
) else (
    echo Starting Ollama...
    start "Ollama" ollama serve
    timeout /t 3 /nobreak >nul
)
echo.

echo Step 2: Starting LiteLLM Proxy...
echo ========================================
start "LiteLLM" cmd /k "litellm --config litellm_config.yaml --port 4000"
timeout /t 5 /nobreak >nul
echo.

echo Step 3: Starting MCP Server (21 Tools)...
echo ========================================
cd /d %~dp0
start "MCP Server" cmd /k "python windows_mcp_server.py"
timeout /t 3 /nobreak >nul
echo.

echo Step 4: Starting WhatsApp Log Bridge...
echo ========================================
start "Log Bridge" cmd /k "python whatsapp_log_bridge_server.py"
timeout /t 3 /nobreak >nul
echo.

echo Step 5: Starting Enhanced Gateway...
echo ========================================
start "Enhanced Gateway" cmd /k "python openclaw_enhanced_gateway.py"
timeout /t 3 /nobreak >nul
echo.

echo ========================================
echo ALL SERVICES STARTED!
echo ========================================
echo.
echo Services running:
echo   - Ollama (Port 11434) - Local LLM
echo   - LiteLLM (Port 4000) - Proxy
echo   - MCP Server (21 Tools) - Windows automation
echo   - Log Bridge (Port 5001) - Activity logging
echo   - Enhanced Gateway (Port 18789) - WhatsApp handler
echo.
echo Testing services...
echo ========================================

timeout /t 5 /nobreak >nul

echo.
echo Testing port connectivity...
netstat -ano | findstr ":4000 :5001 :11434 :18789"
echo.

echo ========================================
echo SYSTEM READY!
echo ========================================
echo.
echo Send a WhatsApp message to test!
echo.
pause
