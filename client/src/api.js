import axios from "axios";

const base = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const API = axios.create({
  baseURL: `${base}/api`,
});

// Add token to requests if needed
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;