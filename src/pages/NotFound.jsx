import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div style={{ maxWidth: 480, margin: "80px auto", fontFamily: "sans-serif" }}>
      <h1>404</h1>
      <p>Esta página no existe.</p>
      <Link to="/">Volver al inicio</Link>
    </div>
  );
}
