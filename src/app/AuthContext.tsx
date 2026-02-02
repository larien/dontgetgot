import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { getAuthIdentity, setAuthIdentity } from "./auth";

interface AuthContextValue {
  /** User identity (name, nickname, or email) from the login page. */
  email: string | null;
  setEmail: (value: string | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [email, setEmailState] = useState<string | null>(() => getAuthIdentity());

  const setEmail = useCallback((value: string | null) => {
    setAuthIdentity(value);
    setEmailState(value);
  }, []);

  const logout = useCallback(() => {
    setEmail(null);
  }, [setEmail]);

  return (
    <AuthContext.Provider value={{ email, setEmail, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
