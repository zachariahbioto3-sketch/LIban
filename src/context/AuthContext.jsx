import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext(null);
const BASE = "http://localhost:8001/api/auth";

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

async function apiFetch(path, options = {}) {
  const csrfToken = getCookie("csrftoken");
  const res = await fetch(`${BASE}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(csrfToken ? { "X-CSRFToken": csrfToken } : {}),
    },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState("login");
  const [authRedirectAction, setAuthRedirectAction] = useState(null);

  useEffect(() => {
    apiFetch("/me/")
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setAuthLoading(false));
  }, []);

  const login = useCallback(async (username, password) => {
    const data = await apiFetch("/login/", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    setUser(data);
    return data;
  }, []);

  const register = useCallback(async (fields) => {
    const data = await apiFetch("/register/", {
      method: "POST",
      body: JSON.stringify(fields),
    });
    setUser(data);
    return data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiFetch("/logout/", { method: "POST" });
    } catch (_) {}
    setUser(null);
  }, []);

  const requireAuth = useCallback((action) => {
    if (user) { action && action(); return true; }
    setAuthRedirectAction(() => action);
    setAuthModalTab("login");
    setAuthModalOpen(true);
    return false;
  }, [user]);

  const onAuthSuccess = useCallback(() => {
    setAuthModalOpen(false);
    if (authRedirectAction) { authRedirectAction(); setAuthRedirectAction(null); }
  }, [authRedirectAction]);

  return (
    <AuthContext.Provider value={{
      user, authLoading,
      login, register, logout,
      authModalOpen, setAuthModalOpen,
      authModalTab, setAuthModalTab,
      requireAuth, onAuthSuccess,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
