import axios from 'axios';

const API_BASE_URL = import.meta.env.MODE === 'production' 
  ? 'https://tap-track1-production.up.railway.app/api' 
  : '/api'; 

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth Exports
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

// Dashboard/Attendance Exports (This is what was missing!)
export const getAttendanceStats = async () => {
  const response = await api.get('/attendance/stats');
  return response.data;
};

// Attendance Actions
export const recordCheckIn = async () => {
  const response = await api.post('/attendance/checkin');
  return response.data;
};

export const recordCheckOut = async () => {
  const response = await api.post('/attendance/checkout');
  return response.data;
};

export default api;
