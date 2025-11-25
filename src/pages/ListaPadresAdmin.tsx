import { useState } from "react";
import { usePadres } from "../context/PadresContext";
import { useToast } from "../context/ToastContext";
import { Trash2, Pencil, Plus } from "lucide-react";

export default function ListPadresAdmin() {
  const { padres, agregarPadre, eliminarPadre, updatePadre } = usePadres();
  const { showToast } = useToast();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNombre, setEditNombre] = useState("");
  const [editCorreo, setEditCorreo] = useState("");
  const [editTelefono, setEditTelefono] = useState("");
  const [editRole, setEditRole] = useState<"padre" | "madre" | "admin">("padre");

  const [showAgregar, setShowAgregar] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoCorreo, setNuevoCorreo] = useState("");
  const [nuevoTelefono, setNuevoTelefono] = useState("");
  const [nuevoRole, setNuevoRole] = useState<"padre" | "madre" | "admin">("padre");
  const [nuevoPassword, setNuevoPassword] = useState("");

  // Iniciar edición
  const startEdit = (padre: typeof padres[0]) => {
    setEditingId(padre.id);
    setEditNombre(padre.nombre);
    setEditCorreo(padre.correo);
    setEditTelefono(padre.telefono);
    setEditRole(padre.role || "padre");
  };

  // Guardar edición
  const handleGuardar = (id: string) => {
    updatePadre(id, {
      nombre: editNombre,
      correo: editCorreo,
      telefono: editTelefono,
      role: editRole,
    });

    showToast({ text: "Padre actualizado correctamente" });
    setEditingId(null);
  };

  // Eliminar con deshacer
  const handleEliminar = (id: string) => {
    const copia = padres.find((p) => p.id === id);
    if (!copia) return;

    eliminarPadre(id);

    showToast({
      text: "Padre eliminado",
      actionLabel: "Deshacer",
      onAction: () => {
        agregarPadre({
          nombre: copia.nombre,
          correo: copia.correo,
          telefono: copia.telefono,
          role: copia.role || "padre",
          password: "12345678", // fallback temporal
        });
      },
    });
  };

  // Agregar nuevo padre
  const handleAgregar = () => {
    if (!nuevoNombre.trim() || !nuevoCorreo.trim() || !nuevoPassword.trim()) {
      showToast({ text: "Faltan campos obligatorios" });
      return;
    }

    agregarPadre({
      nombre: nuevoNombre,
      correo: nuevoCorreo,
      telefono: nuevoTelefono,
      role: nuevoRole,
      password: nuevoPassword,
    });

    showToast({ text: "Padre agregado correctamente" });

    setNuevoNombre("");
    setNuevoCorreo("");
    setNuevoTelefono("");
    setNuevoRole("padre");
    setNuevoPassword("");
    setShowAgregar(false);
  };

  return (
    <div className="p-4 max-w-3xl mx-auto pb-24 bg-ethereal-ivory min-h-[80vh]">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-deep-navy">Administrar Padres</h1>
        <button
          onClick={() => setShowAgregar(!showAgregar)}
          className="bg-cerulean text-white px-4 py-2 rounded-full shadow hover:bg-deep-navy transition flex items-center gap-2"
        >
          <Plus size={16} />
          <span>{showAgregar ? "Cancelar" : "Agregar Padre"}</span>
        </button>
      </div>

      {/* Formulario de agregar */}
      {showAgregar && (
        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-300 mb-6 space-y-2">
          <input
            className="w-full border rounded-md p-2"
            placeholder="Nombre"
            value={nuevoNombre}
            onChange={(e) => setNuevoNombre(e.target.value)}
          />
          <input
            className="w-full border rounded-md p-2"
            placeholder="Correo"
            value={nuevoCorreo}
            onChange={(e) => setNuevoCorreo(e.target.value)}
          />
          <input
            className="w-full border rounded-md p-2"
            placeholder="Teléfono"
            value={nuevoTelefono}
            onChange={(e) => setNuevoTelefono(e.target.value)}
          />

          <input
            className="w-full border rounded-md p-2"
            placeholder="Contraseña (mínimo 6 caracteres)"
            type="password"
            value={nuevoPassword}
            onChange={(e) => setNuevoPassword(e.target.value)}
          />

          <select
            className="w-full border rounded-md p-2"
            value={nuevoRole}
            onChange={(e) =>
              setNuevoRole(e.target.value as "padre" | "madre" | "admin")
            }
          >
            <option value="padre">Padre</option>
            <option value="madre">Madre</option>
            <option value="admin">Admin</option>
          </select>

          <button
            onClick={handleAgregar}
            className="bg-cerulean text-white px-4 py-2 rounded-full shadow hover:bg-deep-navy transition"
          >
            Guardar
          </button>
        </div>
      )}

      {padres.length === 0 && (
        <div className="flex flex-col items-center justify-center mt-16 opacity-70 text-center">
          <p className="text-lg text-deep-navy font-medium">
            No hay padres registrados
          </p>
        </div>
      )}

      <div className="flex flex-col gap-4 mt-4">
        {padres.map((padre) => (
          <div
            key={padre.id}
            className="rounded-xl shadow-lg p-4 border transition hover:shadow-xl"
            style={{
              backgroundColor: "oklch(97% 0.001 106.424)",
              borderColor: "#C1A37D",
            }}
          >
            {editingId === padre.id ? (
              <div className="space-y-2">
                <input
                  className="w-full border rounded-md p-2"
                  value={editNombre}
                  onChange={(e) => setEditNombre(e.target.value)}
                  placeholder="Nombre"
                />
                <input
                  className="w-full border rounded-md p-2"
                  value={editCorreo}
                  onChange={(e) => setEditCorreo(e.target.value)}
                  placeholder="Correo"
                />
                <input
                  className="w-full border rounded-md p-2"
                  value={editTelefono}
                  onChange={(e) => setEditTelefono(e.target.value)}
                  placeholder="Teléfono"
                />
                <select
                  className="w-full border rounded-md p-2"
                  value={editRole}
                  onChange={(e) =>
                    setEditRole(e.target.value as "padre" | "madre" | "admin")
                  }
                >
                  <option value="padre">Padre</option>
                  <option value="madre">Madre</option>
                  <option value="admin">Admin</option>
                </select>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleGuardar(padre.id)}
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
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold text-deep-navy">{padre.nombre}</h2>
                  <p className="text-sm text-cerulean">{padre.correo}</p>
                  <p className="text-sm text-cerulean">{padre.telefono}</p>
                  <p className="text-sm text-cerulean">Rol: {padre.role}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => startEdit(padre)}
                    className="text-cerulean hover:text-deep-navy transition flex items-center gap-1"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleEliminar(padre.id)}
                    className="text-red-600 hover:text-red-800 transition flex items-center gap-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
