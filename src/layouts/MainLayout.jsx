import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Dumbbell, ListChecks, User, Menu, X } from "lucide-react";

const links = [
  { to: "/ejercicios", label: "Ejercicios", icon: Dumbbell },
  { to: "/programas", label: "Programas", icon: ListChecks },
  { to: "/perfil", label: "Perfil", icon: User },
];

const linkClasses = ({ isActive }) =>
  `inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive
      ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
  }`;

function Brand() {
  return (
    <NavLink to="/" className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
        <Dumbbell className="h-5 w-5" strokeWidth={2.25} />
      </span>
      <span className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-50">
        Gym<span className="text-indigo-600 dark:text-indigo-400">Fit</span>
      </span>
    </NavLink>
  );
}

export default function MainLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Brand />

          {/* Desktop */}
          <div className="hidden items-center gap-1 md:flex">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} className={linkClasses}>
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
          </div>

          {/* Botón móvil */}
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-100 md:hidden dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        {/* Menú móvil */}
        {open && (
          <div className="border-t border-slate-200 px-4 py-3 md:hidden dark:border-slate-800">
            <div className="flex flex-col gap-1">
              {links.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={linkClasses}
                  onClick={() => setOpen(false)}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </header>

      <Outlet />
    </div>
  );
}