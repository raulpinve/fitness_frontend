import { NavLink, Outlet } from "react-router-dom";

const links = [
  { to: "/programas", label: "Programas" },
  { to: "/ejercicios", label: "Ejercicios" },
  { to: "/perfil", label: "Perfil" },
];

export default function MainLayout() {
  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <nav
        style={{
          display: "flex",
          gap: 16,
          padding: "12px 24px",
          borderBottom: "1px solid #ddd",
        }}
      >
        <strong>Gim-fit</strong>
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            style={({ isActive }) => ({
              fontWeight: isActive ? "bold" : "normal",
              textDecoration: "none",
            })}
          >
            {l.label}
          </NavLink>
        ))}
      </nav>

      <main style={{ padding: 24 }}>
        <Outlet />
      </main>
    </div>
  );
}
