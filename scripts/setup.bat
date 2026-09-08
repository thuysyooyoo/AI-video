@echo off
chcp 65001 > nul
echo ============================================================
echo      TISA AI Video Editor - Cai Dat & Kiem Tra 1-Click
echo ============================================================
echo.

set "SCRIPT_DIR=%~dp0"
set "REPO_ROOT=%SCRIPT_DIR%.."
cd /d "%REPO_ROOT%"

echo [1/4] Kiem tra Node.js va npm...
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [CANH BAO] Khong tim thay Node.js trong PATH. Vui long cai dat Node.js 18+ hoac 20+.
) else (
    node -v
)

echo.
echo [2/4] Cai dat Node packages (Remotion)...
call npm install

echo.
echo [3/4] Thiet lap moi truong Python (.venv)...
if not exist ".venv" (
    echo Dang tao moi truong ao .venv...
    python -m venv .venv
)

if exist ".venv\Scripts\python.exe" (
    echo Dang cai dat Python dependencies tu requirements.txt...
    call .venv\Scripts\python.exe -m pip install --upgrade pip
    call .venv\Scripts\python.exe -m pip install -r requirements.txt
    echo.
    echo [4/4] Kiem tra toan dien bang scripts\doctor.py...
    call .venv\Scripts\python.exe scripts\doctor.py
) else (
    echo [CANH BAO] Khong the tao .venv. Dang thu pip truc tiep...
    pip install -r requirements.txt
    python scripts\doctor.py
)

echo.
echo ============================================================
echo   HOAN TAT! Neu muon dong bo skills vao Global Config:
echo   Hay chay them file: scripts\sync-skills.bat
echo ============================================================
echo.
pause
