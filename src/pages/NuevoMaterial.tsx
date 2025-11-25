import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Plus, X } from "lucide-react";
import { useMaterials } from "../context/MaterialsContext";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";

export default function NuevoMaterial() {
  const navigate = useNavigate();
  const { crearAviso } = useMaterials();
  const { showToast } = useToast();
  const { user } = useAuth();

  const [paso, setPaso] = useState(1);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [materialInput, setMaterialInput] = useState("");
  const [materiales, setMateriales] = useState<string[]>([]);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const Lineas = () => (
    <div className="flex gap-2 mb-2">
      {[1, 2, 3].map((n) => (
        <div key={n} className={`h-1 flex-1 rounded-full ${paso === n ? "bg-cerulean" : "bg-warm-sand"}`} />
      ))}
    </div>
  );

  const handleAddMaterialFromInput = (raw?: string) => {
    const str = raw ?? materialInput;
    if (!str.trim()) return;
    // split by comma and trim
    const parts = str.split(",").map((p) => p.trim()).filter(Boolean);
    const newItems = [...materiales];
    for (const p of parts) {
      if (!newItems.includes(p)) newItems.push(p);
    }
    setMateriales(newItems);
    setMaterialInput("");
  };

  const removeMaterialAt = (idx: number) => {
    setMateriales((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!titulo.trim()) {
      showToast({ text: "Falta título" });
      setPaso(1);
      return;
    }
    if (!descripcion.trim()) {
      showToast({ text: "Falta descripción" });
      setPaso(2);
      return;
    }

    try {
      await crearAviso({ titulo: titulo.trim(), descripcion: descripcion.trim(), materiales });
      showToast({ text: "Material creado" });
      navigate("/materiales");
    } catch (err) {
      console.error(err);
      showToast({ text: "Error al crear material" });
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto pb-24 bg-ethereal-ivory min-h-[80vh]">
      <header className="flex items-center gap-2 mb-6">
        <button onClick={() => navigate("/materiales")} className="p-2 rounded-full hover:bg-warm-sand transition">
          <ChevronLeft size={22} className="text-deep-navy" />
        </button>
        <h1 className="text-xl font-semibold text-deep-navy">Nuevo material</h1>
      </header>

      <div className="p-6 bg-white border shadow rounded-xl space-y-4">
        <Lineas />
        <p className="text-center text-sm text-deep-navy/90">Paso {paso} de 3</p>

        {paso === 1 && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-deep-navy">Título</label>
            <input
              ref={inputRef}
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full border border-warm-sand rounded-lg p-2"
              placeholder="Ej: Material para proyecto de ciencias"
              autoFocus
            />
          </div>
        )}

        {paso === 2 && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-deep-navy">Descripción (¿para qué necesitamos los materiales?)</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={5}
              className="w-full border border-warm-sand rounded-lg p-2 resize-none"
              placeholder="Explica para qué se usarán estos materiales..."
            />
          </div>
        )}

        {paso === 3 && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-deep-navy">Lista de materiales (separa por comas o pulsa Enter)</label>

            <div className="flex gap-2">
              <input
                value={materialInput}
                onChange={(e) => setMaterialInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddMaterialFromInput();
                  }
                  if (e.key === ",") {
                    // allow comma to add too
                    // do nothing special; user types comma then press space/enter
                  }
                }}
                placeholder="Ej: cartulina, pegamento, tijeras"
                className="flex-1 border border-warm-sand rounded-lg p-2"
              />
              <button
                onClick={() => handleAddMaterialFromInput()}
                type="button"
                className="px-3 py-2 rounded-lg bg-cerulean text-white"
              >
                <Plus size={14} />
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {materiales.map((m, i) => (
                <div key={m + i} className="flex items-center gap-2 bg-ethereal-ivory px-3 py-1 rounded-full border border-warm-sand">
                  <span className="text-sm text-deep-navy">{m}</span>
                  <button onClick={() => removeMaterialAt(i)} type="button" className="p-1 rounded-full hover:bg-warm-sand">
                    <X size={14} />
                  </button>
                </div>
              ))}
              {materiales.length === 0 && <p className="text-sm text-gray-400">Añade materiales para que los padres los tomen</p>}
            </div>
          </div>
        )}

        <div className="flex justify-between mt-2">
          {paso > 1 ? (
            <button onClick={() => setPaso(paso - 1)} className="px-4 py-2 rounded-full border border-warm-sand">Atrás</button>
          ) : <div />}

          {paso < 3 ? (
            <button onClick={() => setPaso(paso + 1)} className="ml-auto bg-cerulean text-white px-6 py-2 rounded-full">Siguiente</button>
          ) : (
            <button onClick={() => handleSubmit()} className="ml-auto bg-cerulean text-white px-6 py-2 rounded-full">Guardar</button>
          )}
        </div>
      </div>
    </div>
  );
}
