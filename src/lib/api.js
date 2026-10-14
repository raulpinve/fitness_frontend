import { auth } from "./firebase";

const API_URL = import.meta.env.VITE_API_URL;

export async function api(path, options = {}) {
  const user = auth.currentUser;
  const token = user ? await user.getIdToken() : null;

  const { body, headers, ...rest } = options;
  const isFormData = body instanceof FormData;
  const isPlainObject =
    body !== undefined && body !== null && !isFormData && typeof body === "object";

  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: {
      // Con FormData el navegador pone el Content-Type con su boundary
      ...(!isFormData && { "Content-Type": "application/json" }),
      ...(token && { Authorization: `Bearer ${token}` }),
      ...headers,
    },
    body: isPlainObject ? JSON.stringify(body) : body,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    // Intenta sacar el mensaje que devuelve tu backend
    const message =
      data?.error ||
      data?.errors?.[0]?.message ||
      data?.errors?.[0]?.msg ||
      data?.message ||
      `Error ${res.status}`;

    const error = new Error(message);
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}