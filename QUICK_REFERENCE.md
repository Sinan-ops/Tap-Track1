# Tap-Track Quick Reference

## Common Commands

### Development
```bash
npm run dev              # Start both frontend and backend
npm run dev --workspace=frontend  # Frontend only
npm run dev --workspace=backend   # Backend only
```

### Installation
```bash
npm run install-all      # Install all dependencies
npm install --workspace=frontend  # Frontend deps
npm install --workspace=backend   # Backend deps
```

### Building
```bash
npm run build            # Build both
npm run build --workspace=frontend
npm run build --workspace=backend
```

### Database
```bash
# Create database
createdb tap_track

# Load schema
psql -U postgres -d tap_track -f database/schema.sql

# Connect to database
psql -U postgres -d tap_track
```

### Docker
```bash
docker-compose up -d     # Start all services
docker-compose down      # Stop all services
docker-compose logs -f   # View logs
docker-compose build     # Build images
```

## Ports

| Service | Port | URL |
|---------|------|-----|
| Frontend | 3000 | http://localhost:3000 |
| Backend | 5000 | http://localhost:5000 |
| PostgreSQL | 5432 | localhost |

## Demo Credentials

- **Email**: admin@tap-track.local
- **Password**: password123

## File Locations

| Component | Location |
|-----------|----------|
| Frontend Code | `frontend/src/` |
| Backend Code | `backend/src/` |
| Database Schema | `database/schema.sql` |
| Configuration | `.env` files |
| Documentation | `*.md` files |

## Environment Files

```
backend/.env          # Backend configuration
frontend/.env         # Frontend configuration
```

## Default Ports & Hosts

- Frontend: localhost:3000
- Backend: localhost:5000
- Database: localhost:5432
- Database Name: tap_track
- Database User: postgres

## Important Endpoints

```
GET  /api/health                  # Health check
POST /api/auth/login              # User login
POST /api/attendance/checkin      # Check-in
POST /api/attendance/checkout     # Check-out
GET  /api/attendance/stats        # Statistics
GET  /api/users                   # List users (admin)
GET  /api/reports/attendance      # Attendance report
```

## Project Structure

```
tap-track/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── utils/
│   │   └── server.js
│   ├── package.json
│   └── .env.example
├── database/
│   └── schema.sql
├── docs/
├── .github/
│   └── copilot-instructions.md
├── .vscode/
│   └── tasks.json
├── package.json
├── README.md
├── INSTALLATION.md
├── DEVELOPMENT.md
├── API_TESTING.md
└── docker-compose.yml
```

## Keyboard Shortcuts (VS Code)

- `Ctrl+~` - Open terminal
- `Ctrl+B` - Toggle sidebar
- `Ctrl+P` - Quick file open
- `Ctrl+Shift+P` - Command palette
- `F5` - Run task

## Useful VS Code Tasks

1. **Backend - Dev Server**: Starts development server
2. **Frontend - Dev Server**: Starts React dev server
3. **Database - Load Schema**: Loads database schema
4. **Build - Frontend**: Production build
5. **Build - Backend**: Production build

## API Authentication

All protected endpoints require:
```
Authorization: Bearer <JWT_TOKEN>
```

Obtain token from `/api/auth/login`

## Debugging

1. **Frontend**: Open DevTools (F12)
2. **Backend**: Check console output / logs
3. **Database**: Use `psql` or GUI tools

## Performance Tips

- Use browser DevTools to check network performance
- Enable HTTP compression in production
- Optimize database queries
- Use React DevTools for component debugging
- Monitor backend with `npm run dev` logs

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Port in use | Kill process: `taskkill /PID <PID> /F` |
| DB connection failed | Check `DATABASE_URL` in `.env` |
| Module not found | Run `npm install` in workspace |
| CORS error | Check `CORS_ORIGIN` in backend `.env` |

## Documentation Links

- [README.md](./README.md) - Project overview
- [INSTALLATION.md](./INSTALLATION.md) - Setup guide
- [DEVELOPMENT.md](./DEVELOPMENT.md) - Dev workflow
- [API_TESTING.md](./API_TESTING.md) - API examples

---

**Last Updated**: April 2, 2026
