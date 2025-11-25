import { useParams, useNavigate } from "react-router-dom";
import { useAvisos } from "../context/AvisosContext";
import { useState, useEffect, useRef } from "react";
import { useToast } from "../context/ToastContext";
import { ChevronLeft } from "lucide-react";

export default function EditarAviso() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { avisos, updateAviso } = useAvisos();
  const { showToast } = useToast();

  const aviso = avisos.find((a) => a.id === id);
  const [paso, setPaso] = useState(1);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const tituloRef = useRef<HTMLInputElement | null>(null);
  const descRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (!aviso) {
      navigate("/avisos");
      return;
    }
    setTitulo(aviso.titulo);
    setDescripcion(aviso.descripcion);
  }, [aviso, navigate]);

  useEffect(() => {
    if (paso === 1) tituloRef.current?.focus();
    if (paso === 2) descRef.current?.focus();
  }, [paso]);

  if (!aviso) return null;

  const Lineas = () => (
    <div className="flex gap-2 mb-3">
      {[1, 2].map((n) => (
        <div key={n} className={`h-1 flex-1 rounded-full ${paso === n ? "bg-cerulean" : "bg-warm-sand"}`} />
      ))}
    </div>
  );

  const handleGuardar = async (e?: React.FormEvent) => {
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
      await updateAviso(aviso.id, { titulo: titulo.trim(), descripcion: descripcion.trim() });
      showToast({ text: "Aviso actualizado" });
      navigate(`/avisos/${aviso.id}`);
    } catch (err) {
      console.error(err);
      showToast({ text: "Error al actualizar" });
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto pb-24 bg-ethereal-ivory min-h-[80vh]">
      <header className="flex items-center gap-2 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-warm-sand transition">
          <ChevronLeft size={22} className="text-deep-navy" />
        </button>
        <h1 className="text-xl font-semibold text-deep-navy">Editar aviso</h1>
      </header>

      <div className="p-6 bg-white border shadow rounded-xl space-y-4">
        <Lineas />
        <p className="text-center text-sm text-deep-navy/90">Paso {paso} de 2</p>

        {paso === 1 && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-deep-navy">Título</label>
            <input
              ref={tituloRef}
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full border border-warm-sand rounded-lg p-3"
            />
          </div>
        )}

        {paso === 2 && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-deep-navy">Descripción</label>
            <textarea
              ref={descRef}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={6}
              className="w-full border border-warm-sand rounded-lg p-3 resize-none"
            />
          </div>
        )}

        <div className="flex justify-between pt-4">
          {paso > 1 ? (
            <button onClick={() => setPaso(paso - 1)} className="px-4 py-2 rounded-full border border-warm-sand">
              Atrás
            </button>
          ) : (
            <div />
          )}

          {paso < 2 ? (
            <button onClick={() => setPaso(paso + 1)} className="ml-auto bg-cerulean text-white px-6 py-2 rounded-full shadow">
              Siguiente
            </button>
          ) : (
            <button onClick={handleGuardar} className="ml-auto bg-cerulean text-white px-6 py-2 rounded-full shadow">
              Guardar cambios
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
