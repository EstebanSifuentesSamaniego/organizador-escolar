import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth(); // <-- aquí viene null si no hay sesión

  const tareas = [
    { id: 1, titulo: "Dibujar la letra A", fecha: "2025-01-15" },
    { id: 2, titulo: "Traer semillas para el proyecto", fecha: "2025-01-16" },
  ];

  return (
    <div className="p-4 max-w-3xl mx-auto pb-24 bg-ethereal-ivory min-h-[80vh]">

      {/* Título + botón */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-deep-navy">Tareas</h1>

        {/* SOLO admins ven el botón */}
        {user?.role === "admin" && (
          <button
            onClick={() => navigate("/nueva-tarea")}
            className="bg-cerulean text-white px-4 py-2 rounded-full shadow hover:bg-deep-navy transition flex items-center gap-2"
          >
            <span className="text-lg font-bold">+</span>
            <span className="hidden sm:block">Nueva tarea</span>
          </button>
        )}
      </div>

      {/* LISTA DE TAREAS */}
      <div className="flex flex-col gap-4">
        {tareas.map((t) => (
          <div
            key={t.id}
            onClick={() => navigate(`/tareas/${t.id}`)}
            className="bg-ethereal-ivory shadow-md rounded-lg p-4 border border-warm-sand hover:bg-warm-sand hover:shadow-lg transition cursor-pointer w-full"
          >
            <h2 className="text-lg font-semibold text-deep-navy">{t.titulo}</h2>
            <p className="text-sm text-cerulean">Entrega: {t.fecha}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
