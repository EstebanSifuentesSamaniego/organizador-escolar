import { useParams, useNavigate } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import { usePagos } from "../context/PagosContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useEffect } from "react";

export default function DetallePago() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pagos, eliminarPago } = usePagos();
  const { user } = useAuth();
  const { showToast } = useToast();

  const pago = pagos.find((p) => p.id === id);

  useEffect(() => {
    if (!pago) navigate("/pagos");
  }, [pago, navigate]);

  if (!pago) return null;

  const handleEliminar = () => {
    const copia = eliminarPago(pago.id);
    navigate("/pagos");

    if (!copia) return;

    showToast({
      text: "Pago eliminado",
      actionLabel: "Deshacer",
      onAction: () => {
        // Aquí podrías agregar agregarPagoCompleto si lo importas
      },
    });
  };

  return (
    <div className="p-4 max-w-3xl mx-auto pb-24 bg-ethereal-ivory min-h-[80vh]">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-cerulean hover:text-deep-navy mb-4 transition"
      >
        <span className="text-xl">←</span>
        <span>Regresar</span>
      </button>

      <div
        className="shadow-md rounded-lg p-6 border"
        style={{
          backgroundColor: "oklch(97% 0.001 106.424)",
          borderColor: "#C1A37D",
        }}
      >
        <div className="flex items-start justify-between">
          <h1 className="text-2xl font-semibold mb-2 text-deep-navy">
            {pago.concepto}
          </h1>

          {user?.role === "admin" && (
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(`/editar-pago/${pago.id}`)}
                className="text-cerulean hover:text-deep-navy transition flex items-center gap-1"
              >
                <Pencil size={20} />
                <span className="text-sm font-medium">Editar</span>
              </button>

              <button
                onClick={handleEliminar}
                className="text-red-600 hover:text-red-800 transition flex items-center gap-1"
              >
                <Trash2 size={20} />
                <span className="text-sm font-medium">Eliminar</span>
              </button>
            </div>
          )}
        </div>

        <p className="text-cerulean text-sm mb-4">
          Monto: ${pago.monto} MXN
        </p>

        <p className="text-cerulean text-sm mb-4">
          Estado:{" "}
          {user?.role === "admin" || pago.padresIds.length > 0 ? (
            <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 font-medium">
              Pagado
            </span>
          ) : (
            <span className="px-2 py-1 rounded-full bg-red-100 text-red-700 font-medium">
              No pagado
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
