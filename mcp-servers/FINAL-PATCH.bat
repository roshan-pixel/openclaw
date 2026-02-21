@echo off

echo ========================================
echo OPENCLAW COMPLETE SYSTEM - ULTIMATE GOD MODE
echo ========================================
echo.
echo Killing any previous processes...
echo ========================================

REM Kill by window title (best effort)
taskkill /F /FI "WINDOWTITLE eq Ollama*" >nul 2>&1
taskkill /F /FI "WINDOWTITLE eq LiteLLM*" >nul 2>&1
taskkill /F /FI "WINDOWTITLE eq MCP Server*" >nul 2>&1
taskkill /F /FI "WINDOWTITLE eq Log Bridge*" >nul 2>&1
taskkill /F /FI "WINDOWTITLE eq Enhanced Gateway*" >nul 2>&1
taskkill /F /FI "WINDOWTITLE eq Adapter*" >nul 2>&1

REM Kill by executable name (fallback)
taskkill /F /IM "ollama.exe" >nul 2>&1
taskkill /F /IM "litellm.exe" >nul 2>&1
taskkill /F /IM "python.exe" /FI "WINDOWTITLE eq *gateway*" >nul 2>&1

echo All previous processes terminated.
echo Waiting 3 seconds...
timeout /t 3 /nobreak >nul
echo.

echo ========================================
echo Starting ULTIMATE God Mode Stack...
echo ========================================
echo.
echo This starts ALL services:
echo - Ollama (11434) - DeepSeek R1 Local LLM
echo - Windows MCP Server (21 tools via stdio)
echo - WhatsApp Log Bridge (5001) - Activity logging
echo - ULTIMATE Gateway (18788) - God Mode + USETOOL parser
echo.

REM Check directory
if not exist "openclaw_enhanced_gateway_ULTIMATE.py" (
    echo ERROR: openclaw_enhanced_gateway_ULTIMATE.py not found!
    echo Please run from the mcp-servers directory.
    pause
    exit /b 1
)

echo Step 1: Starting Ollama...
echo ========================================
tasklist /FI "IMAGENAME eq ollama.exe" 2>NUL | find /I /N "ollama.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo [OK] Ollama already running
) else (
    echo Starting Ollama...
    start "Ollama" ollama serve
    timeout /t 3 /nobreak >nul
    echo [OK] Ollama started
)
echo.

echo Step 2: Starting WhatsApp Log Bridge (Port 5001)...
echo ========================================
if exist "whatsapp_log_bridge_server.py" (
    start "Log Bridge" cmd /k "python whatsapp_log_bridge_server.py"
    timeout /t 2 /nobreak >nul
    echo [OK] Log Bridge started
) else (
    echo [SKIP] whatsapp_log_bridge_server.py not found
)
echo.

echo Step 3: Starting ULTIMATE Gateway (Port 18788)...
echo ========================================
echo This is the MAIN God Mode gateway with:
echo   - 21 MCP Windows tools
echo   - DeepSeek R1 via Ollama
echo   - USETOOL parser
echo   - OpenClaw /v1/responses endpoint
start "ULTIMATE Gateway 18788" cmd /k "python openclaw_enhanced_gateway_ULTIMATE.py"
timeout /t 8 /nobreak >nul
echo [OK] ULTIMATE Gateway started
echo.

echo ========================================
echo CHECKING SERVICES...
echo ========================================
timeout /t 3 /nobreak >nul
echo.
echo Active ports:
netstat -ano | findstr ":5001 :11434 :18788" | findstr "LISTENING"
echo.

echo ========================================
echo SYSTEM READY - GOD MODE ACTIVE!
echo ========================================
echo.
echo Stack running:
echo   [1] Ollama (11434) - DeepSeek R1
echo   [2] Log Bridge (5001) - Activity logs
echo   [3] ULTIMATE Gateway (18788) - God Mode
echo.
echo ========================================
echo IMPORTANT: OpenClaw Configuration
echo ========================================
echo.
echo Make sure your OpenClaw config points to ULTIMATE:
echo   File: %USERPROFILE%\.openclaw\openclaw.json
echo.
echo   Required setting:
echo   {
echo     "models": {
echo       "providers": {
echo         "openai": {
echo           "baseUrl": "http://localhost:18788/v1"
echo         }
echo       }
echo     }
echo   }
echo.
echo ========================================
echo TO START OPENCLAW:
echo ========================================
echo Open a new terminal and run:
echo   openclaw gateway
echo.
echo Then test with WhatsApp message:
echo   "Take a screenshot"
echo.
echo ========================================
echo MONITORING
echo ========================================
echo.
echo Watch the "ULTIMATE Gateway 18788" window for logs
echo All requests will show there with full debug info
echo.
echo To stop everything: Close all terminal windows or Ctrl+C in each
echo.
pause
