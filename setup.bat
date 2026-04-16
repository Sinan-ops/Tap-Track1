@echo off

REM Tap-Track Setup Script for Windows

echo 🚀 Setting up Tap-Track...

REM Create .env files
echo 📝 Creating environment files...

if not exist "backend\.env" (
    copy backend\.env.example backend\.env
    echo ✓ Backend .env created
) else (
    echo ✓ Backend .env already exists
)

if not exist "frontend\.env" (
    copy frontend\.env.example frontend\.env
    echo ✓ Frontend .env created
) else (
    echo ✓ Frontend .env already exists
)

echo.
echo 📦 Installing dependencies...
echo.
echo To continue:
echo 1. Start PostgreSQL
echo 2. Create database: createdb tap_track
echo 3. Run schema: psql -U postgres -d tap_track -f database/schema.sql
echo 4. Install dependencies: npm run install-all
echo 5. Start backend: npm run dev --workspace=backend
echo 6. Start frontend: npm run dev --workspace=frontend
echo.
echo Or use Docker Compose: docker-compose up -d
echo.
pause
