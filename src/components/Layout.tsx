import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Navbar from "../components/Navbar";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col sm:flex-row bg-ethereal-ivory text-deep-navy">

      {/* Sidebar (desktop) */}
      <Navbar variant="sidebar" />

      {/* Contenido */}
      <div className="flex-1 flex flex-col">
        <Header />

        {/* Contenedor del contenido */}
        <main className="flex-1 p-4 bg-ethereal-ivory">
          <Outlet />
        </main>
      </div>

      {/* Bottom nav (móvil) */}
      <Navbar variant="mobile" />
    </div>
  );
}



