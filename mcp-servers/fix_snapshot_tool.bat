@echo off
REM ============================================================
REM Fix Snapshot Tool - Replace Hanging Version
REM ============================================================

echo.
echo ============================================================
echo SNAPSHOT TOOL FIX
echo ============================================================
echo.

cd /d "%~dp0"

if not exist "tools\snapshot_tool.py" (
    echo ERROR: snapshot_tool.py not found!
    pause
    exit /b 1
)

if not exist "snapshot_tool_fixed.py" (
    echo ERROR: snapshot_tool_fixed.py not found!
    echo Please download it first to this directory.
    pause
    exit /b 1
)

echo Step 1: Backup original snapshot tool
echo ============================================================
copy tools\snapshot_tool.py tools\snapshot_tool_backup.py >nul
echo Backed up to: tools\snapshot_tool_backup.py
echo.

echo Step 2: Deploy fixed snapshot tool
echo ============================================================
copy snapshot_tool_fixed.py tools\snapshot_tool.py >nul
echo Fixed snapshot tool deployed
echo.

echo Step 3: Verify deployment
echo ============================================================
python -c "from tools.snapshot_tool import SnapshotTool; print('✓ Import successful')" 2>nul
if errorlevel 1 (
    echo WARNING: Import test failed
    echo Restoring backup...
    copy tools\snapshot_tool_backup.py tools\snapshot_tool.py >nul
    pause
    exit /b 1
)
echo ✓ Tool imports correctly
echo.

echo ============================================================
echo FIX DEPLOYED SUCCESSFULLY
echo ============================================================
echo.
echo The snapshot tool has been fixed:
echo   - Removed hanging accessibility tree call
echo   - Fast screenshot capture only
echo   - No Windows UI Automation delays
echo.
echo Next: Restart your system with FINAL-PATCH.bat
echo.
pause
