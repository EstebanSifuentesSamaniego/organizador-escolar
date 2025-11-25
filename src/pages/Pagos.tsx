import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { usePagos } from "../context/PagosContext";
import { useToast } from "../context/ToastContext";
import { CreditCard } from "lucide-react";

export default function Pagos() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { pagos, subirComprobante } = usePagos();
  const { showToast } = useToast();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 🔥 Firebase user uid
  const userId = user ? String(user.uid) : "";

  const handleSeleccionArchivo = (pagoId: string) => {
    if (!user) {
      showToast({ text: "Inicia sesión para subir un comprobante" });
      return;
    }
    // guardamos pagoId en el data attribute del input
    if (fileInputRef.current) {
      fileInputRef.current.dataset.pagoId = pagoId;
      fileInputRef.current.click();
    }
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const pagoId = e.target.dataset.pagoId;
    if (!file || !pagoId) return;

    showToast({ text: "Subiendo comprobante..." });

    const url = await subirComprobante(pagoId, userId, file);
    if (url) {
      showToast({ text: "Comprobante subido correctamente" });
    } else {
      showToast({ text: "Error al subir comprobante" });
    }

    // limpiar input
    e.target.value = "";
    delete e.target.dataset.pagoId;
  };

  return (
    <div className="p-4 max-w-3xl mx-auto pb-24 bg-ethereal-ivory min-h-[80vh]">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFileChange}
      />

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-deep-navy">Pagos</h1>

        {user?.role === "admin" && (
          <button
            onClick={() => navigate("/nuevo-pago")}
            className="bg-cerulean text-white px-4 py-2 rounded-full shadow hover:bg-deep-navy transition flex items-center gap-2"
          >
            <span className="text-lg font-bold">+</span>
            <span className="hidden sm:block">Nuevo Pago</span>
          </button>
        )}
      </div>

      {pagos.length === 0 && (
        <div className="flex flex-col items-center justify-center mt-16 opacity-70 text-center">
          <CreditCard size={52} className="text-deep-navy mb-3 opacity-80" />
          <p className="text-lg text-deep-navy font-medium">Aún no hay pagos registrados</p>
          <p className="text-sm text-deep-navy mt-1">
            Cuando el administrador cree un pago, aparecerá aquí.
          </p>
        </div>
      )}

      <div className="flex flex-col gap-4 mt-4">
        {pagos.map((pago) => {
          const yaPago = pago.padresIds.includes(userId);
          const comprobanteUrl = userId ? pago.comprobantes?.[userId] : undefined;

          return (
            <div
              key={pago.id}
              className="rounded-xl shadow-lg p-4 border cursor-pointer transition hover:shadow-xl"
              style={{
                backgroundColor: "oklch(97% 0.001 106.424)",
                borderColor: "#C1A37D",
              }}
              onClick={() => {
                if (user?.role === "admin") {
                  navigate(`/pagos/${pago.id}`);
                }
              }}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold text-deep-navy">
                    {pago.concepto}
                  </h2>
                  <p className="text-sm text-cerulean">${pago.monto} MXN</p>
                </div>

                <div className="flex items-center gap-2">
                  {!user && (
                    <span className="px-3 py-1 rounded-full bg-gray-200 text-gray-600 text-sm font-medium">
                      Inicia sesión para pagar
                    </span>
                  )}

                  {user && (
                    <>
                      {yaPago ? (
                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                          Pagado
                        </span>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            alert("Aquí iría la integración real con PayPal.");
                          }}
                          className="bg-cerulean text-white px-3 py-1 rounded-full shadow hover:bg-deep-navy transition text-sm"
                        >
                          Pagar
                        </button>
                      )}

                      {/* Cambiar texto dinámicamente */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSeleccionArchivo(pago.id);
                        }}
                        className="bg-cerulean/60 text-white px-3 py-1 rounded-full shadow hover:bg-cerulean/80 transition text-sm"
                      >
                        {comprobanteUrl ? "Cambiar comprobante" : "Subir comprobante"}
                      </button>

                      {/* Mini preview */}
                      {comprobanteUrl && (
                        <img
                          src={comprobanteUrl}
                          alt="Comprobante"
                          className="w-10 h-10 rounded-md object-cover ml-2 border"
                        />
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
