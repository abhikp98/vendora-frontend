import { useState, useEffect, useContext, createContext, use } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const res = await api.get("/auth/me/");
      console.log("fetchUser response:", res.data); // ← add
      setUser(res.data);
      return res.data;
    } catch (err) {
      console.log(err.message, "auth me");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const res = await api.post("/auth/login/", { username, password },);
      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);
      api.defaults.headers.common["Authorization"] =
        `Bearer ${res.data.access}`;
      const user = await fetchUser();
      return user;
    } catch (err) {
      console.log(err.message);
      throw err;
    }
  };

  const logout = async () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
  };
  const register = async (data) => {
    const res = await api.post("/auth/register/", data);
    localStorage.setItem("access_token", res.data.tokens.access);
    localStorage.setItem("refresh_token", res.data.tokens.refresh);
    await fetchUser();
  };

  return (
    <AuthContext.Provider value={{ user, login, loading, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
