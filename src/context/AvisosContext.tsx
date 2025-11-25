import { createContext, useContext, useEffect, useState } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  query,
  orderBy,
  serverTimestamp,
  type DocumentData,
} from "firebase/firestore";
import { db } from "../firebase";

export interface Aviso {
  id: string; // id de Firestore
  titulo: string;
  descripcion: string;
  createdAt?: any;
}

type AvisosContextType = {
  avisos: Aviso[];
  addAviso: (aviso: Omit<Aviso, "id" | "createdAt">) => Promise<void>;
  updateAviso: (id: string, updated: Partial<Omit<Aviso, "id">>) => Promise<void>;
  deleteAviso: (id: string) => Promise<Aviso | null>;
};

const AvisosContext = createContext<AvisosContextType | undefined>(undefined);

export function AvisosProvider({ children }: { children: React.ReactNode }) {
  const [avisos, setAvisos] = useState<Aviso[]>([]);

  // Escucha en tiempo real la colección 'avisos', ordenada por createdAt (desc)
  useEffect(() => {
    const q = query(collection(db, "avisos"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const docs: Aviso[] = snap.docs.map((d) => {
        const data = d.data() as DocumentData;
        return {
          id: d.id,
          titulo: data.titulo || "",
          descripcion: data.descripcion || "",
          createdAt: data.createdAt || null,
        };
      });
      setAvisos(docs);
    });

    return () => unsub();
  }, []);

  // Agregar aviso a Firestore
  const addAviso = async (aviso: Omit<Aviso, "id" | "createdAt">) => {
    const col = collection(db, "avisos");
    await addDoc(col, {
      titulo: aviso.titulo,
      descripcion: aviso.descripcion,
      createdAt: serverTimestamp(),
    });
  };

  // Actualizar aviso (solo los campos provistos)
  const updateAviso = async (id: string, updated: Partial<Omit<Aviso, "id">>) => {
    const ref = doc(db, "avisos", id);
    const payload: any = {};
    if (updated.titulo !== undefined) payload.titulo = updated.titulo;
    if (updated.descripcion !== undefined) payload.descripcion = updated.descripcion;
    if (Object.keys(payload).length > 0) {
      await updateDoc(ref, payload);
    }
  };

  // Eliminar aviso: devuelve la copia eliminada para posible "deshacer"
  const deleteAviso = async (id: string): Promise<Aviso | null> => {
    const refDoc = doc(db, "avisos", id);
    const snap = await getDoc(refDoc);
    if (!snap.exists()) return null;

    const data = snap.data() as DocumentData;
    const copia: Aviso = {
      id: snap.id,
      titulo: data.titulo || "",
      descripcion: data.descripcion || "",
      createdAt: data.createdAt || null,
    };

    await deleteDoc(refDoc);
    return copia;
  };

  return (
    <AvisosContext.Provider value={{ avisos, addAviso, updateAviso, deleteAviso }}>
      {children}
    </AvisosContext.Provider>
  );
}

export const useAvisos = () => {
  const ctx = useContext(AvisosContext);
  if (!ctx) throw new Error("useAvisos must be used inside AvisosProvider");
  return ctx;
};
