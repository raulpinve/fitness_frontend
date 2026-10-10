import { api } from "../../lib/api";

// Programas
export const getPrograms = () => api("/programs");

export const getProgram = (id) => api(`/programs/${id}`);

export const createProgram = (data) =>
  api("/programs", { method: "POST", body: JSON.stringify(data) });

export const deleteProgram = (id) =>
  api(`/programs/${id}`, { method: "DELETE" });

// Rutinas dentro de un programa
export const getRoutines = (programId) =>
  api(`/programs/${programId}/routines`);

export const createRoutine = (programId, data) =>
  api(`/programs/${programId}/routines`, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const deleteRoutine = (programId, routineId) =>
  api(`/programs/${programId}/routines/${routineId}`, { method: "DELETE" });