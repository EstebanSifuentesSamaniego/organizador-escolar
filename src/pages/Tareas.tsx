import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTasks } from "../context/TasksContext";
import { ClipboardList } from "lucide-react";

export default function Tareas() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { tareas } = useTasks();

  return (
    <div className="p-4 max-w-3xl mx-auto pb-24 bg-ethereal-ivory min-h-[80vh]">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-deep-navy">Tareas</h1>

        {user?.role === "admin" && (
          <button
            onClick={() => navigate("/nueva-tarea")}
            className="bg-cerulean text-white px-4 py-2 rounded-full shadow hover:bg-deep-navy transition flex items-center gap-2"
          >
            + <span className="hidden sm:block">Nueva tarea</span>
          </button>
        )}
      </div>

      {/* --- PLACEHOLDER ESTILO MATERIALS --- */}
      {tareas.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center mt-20 opacity-70">
          <ClipboardList size={80} className="text-cerulean mb-4" />
          <p className="text-lg text-deep-navy font-medium">
            Aún no hay tareas registradas
          </p>
          <p className="text-sm text-deep-navy mt-1">
            Cuando agregues una, aparecerá aquí.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {tareas.map((t) => (
            <div
              key={t.id}
              onClick={() => navigate(`/tareas/${t.id}`)}
              className="rounded-xl shadow-lg p-4 border cursor-pointer transition hover:shadow-xl"
              style={{
                backgroundColor: "oklch(97% 0.001 106.424)",
                borderColor: "#C1A37D",
              }}
            >
              <h2 className="text-lg font-semibold text-deep-navy">{t.titulo}</h2>
              <p className="text-sm text-cerulean">
                Entrega:{" "}
                {t.fechaDeEntrega?.toLocaleDateString("es-MX")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
