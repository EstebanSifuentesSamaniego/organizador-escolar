import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import { auth, db } from "../firebase";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

type User = {
  uid: string;
  email: string;
  name: string;
  role: "admin" | "padre" | "madre";
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        localStorage.removeItem("auth_user");
        return;
      }

      const ref = doc(db, "padres", firebaseUser.uid);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        console.warn("⚠ Usuario sin documento en Firestore");
        setUser(null);
        return;
      }

      const data = snap.data();

      console.log("\n\n\n--- DATA---")
      console.log(data);

      const newUser: User = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || "",
        name: data.nombre || "Padre",
        role: data.role || "padre",
      };

      console.log("\n\n\n--- NEW USER ---")
      console.log(newUser);


      setUser(newUser);
      localStorage.setItem("auth_user", JSON.stringify(newUser));
    });

    return () => unsub();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);

      const ref = doc(db, "padres", cred.user.uid);
      const snap = await getDoc(ref);

      if (!snap.exists()) return false;

      const data = snap.data();

      const loggedUser: User = {
        uid: cred.user.uid,
        email: cred.user.email || "",
        name: data.nombre || "Padre",
        role: data.role || "padre",
      };

      setUser(loggedUser);
      localStorage.setItem("auth_user", JSON.stringify(loggedUser));
      return true;
    } catch (err) {
      console.error("Error en login:", err);
      return false;
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    localStorage.removeItem("auth_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
