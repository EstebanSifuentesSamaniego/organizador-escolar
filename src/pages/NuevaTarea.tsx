import { useNavigate } from "react-router-dom";
import { ChevronLeft, Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import { useTasks } from "../context/TasksContext";
import { useToast } from "../context/ToastContext";

/* -------------------------------------------------------
   SUBCOMPONENTES — se declaran afuera para evitar rerenders
 ------------------------------------------------------- */

function Paso1({ titulo, setTitulo }: { titulo: string; setTitulo: (v: string) => void }) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-deep-navy">Título</label>
      <input
        type="text"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        className="w-full border border-warm-sand rounded-lg p-2"
        placeholder="Ej. Dibujar la letra A"
      />
    </div>
  );
}

function Paso2({ fecha, setFecha }: { fecha: string; setFecha: (v: string) => void }) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-deep-navy">
        Fecha de entrega
      </label>
      <input
        type="date"
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
        className="w-full border border-warm-sand rounded-lg p-2"
      />
    </div>
  );
}

function Paso3({
  descripcion,
  setDescripcion,
}: {
  descripcion: string;
  setDescripcion: (v: string) => void;
}) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-deep-navy">
        Descripción
      </label>
      <textarea
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        rows={5}
        className="w-full border border-warm-sand rounded-lg p-2"
        placeholder="Detalles adicionales…"
      />
    </div>
  );
}

function Paso4({
  imagenes,
  handleAddImages,
}: {
  imagenes: File[];
  handleAddImages: (files: FileList | null) => void;
}) {
  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-deep-navy">
        Imágenes (opcional)
      </label>

      <label className="border-2 border-dashed border-warm-sand p-6 rounded-xl flex flex-col items-center cursor-pointer hover:bg-warm-sand/30 transition space-y-2">
        <ImageIcon size={42} className="text-warm-sand" />
        <span className="text-gray-400 text-sm font-normal">
          Subir imágenes
        </span>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleAddImages(e.target.files)}
          className="hidden"
        />
      </label>

      {imagenes.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {imagenes.map((img, i) => (
            <img
              key={i}
              src={URL.createObjectURL(img)}
              alt=""
              className="rounded-lg shadow object-cover h-24 w-full"
            />
          ))}
        </div>
      )}
    </div>
  );
}

function Paso5({
  titulo,
  fecha,
  descripcion,
  imagenes,
}: {
  titulo: string;
  fecha: string;
  descripcion: string;
  imagenes: File[];
}) {
  return (
    <div className="space-y-4 text-deep-navy">
      <p className="text-sm font-medium text-center">
        Revisa que todo esté correcto antes de guardar.
      </p>

      <div className="bg-ethereal-ivory p-4 rounded-xl border space-y-3">
        <div>
          <p className="font-semibold text-sm">Título:</p>
          <p>{titulo || "—"}</p>
        </div>

        <div>
          <p className="font-semibold text-sm">Fecha de entrega:</p>
          <p>{fecha ? new Date(fecha).toLocaleDateString() : "—"}</p>
        </div>

        <div>
          <p className="font-semibold text-sm">Descripción:</p>
          <p>{descripcion || "—"}</p>
        </div>

        {imagenes.length > 0 && (
          <div>
            <p className="font-semibold text-sm mb-2">Imágenes:</p>
            <div className="grid grid-cols-3 gap-2">
              {imagenes.map((img, i) => (
                <img
                  key={i}
                  src={URL.createObjectURL(img)}
                  className="rounded-lg shadow object-cover h-24 w-full"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------
   COMPONENTE PRINCIPAL
 ------------------------------------------------------- */

export default function NuevaTarea() {
  const navigate = useNavigate();
  const { agregarTarea } = useTasks();
  const { showToast } = useToast();

  const [paso, setPaso] = useState(1);
  const [titulo, setTitulo] = useState("");
  const [fecha, setFecha] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagenes, setImagenes] = useState<File[]>([]);

  const handleAddImages = (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files);
    if (imagenes.length + arr.length > 10) {
      showToast({ text: "Máximo 10 imágenes" });
      return;
    }
    setImagenes((prev) => [...prev, ...arr]);
  };

  const guardarTarea = async () => {
    if (!titulo || !fecha) {
      showToast({ text: "Falta título o fecha" });
      return;
    }

    await agregarTarea(
      {
        titulo,
        descripcion,
        fechaDeEntrega: new Date(fecha),
      },
      imagenes
    );

    showToast({ text: "Tarea creada" });
    navigate("/");
  };

  const Lineas = () => (
    <div className="flex gap-2 mb-4">
      {[1, 2, 3, 4, 5].map((n) => (
        <div
          key={n}
          className={`h-1 flex-1 rounded-full ${
            paso === n ? "bg-cerulean" : "bg-warm-sand"
          }`}
        />
      ))}
    </div>
  );

  return (
    <div className="p-4 max-w-3xl mx-auto pb-24 bg-ethereal-ivory min-h-[80vh]">
      <header className="flex items-center gap-2 mb-6">
        <button
          onClick={() => navigate("/")}
          className="p-2 rounded-full hover:bg-warm-sand transition"
        >
          <ChevronLeft size={22} className="text-deep-navy" />
        </button>
        <h1 className="text-xl font-semibold text-deep-navy">Nueva tarea</h1>
      </header>

      <div className="p-6 bg-white border shadow rounded-xl space-y-6">
        {/* Líneas del progreso */}
        <Lineas />

        {/* Paso centrado y con gris más bonito */}
        <p className="text-sm text-gray-600 text-center font-medium">
          Paso {paso} de 5
        </p>

        {paso === 1 && <Paso1 titulo={titulo} setTitulo={setTitulo} />}
        {paso === 2 && <Paso2 fecha={fecha} setFecha={setFecha} />}
        {paso === 3 && (
          <Paso3 descripcion={descripcion} setDescripcion={setDescripcion} />
        )}
        {paso === 4 && (
          <Paso4 imagenes={imagenes} handleAddImages={handleAddImages} />
        )}
        {paso === 5 && (
          <Paso5
            titulo={titulo}
            fecha={fecha}
            descripcion={descripcion}
            imagenes={imagenes}
          />
        )}

        <div className="flex justify-between pt-4">
          {paso > 1 && (
            <button
              onClick={() => setPaso(paso - 1)}
              className="px-4 py-2 rounded-full border border-warm-sand"
            >
              Atrás
            </button>
          )}

          {paso < 5 && (
            <button
              onClick={() => setPaso(paso + 1)}
              className="ml-auto bg-cerulean text-white px-6 py-2 rounded-full shadow"
            >
              Siguiente
            </button>
          )}

          {paso === 5 && (
            <button
              onClick={guardarTarea}
              className="ml-auto bg-cerulean text-white px-6 py-2 rounded-full shadow"
            >
              Guardar tarea
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
