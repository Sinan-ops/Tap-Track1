import pool from '../utils/database.js';
import express from 'express';

const router = express.Router();

// Get attendance report
router.get('/attendance', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const query = `
      SELECT 
        u.id, u.name, u.email,
        COUNT(ar.id) as total_days,
        COUNT(CASE WHEN ar.check_out_time IS NOT NULL THEN 1 END) as present_days,
        COUNT(CASE WHEN ar.check_out_time IS NULL THEN 1 END) as absent_days
      FROM users u
      LEFT JOIN attendance_records ar ON u.id = ar.user_id
      ${startDate && endDate ? `WHERE DATE(ar.check_in_time) BETWEEN $1 AND $2` : ''}
      GROUP BY u.id, u.name, u.email
    `;

    const result = startDate && endDate 
      ? await pool.query(query, [startDate, endDate])
      : await pool.query(query);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get summary report
router.get('/summary', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        COUNT(DISTINCT user_id) as total_employees,
        COUNT(DISTINCT DATE(check_in_time)) as days_tracked,
        COUNT(*) as total_records,
        AVG(EXTRACT(EPOCH FROM (check_out_time - check_in_time))/3600)::INT as avg_hours
      FROM attendance_records
      WHERE DATE(check_in_time) >= CURRENT_DATE - INTERVAL '30 days'
    `);

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Export report
router.post('/export', async (req, res) => {
  try {
    const { format, startDate, endDate } = req.body;

    const query = `
      SELECT 
        u.name, u.email,
        ar.check_in_time, ar.check_out_time
      FROM attendance_records ar
      JOIN users u ON ar.user_id = u.id
      ${startDate && endDate ? `WHERE DATE(ar.check_in_time) BETWEEN $1 AND $2` : ''}
      ORDER BY ar.check_in_time DESC
    `;

    const result = startDate && endDate 
      ? await pool.query(query, [startDate, endDate])
      : await pool.query(query);

    if (format === 'csv') {
      const csv = 'Name,Email,Check In,Check Out\n' +
        result.rows.map(r => 
          `${r.name},${r.email},${r.check_in_time},${r.check_out_time}`
        ).join('\n');
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=attendance.csv');
      res.send(csv);
    } else {
      res.json(result.rows);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
