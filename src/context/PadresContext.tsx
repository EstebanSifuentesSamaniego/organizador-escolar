import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { auth, db } from "../firebase";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

import { createUserWithEmailAndPassword } from "firebase/auth";

export interface Padre {
  id: string;
  nombre: string;
  correo: string;
  telefono: string;
  role?: "admin" | "padre" | "madre";
}

interface PadresContextType {
  padres: Padre[];
  agregarPadre: (padre: Omit<Padre, "id"> & { password: string }) => Promise<void>;
  eliminarPadre: (id: string) => Promise<void>;
  updatePadre: (id: string, updated: Partial<Padre>) => Promise<void>;
}

const PadresContext = createContext<PadresContextType | undefined>(undefined);

export function PadresProvider({ children }: { children: ReactNode }) {
  const [padres, setPadres] = useState<Padre[]>([]);

  const padresCollection = collection(db, "padres");

  // Cargar padres desde Firestore al iniciar
  const cargarPadres = async () => {
    const snapshot = await getDocs(padresCollection);
    const data = snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Padre)
    );
    setPadres(data);
  };

  useEffect(() => {
    cargarPadres();
  }, []);

  // Crear usuario + documento
  const agregarPadre = async (
    padre: Omit<Padre, "id"> & { password: string }
  ) => {
    // Crear usuario en Firebase Auth
    const cred = await createUserWithEmailAndPassword(
      auth,
      padre.correo,
      padre.password
    );

    const uid = cred.user.uid;

    // Crear documento en Firestore
    const datosFirestore = {
      nombre: padre.nombre,
      correo: padre.correo,
      telefono: padre.telefono,
      role: padre.role || "padre",
    };

    await setDoc(doc(db, "padres", uid), datosFirestore);

    // Actualizar estado local
    setPadres((prev) => [...prev, { id: uid, ...datosFirestore }]);
  };

  const eliminarPadre = async (id: string) => {
    await deleteDoc(doc(db, "padres", id));
    setPadres((prev) => prev.filter((p) => p.id !== id));
  };

  const updatePadre = async (id: string, updated: Partial<Padre>) => {
    await updateDoc(doc(db, "padres", id), updated);
    setPadres((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updated } : p))
    );
  };

  return (
    <PadresContext.Provider
      value={{
        padres,
        agregarPadre,
        eliminarPadre,
        updatePadre,
      }}
    >
      {children}
    </PadresContext.Provider>
  );
}

export function usePadres() {
  const ctx = useContext(PadresContext);
  if (!ctx) throw new Error("usePadres debe usarse dentro de PadresProvider");
  return ctx;
}
