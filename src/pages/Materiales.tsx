import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useMaterials } from "../context/MaterialsContext";
import { PackageOpen } from "lucide-react";

export default function Materiales() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { materialesDocs } = useMaterials();

  return (
    <div className="p-4 max-w-3xl mx-auto pb-24 bg-ethereal-ivory min-h-[80vh]">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-deep-navy">Materiales</h1>

        {user?.role === "admin" && (
          <button
            onClick={() => navigate("/nuevo-material")}
            className="bg-cerulean text-white px-4 py-2 rounded-full shadow hover:bg-deep-navy"
          >
            + Nuevo material
          </button>
        )}
      </div>

      {materialesDocs.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center mt-20 opacity-70">
          <PackageOpen size={80} className="text-cerulean mb-4" />
          <p className="text-lg text-deep-navy font-medium">
            Aún no hay materiales
          </p>
          <p className="text-sm text-deep-navy mt-1">
            Cuando agregues uno, aparecerá aquí.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {materialesDocs.map((a) => (
            <div
              key={a.id}
              onClick={() => navigate(`/materiales/${a.id}`)}
              className="rounded-xl shadow-lg p-4 border cursor-pointer transition hover:shadow-xl"
              style={{
                backgroundColor: "oklch(97% 0.001 106.424)",
                borderColor: "#C1A37D",
              }}
            >
              <h2 className="text-lg font-semibold text-deep-navy">{a.titulo}</h2>
              <p className="text-sm text-cerulean mt-1">{a.descripcion}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
