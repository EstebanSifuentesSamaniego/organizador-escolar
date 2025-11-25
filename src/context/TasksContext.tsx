import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
  getDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
} from "firebase/storage";
import type { Tarea } from "../types/Tarea";

type TasksContextType = {
  tareas: Tarea[];
  agregarTarea: (
    data: Omit<Tarea, "id" | "imagenes">,
    imagenes: File[]
  ) => Promise<void>;
  actualizarTarea: (
    id: string,
    data: Partial<Tarea>,
    nuevasImagenes?: File[]
  ) => Promise<void>;
  eliminarTarea: (id: string) => Promise<Tarea | null>;
};

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export function TasksProvider({ children }: { children: ReactNode }) {
  const [tareas, setTareas] = useState<Tarea[]>([]);

  // ==========================
  // 🔥 Listener en tiempo real
  // ==========================
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "tareas"), (snapshot) => {
      const data: Tarea[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
        fechaDeEntrega: d.data().fechaDeEntrega?.toDate(),
      }));
      setTareas(data);
    });

    return () => unsub();
  }, []);

  // ==========================
  // 📤 Subir imágenes a Storage
  // ==========================
  const subirImagenes = async (
    tareaId: string,
    imagenes: File[]
  ): Promise<string[]> => {
    const urls: string[] = [];

    for (const img of imagenes) {
      const uniqueName = `${crypto.randomUUID()}-${img.name}`;
      const fileRef = ref(storage, `tareas/${tareaId}/${uniqueName}`);

      await uploadBytes(fileRef, img);
      urls.push(await getDownloadURL(fileRef));
    }

    return urls;
  };

  // ==========================
  // ➕ Crear tarea
  // ==========================
  const agregarTarea = async (
    data: Omit<Tarea, "id" | "imagenes">,
    imagenes: File[]
  ) => {
    const docRef = await addDoc(collection(db, "tareas"), {
      titulo: data.titulo,
      descripcion: data.descripcion,
      fechaDeEntrega: Timestamp.fromDate(data.fechaDeEntrega),
      imagenes: [],
    });

    if (imagenes.length > 0) {
      const urls = await subirImagenes(docRef.id, imagenes);
      await updateDoc(docRef, { imagenes: urls });
    }
  };

  // ==========================
  // ✏️ Actualizar tarea
  // ==========================
  const actualizarTarea = async (
    id: string,
    data: Partial<Tarea>,
    nuevasImagenes?: File[]
  ) => {
    const refDoc = doc(db, "tareas", id);
    const snap = await getDoc(refDoc);
    const currentImages = snap.data()?.imagenes || [];

    let payload: any = {};

    if (data.titulo) payload.titulo = data.titulo;
    if (data.descripcion) payload.descripcion = data.descripcion;
    if (data.fechaDeEntrega)
      payload.fechaDeEntrega = Timestamp.fromDate(data.fechaDeEntrega);

    if (nuevasImagenes && nuevasImagenes.length > 0) {
      const nuevasUrls = await subirImagenes(id, nuevasImagenes);
      payload.imagenes = [...currentImages, ...nuevasUrls];
    }

    await updateDoc(refDoc, payload);
  };

  // ==========================
  // 🗑️ Eliminar IMÁGENES de Storage
  // ==========================
  const eliminarImagenesDeTarea = async (tareaId: string) => {
    const folderRef = ref(storage, `tareas/${tareaId}`);
    const result = await listAll(folderRef);

    for (const fileRef of result.items) {
      await deleteObject(fileRef);
    }
  };

  // ==========================
  // 🗑️ Eliminar tarea COMPLETA
  // ==========================
  const eliminarTarea = async (id: string): Promise<Tarea | null> => {
    const refDoc = doc(db, "tareas", id);
    const snap = await getDoc(refDoc);

    if (!snap.exists()) return null;

    const copia: Tarea = {
      id,
      ...snap.data(),
      fechaDeEntrega: snap.data().fechaDeEntrega?.toDate(),
    };

    await deleteDoc(refDoc);
    await eliminarImagenesDeTarea(id);

    return copia;
  };

  return (
    <TasksContext.Provider
      value={{ tareas, agregarTarea, actualizarTarea, eliminarTarea }}
    >
      {children}
    </TasksContext.Provider>
  );
}

export const useTasks = () => {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error("useTasks must be used within TasksProvider");
  return ctx;
};
