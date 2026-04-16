import axios from 'axios';

const API_URL = import.meta.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

const normalizeDate = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value).split('T')[0];
  return date.toISOString().split('T')[0];
};

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const SyncService = {
  // Classes operations
  getClasses: async (userId) => {
    // userId from JWT token, query param ignored by backend
    const response = await api.get('/classes');
    return response.data;
  },

  createClass: async (name, userId) => {
    // userId from JWT token, only name needed in request body
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
    // userId from JWT token, only name/roll_number/class_id needed
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
      console.log(`API: Fetched all records for class ${classId}:`, response.data);
      const normalizedDate = normalizeDate(date);
      const filtered = response.data.filter((record) => normalizeDate(record.date) === normalizedDate);
      console.log(`✅ Filtered results: ${filtered.length} records match date ${normalizedDate}`, filtered);
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
    // userId from JWT token, only class_id/student_id/date/status needed
    try {
      const response = await api.post('/attendance', {
        class_id: classId,
        student_id: studentId,
        date,
        status,
      });
      console.log(`API: Created attendance record for student ${studentId}:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`API Error creating record for student ${studentId}:`, error.response?.data || error.message);
      throw error;
    }
  },

  updateAttendanceRecord: async (recordId, status) => {
    try {
      const response = await api.put(`/attendance/${recordId}`, { status });
      console.log(`API: Updated attendance record ${recordId}:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`API Error updating record ${recordId}:`, error.response?.data || error.message);
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
