// src/App.tsx
import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import Tareas from "./pages/Tareas";
import Materiales from "./pages/Materiales";
import Calendario from "./pages/Calendario";
import NuevaTarea from "./pages/NuevaTarea";
import DetalleTarea from "./pages/DetalleTarea";
import DetalleAviso from "./pages/DetalleAviso"
import DetalleMaterial from "./pages/DetalleMaterial"
import EditarMaterial from "./pages/EditarMaterial"
import Avisos from "./pages/Avisos";
import NuevoMaterial from "./pages/NuevoMaterial";
import NuevoAviso from "./pages/NuevoAviso";
import Pagos from "./pages/Pagos";
import NuevoPago from "./pages/NuevoPago";
import ListPagosAdmin from "./pages/ListPagosAdmin";
import EditarTarea from "./pages/EditarTarea";
import EditarAviso from "./pages/EditarAviso";
import EditarPago from "./pages/EditarPago";
import Login from "./pages/Login";
import ListaPadresAdmin from "./pages/ListaPadresAdmin"



export default function App() {
  return (

    <Routes>
      <Route element={<Layout />}>

        {/* Ruta raíz que muestra la lista de Tareas */}
        <Route path="/" element={<Tareas />} />

        {/* Ruta para crear nueva tarea (permanece igual) */}
        <Route path="nueva-tarea" element={<NuevaTarea />} />
        <Route path="/editar-tarea/:id" element={<EditarTarea />} />


        {/* Detalle por id: mantiene el prefijo /tareas/:id */}
        <Route path="tareas/:id" element={<DetalleTarea />} />

        {/* Resto de rutas */}
        <Route path="materiales" element={<Materiales />} />
        <Route path="/materiales/:id" element={<DetalleMaterial />} />
        <Route path="/editar-material/:id" element={<EditarMaterial />} />


        <Route path="calendario" element={<Calendario />} />

        <Route path="avisos" element={<Avisos />} />
        <Route path="avisos/:id" element={<DetalleAviso />} />
        <Route path="/editar-aviso/:id" element={<EditarAviso />} />


        <Route path="nuevo-material" element={<NuevoMaterial />} />
        <Route path="nuevo-aviso" element={<NuevoAviso />} />

        <Route path="pagos" element={<Pagos />} />
        <Route path="nuevo-pago" element={<NuevoPago />} />
        <Route path="pagos/:id" element={<ListPagosAdmin />} />
        <Route path="/editar-pago/:id" element={<EditarPago />} />

        <Route path="/admin/padres" element={<ListaPadresAdmin />} />



        <Route path="login" element={<Login />} />
      </Route>
    </Routes>
  );
}
