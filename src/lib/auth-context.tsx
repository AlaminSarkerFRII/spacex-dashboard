"use client";

import { createContext, useContext, useState, useCallback } from "react";

interface User {
  name: string;
  email: string;
  role: string;
  since: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const DEMO_CREDENTIALS = { email: "admin@gmail.com", password: "admin" };

const DEMO_USER: User = {
  name: "Admin User",
  email: "admin@gmail.com",
  role: "Administrator",
  since: "January 2024",
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback((email: string, password: string): boolean => {
    if (
      email === DEMO_CREDENTIALS.email &&
      password === DEMO_CREDENTIALS.password
    ) {
      setUser(DEMO_USER);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => setUser(null), []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
