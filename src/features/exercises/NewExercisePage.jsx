import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  Loader2,
  AlertCircle,
  ImagePlus,
  Video,
  X,
} from "lucide-react";
import { createExercise } from "./exercisesApi";
import {
  MUSCLE_LABELS,
  EQUIPMENT_LABELS,
  TYPE_OPTIONS,
  LIMITS,
} from "./exerciseOptions";

const inputClasses =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500";

const formatSize = (bytes) =>
  bytes < 1024 * 1024
    ? `${Math.round(bytes / 1024)} KB`
    : `${(bytes / 1024 / 1024).toFixed(1)} MB`;

function Field({ label, hint, htmlFor, right, children }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label
          htmlFor={htmlFor}
          className="block text-sm font-medium text-slate-900 dark:text-slate-100"
        >
          {label}
        </label>
        {right}
      </div>
      {children}
      {hint && (
        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
          {hint}
        </p>
      )}
    </div>
  );
}

function Card({ title, children }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <h2 className="mb-4 text-sm font-semibold text-slate-900 dark:text-slate-50">
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function FilePicker({ id, accept, icon: Icon, title, hint, file, preview, onPick, onClear }) {
  if (file) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-slate-200 p-3 dark:border-slate-700">
        {preview ? (
          <img
            src={preview}
            alt=""
            className="h-14 w-14 shrink-0 rounded-md object-cover"
          />
        ) : (
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            <Icon className="h-6 w-6" />
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
            {file.name}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {formatSize(file.size)}
          </p>
        </div>
        <button
          type="button"
          onClick={onClear}
          aria-label="Quitar archivo"
          className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer flex-col items-center gap-1 rounded-lg border border-dashed border-slate-300 px-4 py-6 text-center transition hover:border-indigo-400 hover:bg-slate-50 dark:border-slate-700 dark:hover:border-indigo-400 dark:hover:bg-slate-800/50"
    >
      <Icon className="h-6 w-6 text-slate-400" />
      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
        {title}
      </span>
      <span className="text-xs text-slate-500 dark:text-slate-400">{hint}</span>
      <input
        id={id}
        type="file"
        accept={accept}
        onChange={onPick}
        className="sr-only"
      />
    </label>
  );
}

/* ---------- Página ---------- */

export default function NewExercisePage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    type: "strength",
    muscleGroups: [],
    equipment: "",
    description: "",
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [video, setVideo] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Liberar la URL temporal de la vista previa
  const previewRef = useRef(null);
  useEffect(
    () => () => {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    },
    []
  );

  const setField = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const toggleMuscle = (muscle) =>
    setForm((f) => ({
      ...f,
      muscleGroups: f.muscleGroups.includes(muscle)
        ? f.muscleGroups.filter((m) => m !== muscle)
        : [...f.muscleGroups, muscle],
    }));

  const changeImage = (file) => {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    previewRef.current = file ? URL.createObjectURL(file) : null;
    setImage(file);
    setImagePreview(previewRef.current);
  };

  const pickImage = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!LIMITS.imageTypes.includes(file.type))
      return setError("Formato de imagen no permitido (usa JPG, PNG o WebP).");
    if (file.size > LIMITS.imageMB * 1024 * 1024)
      return setError(`La imagen excede los ${LIMITS.imageMB} MB.`);
    setError("");
    changeImage(file);
  };

  const pickVideo = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!LIMITS.videoTypes.includes(file.type))
      return setError("Formato de video no permitido (usa MP4 o WebM).");
    if (file.size > LIMITS.videoMB * 1024 * 1024)
      return setError(`El video excede los ${LIMITS.videoMB} MB.`);
    setError("");
    setVideo(file);
  };

  const validate = () => {
    const name = form.name.trim();
    if (name.length < LIMITS.nameMin || name.length > LIMITS.nameMax)
      return `El nombre debe tener entre ${LIMITS.nameMin} y ${LIMITS.nameMax} caracteres.`;
    if (form.muscleGroups.length === 0)
      return "Debes seleccionar al menos un grupo muscular.";
    if (!form.equipment) return "Debes seleccionar un tipo de equipamiento.";
    if (form.description.length > LIMITS.descriptionMax)
      return "La descripción es demasiado larga.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const problem = validate();
    if (problem) {
      setError(problem);
      return;
    }

    const fd = new FormData();
    fd.append("name", form.name.trim());
    fd.append("type", form.type);
    form.muscleGroups.forEach((m) => fd.append("muscleGroups", m));
    fd.append("equipment", form.equipment);
    if (form.description.trim()) fd.append("description", form.description.trim());
    if (image) fd.append("image", image);
    if (video) fd.append("video", video);

    setSubmitting(true);
    setError("");

    try {
      const res = await createExercise(fd);
      navigate(`/ejercicios/${res.data.id}`);
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <Link
        to="/ejercicios"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
      >
        <ArrowLeft className="h-4 w-4" />
        Ejercicios
      </Link>

      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-50">
          Nuevo ejercicio
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Agrega un ejercicio a tu biblioteca.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Card title="Información básica">
          <Field label="Nombre" htmlFor="name">
            <input
              id="name"
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              maxLength={LIMITS.nameMax}
              placeholder="Ej. Press de banca con barra"
              className={inputClasses}
              autoFocus
            />
          </Field>

          <Field label="Tipo">
            <div
              role="group"
              aria-label="Tipo de ejercicio"
              className="inline-flex rounded-lg border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-900"
            >
              {TYPE_OPTIONS.map((t) => {
                const active = form.type === t.value;
                return (
                  <button
                    type="button"
                    key={t.value}
                    onClick={() => setField("type", t.value)}
                    aria-pressed={active}
                    className={`rounded-md px-4 py-1.5 text-sm font-medium transition ${
                      active
                        ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                        : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                    }`}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          </Field>

          <Field label="Músculos trabajados" hint="Elige al menos uno.">
            <div className="flex flex-wrap gap-2">
              {Object.entries(MUSCLE_LABELS).map(([value, label]) => {
                const selected = form.muscleGroups.includes(value);
                return (
                  <button
                    type="button"
                    key={value}
                    onClick={() => toggleMuscle(value)}
                    aria-pressed={selected}
                    className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition ${
                      selected
                        ? "border-indigo-600 bg-indigo-50 text-indigo-700 dark:border-indigo-400 dark:bg-indigo-500/15 dark:text-indigo-300"
                        : "border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
                    }`}
                  >
                    {selected && <Check className="h-3 w-3" />}
                    {label}
                  </button>
                );
              })}
            </div>
          </Field>

          <Field label="Equipamiento" htmlFor="equipment">
            <select
              id="equipment"
              value={form.equipment}
              onChange={(e) => setField("equipment", e.target.value)}
              className={inputClasses}
            >
              <option value="" disabled>
                Selecciona una opción
              </option>
              {Object.entries(EQUIPMENT_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </Field>
        </Card>

        <Card title="Descripción (opcional)">
          <Field
            label="Cómo se realiza"
            htmlFor="description"
            right={
              <span className="text-xs text-slate-400">
                {form.description.length}/{LIMITS.descriptionMax}
              </span>
            }
          >
            <textarea
              id="description"
              rows={6}
              maxLength={LIMITS.descriptionMax}
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
              placeholder="Posición inicial, ejecución, consejos..."
              className={inputClasses}
            />
          </Field>
        </Card>

        <Card title="Multimedia (opcional)">
          <Field label="Imagen">
            <FilePicker
              id="image"
              accept={LIMITS.imageTypes.join(",")}
              icon={ImagePlus}
              title="Subir imagen"
              hint={`JPG, PNG o WebP · máx. ${LIMITS.imageMB} MB`}
              file={image}
              preview={imagePreview}
              onPick={pickImage}
              onClear={() => changeImage(null)}
            />
          </Field>

          <Field label="Video">
            <FilePicker
              id="video"
              accept={LIMITS.videoTypes.join(",")}
              icon={Video}
              title="Subir video"
              hint={`MP4 o WebM · máx. ${LIMITS.videoMB} MB`}
              file={video}
              onPick={pickVideo}
              onClear={() => setVideo(null)}
            />
          </Field>
        </Card>

        {error && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        <div className="flex items-center justify-end gap-3">
          <Link
            to="/ejercicios"
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {submitting ? "Guardando..." : "Guardar ejercicio"}
          </button>
        </div>
      </form>
    </main>
  );
}