import { api } from "./api.js";

export const getEmployees = (params) =>
  api.get("/employees", { params }).then((r) => r.data);

export const createEmployee = (payload) =>
  api.post("/employees", payload).then((r) => r.data);

export const updateEmployee = (id, payload) =>
  api.put(`/employees/${id}`, payload).then((r) => r.data);

export const deleteEmployee = (id) =>
  api.delete(`/employees/${id}`).then((r) => r.data);
