import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path'; // ADDED
import { fileURLToPath } from 'url'; // ADDED
import authRoutes from './routes/auth.js';
import attendanceRoutes from './routes/attendance.js';
import userRoutes from './routes/users.js';
import reportRoutes from './routes/reports.js';
import classesRoutes from './routes/classes.js';
import studentsRoutes from './routes/students.js';
import authMiddleware from './middleware/auth.js';
import errorHandler from './middleware/errorHandler.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url); // ADDED
const __dirname = path.dirname(__filename); // ADDED

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// 1. API Routes
app.use('/api/auth', authRoutes);
app.use('/api/classes', authMiddleware, classesRoutes);
app.use('/api/students', authMiddleware, studentsRoutes);
app.use('/api/attendance', authMiddleware, attendanceRoutes);
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/reports', authMiddleware, reportRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// 2. Serve Frontend Static Files (ADDED)
// This tells Express to look into the frontend's dist folder for images/css/js
app.use(express.static(path.join(__dirname, '../../frontend/dist')));

// 3. Catch-all route (ADDED)
// If the request isn't for an API, send the user the React app (index.html)
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
  }
});

// Error handling middleware
app.use(errorHandler);

// Note: I removed the old 404 JSON handler because the code above 
// handles "Not Found" by sending the user to your frontend.

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
