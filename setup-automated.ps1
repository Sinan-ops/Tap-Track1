# Tap-Track Complete Automated Setup Script
# Run in PowerShell as Administrator

# Check admin privileges
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")

if (-not $isAdmin) {
    Write-Host "ERROR: This script requires administrator privileges!" -ForegroundColor Red
    Write-Host "Please run PowerShell as Administrator and retry" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "`n╔════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  Tap-Track Complete Setup Script       ║" -ForegroundColor Cyan
Write-Host "║  Running with Administrator Privileges ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════╝`n" -ForegroundColor Cyan

# Function to check if command exists
function Test-CommandExists {
    param($command)
    $null = Get-Command $command -ErrorAction SilentlyContinue
    return $?
}

# Step 1: Check and Install Node.js
Write-Host "[1/7] Checking Node.js..." -ForegroundColor Yellow
if (Test-CommandExists node) {
    $nodeVersion = node --version
    Write-Host "✓ Node.js already installed: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "Installing Node.js v18.19.0..." -ForegroundColor Yellow
    $nodeUrl = "https://nodejs.org/dist/v18.19.0/node-v18.19.0-x64.msi"
    $nodeInstaller = "$env:TEMP\node-v18.19.0-x64.msi"
    
    Write-Host "  Downloading Node.js..." -ForegroundColor Gray
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    (New-Object Net.WebClient).DownloadFile($nodeUrl, $nodeInstaller)
    
    Write-Host "  Running installer..." -ForegroundColor Gray
    $process = Start-Process msiexec -ArgumentList "/i `"$nodeInstaller`" /quiet /norestart" -PassThru -Wait
    if ($process.ExitCode -eq 0) {
        Write-Host "✓ Node.js installed successfully" -ForegroundColor Green
        Remove-Item $nodeInstaller -Force
    } else {
        Write-Host "✗ Node.js installation failed with exit code: $($process.ExitCode)" -ForegroundColor Red
        exit 1
    }
}

# Refresh environment
$env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")

# Verify Node.js
if (Test-CommandExists node) {
    Write-Host "✓ Node.js verified: $(node --version)" -ForegroundColor Green
} else {
    Write-Host "⚠ Node.js not found in PATH, checking common locations..." -ForegroundColor Yellow
    $nodePaths = @(
        "C:\Program Files\nodejs\node.exe"
        "C:\Program Files (x86)\nodejs\node.exe"
    )
    foreach ($nodePath in $nodePaths) {
        if (Test-Path $nodePath) {
            $env:Path = "$env:Path;$(Split-Path $nodePath)"
            Write-Host "✓ Found Node.js at: $nodePath" -ForegroundColor Green
            break
        }
    }
}

# Step 2: Check PostgreSQL
Write-Host "`n[2/7] Checking PostgreSQL..." -ForegroundColor Yellow
if (Test-CommandExists psql) {
    $psqlVersion = psql --version
    Write-Host "✓ PostgreSQL already installed: $psqlVersion" -ForegroundColor Green
} else {
    Write-Host "⚠ PostgreSQL not found" -ForegroundColor Yellow
    Write-Host "Please install PostgreSQL manually from: https://www.postgresql.org/download/windows/" -ForegroundColor Cyan
    Read-Host "Press Enter after PostgreSQL is installed"
}

# Step 3: Navigate to project directory
Write-Host "`n[3/7] Setting up project directory..." -ForegroundColor Yellow
$projectDir = Split-Path -Parent $PSCommandPath
if (-not (Test-Path "$projectDir\backend\package.json")) {
    Write-Host "⚠ This script should be run from the tap-track root directory" -ForegroundColor Yellow
    $projectDir = Read-Host "Enter the tap-track directory path"
}
Set-Location $projectDir
Write-Host "✓ Working directory: $(Get-Location)" -ForegroundColor Green

# Step 4: Create environment files
Write-Host "`n[4/7] Creating environment files..." -ForegroundColor Yellow
if (-not (Test-Path "backend\.env")) {
    Copy-Item "backend\.env.example" "backend\.env"
    Write-Host "✓ Backend .env created" -ForegroundColor Green
} else {
    Write-Host "✓ Backend .env already exists" -ForegroundColor Green
}

if (-not (Test-Path "frontend\.env")) {
    Copy-Item "frontend\.env.example" "frontend\.env"
    Write-Host "✓ Frontend .env created" -ForegroundColor Green
} else {
    Write-Host "✓ Frontend .env already exists" -ForegroundColor Green
}

# Step 5: Setup Database
Write-Host "`n[5/7] Setting up database..." -ForegroundColor Yellow
if (Test-CommandExists psql) {
    Write-Host "  Creating database..." -ForegroundColor Gray
    psql -U postgres -c "CREATE DATABASE tap_track;" 2>$null
    Write-Host "✓ Database created (or already exists)" -ForegroundColor Green
    
    Write-Host "  Loading schema..." -ForegroundColor Gray
    psql -U postgres -d tap_track -f "database/schema.sql" 2>$null
    Write-Host "✓ Database schema loaded" -ForegroundColor Green
} else {
    Write-Host "⚠ PostgreSQL not available, please create database manually:" -ForegroundColor Yellow
    Write-Host "  createdb tap_track" -ForegroundColor Gray
    Write-Host "  psql -U postgres -d tap_track -f database/schema.sql" -ForegroundColor Gray
}

# Step 6: Install npm dependencies
Write-Host "`n[6/7] Installing npm dependencies..." -ForegroundColor Yellow
Write-Host "  Backend dependencies..." -ForegroundColor Gray
Set-Location backend
npm install --silent
Set-Location ..
Write-Host "✓ Backend dependencies installed" -ForegroundColor Green

Write-Host "  Frontend dependencies..." -ForegroundColor Gray
Set-Location frontend
npm install --silent
Set-Location ..
Write-Host "✓ Frontend dependencies installed" -ForegroundColor Green

# Step 7: Verify installation
Write-Host "`n[7/7] Verifying installation..." -ForegroundColor Yellow
Write-Host "  Node.js: $(node --version)" -ForegroundColor Gray
Write-Host "  npm: $(npm --version)" -ForegroundColor Gray
if (Test-CommandExists psql) {
    Write-Host "  PostgreSQL: $(psql --version)" -ForegroundColor Gray
}

# Final summary
Write-Host "`n╔════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║  ✓ Setup Complete!                     ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════╝`n" -ForegroundColor Green

Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Start backend:  npm run dev --workspace=backend" -ForegroundColor Gray
Write-Host "  2. Start frontend: npm run dev --workspace=frontend" -ForegroundColor Gray
Write-Host "  3. Or run both:    npm run dev" -ForegroundColor Gray
Write-Host "  4. Open browser:   http://localhost:3000" -ForegroundColor Gray
Write-Host "  5. Login with:     admin@tap-track.local / password123" -ForegroundColor Gray

Write-Host "`nFor more information, see INSTALLATION.md`n" -ForegroundColor Yellow
