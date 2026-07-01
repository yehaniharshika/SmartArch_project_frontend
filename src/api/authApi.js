import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach token automatically if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("sa_access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  register: async (payload) => {
    // payload: { full_name, email, password, confirm_password, role }
    const res = await api.post("/api/auth/register", payload);
    return res.data; // { success, message, data: { user, token } }
  },

  login: async (payload) => {
    // payload: { email, password }
    const res = await api.post("/api/auth/login", payload);
    return res.data; // { success, message, data: { user, token } }
  },

  forgotPassword: async (payload) => {
    const res = await api.post("/api/auth/forgot-password", payload);
    return res.data;
  },

  resetPassword: async (payload) => {
    const res = await api.post("/api/auth/reset-password", payload);
    return res.data;
  },
};

export default api;