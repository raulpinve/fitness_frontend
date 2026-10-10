// src/lib/api.js
// Helper para llamar a tu VPS enviando el ID token de Firebase.
// Tu backend debe verificar el token (ej. con firebase-admin: admin.auth().verifyIdToken(token)).
import { auth } from "./firebase";

const API_URL = import.meta.env.VITE_API_URL;

export async function api(path, options = {}) {
  const user = auth.currentUser;
  const token = user ? await user.getIdToken() : null; // se renueva solo si expiró

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}