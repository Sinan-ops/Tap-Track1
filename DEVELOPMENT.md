# Tap-Track Development Guide

## Project Overview

Tap-Track is a modern attendance tracking system built with React, Express.js, and PostgreSQL. It provides real-time check-in/check-out functionality, attendance analytics, user management, and comprehensive reporting features.

## Quick Start

### Prerequisites
- Node.js 16+ and npm
- PostgreSQL 12+
- Git

### Installation

1. **Clone and Setup**
```bash
# Navigate to project directory
cd tap-track

# Create environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

2. **Database Setup**
```bash
# Create database
createdb tap_track

# Load schema
psql -U postgres -d tap_track -f database/schema.sql
```

3. **Install Dependencies**
```bash
npm run install-all
```

4. **Start Development Servers**
```bash
# Start both frontend and backend
npm run dev

# Or separately:
npm run dev --workspace=backend  # Terminal 1
npm run dev --workspace=frontend # Terminal 2
```

5. **Access Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- Health Check: http://localhost:5000/api/health

### Demo Credentials
- Email: `admin@tap-track.local`
- Password: `password123`

## Project Structure

```
tap-track/
├── frontend/                    # React application
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   ├── pages/               # Page components
│   │   ├── services/            # API integration
│   │   ├── styles/              # CSS modules
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/                     # Express.js API
│   ├── src/
│   │   ├── routes/              # API endpoints
│   │   ├── controllers/         # Business logic
│   │   ├── models/              # Data models
│   │   ├── middleware/          # Express middleware
│   │   ├── utils/               # Utilities
│   │   └── server.js
│   ├── package.json
│   └── .env.example
│
├── database/                    # Database files
│   └── schema.sql               # PostgreSQL schema
│
├── docs/                        # Documentation
├── README.md
├── package.json
├── docker-compose.yml
└── .gitignore
```

## API Documentation

### Authentication
- `POST /api/auth/login` - User login (returns JWT token)
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Attendance
- `GET /api/attendance/stats` - Get attendance statistics
- `POST /api/attendance/checkin` - Record check-in
- `POST /api/attendance/checkout` - Record check-out
- `GET /api/attendance/user/:userId` - Get user attendance history

### Users (Admin only)
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user details
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Reports
- `GET /api/reports/attendance` - Generate attendance report
- `GET /api/reports/summary` - Get attendance summary
- `POST /api/reports/export` - Export data (CSV/JSON)

## Development Workflow

### Adding a New Feature

1. **Frontend Component**
```bash
# Create component
touch frontend/src/components/NewComponent.jsx
```

2. **Backend Endpoint**
```bash
# Add route in backend/src/routes/
# Add controller logic in backend/src/controllers/
```

3. **Database Changes**
```sql
-- Update database/schema.sql with new tables/columns
-- Apply migration: psql -U postgres -d tap_track -f database/migration.sql
```

### Testing

```bash
# Run backend tests
npm test --workspace=backend

# Run frontend tests
npm test --workspace=frontend
```

### Building for Production

```bash
# Build both frontend and backend
npm run build

# Using Docker
docker-compose build
docker-compose up -d
```

## Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/tap_track
JWT_SECRET=your-secret-key
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

## Deployment

### Using Docker Compose
```bash
# Start all services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f
```

### Environment Variables for Production
- Set secure `JWT_SECRET`
- Use production database URL
- Set `NODE_ENV=production`
- Update `REACT_APP_API_URL` to production endpoint

## Troubleshooting

### Port Already in Use
```bash
# Find process using port 5000
netstat -ano | findstr :5000
# Kill process
taskkill /PID <PID> /F
```

### Database Connection Error
- Verify PostgreSQL is running
- Check `DATABASE_URL` in `.env`
- Ensure database `tap_track` exists

### Node Modules Issues
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "Add new feature"

# Push and create pull request
git push origin feature/new-feature
```

## Code Style Guidelines

- Use ES6+ syntax
- Follow naming conventions (camelCase for variables, PascalCase for components)
- Comment complex logic
- Keep functions small and focused
- Use consistent indentation (2 spaces)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Support

For issues and questions, please create an issue in the repository or contact support@tap-track.local.
