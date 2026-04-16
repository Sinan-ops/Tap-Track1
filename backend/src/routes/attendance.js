import pool from '../utils/database.js';
import express from 'express';

const router = express.Router();

// Get attendance stats
router.get('/stats', async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date().toISOString().split('T')[0];
    
    // Today's attendance
    const todayResult = await pool.query(`
      SELECT COUNT(*) as total, 
             SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) as present,
             SUM(CASE WHEN status = 'absent' THEN 1 ELSE 0 END) as absent,
             SUM(CASE WHEN status = 'leave' THEN 1 ELSE 0 END) as leave
      FROM attendance_records 
      WHERE date = $1 AND user_id = $2
    `, [today, userId]);

    const totalToday = todayResult.rows[0].total || 0;
    const presentToday = todayResult.rows[0].present || 0;
    const absentToday = todayResult.rows[0].absent || 0;
    const leaveToday = todayResult.rows[0].leave || 0;

    // Average attendance
    const avgResult = await pool.query(`
      SELECT 
        COUNT(DISTINCT date) as days_with_records,
        COUNT(DISTINCT student_id) as total_students,
        SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) as total_present
      FROM attendance_records
      WHERE date >= CURRENT_DATE - INTERVAL '30 days'
    `);

    const classCountResult = await pool.query(
      'SELECT COUNT(*) as total_classes FROM classes WHERE user_id = $1',
      [userId]
    );

    const studentCountResult = await pool.query(
      `SELECT COUNT(s.id) as total_students
       FROM students s
       JOIN classes c ON s.class_id = c.id
       WHERE c.user_id = $1`,
      [userId]
    );

    const avgPresent = avgResult.rows[0].total_present || 0;
    const avgTotal = avgResult.rows[0].days_with_records || 1;
    const averageAttendance = Math.round((avgPresent / Math.max(avgTotal, 1)) * 100);

    const totalClasses = classCountResult.rows[0].total_classes || 0;
    const totalStudents = studentCountResult.rows[0].total_students || 0;

    // Today's records
    const recordsResult = await pool.query(`
      SELECT ar.*, s.name as student_name, c.name as class_name
      FROM attendance_records ar
      LEFT JOIN students s ON ar.student_id = s.id
      LEFT JOIN classes c ON ar.class_id = c.id
      WHERE ar.date = $1
      ORDER BY ar.created_at DESC
    `, [today]);

    const todayRecords = recordsResult.rows.map(r => ({
      id: r.id,
      studentName: r.student_name || 'Unknown',
      className: r.class_name || 'N/A',
      date: r.date,
      status: r.status
    }));

    res.json({
      presentToday,
      absentToday,
      leaveToday,
      averageAttendance,
      totalClasses,
      totalStudents,
      totalRecords: totalToday,
      todayRecords
    });
  } catch (error) {
    console.error('Error fetching attendance stats:', error);
    res.status(500).json({ error: 'Failed to fetch attendance stats' });
  }
});

// Create attendance record (mark attendance)
router.post('/', async (req, res) => {
  try {
    const { class_id, student_id, date, status } = req.body;
    const userId = req.user.id;

    console.log(`📝 POST /attendance: Creating record for student ${student_id}, class ${class_id}, date ${date} (type: ${typeof date}), status ${status}, user ${userId}`);

    if (!class_id || !student_id || !date || !status) {
      console.log(`❌ Missing required fields: class_id=${class_id}, student_id=${student_id}, date=${date}, status=${status}`);
      return res.status(400).json({ error: 'class_id, student_id, date, and status are required' });
    }

    // Verify the class and student belong to the user
    const classCheck = await pool.query(
      'SELECT id FROM classes WHERE id = $1 AND user_id = $2',
      [class_id, userId]
    );

    if (classCheck.rows.length === 0) {
      console.log(`❌ Access denied: Class ${class_id} not found for user ${userId}`);
      return res.status(403).json({ error: 'Access denied' });
    }

    // IMPORTANT: Cast date as DATE type to avoid timezone conversion
    const result = await pool.query(
      `INSERT INTO attendance_records (class_id, student_id, user_id, date, status) 
       VALUES ($1, $2, $3, $4::DATE, $5) 
       ON CONFLICT (class_id, student_id, date) DO UPDATE SET status = $5, updated_at = NOW()
       RETURNING id, class_id, student_id, date::text, status, created_at`,
      [class_id, student_id, userId, date, status]
    );

    // Log what was actually stored
    console.log(`✅ Record saved: ID=${result.rows[0].id}, student=${student_id}, DATE_STORED="${result.rows[0].date}", status=${status}`);
    res.status(201).json({
      id: result.rows[0].id,
      class_id: result.rows[0].class_id,
      student_id: result.rows[0].student_id,
      date: result.rows[0].date,
      status: result.rows[0].status
    });
  } catch (error) {
    console.error('❌ Error creating attendance record:', error.message);
    console.error('Full error:', error);
    res.status(500).json({ error: 'Failed to create attendance record', details: error.message });
  }
});

// Update attendance record
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    console.log(`✏️ PUT /attendance/${id}: Updating record to status ${status} for user ${userId}`);

    if (!status) {
      return res.status(400).json({ error: 'status is required' });
    }

    // Verify the record belongs to the user
    const checkRecord = await pool.query(
      'SELECT id FROM attendance_records WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (checkRecord.rows.length === 0) {
      console.log(`❌ Access denied: Record ${id} not found for user ${userId}`);
      return res.status(403).json({ error: 'Access denied' });
    }

    // Cast date as text to ensure consistent format
    const result = await pool.query(
      'UPDATE attendance_records SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING id, class_id, student_id, date::text as date, status',
      [status, id]
    );

    console.log(`✅ Record ${id} updated to status=${status}`);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error updating attendance record:', error.message);
    res.status(500).json({ error: 'Failed to update attendance record', details: error.message });
  }
});

// Delete attendance record
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Verify the record belongs to the user
    const checkRecord = await pool.query(
      'SELECT id FROM attendance_records WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (checkRecord.rows.length === 0) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await pool.query('DELETE FROM attendance_records WHERE id = $1', [id]);
    res.json({ message: 'Attendance record deleted' });
  } catch (error) {
    console.error('Error deleting attendance record:', error);
    res.status(500).json({ error: 'Failed to delete attendance record' });
  }
});

// Get attendance records for a class
router.get('/class/:classId', async (req, res) => {
  try {
    const { classId } = req.params;
    const userId = req.user.id;

    console.log(`🔍 GET /attendance/class/${classId}: Fetching records for user ${userId}`);

    // Verify the class belongs to the user
    const classCheck = await pool.query(
      'SELECT id FROM classes WHERE id = $1 AND user_id = $2',
      [classId, userId]
    );

    if (classCheck.rows.length === 0) {
      console.log(`❌ Access denied: Class ${classId} not found for user ${userId}`);
      return res.status(403).json({ error: 'Access denied' });
    }

    // Cast date as text to avoid timezone conversion issues
    const result = await pool.query(
      `SELECT ar.id, ar.class_id, ar.student_id, ar.user_id, ar.date::text as date, ar.status, ar.notes, ar.created_at, ar.updated_at, s.name as student_name
       FROM attendance_records ar
       LEFT JOIN students s ON ar.student_id = s.id
       WHERE ar.class_id = $1
       ORDER BY ar.date DESC, ar.created_at DESC`,
      [classId]
    );

    console.log(`✅ Retrieved ${result.rows.length} attendance records for class ${classId}`);
    if (result.rows.length > 0) {
      const uniqueDates = [...new Set(result.rows.map(r => r.date))];
      console.log(`   Unique dates in database: [${uniqueDates.join(', ')}]`);
      console.log(`   First 3 records:`, result.rows.slice(0, 3).map(r => ({ id: r.id, date: r.date, status: r.status })));
    }
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error fetching attendance records:', error.message);
    res.status(500).json({ error: 'Failed to fetch attendance records', details: error.message });
  }
});

// Get attendance records for a student
router.get('/student/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    const userId = req.user.id;

    // Verify the student belongs to user's class
    const studentCheck = await pool.query(
      `SELECT s.id FROM students s
       JOIN classes c ON s.class_id = c.id
       WHERE s.id = $1 AND c.user_id = $2`,
      [studentId, userId]
    );

    if (studentCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const result = await pool.query(
      `SELECT * FROM attendance_records
       WHERE student_id = $1
       ORDER BY date DESC`,
      [studentId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching student attendance:', error);
    res.status(500).json({ error: 'Failed to fetch student attendance' });
  }
});

export default router;
