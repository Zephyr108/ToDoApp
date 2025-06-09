import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const register = (username, password) =>
  axios.post(`${API_URL}/auth/register`, { username, password });

export const login = (username, password) =>
  axios.post(`${API_URL}/auth/login`, { username, password });

export const getTasks = token =>
  axios.get(`${API_URL}/tasks`, { headers: { Authorization: `Bearer ${token}` } });

export const createTask = (token, title, deadline) =>
  axios.post(`${API_URL}/tasks`, { title, deadline }, { headers: { Authorization: `Bearer ${token}` } });

export const updateTask = (token, id, data) =>
  axios.put(`${API_URL}/tasks/${id}`, data, { headers: { Authorization: `Bearer ${token}` } });

export const deleteTask = (token, id) =>
  axios.delete(`${API_URL}/tasks/${id}`, { headers: { Authorization: `Bearer ${token}` } });

export const updateAccount = (token, { login, newPassword, currentPassword }) =>
  axios.patch(`${API_URL}/auth/update`, { login, newPassword, currentPassword }, { headers: { Authorization: `Bearer ${token}` } });

export const deleteAccount = (token, { currentPassword }) =>
  axios.post(`${API_URL}/auth/delete`, { currentPassword }, { headers: { Authorization: `Bearer ${token}` } });
