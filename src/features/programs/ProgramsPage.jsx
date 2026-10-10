import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPrograms } from "./programsApi";

export default function ProgramsPage() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getPrograms()
      .then(setPrograms)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Cargando programas...</p>;
  if (error) return <p style={{ color: "crimson" }}>{error}</p>;

  return (
    <section>
      <h1>Programas</h1>
      {programs.length === 0 ? (
        <p>Aún no tienes programas.</p>
      ) : (
        <ul>
          {programs.map((p) => (
            <li key={p.id}>
              <Link to={`/programas/${p.id}`}>{p.name}</Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
