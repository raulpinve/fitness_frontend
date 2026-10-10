import { useAuth } from "../context/useAuth";

export default function Home() {
  const { user, logout } = useAuth();

  return (
    <div style={{ maxWidth: 480, margin: "80px auto", fontFamily: "sans-serif" }}>
      <h1>Home</h1>
      <p>Sesión iniciada como: {user?.email}</p>
      <button onClick={logout}>Cerrar sesión</button>
    </div>
  );
}