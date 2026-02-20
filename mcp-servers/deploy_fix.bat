@echo off
REM ============================================================
REM MCP Server Fix Deployment Script
REM Automatically deploys the ultra-clean MCP server
REM ============================================================

echo.
echo ============================================================
echo MCP SERVER FIX DEPLOYMENT
echo ============================================================
echo.

REM Check we're in the right directory
if not exist "windows_mcp_server.py" (
    echo ERROR: windows_mcp_server.py not found!
    echo Please run this script from the mcp-servers directory
    pause
    exit /b 1
)

if not exist "windows_mcp_server_ultraclean.py" (
    echo ERROR: windows_mcp_server_ultraclean.py not found!
    echo Please copy the ultra-clean server file to this directory first
    pause
    exit /b 1
)

echo Step 1: Backup current server
echo ============================================================
if exist "windows_mcp_server_backup.py" (
    echo Previous backup found, creating timestamped backup...
    for /f "tokens=2-4 delims=/ " %%a in ('date /t') do (set mydate=%%c%%a%%b)
    for /f "tokens=1-2 delims=/:" %%a in ('time /t') do (set mytime=%%a%%b)
    set timestamp=%mydate%_%mytime%
    copy windows_mcp_server.py windows_mcp_server_backup_%timestamp%.py >nul
    echo Backed up to: windows_mcp_server_backup_%timestamp%.py
) else (
    copy windows_mcp_server.py windows_mcp_server_backup.py >nul
    echo Backed up to: windows_mcp_server_backup.py
)
echo.

echo Step 2: Deploy ultra-clean server
echo ============================================================
copy windows_mcp_server_ultraclean.py windows_mcp_server.py >nul
echo Ultra-clean server deployed as windows_mcp_server.py
echo.

echo Step 3: Verify deployment
echo ============================================================
python -c "import os; print('File size:', os.path.getsize('windows_mcp_server.py'), 'bytes')" 2>nul
if errorlevel 1 (
    echo WARNING: Could not verify file size
) else (
    echo Server file updated successfully
)
echo.

echo Step 4: Test server imports
echo ============================================================
python -c "import sys; sys.stderr=open('nul','w'); from mcp.server import Server; print('✓ MCP imports OK')" 2>nul
if errorlevel 1 (
    echo WARNING: MCP imports failed - check Python environment
) else (
    echo ✓ MCP library available
)
echo.

echo Step 5: Check diagnostic tools
echo ============================================================
if exist "diagnose_mcp_stdio.py" (
    echo ✓ Diagnostic tool available
    echo   Run: python diagnose_mcp_stdio.py
) else (
    echo ⚠ Diagnostic tool not found (optional)
)

if exist "minimal_screenshot_mcp.py" (
    echo ✓ Minimal test server available
) else (
    echo ⚠ Minimal test server not found (optional)
)
echo.

echo ============================================================
echo DEPLOYMENT COMPLETE
echo ============================================================
echo.
echo Next steps:
echo.
echo 1. Stop all running services:
echo    - Close any running Gateway windows
echo    - Stop Ollama if running
echo.
echo 2. Start the system:
echo    - Run: FINAL-PATCH.bat
echo    - OR manually start services
echo.
echo 3. Check the logs:
echo    - ULTIMATE Gateway should show: "21 tools discovered"
echo    - Check: mcp_execution.log for MCP activity
echo.
echo 4. Test from WhatsApp:
echo    - Send: "Take a screenshot"
echo    - Should receive screenshot image
echo.
echo 5. If problems persist:
echo    - Run: python diagnose_mcp_stdio.py
echo    - Check output for specific errors
echo.
echo ============================================================
echo.

echo Would you like to:
echo   1. Start the system now (run FINAL-PATCH.bat)
echo   2. Run diagnostics first (python diagnose_mcp_stdio.py)
echo   3. Exit and start manually
echo.
choice /c 123 /n /m "Enter choice (1, 2, or 3): "

if errorlevel 3 goto :manual
if errorlevel 2 goto :diagnostics
if errorlevel 1 goto :start_system

:start_system
echo.
echo Starting system...
if exist "FINAL-PATCH.bat" (
    call FINAL-PATCH.bat
) else (
    echo ERROR: FINAL-PATCH.bat not found
    echo Please start services manually
    pause
)
goto :end

:diagnostics
echo.
echo Running diagnostics...
if exist "diagnose_mcp_stdio.py" (
    python diagnose_mcp_stdio.py 2>&1 | more
    echo.
    echo Diagnostics complete. Check output above.
    pause
) else (
    echo ERROR: diagnose_mcp_stdio.py not found
    echo Please copy the diagnostic script first
    pause
)
goto :end

:manual
echo.
echo Exiting. Start services manually when ready.
echo.
pause
goto :end

:end
echo.
echo Done.
