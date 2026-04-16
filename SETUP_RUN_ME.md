# Tap-Track Setup - Step by Step Guide

## ⚠️ Admin Privileges Required

To complete the setup, you need to run commands as **Administrator**. Here's how:

---

## OPTION 1: Fast Automated Setup (Recommended)

### 1. Right-click on File Explorer
   - Navigate to: `C:\Users\StepIn Solution\Desktop\Tap-Track`
   - Right-click on `setup-automated.ps1`
   - Select "Run with PowerShell"
   - A new window will appear
   - Click "Yes" when prompted for admin access

### 2. Wait for the script to complete
   - The script will:
     - Download and install Node.js
     - Detect or prompt for PostgreSQL
     - Create environment files
     - Set up the database
     - Install all npm dependencies
   - It will show ✓ checkmarks as it completes each step

### 3. Once complete, run the app:
   ```bash
   npm run dev
   ```

---

## OPTION 2: Manual Step-by-Step Setup

### Step 1: Install Prerequisites

**Install Node.js**
- Go to https://nodejs.org/en/download/
- Download: Windows Installer (LTS version, 18+)
- Run the installer and click "Next" through all steps
- Choose to install npm when prompted

**Install PostgreSQL**
- Go to https://www.postgresql.org/download/windows/
- Download PostgreSQL 15
- Run installer:
  - Choose default options
  - Set password: `password123`
  - Port: 5432
  - Locale: Default

### Step 2: Verify Installation

Open PowerShell (as Administrator) and run:
```powershell
node --version
npm --version
psql --version
```

You should see version numbers for all three.

### Step 3: Create Database

In PowerShell (as Administrator):
```powershell
cd "C:\Users\StepIn Solution\Desktop\Tap-Track"

# Create database
psql -U postgres -c "CREATE DATABASE tap_track;"

# Load schema
psql -U postgres -d tap_track -f database/schema.sql
```

### Step 4: Create Environment Files

In PowerShell:
```powershell
# Create .env files
Copy-Item backend\.env.example backend\.env
Copy-Item frontend\.env.example frontend\.env
```

### Step 5: Install Dependencies

In PowerShell:
```powershell
npm run install-all
```

### Step 6: Start Development

```powershell
npm run dev
```

---

## OPTION 3: Docker Setup (If You Have Docker Installed)

```bash
docker-compose up -d
```

Then access at: http://localhost:3000

---

## After Setup is Complete

### Start the Application

**Terminal 1 (Backend):**
```bash
npm run dev --workspace=backend
```

**Terminal 2 (Frontend):**
```bash
npm run dev --workspace=frontend
```

Or run both together:
```bash
npm run dev
```

### Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api

### Demo Login

- **Email**: admin@tap-track.local
- **Password**: password123

---

## Troubleshooting

### "node is not recognized"
- Node.js may not be installed or PATH not updated
- Restart PowerShell and try again
- Or reinstall Node.js

### "psql is not recognized"
- PostgreSQL may not be installed
- Or try with full path: `C:\Program Files\PostgreSQL\15\bin\psql`

### "Port already in use"
```powershell
# Find process using port 5000
Get-NetTCPConnection -LocalPort 5000

# Kill it
Stop-Process -Id <PID> -Force
```

### "Database tap_track already exists"
- This is normal, you can ignore it
- Or drop and recreate:
```bash
psql -U postgres -c "DROP DATABASE tap_track;"
psql -U postgres -c "CREATE DATABASE tap_track;"
psql -U postgres -d tap_track -f database/schema.sql
```

---

## Getting Help

If you encounter issues:
1. Read the error message carefully
2. Check [INSTALLATION.md](./INSTALLATION.md) for detailed troubleshooting
3. Verify all prerequisites are installed and in PATH
4. Try running in a fresh PowerShell window with admin privileges

---

**Let me know which option you'd like to use, and I can help with any specific issues!**
