import { useNavigate, useParams } from "react-router-dom";
import { useTasks } from "../context/TasksContext";
import { useToast } from "../context/ToastContext";
import { useEffect, useState } from "react";

export default function EditarTarea() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tareas, actualizarTarea } = useTasks();
  const { showToast } = useToast();

  const tarea = tareas.find((t) => t.id === id);

  useEffect(() => {
    if (!tarea) navigate("/");
  }, [tarea, navigate]);

  const [titulo, setTitulo] = useState(tarea?.titulo || "");
  const [descripcion, setDescripcion] = useState(tarea?.descripcion || "");
  const [fechaDeEntrega, setFecha] = useState(
    tarea?.fechaDeEntrega?.toISOString().split("T")[0] || ""
  );
  const [nuevasImagenes, setNuevasImagenes] = useState<File[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!titulo.trim() || !fechaDeEntrega) {
      showToast({ text: "Completa título y fecha" });
      return;
    }

    await actualizarTarea(
      id!,
      {
        titulo,
        descripcion,
        fechaDeEntrega: new Date(fechaDeEntrega),
      },
      nuevasImagenes
    );

    showToast({ text: "Tarea actualizada" });
    navigate("/");
  };

  const handleAddImages = (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files);
    setNuevasImagenes([...nuevasImagenes, ...arr]);
  };

  if (!tarea) return null;

  return (
    <div className="p-4 max-w-3xl mx-auto pb-24 bg-ethereal-ivory min-h-[80vh]">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-cerulean hover:text-deep-navy mb-4"
      >
        ← Regresar
      </button>

      <div className="shadow-md rounded-lg p-6 border border-warm-sand bg-white">
        <h1 className="text-2xl font-semibold mb-4 text-deep-navy">
          Editar tarea
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-deep-navy mb-1">
              Título
            </label>
            <input
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full border border-warm-sand p-2 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-deep-navy mb-1">
              Fecha de entrega
            </label>
            <input
              type="date"
              value={fechaDeEntrega}
              onChange={(e) => setFecha(e.target.value)}
              className="w-full border border-warm-sand p-2 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-deep-navy mb-1">
              Descripción
            </label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={4}
              className="w-full border border-warm-sand p-2 rounded-lg"
            />
          </div>

          {/* IMÁGENES ACTUALES */}
          {tarea.imagenes?.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {tarea.imagenes.map((url, i) => (
                <img key={i} src={url} className="rounded-lg shadow" />
              ))}
            </div>
          )}

          {/* AÑADIR NUEVAS IMÁGENES */}
          <label className="border-2 border-dashed border-warm-sand p-6 rounded-xl flex flex-col items-center cursor-pointer hover:bg-warm-sand/30 transition">
            <span className="text-deep-navy font-medium">
              Subir nuevas imágenes
            </span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleAddImages(e.target.files)}
              className="hidden"
            />
          </label>

          {nuevasImagenes.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {nuevasImagenes.map((img, i) => (
                <img
                  key={i}
                  src={URL.createObjectURL(img)}
                  className="rounded-lg shadow"
                />
              ))}
            </div>
          )}

          <button
            type="submit"
            className="bg-cerulean text-white px-6 py-3 rounded-full shadow hover:bg-deep-navy transition"
          >
            Guardar cambios
          </button>
        </form>
      </div>
    </div>
  );
}
