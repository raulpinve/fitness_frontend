// src/context/AuthProvider.jsx
import { useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";
import { syncUser } from "../features/auth/authApi";
import { AuthContext } from "./authContext";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        await syncUser(); // crea el usuario en la BD si no existe
        setAuthError("");
        setUser(firebaseUser);
      } catch (err) {
        console.error("No se pudo sincronizar el usuario:", err);
        setAuthError(err.message);
        await signOut(auth); // evita quedar logueado en Firebase sin usuario en la BD
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const loginWithGoogle = () => signInWithPopup(auth, googleProvider);

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider
      value={{ user, loading, authError, login, loginWithGoogle, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}