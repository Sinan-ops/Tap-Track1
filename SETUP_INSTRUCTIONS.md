# Tap-Track Complete Setup - Quick Instructions

## ⚠️ ADMIN PRIVILEGES REQUIRED

Due to security restrictions, Node.js and PostgreSQL installation requires administrator privileges. Here's what you need to do:

### QUICK START (Recommended)

1. **Right-click PowerShell** and select "Run as Administrator"

2. **Copy and paste this command:**

```powershell
$ProgressPreference = 'SilentlyContinue'; $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine")+";"+[System.Environment]::GetEnvironmentVariable("Path","User"); if(-not (node --version 2>$null)) { Write-Host "Installing Node.js..." -ForegroundColor Yellow; $nodeurl="https://nodejs.org/dist/v18.19.0/node-v18.19.0-x64.msi"; $outpath="$env:TEMP\node-install.msi"; [Net.ServicePointManager]::SecurityProtocol=[Net.SecurityProtocolType]::Tls12; (New-Object Net.WebClient).DownloadFile($nodeurl,$outpath); Start-Process msiexec -ArgumentList "/i $outpath /quiet /norestart" -Wait; $env:Path=[System.Environment]::GetEnvironmentVariable("Path","Machine")+";"+[System.Environment]::GetEnvironmentVariable("Path","User"); node --version; npm --version } else { Write-Host "Node.js is already installed: $(node --version)" -ForegroundColor Green }
```

3. **Wait for installation to complete**

### Manual Installation (If Above Doesn't Work)

**Install Node.js:**
- Visit: https://nodejs.org/en/download/
- Download: Windows Installer (.msi) for Node 18 LTS
- Run the installer and click "Next" through all screens

**Install PostgreSQL:**
- Visit: https://www.postgresql.org/download/windows/
- Download PostgreSQL 15
- Run installer, set postgres password to **password123**

**Refresh PowerShell** and verify:
```powershell
node --version
npm --version
psql --version
```

---

## After Prerequisites Are Installed

Run this in PowerShell (as Administrator):

```powershell
cd "C:\Users\StepIn Solution\Desktop\Tap-Track"

# Create environment files
Copy-Item backend\.env.example backend\.env
Copy-Item frontend\.env.example frontend\.env

# Create database
psql -U postgres -c "CREATE DATABASE tap_track;"
psql -U postgres -d tap_track -f database/schema.sql

# Install dependencies
npm run install-all

# Verify everything
node --version
npm --version
