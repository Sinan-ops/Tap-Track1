@echo off
REM Tap-Track Complete Setup Script for Windows (Run as Administrator)
REM This script will install all dependencies and set up tap-track

echo.
echo ================================
echo Tap-Track Complete Setup
echo ================================
echo.

REM Check if running as administrator
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo ERROR: This script must be run as Administrator!
    echo Please right-click on this file and select "Run as Administrator"
    pause
    exit /b 1
)

echo [1/6] Installing Node.js...
if exist "%TEMP%\node-installer.msi" (
    start /wait msiexec /i "%TEMP%\node-installer.msi" /quiet /norestart
    echo ✓ Node.js installed
) else (
    echo ✗ Node.js installer not found in temp folder
    echo Please download from: https://nodejs.org/dist/v18.19.0/node-v18.19.0-x64.msi
)

echo.
echo [2/6] Installing PostgreSQL...
echo Please download PostgreSQL from: https://www.postgresql.org/download/windows/
echo Install with password 'password' for postgres user
pause

echo.
echo [3/6] Refreshing environment...
setx /M NODEJS_HOME "%ProgramFiles%\nodejs"
set "PATH=%PATH%;%ProgramFiles%\nodejs"

echo.
echo [4/6] Verifying installations...
node --version
npm --version
echo.

REM Now do the app setup
cd /d "%~dp0"

echo [5/6] Setting up Tap-Track...
echo.
echo Creating environment files...
if not exist "backend\.env" (
    copy backend\.env.example backend\.env
    echo ✓ Backend .env created
)

if not exist "frontend\.env" (
    copy frontend\.env.example frontend\.env
    echo ✓ Frontend .env created
)

echo.
echo Setting up database...
echo Please ensure PostgreSQL is running and execute these commands in PostgreSQL:
echo.
echo   createdb tap_track
echo   psql -U postgres -d tap_track -f database/schema.sql
echo.
pause

echo.
echo [6/6] Installing npm dependencies...
call npm run install-all

echo.
echo ================================
echo Setup Complete!
echo ================================
echo.
echo Next steps:
echo 1. Ensure PostgreSQL database is created and schema is loaded
echo 2. Update backend/.env and frontend/.env if needed
echo 3. Run: npm run dev
echo 4. Open http://localhost:3000
echo.
pause
