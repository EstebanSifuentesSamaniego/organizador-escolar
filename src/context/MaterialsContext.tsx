import React, { createContext, useContext, useEffect, useState } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  getDoc,
  serverTimestamp,
  deleteField,
  type DocumentData,
} from "firebase/firestore";

import { db } from "../firebase";

export interface MaterialDoc {
  id: string;
  titulo: string;
  descripcion: string;
  materiales: string[];
  createdAt?: any;
  asignaciones?: Record<
    string,
    {
      uid: string | null;
      nombre: string;
    }
  >;
}

type MaterialsContextType = {
  materialesDocs: MaterialDoc[];
  crearAviso: (payload: {
    titulo: string;
    descripcion: string;
    materiales: string[];
  }) => Promise<void>;
  actualizarAviso: (
    id: string,
    payload: Partial<Omit<MaterialDoc, "id">>
  ) => Promise<void>;
  eliminarAviso: (id: string) => Promise<MaterialDoc | null>;
  tomarMaterial: (
    avisoId: string,
    materialIndex: number,
    nombrePadre: string
  ) => Promise<void>;
  soltarMaterial: (avisoId: string, materialIndex: number) => Promise<void>;
};

const MaterialsContext = createContext<MaterialsContextType | undefined>(
  undefined
);

export function MaterialsProvider({ children }: { children: React.ReactNode }) {
  const [materialesDocs, setMaterialesDocs] = useState<MaterialDoc[]>([]);

  // ========================================
  // 🔥 LISTENER EN TIEMPO REAL
  // ========================================
  useEffect(() => {
    const q = query(collection(db, "materiales"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const docs: MaterialDoc[] = snap.docs.map((d) => {
        const data = d.data() as DocumentData;
        return {
          id: d.id,
          titulo: data.titulo,
          descripcion: data.descripcion,
          materiales: data.materiales || [],
          asignaciones: data.asignaciones || {},
          createdAt: data.createdAt || null,
        };
      });

      setMaterialesDocs(docs);
    });

    return () => unsub();
  }, []);

  // ========================================
  // ➕ CREAR AVISO
  // ========================================
  const crearAviso = async (payload: {
    titulo: string;
    descripcion: string;
    materiales: string[];
  }) => {
    const col = collection(db, "materiales");
    await addDoc(col, {
      titulo: payload.titulo,
      descripcion: payload.descripcion,
      materiales: payload.materiales,
      asignaciones: {},
      createdAt: serverTimestamp(),
    });
  };

  // ========================================
  // ✏️ ACTUALIZAR AVISO
  // ========================================
  const actualizarAviso = async (
    id: string,
    payload: Partial<Omit<MaterialDoc, "id">>
  ) => {
    const ref = doc(db, "materiales", id);
    const updatePayload: any = {};

    if (payload.titulo !== undefined) updatePayload.titulo = payload.titulo;
    if (payload.descripcion !== undefined)
      updatePayload.descripcion = payload.descripcion;
    if (payload.materiales !== undefined)
      updatePayload.materiales = payload.materiales;
    if (payload.asignaciones !== undefined)
      updatePayload.asignaciones = payload.asignaciones;

    await updateDoc(ref, updatePayload);
  };

  // ========================================
  // 🗑️ ELIMINAR AVISO
  // ========================================
  const eliminarAviso = async (id: string): Promise<MaterialDoc | null> => {
    const ref = doc(db, "materiales", id);
    const snap = await getDoc(ref);

    if (!snap.exists()) return null;

    const data = snap.data() as DocumentData;

    const copia: MaterialDoc = {
      id: snap.id,
      titulo: data.titulo,
      descripcion: data.descripcion,
      materiales: data.materiales || [],
      asignaciones: data.asignaciones || {},
      createdAt: data.createdAt || null,
    };

    await deleteDoc(ref);

    return copia;
  };

  // ========================================
  // 🟢 TOMAR MATERIAL
  // ========================================
  const tomarMaterial = async (
    avisoId: string,
    materialIndex: number,
    nombrePadre: string
  ) => {
    const { getAuth } = await import("firebase/auth");
    const uid = getAuth().currentUser?.uid || null;

    const refDoc = doc(db, "materiales", avisoId);
    const key = String(materialIndex);

    await updateDoc(refDoc, {
      [`asignaciones.${key}`]: {
        uid,
        nombre: nombrePadre,
      },
    });
  };

  // ========================================
  // 🔴 SOLTAR MATERIAL
  // ========================================
  const soltarMaterial = async (avisoId: string, materialIndex: number) => {
    const refDoc = doc(db, "materiales", avisoId);
    const key = `asignaciones.${String(materialIndex)}`;

    await updateDoc(refDoc, { [key]: deleteField() });
  };

  return (
    <MaterialsContext.Provider
      value={{
        materialesDocs,
        crearAviso,
        actualizarAviso,
        eliminarAviso,
        tomarMaterial,
        soltarMaterial,
      }}
    >
      {children}
    </MaterialsContext.Provider>
  );
}

export function useMaterials() {
  const ctx = useContext(MaterialsContext);
  if (!ctx)
    throw new Error("useMaterials debe usarse dentro de MaterialsProvider");

  return ctx;
}
