import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { usePagos } from "../context/PagosContext";

export default function NuevoPago() {
  const navigate = useNavigate();
  const { agregarPago } = usePagos();

  const [titulo, setTitulo] = useState("");
  const [monto, setMonto] = useState("");

  const handleGuardar = (e: React.FormEvent) => {
    e.preventDefault();

    if (!titulo.trim() || !monto.trim()) {
      alert("Por favor completa todos los campos.");
      return;
    }

    const nuevoPago = {
      concepto: titulo,
      monto: Number(monto),
      padresIds: [],
    };

    agregarPago(nuevoPago);
    navigate("/pagos");
  };

  return (
    <div className="p-4 max-w-3xl mx-auto pb-24 bg-ethereal-ivory min-h-[80vh]">

      {/* HEADER */}
      <header className="flex items-center gap-2 mb-6">
        <button
          onClick={() => navigate("/pagos")}
          className="p-2 rounded-full hover:bg-warm-sand transition"
        >
          <ChevronLeft size={22} className="text-deep-navy" />
        </button>
        <h1 className="text-xl font-semibold text-deep-navy">Nuevo pago</h1>
      </header>

      {/* FORM */}
      <form
        onSubmit={handleGuardar}
        className="bg-ethereal-ivory p-6 rounded-lg shadow-md border border-warm-sand space-y-4"
      >
        {/* TÍTULO */}
        <div>
          <label className="text-sm font-medium text-deep-navy">Concepto del pago</label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ej: Foto navideña"
            className="mt-1 w-full border border-warm-sand rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-golden-brown transition"
          />
        </div>

        {/* MONTO */}
        <div>
          <label className="text-sm font-medium text-deep-navy">Monto (MXN)</label>
          <input
            type="number"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            placeholder="Ej: 100"
            className="mt-1 w-full border border-warm-sand rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-golden-brown transition"
          />
        </div>

        {/* BOTÓN */}
        <button
          type="submit"
          className="w-full bg-cerulean text-white py-3 rounded-full shadow hover:bg-deep-navy transition font-medium"
        >
          Guardar pago
        </button>
      </form>

    </div>
  );
}
