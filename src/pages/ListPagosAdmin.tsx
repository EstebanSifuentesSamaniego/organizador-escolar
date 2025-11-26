import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { usePagos } from "../context/PagosContext";
import { usePadres } from "../context/PadresContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { Trash2, Pencil, Check, X } from "lucide-react";

export default function ListPagosAdmin() {
  const { id } = useParams();
  const { pagos, eliminarPago, updatePago, marcarPagado, desmarcarPago, agregarPago } =
    usePagos();
  const { padres } = usePadres();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editConcepto, setEditConcepto] = useState("");
  const [editMonto, setEditMonto] = useState(0);
  const [modalUrl, setModalUrl] = useState<string | null>(null);

  const pagoSeleccionado = pagos.find((p) => p.id === id);

  if (!pagoSeleccionado) {
    return (
      <div className="p-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-cerulean hover:text-deep-navy mb-4 transition"
        >
          <span className="text-xl">←</span>
          <span>Regresar</span>
        </button>
        <p className="text-center text-lg text-red-600">No se encontró este pago.</p>
      </div>
    );
  }

  const startEdit = (pago: typeof pagos[0]) => {
    setEditingId(pago.id);
    setEditConcepto(pago.concepto);
    setEditMonto(pago.monto);
  };

  const handleGuardar = async (id: string) => {
    await updatePago(id, { concepto: editConcepto, monto: editMonto });
    showToast({ text: "Pago actualizado correctamente" });
    setEditingId(null);
  };

  // 🔥 Restaurado: eliminar + deshacer + volver atrás
  const handleEliminar = async (id: string) => {
    const pagoEliminado = await eliminarPago(id);

    if (!pagoEliminado) return;

    showToast({
      text: "Pago eliminado",
      actionLabel: "Deshacer",
      onAction: () => agregarPago(pagoEliminado),
    });

    navigate(-1);
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
        className="rounded-xl shadow-lg p-4 border transition hover:shadow-xl"
        style={{ backgroundColor: "oklch(97% 0.001 106.424)", borderColor: "#C1A37D" }}
      >
        {editingId === pagoSeleccionado.id ? (
          <div className="space-y-2">
            <input
              className="w-full border rounded-md p-2"
              value={editConcepto}
              onChange={(e) => setEditConcepto(e.target.value)}
            />
            <input
              type="number"
              className="w-full border rounded-md p-2"
              value={editMonto}
              onChange={(e) => setEditMonto(Number(e.target.value))}
              min={0}
            />
            <div className="flex gap-2">
              <button
                onClick={() => handleGuardar(pagoSeleccionado.id)}
                className="bg-cerulean text-white px-4 py-1 rounded hover:bg-deep-navy transition"
              >
                Guardar
              </button>
              <button
                onClick={() => setEditingId(null)}
                className="bg-gray-300 px-4 py-1 rounded hover:bg-gray-400 transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-deep-navy">
                  {pagoSeleccionado.concepto}
                </h2>
                <p className="text-sm text-cerulean">
                  ${pagoSeleccionado.monto} MXN
                </p>
              </div>

              {user?.role === "admin" && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => startEdit(pagoSeleccionado)}
                    className="text-cerulean hover:text-deep-navy transition flex items-center gap-1"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleEliminar(pagoSeleccionado.id)}
                    className="text-red-600 hover:text-red-800 transition flex items-center gap-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>

            <div className="mt-3 flex flex-col gap-1">
              {padres.map((padre) => {
                const yaPago = pagoSeleccionado.padresIds.includes(padre.id);
                const comprobanteUrl = pagoSeleccionado.comprobantes?.[padre.id];

                return (
                  <div
                    key={padre.id}
                    className="flex justify-between items-center p-2 bg-white rounded-md shadow-sm"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-deep-navy">
                        {padre.nombre}
                      </span>
                      <span className="text-xs text-cerulean">{padre.correo}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {comprobanteUrl && (
                        <button
                          onClick={() => setModalUrl(comprobanteUrl)}
                          className="px-3 py-1 rounded-full bg-cerulean/60 text-white text-sm shadow hover:bg-cerulean/80 transition"
                        >
                          Ver comprobante
                        </button>
                      )}

                      {user?.role === "admin" && (
                        <button
                          onClick={() =>
                            yaPago
                              ? desmarcarPago(pagoSeleccionado.id, padre.id)
                              : marcarPagado(pagoSeleccionado.id, padre.id)
                          }
                          className={`px-3 py-1 rounded-full shadow text-sm flex items-center gap-1 transition ${
                            yaPago
                              ? "bg-green-200 text-green-700 hover:bg-green-300"
                              : "bg-red-200 text-red-700 hover:bg-red-300"
                          }`}
                        >
                          {yaPago ? (
                            <>
                              <Check size={14} /> Pagado
                            </>
                          ) : (
                            <>
                              <X size={14} /> No pagado
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {modalUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setModalUrl(null)}
        >
          <div
            className="bg-white rounded-md shadow-lg max-w-[90%] max-h-[90%] overflow-auto p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={modalUrl}
              alt="Comprobante"
              className="max-w-full max-h-[80vh] object-contain"
            />
            <div className="mt-3 flex justify-end">
              <button
                onClick={() => setModalUrl(null)}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
