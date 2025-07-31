import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://deliveroo-f2ec.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default api;
