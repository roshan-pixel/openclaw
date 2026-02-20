@echo off
echo.
echo ========================================
echo OPENCLAW API KEY DIAGNOSTIC
echo ========================================
echo.

echo [1] Checking Environment Variables...
echo ----------------------------------------
set | findstr /I "ANTHROPIC GEMINI OPENCLAW"
echo.

echo [2] Checking .env File Location...
echo ----------------------------------------
cd /d %~dp0
if exist .env (
    echo [✓] .env file found
    echo Content:
    type .env
) else (
    echo [✗] .env file NOT FOUND!
)
echo.

echo [3] Checking OpenClaw Config...
echo ----------------------------------------
openclaw config get auth.profiles
echo.

echo [4] Checking OpenClaw Config File Location...
echo ----------------------------------------
echo Config file should be at: %USERPROFILE%\.openclaw\openclaw.json
if exist "%USERPROFILE%\.openclaw\openclaw.json" (
    echo [✓] Config file found
    echo Showing auth section:
    findstr /C:"auth" /C:"anthropic" /C:"apiKey" "%USERPROFILE%\.openclaw\openclaw.json"
) else (
    echo [✗] Config file NOT FOUND!
)
echo.

echo [5] Running OpenClaw Doctor...
echo ----------------------------------------
openclaw doctor
echo.

echo ========================================
echo DIAGNOSTIC COMPLETE
echo ========================================
pause
