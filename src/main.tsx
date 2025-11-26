import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { TasksProvider } from "./context/TasksContext";
import { AvisosProvider } from "./context/AvisosContext";
import { MaterialsProvider } from "./context/MaterialsContext";
import { PagosProvider } from "./context/PagosContext";
import { ToastProvider } from "./context/ToastContext"
import { PadresProvider } from "./context/PadresContext"
import { Toaster } from "sonner";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <>
    <Toaster richColors position="top-center" />
    <BrowserRouter>
      <AuthProvider>
        <TasksProvider>
          <MaterialsProvider>
            <PagosProvider>
              <AvisosProvider>
                <ToastProvider>
                  <PadresProvider>
                    <App />
                  </PadresProvider>
                </ToastProvider>
              </AvisosProvider>
            </PagosProvider>
          </MaterialsProvider>
        </TasksProvider>
      </AuthProvider>
    </BrowserRouter>
    </>
);
