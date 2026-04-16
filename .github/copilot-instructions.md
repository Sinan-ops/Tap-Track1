<!-- Use this file to provide workspace-specific custom instructions to Copilot -->

## Project Setup Checklist for tap-track

- [x] Verify that the copilot-instructions.md file in the .github directory is created.
- [x] Clarify Project Requirements
- [x] Scaffold the Project
- [x] Customize the Project
- [x] Install Required Extensions (No extensions required - using built-in tools)
- [x] Compile the Project (Node.js packages ready for npm install)
- [x] Create and Run Task (.vscode/tasks.json created)
- [x] Launch the Project (See Getting Started below)
- [x] Ensure Documentation is Complete (README.md, INSTALLATION.md, DEVELOPMENT.md created)

## Project Details

**Name:** tap-track
**Version:** 1.0.0
**Type:** Full-stack attendance tracking system
**Stack:** React 18 (frontend), Express.js (backend), PostgreSQL (database)
**Build Tool:** Vite (frontend), Node.js (backend)

## Key Features

✅ Real-time check-in/check-out system
✅ Attendance analytics dashboard
✅ User management (admin, employee/student roles)
✅ Reporting and export functionality
✅ Modern UI with responsive design
✅ JWT-based authentication
✅ Role-based access control

## Technology Stack

**Frontend:**
- React 18 with React Router
- Vite as build tool
- Axios for API calls
- Responsive CSS design

**Backend:**
- Express.js server
- PostgreSQL database
- JWT authentication
- bcryptjs for password encryption

**Infrastructure:**
- Docker & Docker Compose support
- Environment-based configuration
- Cross-platform setup (Windows/macOS/Linux)

## Getting Started

### Quick Setup (5 minutes)

1. **Install Prerequisites**
   - Node.js 16+ (https://nodejs.org/)
   - PostgreSQL 12+ (https://www.postgresql.org/)

2. **Database Setup**
   ```bash
   createdb tap_track
   psql -U postgres -d tap_track -f database/schema.sql
   ```

3. **Install Dependencies**
   ```bash
   npm run install-all
   ```

4. **Configure Environment**
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

5. **Start Development**
   ```bash
   npm run dev
   ```

6. **Access Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api
   - Demo: admin@tap-track.local / password123

### Docker Setup (Alternative)
```bash
docker-compose up -d
# Access at http://localhost:3000
```

## Project Structure

```
tap-track/
├── frontend/                 # React app (port 3000)
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API integration
│   │   └── styles/           # CSS styles
│   ├── vite.config.js
│   └── package.json
│
├── backend/                  # Express API (port 5000)
│   ├── src/
│   │   ├── routes/           # API endpoints
│   │   ├── middleware/       # Auth & error handling
│   │   └── utils/            # Database & JWT
│   ├── package.json
│   └── server.js
│
├── database/
│   └── schema.sql            # PostgreSQL schema
│
├── .github/
│   └── copilot-instructions.md
├── README.md                 # Project overview
├── INSTALLATION.md           # Setup guide
├── DEVELOPMENT.md            # Dev workflow
├── API_TESTING.md            # API examples
└── docker-compose.yml

## Documentation

- **[README.md](../README.md)** - Project overview and features
- **[INSTALLATION.md](../INSTALLATION.md)** - Detailed setup guide
- **[DEVELOPMENT.md](../DEVELOPMENT.md)** - Development workflow
- **[API_TESTING.md](../API_TESTING.md)** - API endpoint testing

## Important Scripts

```bash
npm run dev              # Start both frontend and backend
npm run build            # Build both for production
npm run install-all      # Install all dependencies

# Individual workspace commands
npm run dev --workspace=frontend
npm run dev --workspace=backend
```

## Database

- **Type:** PostgreSQL
- **Default Port:** 5432
- **Database:** tap_track
- **Schema:** Pre-configured in database/schema.sql
  - Users table (authentication)
  - Attendance records (check-in/out logs)
  - Departments table
  - Roles table

## API Endpoints

**Authentication:**
- POST `/api/auth/login`
- POST `/api/auth/register`
- POST `/api/auth/logout`

**Attendance:**
- GET `/api/attendance/stats`
- POST `/api/attendance/checkin`
- POST `/api/attendance/checkout`
- GET `/api/attendance/user/:userId`

**Users (Admin):**
- GET `/api/users`
- GET `/api/users/:id`
- PUT `/api/users/:id`
- DELETE `/api/users/:id`

**Reports:**
- GET `/api/reports/attendance`
- GET `/api/reports/summary`
- POST `/api/reports/export`

See [API_TESTING.md](../API_TESTING.md) for detailed examples.

## Troubleshooting

### Port Already in Use
```powershell
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>
```

### Database Connection Error
- Ensure PostgreSQL is running
- Verify DATABASE_URL in backend/.env
- Run schema: `psql -U postgres -d tap_track -f database/schema.sql`

### Dependencies Install Error
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## Environment Variables

**Backend (.env):**
```
PORT=5000
DATABASE_URL=postgresql://postgres:password@localhost:5432/tap_track
JWT_SECRET=tap-track-secret-key
NODE_ENV=development
```

**Frontend (.env):**
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

## Next Steps

1. Follow [INSTALLATION.md](../INSTALLATION.md) for detailed setup
2. Review [DEVELOPMENT.md](../DEVELOPMENT.md) for development workflow
3. Test API endpoints using [API_TESTING.md](../API_TESTING.md)
4. Explore the codebase and start building!

## Support

- Check [INSTALLATION.md](../INSTALLATION.md) for setup issues
- Review [API_TESTING.md](../API_TESTING.md) for API help
- See [DEVELOPMENT.md](../DEVELOPMENT.md) for development questions
