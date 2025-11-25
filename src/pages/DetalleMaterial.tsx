import { useParams, useNavigate } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import { useMaterials } from "../context/MaterialsContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useEffect } from "react";

export default function DetalleMaterial() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { materialesDocs, eliminarAviso, tomarMaterial, soltarMaterial, crearAviso } =
    useMaterials();
  const { user } = useAuth();

  const { showToast } = useToast();

  const aviso = materialesDocs.find((m) => m.id === id);

  useEffect(() => {
    if (!aviso) navigate("/materiales");
  }, [aviso, navigate]);

  if (!aviso) return null;

  const handleEliminar = async () => {
    const copia = await eliminarAviso(aviso.id);
    navigate("/materiales");

    if (!copia) return;

    showToast({
      text: "Material eliminado",
      actionLabel: "Deshacer",
      onAction: async () => {
        await crearAviso({
          titulo: copia.titulo,
          descripcion: copia.descripcion,
          materiales: copia.materiales,
        });
      },
    });
  };

  const onTomar = async (index: number) => {
    if (!user) {
      showToast({ text: "Debes iniciar sesión para tomar un material" });
      return;
    }

    const key = String(index);
    const asign = aviso.asignaciones?.[key];

    if (asign && asign.uid !== user.uid) {
      showToast({ text: `Material ya asignado a ${asign.nombre}` });
      return;
    }

    if (asign && asign.uid === user.uid) {
      await soltarMaterial(aviso.id, index);
      showToast({ text: "Material liberado" });
      return;
    }

    // ✅ USAMOS user.name SIEMPRE
    await tomarMaterial(aviso.id, index, user.name);

    showToast({ text: "Material tomado" });
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
        <div className="flex items-start justify-between">
          <h1 className="text-2xl font-semibold mb-2 text-deep-navy">
            {aviso.titulo}
          </h1>

          {user?.role === "admin" && (
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(`/editar-material/${aviso.id}`)}
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

        <p className="text-cerulean text-sm mb-4">Descripción</p>
        <p className="text-deep-navy whitespace-pre-line mb-6">
          {aviso.descripcion}
        </p>

        <h2 className="text-lg font-semibold mb-3 text-deep-navy">
          Lista de materiales
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {aviso.materiales.map((mat, idx) => {
            const asign = aviso.asignaciones?.[String(idx)];
            const isMine = user && asign?.uid === user.uid;
            const assignedTo = asign?.nombre;

            return (
              <div
                key={mat + idx}
                className={`p-3 rounded-lg border flex items-center justify-between ${
                  isMine
                    ? "bg-cerulean/10 border-cerulean"
                    : "bg-white border-warm-sand"
                }`}
              >
                <div>
                  <p className="text-deep-navy font-medium">{mat}</p>

                  {/* 🎯 SOLO UN TEXTO DE ESTADO */}
                  <p className="text-xs text-gray-500 mt-1">
                    {assignedTo
                      ? isMine
                        ? "Tomado por ti"
                        : `Asignado a ${assignedTo}`
                      : "Disponible"}
                  </p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onTomar(idx);
                  }}
                  className={`px-3 py-1 rounded-full text-sm transition ${
                    isMine
                      ? "bg-red-100 text-red-700 border border-red-200 hover:bg-red-200"
                      : assignedTo
                      ? "bg-gray-100 text-gray-500 border border-gray-200 cursor-not-allowed"
                      : "bg-green-100 text-green-700 border border-green-200 hover:bg-green-200"
                  }`}
                >
                  {isMine
                    ? "Soltar"
                    : assignedTo
                    ? "No disponible"
                    : "Tomar"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
