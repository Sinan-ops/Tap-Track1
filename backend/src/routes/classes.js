import express from 'express';
import pool from '../utils/database.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Get all classes for a user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      'SELECT * FROM classes WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching classes:', err);
    res.status(500).json({ error: 'Failed to fetch classes' });
  }
});

// Get a specific class
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
      'SELECT * FROM classes WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Class not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching class:', err);
    res.status(500).json({ error: 'Failed to fetch class' });
  }
});

// Create a new class
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user.id;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Class name is required' });
    }

    const result = await pool.query(
      'INSERT INTO classes (user_id, name, created_at) VALUES ($1, $2, NOW()) RETURNING *',
      [userId, name]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating class:', err);
    res.status(500).json({ error: 'Failed to create class' });
  }
});

// Update a class
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const userId = req.user.id;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Class name is required' });
    }

    const result = await pool.query(
      'UPDATE classes SET name = $1, updated_at = NOW() WHERE id = $2 AND user_id = $3 RETURNING *',
      [name, id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Class not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating class:', err);
    res.status(500).json({ error: 'Failed to update class' });
  }
});

// Delete a class
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // First delete related students and attendance records
    await pool.query('DELETE FROM attendance_records WHERE class_id = $1', [id]);
    await pool.query('DELETE FROM students WHERE class_id = $1', [id]);

    const result = await pool.query(
      'DELETE FROM classes WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Class not found' });
    }

    res.json({ message: 'Class deleted successfully' });
  } catch (err) {
    console.error('Error deleting class:', err);
    res.status(500).json({ error: 'Failed to delete class' });
  }
});

export default router;
