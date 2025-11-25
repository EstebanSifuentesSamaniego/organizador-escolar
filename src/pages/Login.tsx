import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const ok = await login(email, password);

    if (!ok) {
      setError("Credenciales incorrectas");
      return;
    }

    navigate("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-ethereal-ivory p-4">
      <div
        className="w-full max-w-md p-6 rounded-xl shadow-lg border"
        style={{ backgroundColor: "oklch(97% 0.001 106.424)", borderColor: "#C1A37D" }}
      >
        <h1 className="text-2xl font-bold text-deep-navy mb-6 text-center">
          Iniciar sesión
        </h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-deep-navy mb-1">
              Correo
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-warm-sand rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-brown transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="padre@escuela.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-deep-navy mb-1">
              Contraseña
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-warm-sand rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-brown transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="123456"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-cerulean text-white py-3 rounded-full shadow hover:bg-deep-navy transition font-medium"
          >
            Entrar
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-deep-navy/70">
          <p><strong>Admin:</strong> admin@escuela.com / 123456</p>
          <p><strong>Padre:</strong> padre@escuela.com / 123456</p>
        </div>
      </div>
    </div>
  );
}
