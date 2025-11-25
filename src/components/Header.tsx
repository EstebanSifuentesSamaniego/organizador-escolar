import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";

// 🎨 Colores estilo Google
const avatarColors = [
  "#F87171", // rojo
  "#60A5FA", // azul
  "#34D399", // verde
  "#FBBF24", // amarillo
  "#A78BFA", // morado
  "#F472B6", // rosa
];

// -----------------------------------------------------------
// Helpers
// -----------------------------------------------------------
function getInitials(name?: string | null): string {
  if (!name || typeof name !== "string") return "";
  const parts = name.trim().split(" ").filter(Boolean);
  return parts
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");
}

function getAvatarColor(name?: string | null): string {
  if (!name) return "#60A5FA";
  const charCode = name.charCodeAt(0);
  return avatarColors[charCode % avatarColors.length];
}

// -----------------------------------------------------------
// Header Component
// -----------------------------------------------------------
export default function Header() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isLoginPage = location.pathname === "/login";

  return (
    <header className="flex items-center justify-between px-4 py-3 shadow-sm bg-ethereal-ivory relative">

      {/* Título */}
      <div>
        <h1 className="text-lg font-bold text-deep-navy">Organizador Escolar</h1>
        <p className="text-xs text-cerulean">Salón • Ciclo 2025</p>
      </div>

      {/* Área de usuario */}
      <div className="relative">
        {!user && !isLoginPage && (
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 bg-cerulean text-white rounded-full shadow hover:bg-deep-navy transition"
          >
            Iniciar sesión
          </button>
        )}

        {user && (
          <>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 rounded-full p-1 hover:bg-warm-sand transition"
            >
              {/* Avatar */}
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold select-none overflow-hidden"
                style={{
                  backgroundColor: user.avatarUrl
                    ? "transparent"
                    : getAvatarColor(user.name),
                }}
              >
                {/* Si NO tiene foto → iniciales */}
                {!user.avatarUrl && getInitials(user.name)}

                {/* Si tiene foto → mostrarla */}
                {user.avatarUrl && user.avatarUrl.trim() !== "" && (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => {
                      // fallback a iniciales si la imagen falla
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                )}
              </div>

              <div className="hidden sm:flex flex-col text-left">
                <span className="text-sm font-medium text-deep-navy">{user.name}</span>
                <span className="text-xs text-cerulean">
                  {user.role === "admin" ? "Admin" : "Padre/madre"}
                </span>
              </div>

              <ChevronDown size={18} className="text-cerulean" />
            </button>

            {/* Menú */}
            {menuOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-ethereal-ivory rounded-md shadow-lg ring-1 ring-black/5 z-40 animate-fadeIn">
                <div className="px-4 py-3 border-b border-golden-brown">
                  <div className="text-sm font-semibold text-deep-navy">{user.name}</div>
                  <div className="text-xs text-cerulean">{user.email}</div>
                </div>

                <div className="py-1">
                  {user.role === "admin" && (
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        navigate("/admin/padres");
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-warm-sand text-deep-navy"
                    >
                      🧑‍🤝‍🧑 Administrar padres
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      logout();
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-warm-sand text-deep-navy"
                  >
                    🔐 Cerrar sesión
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </header>
  );
}
