import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Dumbbell,
  Activity,
  ArrowLeft,
  AlertCircle,
  Target,
  Wrench,
  Play,
  ListOrdered,
  Lightbulb,
  Info,
  Trash2,
  Loader2,
} from "lucide-react";
import { MUSCLE_LABELS, EQUIPMENT_LABELS } from "./exerciseOptions";
import { getExercise, deleteExercise } from "./exercisesApi";

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

/* ---------- Piezas ---------- */

function InfoTile({ icon: Icon, label, children }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">
        {children}
      </div>
    </div>
  );
}

function DescriptionSection({ icon: Icon, title, text }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-50">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          <Icon className="h-4 w-4" />
        </span>
        {title}
      </h2>
      <p className="whitespace-pre-line text-sm leading-6 text-slate-600 dark:text-slate-300">
        {text}
      </p>
    </section>
  );
}

function DetailSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="mb-3 h-8 w-2/3 rounded bg-slate-200 dark:bg-slate-800" />
      <div className="mb-8 h-6 w-24 rounded bg-slate-200 dark:bg-slate-800" />
      <div className="mb-6 aspect-video rounded-2xl bg-slate-200 dark:bg-slate-800" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-20 rounded-xl bg-slate-200 dark:bg-slate-800" />
        ))}
      </div>
    </div>
  );
}

function ErrorState({ message }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900">
      <div className="mb-4 rounded-full bg-red-50 p-3 text-red-500 dark:bg-red-500/10 dark:text-red-400">
        <AlertCircle className="h-6 w-6" />
      </div>
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
        No se pudo cargar el ejercicio
      </h3>
      <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
        {message}
      </p>
    </div>
  );
}

function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Eliminar",
  loading,
  error,
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && !loading && onCancel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, loading, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
      onClick={() => !loading && onCancel()}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-slate-900"
      >
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-400">
          <Trash2 className="h-5 w-5" />
        </div>

        <h2
          id="confirm-title"
          className="text-base font-semibold text-slate-900 dark:text-slate-50"
        >
          {title}
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {description}
        </p>

        {error && (
          <p
            role="alert"
            className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300"
          >
            {error}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 disabled:opacity-50 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Eliminando..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Página ---------- */

export default function ExerciseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [result, setResult] = useState({ id: null, exercise: null, error: "" });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    let ignore = false;

    getExercise(id)
      .then((res) => {
        if (ignore) return;
        setResult({ id, exercise: res.data, error: "" });
      })
      .catch((err) => {
        if (ignore) return;
        setResult({ id, exercise: null, error: err.message });
      });

    return () => {
      ignore = true;
    };
  }, [id]);

  const loading = result.id !== id;
  const { exercise, error } = result;

  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError("");
    try {
      await deleteExercise(id);
      navigate("/ejercicios", { replace: true });
    } catch (err) {
      setDeleteError(err.message);
      setDeleting(false);
    }
  };

  const closeConfirm = () => {
    setConfirmOpen(false);
    setDeleteError("");
  };

  const sections = exercise
    ? [
        { icon: Target, title: "Posición inicial", text: exercise.description?.positionInicial },
        { icon: ListOrdered, title: "Ejecución", text: exercise.description?.ejecucion },
        { icon: Lightbulb, title: "Tips extra", text: exercise.description?.tipsExtra },
      ].filter((s) => s.text?.trim())
    : [];

  const hasAnyDescription = sections.length > 0 || exercise?.descriptionText?.trim();

  const style = TYPE_STYLES[exercise?.type] ?? DEFAULT_STYLE;
  const Icon = style.icon;
  const image = exercise?.avatar || exercise?.avatarThumbnail;

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <Link
        to="/ejercicios"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
      >
        <ArrowLeft className="h-4 w-4" />
        Ejercicios
      </Link>

      {loading ? (
        <DetailSkeleton />
      ) : error ? (
        <ErrorState message={error} />
      ) : (
        <article>
          {/* Encabezado */}
          <header className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-50">
                {exercise.name}
              </h1>
              <span
                className={`mt-3 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${style.badge}`}
              >
                <Icon className="h-3.5 w-3.5" />
                {style.label}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-red-500/30 dark:hover:bg-red-500/10 dark:hover:text-red-400"
            >
              <Trash2 className="h-4 w-4" />
              Eliminar
            </button>
          </header>

          {/* Media */}
          <div
            className={`relative mb-6 aspect-video overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br dark:border-slate-800 ${style.tile}`}
          >
            {exercise.video ? (
              <video
                src={exercise.video}
                poster={image ?? undefined}
                controls
                className="h-full w-full bg-black object-contain"
              />
            ) : image ? (
              <img
                src={image}
                alt={exercise.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Icon className="h-20 w-20" strokeWidth={1.25} />
              </div>
            )}
          </div>

          {/* Datos rápidos */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <InfoTile icon={Target} label="Músculos">
              {exercise.muscleGroups?.length ? (
                <div className="flex flex-wrap gap-1.5">
                  {exercise.muscleGroups.map((m) => (
                    <span
                      key={m}
                      className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    >
                      {MUSCLE_LABELS[m] ?? m}
                    </span>
                  ))}
                </div>
              ) : (
                "—"
              )}
            </InfoTile>

            <InfoTile icon={Wrench} label="Equipamiento">
              {exercise.equipment === "ninguno"
                ? "Sin equipamiento"
                : EQUIPMENT_LABELS[exercise.equipment] ?? exercise.equipment}
            </InfoTile>

            <InfoTile icon={Play} label="Video">
              {exercise.video ? "Disponible" : "No disponible"}
            </InfoTile>
          </div>

          {/* Descripción */}
          <div className="space-y-4">
            {sections.map((s) => (
              <DescriptionSection key={s.title} {...s} />
            ))}

            {sections.length === 0 && exercise.descriptionText?.trim() && (
              <DescriptionSection
                icon={Info}
                title="Descripción"
                text={exercise.descriptionText}
              />
            )}

            {!hasAnyDescription && (
              <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
                Este ejercicio aún no tiene descripción.
              </div>
            )}
          </div>
        </article>
      )}

      <ConfirmDialog
        open={confirmOpen}
        title="¿Eliminar este ejercicio?"
        description={`Se eliminará "${exercise?.name ?? ""}" junto con su imagen y video. Esta acción no se puede deshacer.`}
        loading={deleting}
        error={deleteError}
        onConfirm={handleDelete}
        onCancel={closeConfirm}
      />
    </main>
  );
}