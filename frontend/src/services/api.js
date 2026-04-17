import axios from 'axios';

// This points specifically to your Railway backend domain
const API_BASE_URL = import.meta.env.MODE === 'production' 
  ? 'https://tap-track1-production.up.railway.app/api' 
  : '/api'; 

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Leave everything else below this exactly as it was

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Authentication
export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const register = async (name, email, password) => {
  const response = await api.post('/auth/register', { name, email, password });
  return response.data;
};

export const logout = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};

// Attendance
export const recordCheckIn = async () => {
  const response = await api.post('/attendance/checkin');
  return response.data;
};

export const recordCheckOut = async () => {
  const response = await api.post('/attendance/checkout');
  return response.data;
};

export const getAttendanceStats = async () => {
  const response = await api.get('/attendance/stats');
  return response.data;
};

export const getAttendanceRecords = async (filter) => {
  const response = await api.get('/attendance', { params: filter });
  return response.data;
};

// Users
export const getUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

export const getUserById = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

// Reports
export const generateReport = async (type, filters) => {
  const response = await api.post(`/reports/${type}`, filters);
  return response.data;
};

export default api;
