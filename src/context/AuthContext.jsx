/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect, useContext } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../services/api";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const storedToken = localStorage.getItem("access_token");
  const storedUser = localStorage.getItem("user");

  const [token, setToken] = useState(storedToken);
  const [user, setUser] = useState(storedUser ? JSON.parse(storedUser) : null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!storedToken);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    const storedToken = localStorage.getItem("access_token");
    if (!storedToken) {
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }

    setToken(storedToken);

    try {
      const decoded = jwtDecode(storedToken);
      const userData = {
        id: decoded.user_id,
        username: decoded.username,
        role: decoded.role,
      };
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      setIsAuthenticated(true);
    } catch (e) {
      console.error("Failed to decode token:", e);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await api.post("login/", { username, password });
      const { access, refresh } = response.data;

      if (access) {
        localStorage.setItem("access_token", access);
        setToken(access);

        const decoded = jwtDecode(access);
        const userData = {
          id: decoded.user_id,
          username: decoded.username,
          role: decoded.role,
        };
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        setIsAuthenticated(true);
      }

      if (refresh) localStorage.setItem("refresh_token", refresh);

      return { success: true };
    } catch (error) {
      console.error("Login failed:", error);
      return {
        success: false,
        error: error.response?.data || { message: "Login failed" },
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const register = async (userData) => {
    try {
      const response = await api.post("register/", userData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Registration failed:", error);
      return {
        success: false,
        error: error.response?.data || { message: "Registration failed" },
      };
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const value = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
    register,
    updateUser,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
