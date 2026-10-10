import { useAuth } from "../../context/useAuth";

export default function ProfilePage() {
  const { user, logout } = useAuth();

  return (
    <section style={{ maxWidth: 480 }}>
      <h1>Perfil</h1>

      {user?.photoURL && (
        <img
          src={user.photoURL}
          alt="Foto de perfil"
          width={80}
          height={80}
          style={{ borderRadius: "50%" }}
        />
      )}

      <p>
        <strong>Nombre:</strong> {user?.displayName || "—"}
      </p>
      <p>
        <strong>Correo:</strong> {user?.email}
      </p>

      <button onClick={logout}>Cerrar sesión</button>
    </section>
  );
}
