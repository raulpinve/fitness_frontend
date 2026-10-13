import { useEffect, useState } from "react";
import { getExercises } from "./exercisesApi";

function ExerciseCard({ exercise }) {
  const { name, avatarThumbnail, avatar, muscleGroup } = exercise;
  const image = avatarThumbnail || avatar;

  return (
    <article className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800">
      <div className="flex aspect-[4/3] items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-500 to-violet-500">
        {image ? (
          <img
            src={image}
            alt={name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <span className="text-5xl font-bold text-white/90">
            {name.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
      <div className="flex flex-col items-start gap-2.5 p-4">
        <h3 className="text-base font-semibold leading-snug text-gray-900 dark:text-gray-50">
          {name}
        </h3>
        {muscleGroup && (
          <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-200">
            {muscleGroup}
          </span>
        )}
      </div>
    </article>
  );
}

function Pagination({ currentPage, totalPages, onChange, disabled }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const base =
    "min-w-10 rounded-lg border px-3 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50";
  const idle =
    "border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700";
  const active = "border-indigo-600 bg-indigo-600 text-white";

  return (
    <nav
      aria-label="Paginación"
      className="mt-8 flex flex-wrap items-center justify-center gap-2"
    >
      <button
        className={`${base} ${idle}`}
        onClick={() => onChange(currentPage - 1)}
        disabled={disabled || currentPage <= 1}
      >
        Anterior
      </button>

      {pages.map((p) => (
        <button
          key={p}
          className={`${base} ${p === currentPage ? active : idle}`}
          onClick={() => onChange(p)}
          disabled={disabled}
          aria-current={p === currentPage ? "page" : undefined}
        >
          {p}
        </button>
      ))}

      <button
        className={`${base} ${idle}`}
        onClick={() => onChange(currentPage + 1)}
        disabled={disabled || currentPage >= totalPages}
      >
        Siguiente
      </button>
    </nav>
  );
}

export default function ExercisesPage() {
  const [page, setPage] = useState(1);
  const [type, setType] = useState("");
  const [search, setSearch] = useState("");
  const [name, setName] = useState(""); // valor con debounce

  const [result, setResult] = useState({
    key: null, // identifica la consulta a la que pertenece el resultado
    exercises: [],
    pagination: null,
    error: "",
  });

  // Debounce del buscador: espera 400 ms desde la última tecla
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

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleTypeChange = (e) => {
    setType(e.target.value);
    setPage(1); // al filtrar, vuelve a la primera página
  };

  if (loading && exercises.length === 0 && !error)
    return <p className="py-8 text-center text-gray-500">Cargando ejercicios...</p>;

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">
          Ejercicios
        </h1>

        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre..."
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          />
          <select
            value={type}
            onChange={handleTypeChange}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          >
            <option value="">Todos los tipos</option>
            <option value="strength">Fuerza</option>
            <option value="cardio">Cardio</option>
          </select>
        </div>
      </div>

      {error && !loading ? (
        <p className="py-8 text-center text-red-600">{error}</p>
      ) : exercises.length === 0 && !loading ? (
        <p className="py-8 text-center text-gray-500">No se encontraron ejercicios.</p>
      ) : (
        <div
          className={`grid grid-cols-1 gap-5 transition-opacity sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${
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
    </section>
  );
}