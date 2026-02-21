@echo off
:: Check for administrator privileges
net session >nul 2>&1
if %errorLevel% == 0 (
    echo Running with Administrator privileges...
) else (
    echo ========================================
    echo REQUESTING ADMINISTRATOR PRIVILEGES
    echo ========================================
    echo This script needs admin rights for proper execution.
    echo Relaunching with admin privileges...
    echo.

    :: Relaunch with admin rights
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

echo ========================================
echo OPENCLAW COMPLETE SYSTEM - ADVANCED
echo ========================================
echo.
echo Features:
echo   - Auto-kill previous services (except OpenClaw Gateway)
echo   - Administrator privileges
echo   - Health checks after startup
echo   - Automatic verification
echo.

REM Check directory
cd /d "%~dp0"
if not exist "openclaw_enhanced_gateway_PERMANENT.py" (
    echo [ERROR] Please ensure you're in the correct directory
    echo Location: %~dp0
    pause
    exit /b 1
)

echo ========================================
echo STEP 0: CLEANUP - Killing Previous Services
echo ========================================
echo.
echo Keeping OpenClaw Gateway alive (if running)...
echo Killing other services...
echo.

REM Kill Python processes (except OpenClaw Gateway)
taskkill /F /FI "WINDOWTITLE ne OpenClaw Gateway*" /IM python.exe 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Python processes stopped
) else (
    echo [INFO] No Python processes to kill
)

REM Kill LiteLLM
taskkill /F /IM litellm.exe 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] LiteLLM stopped
) else (
    echo [INFO] No LiteLLM process running
)

REM Kill specific port processes (except 18789 - OpenClaw Gateway)
echo.
echo Freeing ports (except 18789)...

for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":4000" ^| findstr "LISTENING"') do (
    echo Killing PID %%a on port 4000
    taskkill /F /PID %%a 2>nul
)

for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5001" ^| findstr "LISTENING"') do (
    echo Killing PID %%a on port 5001
    taskkill /F /PID %%a 2>nul
)

for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":18788" ^| findstr "LISTENING"') do (
    echo Killing PID %%a on port 18788
    taskkill /F /PID %%a 2>nul
)

echo.
echo [OK] Cleanup complete! Waiting 3 seconds...
timeout /t 3 /nobreak >nul
echo.

echo ========================================
echo STEP 1: STARTING SERVICES
echo ========================================
echo.

echo [1/5] Checking Ollama...
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

echo [2/5] Starting LiteLLM Proxy...
echo ========================================
start "LiteLLM" cmd /k "litellm --config litellm_config.yaml --port 4000"
echo [OK] LiteLLM starting...
timeout /t 8 /nobreak >nul
echo.

echo [3/5] Starting MCP Server (21 Tools)...
echo ========================================
cd /d "%~dp0"
start "MCP Server" cmd /k "python windows_mcp_server.py"
echo [OK] MCP Server starting...
timeout /t 5 /nobreak >nul
echo.

echo [4/5] Starting WhatsApp Log Bridge...
echo ========================================
start "Log Bridge" cmd /k "python whatsapp_log_bridge_PERMANENT.py"
echo [OK] Log Bridge starting...
timeout /t 5 /nobreak >nul
echo.

echo [5/5] Starting Enhanced Gateway (Port 18788)...
echo ========================================
start "Enhanced Gateway 18788" cmd /k "python openclaw_enhanced_gateway_PERMANENT.py"
echo [OK] Enhanced Gateway starting...
timeout /t 8 /nobreak >nul
echo.

echo ========================================
echo STEP 2: VERIFYING SERVICES
echo ========================================
echo.

echo Checking port connectivity...
netstat -ano | findstr ":4000 :5001 :11434 :18788 :18789"
echo.

echo ========================================
echo STEP 3: HEALTH CHECKS
echo ========================================
echo.

echo Testing LiteLLM (Port 4000)...
curl -s http://localhost:4000/health
echo.
echo.

echo Testing Log Bridge (Port 5001)...
curl -s http://localhost:5001/health
echo.
echo.

echo Testing Enhanced Gateway (Port 18788)...
curl -s http://localhost:18788/health
echo.
echo.

echo Testing OpenClaw Gateway (Port 18789)...
curl -s -o nul -w "HTTP Status: %%{http_code}" http://localhost:18789/health
echo.
echo.

echo ========================================
echo DEPLOYMENT COMPLETE!
echo ========================================
echo.
echo Services Status:
echo ----------------
echo   1. Ollama (11434)        - Local LLM Engine
echo   2. LiteLLM (4000)        - Proxy to Ollama
echo   3. MCP Server            - 21 Windows Tools
echo   4. Log Bridge (5001)     - Activity Logging
echo   5. Enhanced Gateway (18788) - Custom Webhooks
echo   6. OpenClaw Gateway (18789) - WhatsApp Handler
echo.
echo Gateway Options:
echo ----------------
echo   WhatsApp: Send to +918058363027 (uses port 18789)
echo   Webhook:  POST to http://localhost:18788/webhook
echo.
echo Features Active:
echo ----------------
echo   [x] 21 MCP Tools (Windows Automation)
echo   [x] Activity Logging (All messages tracked)
echo   [x] Local LLM (DeepSeek R1 - No API costs)
echo   [x] Conversation Memory (Last 10 messages)
echo   [x] Two Gateway System (No conflicts)
echo.
echo ========================================
echo QUICK COMMANDS:
echo ========================================
echo.
echo Test WhatsApp:
echo   Send message to +918058363027
echo.
echo Check All Ports:
echo   netstat -ano ^| findstr ":4000 :5001 :11434 :18788 :18789"
echo.
echo Check Health:
echo   curl http://localhost:4000/health
echo   curl http://localhost:5001/health
echo   curl http://localhost:18788/health
echo.
echo View Logs:
echo   type logs\enhanced_gateway.log
echo   type logs\whatsapp_activity.log
echo.
echo ========================================
echo SYSTEM READY FOR PRODUCTION!
echo ========================================
echo.
pause
