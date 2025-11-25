import { useParams, useNavigate } from "react-router-dom";
import { useTasks } from "../context/TasksContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { Trash2, Pencil } from "lucide-react";

export default function DetalleTarea() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tareas, eliminarTarea, agregarTarea } = useTasks();
  const { user } = useAuth();
  const { showToast } = useToast();

  const tarea = tareas.find((t) => t.id === id);

  if (!tarea) {
    navigate("/");
    return null;
  }

  const handleEliminar = async () => {
    const copia = await eliminarTarea(tarea.id);

    navigate("/");

    if (!copia) return;

    showToast({
      text: "Tarea eliminada",
      actionLabel: "Deshacer",
      onAction: () => {
        agregarTarea(
          {
            titulo: copia.titulo,
            descripcion: copia.descripcion,
            fechaDeEntrega: copia.fechaDeEntrega,
          },
          []
        );
      },
    });
  };

  // ======================================
  // DESCARGAR IMAGEN SIN ABRIR NUEVA VENTANA
  // ======================================
  const descargarImagen = async (url: string, nombre: string) => {
    try {
      const response = await fetch(url, { mode: "cors" });
      const blob = await response.blob();

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = nombre;
      link.click();

      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Error descargando imagen:", error);
      showToast({ text: "No se pudo descargar la imagen" });
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto pb-24 bg-ethereal-ivory min-h-[80vh]">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-cerulean hover:text-deep-navy mb-4 transition"
      >
        ← Regresar
      </button>

      <div className="shadow-md rounded-lg p-6 border bg-white border-warm-sand">
        <div className="flex items-start justify-between">
          <h1 className="text-2xl font-semibold mb-2 text-deep-navy">
            {tarea.titulo}
          </h1>

          {user?.role === "admin" && (
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(`/editar-tarea/${tarea.id}`)}
                className="text-cerulean hover:text-deep-navy transition flex items-center gap-1"
              >
                <Pencil size={20} />
                Editar
              </button>

              <button
                onClick={handleEliminar}
                className="text-red-600 hover:text-red-800 transition flex items-center gap-1"
              >
                <Trash2 size={20} />
                Eliminar
              </button>
            </div>
          )}
        </div>

        <p className="text-cerulean text-sm mb-4">
          Fecha de entrega:{" "}
          {tarea.fechaDeEntrega?.toLocaleDateString("es-MX")}
        </p>

        <h2 className="text-lg font-semibold mb-1 text-deep-navy">
          Descripción
        </h2>
        <p className="text-deep-navy whitespace-pre-line mb-6">
          {tarea.descripcion}
        </p>

        {/* IMÁGENES CON DESCARGA AUTOMÁTICA */}
        {tarea.imagenes && tarea.imagenes.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {tarea.imagenes.map((url, i) => {
              const nombreArchivo = `tarea-${tarea.titulo.replace(
                /\s+/g,
                "_"
              )}-img-${i + 1}.jpg`;

              return (
                <div
                  key={i}
                  className="flex flex-col items-center bg-white p-2 rounded-lg shadow border"
                >
                  <img
                    src={url}
                    className="rounded-lg object-cover h-32 w-full mb-2"
                  />

                  <button
                    onClick={() => descargarImagen(url, nombreArchivo)}
                    className="text-sm px-3 py-1 rounded-full border border-cerulean text-cerulean hover:bg-cerulean hover:text-white transition"
                  >
                    Descargar
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
