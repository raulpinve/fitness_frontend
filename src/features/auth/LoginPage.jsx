// src/features/auth/LoginPage.jsx
import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

const ERRORES = {
  "auth/invalid-credential": "Correo o contraseña incorrectos.",
  "auth/user-not-found": "Correo o contraseña incorrectos.",
  "auth/wrong-password": "Correo o contraseña incorrectos.",
  "auth/invalid-email": "El correo no es válido.",
  "auth/too-many-requests": "Demasiados intentos. Intenta más tarde.",
  "auth/popup-closed-by-user": "Cerraste la ventana de Google.",
  "auth/network-request-failed": "Error de red. Revisa tu conexión.",
};

export default function LoginPage() {
  const { user, loading, authError, login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) return <p>Cargando...</p>;
  if (user) return <Navigate to={from} replace />;

  const handle = async (fn) => {
    setError("");
    setSubmitting(true);
    try {
      await fn();
      navigate(from, { replace: true });
    } catch (err) {
      setError(ERRORES[err.code] || "No se pudo iniciar sesión.");
    } finally {
      setSubmitting(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handle(() => login(email, password));
  };

  return (
    <div style={{ maxWidth: 360, margin: "80px auto", fontFamily: "sans-serif" }}>
      <h1>Iniciar sesión</h1>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
        {error && <p style={{ color: "crimson", margin: 0 }}>{error}</p>}
        <button type="submit" disabled={submitting}>
          {submitting ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <hr style={{ margin: "20px 0" }} />

      {(error || authError) && (
        <p style={{ color: "crimson", margin: 0 }}>{error || authError}</p>
      )}

      <button
        type="button"
        onClick={() => handle(loginWithGoogle)}
        disabled={submitting}
        style={{ width: "100%" }}
      >
        Continuar con Google
      </button>
    </div>
  );
}