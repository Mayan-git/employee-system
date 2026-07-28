import { api } from "./api.js";

export const signup = (payload) => api.post("/auth/signup", payload).then((r) => r.data);
export const login = (payload) => api.post("/auth/login", payload).then((r) => r.data);
export const getMe = () => api.get("/auth/me").then((r) => r.data);
export const listUsers = () => api.get("/auth/users").then((r) => r.data);
export const updateUserRole = (id, role) =>
  api.patch(`/auth/users/${id}/role`, { role }).then((r) => r.data);
