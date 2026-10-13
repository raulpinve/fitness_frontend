import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
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
} from "lucide-react";
import { getExercise } from "./exercisesApi";

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

const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

const formatEquipment = (eq) =>
  !eq || eq.toLowerCase() === "ninguno" ? "Sin equipamiento" : capitalize(eq);

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
      <div className="mb-6 h-4 w-24 rounded bg-slate-200 dark:bg-slate-800" />
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

/* ---------- Página ---------- */

export default function ExerciseDetailPage() {
  const { id } = useParams();

  const [result, setResult] = useState({ id: null, exercise: null, error: "" });

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
          <header className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-50">
              {exercise.name}
            </h1>
            <span
              className={`mt-3 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${style.badge}`}
            >
              <Icon className="h-3.5 w-3.5" />
              {style.label}
            </span>
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
                      {capitalize(m)}
                    </span>
                  ))}
                </div>
              ) : (
                "—"
              )}
            </InfoTile>

            <InfoTile icon={Wrench} label="Equipamiento">
              {formatEquipment(exercise.equipment)}
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
    </main>
  );
}