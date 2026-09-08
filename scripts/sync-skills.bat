@echo off
chcp 65001 > nul
echo ============================================================
echo   TISA AI Video Editor - Dong bo Skills sang Global Config
echo ============================================================
echo.

set "SCRIPT_DIR=%~dp0"
set "REPO_ROOT=%SCRIPT_DIR%.."
set "AGENTS_SKILLS=%REPO_ROOT%\.agents\skills"
set "TARGET_DIR=%USERPROFILE%\.gemini\config\skills"

if not exist "%AGENTS_SKILLS%" (
    echo [LOI] Khong tim thay thu muc: %AGENTS_SKILLS%
    pause
    exit /b 1
)

echo Dang dong bo skills vao: %TARGET_DIR%
echo.

if not exist "%TARGET_DIR%" mkdir "%TARGET_DIR%"

for /d %%D in ("%AGENTS_SKILLS%\*") do (
    echo  - Dang sao chep skill: %%~nxD ...
    robocopy "%%D" "%TARGET_DIR%\%%~nxD" /E /NFL /NDL /NJH /NJS /nc /ns /np > nul
)

echo.
echo [THANH CONG] Toan bo 9 skills da duoc dong bo vao Global Config!
echo Gio day ban co the su dung cac lenh slash (/thuy-style-oneshot, /tisa-ai-editor-agent...) tren may nay.
echo.
pause
