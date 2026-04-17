import api from './api';

const normalizeDate = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value).split('T')[0];
  return date.toISOString().split('T')[0];
};

export const SyncService = {
  // Classes operations
  getClasses: async (userId) => {
    const response = await api.get('/classes');
    return response.data;
  },

  createClass: async (name, userId) => {
    const response = await api.post('/classes', { name });
    return response.data;
  },

  updateClass: async (classId, name) => {
    const response = await api.put(`/classes/${classId}`, { name });
    return response.data;
  },

  deleteClass: async (classId) => {
    await api.delete(`/classes/${classId}`);
    return true;
  },

  // Students operations
  getStudents: async (classId) => {
    const response = await api.get(`/students?class_id=${classId}`);
    return response.data;
  },

  createStudent: async (name, rollNumber, classId, userId) => {
    const response = await api.post('/students', {
      name,
      roll_number: rollNumber,
      class_id: classId,
    });
    return response.data;
  },

  updateStudent: async (studentId, name, rollNumber) => {
    const response = await api.put(`/students/${studentId}`, {
      name,
      roll_number: rollNumber,
    });
    return response.data;
  },

  deleteStudent: async (studentId) => {
    await api.delete(`/students/${studentId}`);
    return true;
  },

  // Attendance operations
  getAttendanceRecords: async (classId, date) => {
    try {
      const response = await api.get(`/attendance/class/${classId}`);
      const normalizedDate = normalizeDate(date);
      const filtered = response.data.filter((record) => normalizeDate(record.date) === normalizedDate);
      return filtered;
    } catch (error) {
      console.error(`API Error fetching attendance:`, error.response?.data || error.message);
      throw error;
    }
  },

  getAttendanceClassRecords: async (classId) => {
    try {
      const response = await api.get(`/attendance/class/${classId}`);
      return response.data;
    } catch (error) {
      console.error(`API Error fetching class attendance records:`, error.response?.data || error.message);
      throw error;
    }
  },

  createAttendanceRecord: async (classId, studentId, date, status) => {
    try {
      const response = await api.post('/attendance', {
        class_id: classId,
        student_id: studentId,
        date,
        status,
      });
      return response.data;
    } catch (error) {
      console.error(`API Error creating record:`, error.response?.data || error.message);
      throw error;
    }
  },

  updateAttendanceRecord: async (recordId, status) => {
    try {
      const response = await api.put(`/attendance/${recordId}`, { status });
      return response.data;
    } catch (error) {
      console.error(`API Error updating record:`, error.response?.data || error.message);
      throw error;
    }
  },

  deleteAttendanceRecord: async (recordId) => {
    await api.delete(`/attendance/${recordId}`);
    return true;
  },

  // Analytics
  getAttendanceStats: async (classId, studentId) => {
    const response = await api.get('/attendance/stats', {
      params: { class_id: classId, student_id: studentId },
    });
    return response.data;
  },

  // Export
  exportAttendance: async (classId, format = 'csv') => {
    const response = await api.get('/attendance/export', {
      params: { class_id: classId, format },
      responseType: 'blob',
    });
    return response.data;
  },
};
