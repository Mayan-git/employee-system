import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Centralizes "readable error message" extraction so callers don't each
// have to know the backend's { message } error shape.
export const getErrorMessage = (err) =>
  err.response?.data?.message || err.message || "Something went wrong. Please try again.";
