import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api } from "../services/api.js";
import * as authService from "../services/authService.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  });
  // Starts true whenever a token exists, so protected routes wait for the
  // /auth/me check (confirms the token and picks up the latest role) before
  // deciding whether to redirect to login.
  const [loading, setLoading] = useState(Boolean(token));

  const persistSession = (nextToken, nextUser) => {
    localStorage.setItem("token", nextToken);
    localStorage.setItem("user", JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
  };

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken("");
    setUser(null);
  }, []);

  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (res) => res,
      (err) => {
        if (err.response?.status === 401) logout();
        return Promise.reject(err);
      }
    );
    return () => api.interceptors.response.eject(interceptor);
  }, [logout]);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    authService
      .getMe()
      .then((me) => {
        const refreshed = { id: me.id, name: me.name, email: me.email, role: me.role };
        localStorage.setItem("user", JSON.stringify(refreshed));
        setUser(refreshed);
      })
      .catch(() => logout())
      .finally(() => setLoading(false));
    // Only needs to run once per token (e.g. on reload); login()/signup()
    // already set fresh user state themselves.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email, password) => {
    const data = await authService.login({ email, password });
    persistSession(data.token, data.user);
    return data.user;
  };

  const signup = async (name, email, password) => {
    const data = await authService.signup({ name, email, password });
    persistSession(data.token, data.user);
    return data.user;
  };

  const value = {
    token,
    user,
    loading,
    isAuthenticated: Boolean(token),
    isAdmin: user?.role === "admin",
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
