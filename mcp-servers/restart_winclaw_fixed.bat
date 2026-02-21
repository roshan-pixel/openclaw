@echo off
REM ============================================================
REM Restart WinClaw with Fixed Config
REM ============================================================

echo.
echo ============================================================
echo RESTARTING WinClaw WITH FIXED CONFIG
echo ============================================================
echo.

echo Step 1: Stopping any running services...
echo ============================================================
taskkill /F /IM node.exe /FI "WINDOWTITLE eq *WinClaw*" 2>nul
taskkill /F /IM python.exe /FI "WINDOWTITLE eq *gateway*" 2>nul
timeout /t 2 >nul
echo Services stopped
echo.

echo Step 2: Verifying config is valid...
echo ============================================================
cd /d "%USERPROFILE%\.WinClaw"
if not exist "WinClaw.json" (
    echo ERROR: Config file missing!
    if exist "WinClaw.json.bak" (
        echo Restoring from backup...
        copy WinClaw.json.bak WinClaw.json >nul
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
cd /d "%~dp0"

if exist "FINAL-PATCH.bat" (
    echo Running FINAL-PATCH.bat...
    call FINAL-PATCH.bat
) else (
    echo ERROR: FINAL-PATCH.bat not found!
    echo Please start services manually:
    echo   1. Start Ollama
    echo   2. Start ULTIMATE Gateway: python WinClaw_enhanced_gateway_ULTIMATE.py
    echo   3. Start WinClaw: WinClaw gateway
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
