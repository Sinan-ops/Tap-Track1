import express from 'express';
import pool from '../utils/database.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Get all students in a class
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { class_id } = req.query;
    const userId = req.user.id;

    if (!class_id) {
      return res.status(400).json({ error: 'class_id is required' });
    }

    // Verify the class belongs to the user
    const classCheck = await pool.query(
      'SELECT id FROM classes WHERE id = $1 AND user_id = $2',
      [class_id, userId]
    );

    if (classCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const result = await pool.query(
      'SELECT * FROM students WHERE class_id = $1 ORDER BY roll_number ASC',
      [class_id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching students:', err);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// Get a specific student
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT s.* FROM students s
       JOIN classes c ON s.class_id = c.id
       WHERE s.id = $1 AND c.user_id = $2`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching student:', err);
    res.status(500).json({ error: 'Failed to fetch student' });
  }
});

// Create a new student
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, roll_number, class_id } = req.body;
    const userId = req.user.id;

    if (!name || !roll_number || !class_id) {
      return res.status(400).json({ error: 'name, roll_number, and class_id are required' });
    }

    // Verify the class belongs to the user
    const classCheck = await pool.query(
      'SELECT id FROM classes WHERE id = $1 AND user_id = $2',
      [class_id, userId]
    );

    if (classCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const result = await pool.query(
      'INSERT INTO students (class_id, user_id, name, roll_number, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
      [class_id, userId, name, roll_number]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating student:', err);
    res.status(500).json({ error: 'Failed to create student' });
  }
});

// Update a student
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, roll_number } = req.body;
    const userId = req.user.id;

    if (!name || !roll_number) {
      return res.status(400).json({ error: 'name and roll_number are required' });
    }

    const result = await pool.query(
      `UPDATE students SET name = $1, roll_number = $2, updated_at = NOW()
       WHERE id = $3 AND user_id = $4 RETURNING *`,
      [name, roll_number, id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating student:', err);
    res.status(500).json({ error: 'Failed to update student' });
  }
});

// Delete a student
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // First delete related attendance records
    await pool.query('DELETE FROM attendance_records WHERE student_id = $1', [id]);

    const result = await pool.query(
      `DELETE FROM students WHERE id = $1 AND user_id = $2 RETURNING *`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    console.error('Error deleting student:', err);
    res.status(500).json({ error: 'Failed to delete student' });
  }
});

export default router;
