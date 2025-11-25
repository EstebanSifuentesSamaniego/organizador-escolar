import { useParams, useNavigate } from "react-router-dom";
import { usePagos } from "../context/PagosContext";
import { useState } from "react";
import { useToast } from "../context/ToastContext";

export default function EditarPago() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pagos, updatePago } = usePagos();
  const { showToast } = useToast();

  const pago = pagos.find((p) => p.id === id);

  if (!pago) return <p className="p-4">Pago no encontrado.</p>;

  const [concepto, setConcepto] = useState(pago.concepto);
  const [monto, setMonto] = useState(pago.monto);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    updatePago(pago.id, { concepto, monto });

    showToast({ text: "Pago actualizado correctamente" });
    navigate(`/pagos/${pago.id}`);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto pb-24">
      <h1 className="text-2xl font-semibold mb-6 text-deep-navy">Editar Pago</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md border border-gray-200 space-y-4"
      >
        <div>
          <label className="block text-sm font-medium mb-1">Concepto</label>
          <input
            className="w-full border rounded-md p-2"
            value={concepto}
            onChange={(e) => setConcepto(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Monto</label>
          <input
            type="number"
            className="w-full border rounded-md p-2"
            value={monto}
            onChange={(e) => setMonto(Number(e.target.value))}
            required
            min={0}
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 rounded-lg bg-cerulean text-white font-medium hover:bg-deep-navy transition"
        >
          Guardar cambios
        </button>
      </form>
    </div>
  );
}
