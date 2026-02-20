@echo off
echo ========================================
echo SYSTEM STATUS CHECK
echo ========================================
echo.

echo Checking services...
echo.

echo [1/5] Ollama (Port 11434):
netstat -ano | findstr ":11434" | findstr "LISTENING"
if %ERRORLEVEL%==0 (echo   ✅ Running) else (echo   ❌ Not running)
echo.

echo [2/5] LiteLLM (Port 4000):
netstat -ano | findstr ":4000" | findstr "LISTENING"
if %ERRORLEVEL%==0 (echo   ✅ Running) else (echo   ❌ Not running)
echo.

echo [3/5] Log Bridge (Port 5001):
netstat -ano | findstr ":5001" | findstr "LISTENING"
if %ERRORLEVEL%==0 (echo   ✅ Running) else (echo   ❌ Not running)
echo.

echo [4/5] Enhanced Gateway (Port 18789):
netstat -ano | findstr ":18789" | findstr "LISTENING"
if %ERRORLEVEL%==0 (echo   ✅ Running) else (echo   ❌ Not running)
echo.

echo [5/5] Testing API Health:
curl -s http://localhost:4000/health
echo.
curl -s http://localhost:5001/health
echo.
curl -s http://localhost:18789/health
echo.

echo ========================================
echo Ollama Models:
ollama list
echo.

echo ========================================
echo STATUS CHECK COMPLETE
echo ========================================
pause
