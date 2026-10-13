import { api } from "../../lib/api";

export const getExercises = ({ page = 1, pageSize = 10, type, name } = {}) => {
  const params = new URLSearchParams({ page, pageSize });
  if (type) params.set("type", type);
  if (name) params.set("name", name);
  return api(`/exercises?${params}`);
};

export const getExercise = (id) => api(`/exercises/${id}`);

export const createExercise = (data) =>
  api("/exercises", { method: "POST", body: JSON.stringify(data) });

export const updateExercise = (id, data) =>
  api(`/exercises/${id}`, { method: "PUT", body: JSON.stringify(data) });

export const deleteExercise = (id) =>
  api(`/exercises/${id}`, { method: "DELETE" });