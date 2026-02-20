@echo off
REM ============================================================
REM Restart OpenClaw with Fixed Config
REM ============================================================

echo.
echo ============================================================
echo RESTARTING OPENCLAW WITH FIXED CONFIG
echo ============================================================
echo.

echo Step 1: Stopping any running services...
echo ============================================================
taskkill /F /IM node.exe /FI "WINDOWTITLE eq *openclaw*" 2>nul
taskkill /F /IM python.exe /FI "WINDOWTITLE eq *gateway*" 2>nul
timeout /t 2 >nul
echo Services stopped
echo.

echo Step 2: Verifying config is valid...
echo ============================================================
cd C:\Users\sgarm\.openclaw
if not exist "openclaw.json" (
    echo ERROR: Config file missing!
    if exist "openclaw.json.bak" (
        echo Restoring from backup...
        copy openclaw.json.bak openclaw.json >nul
    ) else (
        echo No backup found! Please fix manually.
        pause
        exit /b 1
    )
)
echo Config file exists
echo.

echo Step 3: Starting system...
echo ============================================================
cd C:\Users\sgarm\openclaw-repos\openclaw\mcp-servers

if exist "FINAL-PATCH.bat" (
    echo Running FINAL-PATCH.bat...
    call FINAL-PATCH.bat
) else (
    echo ERROR: FINAL-PATCH.bat not found!
    echo Please start services manually:
    echo   1. Start Ollama
    echo   2. Start ULTIMATE Gateway: python openclaw_enhanced_gateway_ULTIMATE.py
    echo   3. Start OpenClaw: openclaw gateway
    pause
    exit /b 1
)

echo.
echo ============================================================
echo SYSTEM RESTARTED
echo ============================================================
echo.
echo Now test from WhatsApp by sending: hello
echo.
