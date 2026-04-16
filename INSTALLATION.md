# Tap-Track Installation Guide

## System Requirements

- **Node.js**: 16.x or higher
- **npm**: 8.x or higher
- **PostgreSQL**: 12.x or higher
- **Git**: Latest version

## Installation Steps

### Step 1: Prerequisites Setup

#### Windows
1. Install PostgreSQL from https://www.postgresql.org/download/windows/
2. Install Node.js from https://nodejs.org/
3. Install Git from https://git-scm.com/

#### macOS
```bash
# Using Homebrew
brew install postgresql
brew install node
brew install git
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib nodejs npm git
```

### Step 2: Database Setup

#### Create Database
```bash
# Login to PostgreSQL
psql -U postgres

# In PostgreSQL shell
CREATE DATABASE tap_track;
\q
```

#### Load Schema
```bash
# Navigate to project directory
cd tap-track

# Load database schema
psql -U postgres -d tap_track -f database/schema.sql
```

### Step 3: Environment Configuration

#### Backend Configuration
```bash
cd backend
cp .env.example .env
# Edit .env with your settings
```

**Backend .env file:**
```
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:password@localhost:5432/tap_track
JWT_SECRET=your-secret-key-here
CORS_ORIGIN=http://localhost:3000
```

#### Frontend Configuration
```bash
cd frontend
cp .env.example .env
# Edit .env with your settings
```

**Frontend .env file:**
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

### Step 4: Install Dependencies

```bash
# From root directory
npm run install-all

# Or individually
cd backend && npm install
cd ../frontend && npm install
```

### Step 5: Start Development

#### Option 1: Separate Terminals
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

#### Option 2: Concurrently
```bash
npm run dev
```

#### Option 3: Docker
```bash
docker-compose up -d
```

### Step 6: Access Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **API Health**: http://localhost:5000/api/health

## Login

Use these demo credentials:
- **Email**: admin@tap-track.local
- **Password**: password123

## Troubleshooting

### Port Already in Use

**Windows:**
```powershell
# Find process on port
Get-NetTCPConnection -LocalPort 5000

# Kill process
Stop-Process -Id <PID> -Force
```

**macOS/Linux:**
```bash
# Find process on port
lsof -i :5000

# Kill process
kill -9 <PID>
```

### PostgreSQL Connection Issues

```bash
# Test connection
psql -U postgres -d tap_track -c "SELECT version();"

# Check if PostgreSQL is running
sudo service postgresql status  # Linux
pg_ctl -D /usr/local/var/postgres status  # macOS
```

### Node Modules Issues

```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Database Permission Issues

```bash
# Reset database owner
psql -U postgres -d tap_track -c "ALTER DATABASE tap_track OWNER TO postgres;"
```

## Next Steps

1. Review [DEVELOPMENT.md](./DEVELOPMENT.md) for development workflow
2. Check [API Documentation](./README.md#api-documentation) for API endpoints
3. Explore project structure in [README.md](./README.md#project-structure)

## Getting Help

- Check existing issues on GitHub
- Review error logs in console
- Contact support@tap-track.local
