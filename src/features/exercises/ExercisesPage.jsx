import { useEffect, useState } from "react";
import { getExercises } from "./exercisesApi";

export default function ExercisesPage() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getExercises()
      .then(setExercises)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Cargando ejercicios...</p>;
  if (error) return <p style={{ color: "crimson" }}>{error}</p>;

  return (
    <section>
      <h1>Ejercicios</h1>
      {exercises.length === 0 ? (
        <p>Aún no hay ejercicios.</p>
      ) : (
        <ul>
          {exercises.map((ex) => (
            <li key={ex.id}>
              {ex.name} {ex.muscleGroup && `· ${ex.muscleGroup}`}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
