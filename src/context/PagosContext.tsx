import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { db, storage } from "../firebase";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

export interface Pago {
  id: string;
  concepto: string;
  monto: number;
  padresIds: string[];
  comprobantes?: Record<string, string>; // padreId -> url
}

interface PagosContextType {
  pagos: Pago[];
  agregarPago: (pago: Omit<Pago, "id">) => Promise<void>;
  eliminarPago: (id: string) => Promise<void>;
  updatePago: (id: string, updated: Partial<Pago>) => Promise<void>;
  marcarPagado: (pagoId: string, padreId: string) => Promise<void>;
  desmarcarPago: (pagoId: string, padreId: string) => Promise<void>;
  subirComprobante: (pagoId: string, padreId: string, file: File) => Promise<string | null>;
}

const PagosContext = createContext<PagosContextType | undefined>(undefined);

export function PagosProvider({ children }: { children: ReactNode }) {
  const [pagos, setPagos] = useState<Pago[]>([]);
  const pagosCollection = collection(db, "pagos");

  const normalizePadresIds = (valor: any): string[] => {
    if (!valor) return [];
    if (Array.isArray(valor)) return valor.map((id) => String(id));
    if (typeof valor === "object") return Object.values(valor).map((id) => String(id));
    return [];
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(pagosCollection, (snapshot) => {
      const data: Pago[] = snapshot.docs.map((docSnap) => {
        const d = docSnap.data() as any;

        return {
          id: docSnap.id,
          concepto: d.concepto,
          monto: d.monto,
          padresIds: normalizePadresIds(d.padresIds),
          comprobantes: d.comprobantes ?? {},
        };
      });

      setPagos(data);
    });

    return () => unsubscribe();
  }, []);

  const agregarPago = async (pago: Omit<Pago, "id">) => {
    await addDoc(pagosCollection, {
      ...pago,
      padresIds: normalizePadresIds(pago.padresIds),
      comprobantes: pago.comprobantes ?? {},
    });
  };

  const eliminarPago = async (id: string) => {
    await deleteDoc(doc(db, "pagos", id));
  };

  const updatePago = async (id: string, updated: Partial<Pago>) => {
    const finalUpdate: any = { ...updated };
    if (updated.padresIds !== undefined) {
      finalUpdate.padresIds = normalizePadresIds(updated.padresIds);
    }
    if (updated.comprobantes !== undefined) {
      finalUpdate.comprobantes = updated.comprobantes;
    }

    await updateDoc(doc(db, "pagos", id), finalUpdate);
  };

  const marcarPagado = async (pagoId: string, padreId: string) => {
    const pagoActual = pagos.find((p) => p.id === pagoId);
    if (!pagoActual) return;

    const nuevos = Array.from(new Set([...pagoActual.padresIds, String(padreId)]));

    await updatePago(pagoId, { padresIds: nuevos });
  };

  const desmarcarPago = async (pagoId: string, padreId: string) => {
    const pagoActual = pagos.find((p) => p.id === pagoId);
    if (!pagoActual) return;

    const nuevos = pagoActual.padresIds.filter((id) => id !== String(padreId));

    await updatePago(pagoId, { padresIds: nuevos });
  };

  /**
   * Subir comprobante al Storage y guardar URL en el documento del pago.
   * Retorna la URL guardada o null en caso de error.
   */
  const subirComprobante = async (pagoId: string, padreId: string, file: File) => {
    try {
      const path = `comprobantes/${pagoId}/${padreId}_${Date.now()}_${file.name}`;
      const sRef = storageRef(storage, path);
      await uploadBytes(sRef, file);
      const url = await getDownloadURL(sRef);

      // Actualizar el documento de pago con la URL
      const pagoActual = pagos.find((p) => p.id === pagoId);
      const comprobantes = { ...(pagoActual?.comprobantes ?? {}) };
      comprobantes[String(padreId)] = url;

      await updatePago(pagoId, { comprobantes });

      return url;
    } catch (err) {
      console.error("Error subiendo comprobante:", err);
      return null;
    }
  };

  return (
    <PagosContext.Provider
      value={{
        pagos,
        agregarPago,
        eliminarPago,
        updatePago,
        marcarPagado,
        desmarcarPago,
        subirComprobante,
      }}
    >
      {children}
    </PagosContext.Provider>
  );
}

export function usePagos() {
  const ctx = useContext(PagosContext);
  if (!ctx) throw new Error("usePagos debe usarse dentro de PagosProvider");
  return ctx;
}
