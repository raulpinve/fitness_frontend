import { api } from "../../lib/api";

export const getExercises = () => api("/exercises");

export const getExercise = (id) => api(`/exercises/${id}`);

export const createExercise = (data) =>
  api("/exercises", { method: "POST", body: JSON.stringify(data) });

export const updateExercise = (id, data) =>
  api(`/exercises/${id}`, { method: "PUT", body: JSON.stringify(data) });

export const deleteExercise = (id) =>
  api(`/exercises/${id}`, { method: "DELETE" });