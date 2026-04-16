import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import attendanceRoutes from './routes/attendance.js';
import userRoutes from './routes/users.js';
import reportRoutes from './routes/reports.js';
import classesRoutes from './routes/classes.js';
import studentsRoutes from './routes/students.js';
import authMiddleware from './middleware/auth.js';
import errorHandler from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/classes', authMiddleware, classesRoutes);
app.use('/api/students', authMiddleware, studentsRoutes);
app.use('/api/attendance', authMiddleware, attendanceRoutes);
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/reports', authMiddleware, reportRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
