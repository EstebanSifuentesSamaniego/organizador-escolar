import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAvisos } from "../context/AvisosContext";
import { Bell } from "lucide-react";

export default function Avisos() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { avisos } = useAvisos();

  return (
    <div className="p-4 max-w-3xl mx-auto pb-24 bg-ethereal-ivory min-h-[80vh]">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-deep-navy">Avisos</h1>

        {user?.role === "admin" && (
          <button
            onClick={() => navigate("/nuevo-aviso")}
            className="bg-cerulean text-white px-4 py-2 rounded-full shadow hover:bg-deep-navy transition flex items-center gap-2"
          >
            <span className="text-lg font-bold">+</span>
            <span className="hidden sm:block">Nuevo aviso</span>
          </button>
        )}
      </div>

      {avisos.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-16 opacity-70 text-center">
          <Bell size={52} className="text-deep-navy mb-3 opacity-80" />
          <p className="text-lg text-deep-navy font-medium">Aún no hay avisos ✨</p>
          <p className="text-sm text-deep-navy mt-1">Cuando publiquen uno, aparecerá aquí.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 mt-4">
          {avisos.map((aviso) => (
            <div
              key={aviso.id}
              onClick={() => navigate(`/avisos/${aviso.id}`)}
              className="rounded-xl shadow-lg p-4 border cursor-pointer transition hover:shadow-xl"
              style={{
                backgroundColor: "oklch(97% 0.001 106.424)",
                borderColor: "#C1A37D",
              }}
            >
              <h2 className="text-lg font-semibold text-deep-navy">{aviso.titulo}</h2>
              {/* opcional mostrar fecha legible si existe createdAt */}
              <p className="text-sm text-cerulean">
                {aviso.createdAt ? new Date(aviso.createdAt.seconds * 1000).toLocaleDateString() : ""}
              </p>
              <p className="mt-1 text-deep-navy">{aviso.descripcion}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
