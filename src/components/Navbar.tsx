import { Link, useLocation } from "react-router-dom";
import { ClipboardList, Bell, Package, CreditCard } from "lucide-react";

interface Props {
  variant: "mobile" | "sidebar";
}

export default function Navbar({ variant }: Props) {
  const location = useLocation();
  const current = location.pathname;

  const isActive = (path: string) => current === path;

  const items = [
    { path: "/", label: "Tareas", icon: ClipboardList },
    { path: "/avisos", label: "Avisos", icon: Bell },
    { path: "/materiales", label: "Materiales", icon: Package },
    { path: "/pagos", label: "Pagos", icon: CreditCard },
  ];

  if (variant === "mobile") {
    return (
      <nav className="fixed bottom-0 left-0 right-0 sm:hidden border-t bg-ethereal-ivory/90 backdrop-blur-md">
        <ul className="flex justify-between items-center px-4 py-2">
          {items.map(({ path, label, icon: Icon }) => (
            <Link key={path} to={path}>
              <li
                className={`flex flex-col items-center text-xs ${
                  isActive(path)
                    ? "text-deep-navy font-semibold"
                    : "text-cerulean"
                }`}
              >
                <Icon className="w-5 h-5 mb-0.5" />
                {label}
              </li>
            </Link>
          ))}
        </ul>
      </nav>
    );
  }

  return (
    <nav className="hidden sm:flex flex-col w-48 border-r bg-ethereal-ivory px-4 py-6 gap-4">
      {items.map(({ path, label, icon: Icon }) => (
        <Link key={path} to={path}>
          <div
            className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition ${
              isActive(path)
                ? "bg-warm-sand text-deep-navy font-semibold"
                : "text-deep-navy hover:bg-warm-sand"
            }`}
          >
            <Icon className="w-5 h-5 text-cerulean" />
            <span>{label}</span>
          </div>
        </Link>
      ))}
    </nav>
  );
}
