// src/services/api.js
import axios from 'axios';
import { store } from '../store/index';

const API_URL = 'http://localhost:5001/api'; // Your backend URL

const api = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to include the token in headers
api.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;