import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProgram, getRoutines } from "./programsApi";

export default function ProgramDetailPage() {
  const { programId } = useParams();
  const [program, setProgram] = useState(null);
  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getProgram(programId), getRoutines(programId)])
      .then(([prog, routs]) => {
        setProgram(prog);
        setRoutines(routs);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [programId]);

  if (loading) return <p>Cargando programa...</p>;
  if (error) return <p style={{ color: "crimson" }}>{error}</p>;

  return (
    <section>
      <Link to="/programas">← Volver a programas</Link>
      <h1>{program?.name}</h1>

      <h2>Rutinas</h2>
      {routines.length === 0 ? (
        <p>Este programa aún no tiene rutinas.</p>
      ) : (
        <ol>
          {routines.map((r) => (
            <li key={r.id}>{r.name}</li>
          ))}
        </ol>
      )}
    </section>
  );
}
