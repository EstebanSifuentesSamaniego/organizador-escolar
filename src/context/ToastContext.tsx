import { createContext, useContext, useState } from "react";

interface ToastMessage {
  id: string;
  text: string;
  actionLabel?: string;
  onAction?: () => void;
}

interface ToastContextType {
  showToast: (msg: Omit<ToastMessage, "id">) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (msg: Omit<ToastMessage, "id">) => {
    const id = crypto.randomUUID();
    const newToast: ToastMessage = { id, ...msg };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* CONTENEDOR DE TOASTS */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 flex flex-col gap-2 z-50">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="bg-deep-navy text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-4 animate-fadeIn"
          >
            <span>{toast.text}</span>

            {toast.actionLabel && toast.onAction && (
              <button
                onClick={toast.onAction}
                className="underline font-semibold hover:text-cerulean"
              >
                {toast.actionLabel}
              </button>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast debe usarse dentro de ToastProvider");
  return ctx;
}
