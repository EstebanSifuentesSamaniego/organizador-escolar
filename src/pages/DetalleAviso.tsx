import { useNavigate, useParams } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import { useAvisos } from "../context/AvisosContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useEffect } from "react";

export default function DetalleAviso() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { avisos, deleteAviso, addAviso } = useAvisos();
  const { user } = useAuth();
  const { showToast } = useToast();

  const aviso = avisos.find((a) => a.id === id);

  // ⛔ Evitar render cuando el aviso no existe (por eliminación o URL inválida)
  useEffect(() => {
    if (!aviso) {
      navigate("/avisos");
    }
  }, [aviso, navigate]);

  if (!aviso) return null;

  // --------------------------------------------------
  // 🗑 Eliminar aviso con opción a deshacer
  // --------------------------------------------------
  const handleEliminar = async () => {
    const copia = await deleteAviso(aviso.id);
    navigate("/avisos");

    if (!copia) return;

    showToast({
      text: "Aviso eliminado",
      actionLabel: "Deshacer",
      onAction: async () => {
        addAviso({
          ...copia,
        });
      },
    });
  };

  return (
    <div className="p-4 max-w-3xl mx-auto pb-24 bg-ethereal-ivory min-h-[80vh]">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-cerulean hover:text-deep-navy mb-4 transition"
      >
        ← Regresar
      </button>

      <div
        className="shadow-md rounded-lg p-6 border"
        style={{
          backgroundColor: "oklch(97% 0.001 106.424)",
          borderColor: "#C1A37D",
        }}
      >
        {/* Encabezado */}
        <div className="flex items-start justify-between">
          <h1 className="text-2xl font-semibold mb-2 text-deep-navy">
            {aviso.titulo}
          </h1>

          {user?.role === "admin" && (
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(`/editar-aviso/${aviso.id}`)}
                className="text-cerulean hover:text-deep-navy transition flex items-center gap-1"
              >
                <Pencil size={20} /> Editar
              </button>

              <button
                onClick={handleEliminar}
                className="text-red-600 hover:text-red-800 transition flex items-center gap-1"
              >
                <Trash2 size={20} /> Eliminar
              </button>
            </div>
          )}
        </div>

        {/* Fecha */}
        {aviso.createdAt && (
          <p className="text-cerulean text-sm mb-4">
            {new Date(aviso.createdAt.seconds * 1000).toLocaleDateString(
              "es-MX"
            )}
          </p>
        )}

        {/* Descripción */}
        <h2 className="text-lg font-semibold mb-1 text-deep-navy">Descripción</h2>
        <p className="text-deep-navy leading-relaxed whitespace-pre-line">
          {aviso.descripcion}
        </p>
      </div>
    </div>
  );
}
