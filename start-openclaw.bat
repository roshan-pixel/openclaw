@echo off
cd /d C:\Users\sgarm\openclaw-repos\openclaw

echo Stopping existing gateway...
openclaw gateway stop
timeout /t 2 /nobreak >nul

echo Loading environment variables from .env...
for /f "usebackq delims== tokens=1,2" %%i in (".env") do (
    echo Setting %%i
    set "%%i=%%j"
)

echo.
echo Verifying API keys loaded:
if defined ANTHROPIC_API_KEY (
    echo [✓] ANTHROPIC_API_KEY is set
) else (
    echo [✗] ANTHROPIC_API_KEY NOT FOUND!
)

if defined GEMINI_API_KEY (
    echo [✓] GEMINI_API_KEY is set
) else (
    echo [✗] GEMINI_API_KEY NOT FOUND!
)

echo.
echo Starting OpenClaw Gateway...
openclaw gateway
