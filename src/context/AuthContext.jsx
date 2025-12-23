import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../services/api";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(() => {
    return localStorage.getItem("access_token");
  });

  const checkAuth = async () => {
    const storedToken = localStorage.getItem("access_token");
    if (storedToken) {
      setToken(storedToken);
      // Try to get user data from localStorage first
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        } catch (e) {
          console.error("Error parsing stored user:", e);
        }
      }
      // Optionally verify token by fetching user data from API
      // Uncomment this if you have a user endpoint:
      /*
      try {
        const response = await api.get("user/");
        setUser(response.data);
        localStorage.setItem("user", JSON.stringify(response.data));
        setIsAuthenticated(true);
      } catch (error) {
        // Token might be expired or invalid
        console.error("Auth check failed:", error);
        logout();
      }
      */
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, []); 

  const login = async (username, password) => {
    try {
      const response = await api.post("login/", { username, password });
      const { access, refresh, user: userData } = response.data;

      // Store tokens
      if (access) {
        localStorage.setItem("access_token", access);
        setToken(access);
      }
      if (refresh) {
        localStorage.setItem("refresh_token", refresh);
      }

      // Store user data if provided
      if (userData) {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      } else {
        // If user data is not in response, you can fetch it here
        // Or store basic info like username from the login response
        // For now, we'll just mark as authenticated since we have the token
      }

      setIsAuthenticated(true);
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
      // After successful registration, you might want to auto-login
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
    isAuthenticated,
    isLoading,
    token,
    login,
    logout,
    register,
    updateUser,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
