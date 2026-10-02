import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";








const AuthContext = createContext(null);

const ADMIN_CREDENTIALS = { username: "admin", password: "admin123" };
const SESSION_KEY = "aerotrack_session";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const session = sessionStorage.getItem(SESSION_KEY);
    if (session) {
      try {
        setUser(JSON.parse(session));
      } catch (e) {
        sessionStorage.removeItem(SESSION_KEY);
      }
    }
  }, []);

  const login = useCallback((username, password, selectedRole = "user") => {
    const u = (username || "").trim();
    const p = (password || "").trim();
    if (!u || !p) {
      return { success: false, error: "Please enter both username and password." };
    }

    if (selectedRole === "admin") {
      if (u === ADMIN_CREDENTIALS.username && p === ADMIN_CREDENTIALS.password) {
        const userData = { id: "admin-001", name: "System Admin", role: "Administrator", isAdmin: true };
        setUser(userData);
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(userData));
        return { success: true, redirect: "/dashboard" };
      }
      return { success: false, error: "Invalid admin credentials. Use admin / admin123" };
    }

    // User Login
    if (p.length >= 4) {
      const userData = {
        id: `usr-${Date.now()}`,
        name: u.charAt(0).toUpperCase() + u.slice(1),
        role: "User",
        isAdmin: false,
      };
      setUser(userData);
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(userData));
      return { success: true, redirect: "/flight-status" };
    }
    return { success: false, error: "Password must be at least 4 characters. Demo: user / user123" };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem(SESSION_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, isAdmin: user?.role === "Administrator", login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const RequireAuth = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) navigate("/", { replace: true });
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;
  return <>{children}</>;
};

export const RequireAdmin = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/", { replace: true });
    } else if (user?.role !== "Administrator") {
      navigate("/flight-status", { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated || user?.role !== "Administrator") return null;
  return <>{children}</>;
};
