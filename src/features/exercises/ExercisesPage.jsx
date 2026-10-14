import { useEffect, useState } from "react";
import {
  Dumbbell,
  Activity,
  PlayCircle,
  Search,
  SearchX,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";
import { getExercises } from "./exercisesApi";
import { Link } from "react-router-dom";
import { MUSCLE_LABELS } from "./exerciseOptions";

/* ---------- Estilos por tipo ---------- */

const TYPE_STYLES = {
  strength: {
    label: "Fuerza",
    icon: Dumbbell,
    badge:
      "bg-indigo-50 text-indigo-700 ring-indigo-600/20 dark:bg-indigo-500/10 dark:text-indigo-300 dark:ring-indigo-400/20",
    tile: "from-indigo-50 to-slate-100 text-indigo-300 dark:from-indigo-950/50 dark:to-slate-800 dark:text-indigo-400/40",
  },
  cardio: {
    label: "Cardio",
    icon: Activity,
    badge:
      "bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-400/20",
    tile: "from-rose-50 to-slate-100 text-rose-300 dark:from-rose-950/50 dark:to-slate-800 dark:text-rose-400/40",
  },
};

const DEFAULT_STYLE = {
  label: "Ejercicio",
  icon: Dumbbell,
  badge:
    "bg-slate-100 text-slate-700 ring-slate-500/20 dark:bg-slate-700/40 dark:text-slate-300 dark:ring-slate-400/20",
  tile: "from-slate-50 to-slate-100 text-slate-300 dark:from-slate-800 dark:to-slate-800 dark:text-slate-600",
};

const TYPE_FILTERS = [
  { value: "", label: "Todos" },
  { value: "strength", label: "Fuerza" },
  { value: "cardio", label: "Cardio" },
];

const gridClasses =
  "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

/* ---------- Tarjeta ---------- */
function ExerciseCard({ exercise }) {
  const { id, name, type, avatarThumbnail, avatar, video, muscleGroups } =
    exercise;
  const image = avatarThumbnail || avatar;
  const style = TYPE_STYLES[type] ?? DEFAULT_STYLE;
  const Icon = style.icon;

  return (
    <Link
      to={`/ejercicios/${id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition duration-200 hover:border-slate-300 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
    >
      <div
        className={`relative aspect-[16/10] overflow-hidden bg-gradient-to-br ${style.tile}`}
      >
        {image ? (
          <img
            src={image}
            alt={name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Icon className="h-14 w-14" strokeWidth={1.5} />
          </div>
        )}

        {video && (
          <span
            className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-slate-900/70 px-2 py-1 text-xs font-medium text-white backdrop-blur"
            title="Incluye video"
          >
            <PlayCircle className="h-3.5 w-3.5" />
            Video
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-5 text-slate-900 dark:text-slate-50">
          {name}
        </h3>

        <div className="mt-auto flex items-center justify-between gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
          <span
            className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${style.badge}`}
          >
            <Icon className="h-3.5 w-3.5" />
            {style.label}
          </span>

          {muscleGroups?.length > 0 && (
            <span className="truncate text-xs capitalize text-slate-500 dark:text-slate-400">
              {muscleGroups.slice(0, 2).join(", ")}
            </span>
          )}
        </div>
      </div>
      <span className="truncate text-xs text-slate-500 dark:text-slate-400">
      {muscleGroups
        .slice(0, 2)
        .map((m) => MUSCLE_LABELS[m] ?? m)
        .join(", ")}
    </span>
    </Link>
  );
}

function ExerciseCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="aspect-[16/10] bg-slate-100 dark:bg-slate-800" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-3/4 rounded bg-slate-100 dark:bg-slate-800" />
        <div className="h-4 w-1/2 rounded bg-slate-100 dark:bg-slate-800" />
        <div className="h-6 w-20 rounded bg-slate-100 dark:bg-slate-800" />
      </div>
    </div>
  );
}

/* ---------- Filtros ---------- */

function SearchInput({ value, onChange }) {
  return (
    <div className="relative w-full sm:w-64">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar ejercicio..."
        className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
      />
    </div>
  );
}

function TypeFilter({ value, onChange }) {
  return (
    <div
      role="group"
      aria-label="Filtrar por tipo"
      className="inline-flex rounded-lg border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-900"
    >
      {TYPE_FILTERS.map((f) => {
        const active = f.value === value;
        return (
          <button
            key={f.value}
            onClick={() => onChange(f.value)}
            aria-pressed={active}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
              active
                ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            }`}
          >
            {f.label}
          </button>
        );
      })}
    </div>
  );
}

/* ---------- Paginación ---------- */

function getPageList(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) pages.push("…");
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push("…");
  pages.push(total);

  return pages;
}

function Pagination({ currentPage, totalPages, onChange, disabled }) {
  if (totalPages <= 1) return null;

  const base =
    "inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40";
  const idle =
    "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800";
  const active = "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900";

  return (
    <nav
      aria-label="Paginación"
      className="mt-10 flex items-center justify-center gap-1"
    >
      <button
        className={`${base} ${idle}`}
        onClick={() => onChange(currentPage - 1)}
        disabled={disabled || currentPage <= 1}
        aria-label="Página anterior"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {getPageList(currentPage, totalPages).map((p, i) =>
        p === "…" ? (
          <span key={`dots-${i}`} className="px-2 text-slate-400">
            …
          </span>
        ) : (
          <button
            key={p}
            className={`${base} ${p === currentPage ? active : idle}`}
            onClick={() => onChange(p)}
            disabled={disabled}
            aria-current={p === currentPage ? "page" : undefined}
          >
            {p}
          </button>
        )
      )}

      <button
        className={`${base} ${idle}`}
        onClick={() => onChange(currentPage + 1)}
        disabled={disabled || currentPage >= totalPages}
        aria-label="Página siguiente"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}

/* ---------- Estados ---------- */

function EmptyState({ icon: Icon, title, description, tone = "neutral" }) {
  const iconTone =
    tone === "error"
      ? "bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-400"
      : "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500";

  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900">
      <div className={`mb-4 rounded-full p-3 ${iconTone}`}>
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
        {title}
      </h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
          {description}
        </p>
      )}
    </div>
  );
}

/* ---------- Página ---------- */

export default function ExercisesPage() {
  const [page, setPage] = useState(1);
  const [type, setType] = useState("");
  const [search, setSearch] = useState("");
  const [name, setName] = useState(""); // valor con debounce

  const [result, setResult] = useState({
    key: null,
    exercises: [],
    pagination: null,
    error: "",
  });

  useEffect(() => {
    const t = setTimeout(() => {
      setName(search.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const queryKey = `${page}|${type}|${name}`;

  useEffect(() => {
    let ignore = false;

    getExercises({ page, type, name })
      .then((res) => {
        if (ignore) return;
        setResult({
          key: queryKey,
          exercises: res.data,
          pagination: res.pagination,
          error: "",
        });
      })
      .catch((err) => {
        if (ignore) return;
        setResult((prev) => ({ ...prev, key: queryKey, error: err.message }));
      });

    return () => {
      ignore = true;
    };
  }, [page, type, name, queryKey]);

  const { exercises, pagination, error } = result;
  const loading = result.key !== queryKey;
  const firstLoad = loading && exercises.length === 0 && !error;

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleTypeChange = (value) => {
    setType(value);
    setPage(1);
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      {/* Encabezado */}
      <header className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-50">
            Ejercicios
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {pagination
              ? `${pagination.totalRecords} ejercicios disponibles`
              : "Explora y filtra tu biblioteca de ejercicios"}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchInput value={search} onChange={setSearch} />
          <TypeFilter value={type} onChange={handleTypeChange} />
          <Link
            to="/ejercicios/nuevo"
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
          >
            <Plus className="h-4 w-4" />
            Nuevo
          </Link>
        </div>
      </header>

      {/* Contenido */}
      {firstLoad ? (
        <div className={gridClasses}>
          {Array.from({ length: 8 }, (_, i) => (
            <ExerciseCardSkeleton key={i} />
          ))}
        </div>
      ) : error && !loading ? (
        <EmptyState
          icon={AlertCircle}
          tone="error"
          title="No se pudieron cargar los ejercicios"
          description={error}
        />
      ) : exercises.length === 0 && !loading ? (
        <EmptyState
          icon={SearchX}
          title="Sin resultados"
          description="Prueba con otro nombre o cambia el filtro de tipo."
        />
      ) : (
        <div
          className={`${gridClasses} transition-opacity ${
            loading ? "opacity-50" : "opacity-100"
          }`}
        >
          {exercises.map((ex) => (
            <ExerciseCard key={ex.id} exercise={ex} />
          ))}
        </div>
      )}

      {pagination && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onChange={handlePageChange}
          disabled={loading}
        />
      )}
      
    </main>
  );
}