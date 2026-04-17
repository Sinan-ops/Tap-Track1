import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import attendanceRoutes from './routes/attendance.js';
import userRoutes from './routes/users.js';
import reportRoutes from './routes/reports.js';
import classesRoutes from './routes/classes.js';
import studentsRoutes from './routes/students.js';
import authMiddleware from './middleware/auth.js';
import errorHandler from './middleware/errorHandler.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Railway sets the PORT automatically. If not, it defaults to 5000.
const PORT = process.env.PORT || 5000;

// --- MIDDLEWARE ---
app.use(cors({
  origin: '*', // Allows all origins. More secure: replace '*' with your frontend URL later.
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// --- API ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/classes', authMiddleware, classesRoutes);
app.use('/api/students', authMiddleware, studentsRoutes);
app.use('/api/attendance', authMiddleware, attendanceRoutes);
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/reports', authMiddleware, reportRoutes);

// Health Check for Railway
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// --- ERROR HANDLING ---
app.use(errorHandler);

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
