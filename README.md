# Tap-Track: Modern Attendance Tracking System

A full-stack attendance tracking system built with React, Express.js, and PostgreSQL for managing real-time check-in/check-out, attendance analytics, user management, and reporting.

## 🎯 Features

- **Real-time Check-in/Check-out**: Instant attendance recording with timestamps
- **Analytics Dashboard**: Visual representation of attendance data and trends
- **User Management**: Support for admin and employee/student roles
- **Reporting & Export**: Generate and export attendance reports
- **Modern UI**: Responsive design with intuitive interface
- **Role-based Access Control**: Different permissions for admins and users

## 🏗️ Project Structure

```
tap-track/
├── frontend/               # React frontend application
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service layer
│   │   └── styles/         # CSS styles
│   └── package.json
├── backend/                # Express.js backend server
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── controllers/     # Request handlers
│   │   ├── models/         # Database models
│   │   ├── middleware/     # Express middleware
│   │   └── utils/          # Utility functions
│   └── package.json
├── database/               # Database setup and migrations
│   └── schema.sql          # PostgreSQL schema
└── docs/                   # Documentation
```

## 🛠️ Tech Stack

- **Frontend**: React 18, Axios, React Router
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL
- **Authentication**: JWT
- **Styling**: CSS3, Responsive Design

## 📋 Prerequisites

- Node.js 16+ and npm
- PostgreSQL 12+
- Git

## 🚀 Getting Started

### 1. Setup Environment Variables

Create `.env` files in both `frontend` and `backend` directories:

**Backend (.env)**
```
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/tap_track
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

**Frontend (.env)**
```
REACT_APP_API_URL=http://localhost:5000/api
```

### 2. Install Dependencies

```bash
npm run install-all
```

### 3. Setup Database

```bash
psql -U postgres -d postgres -f database/schema.sql
```

### 4. Start Development Servers

```bash
npm run dev
```

This will start both frontend (port 3000) and backend (port 5000) servers.

### 5. Build for Production

```bash
npm run build
```

## 📚 API Documentation

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Attendance
- `GET /api/attendance` - Get all attendance records
- `POST /api/attendance/checkin` - Record check-in
- `POST /api/attendance/checkout` - Record check-out
- `GET /api/attendance/user/:userId` - Get user attendance

### Users
- `GET /api/users` - Get all users (Admin)
- `GET /api/users/:id` - Get user details
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (Admin)

### Reports
- `GET /api/reports/attendance` - Attendance report
- `GET /api/reports/summary` - Summary report
- `POST /api/reports/export` - Export to CSV/PDF

## 🔐 Security Features

- JWT-based authentication
- Password encryption with bcrypt
- CORS protection
- Input validation and sanitization
- Rate limiting
- SQL injection prevention

## 📝 Database Design

The system includes the following main tables:
- `users` - User accounts and profiles
- `attendance_records` - Check-in/check-out logs
- `departments` - Department information
- `roles` - User roles and permissions

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📦 Deployment

### Docker
```bash
docker-compose up -d
```

### Heroku
```bash
git push heroku main
```

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit changes (`git commit -m 'Add some AmazingFeature'`)
3. Push to branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📧 Support

For support, email support@tap-track.local or open an issue in the repository.

## 🗺️ Roadmap

- [ ] Mobile app (React Native)
- [ ] Real-time notifications
- [ ] Biometric integration
- [ ] Geolocation tracking
- [ ] Advanced analytics with ML predictions
- [ ] Multi-language support
