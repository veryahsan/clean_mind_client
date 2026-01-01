/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect, useContext } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../services/api";
import profileApi from "../services/profileApi";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const storedToken = localStorage.getItem("access_token");
  const storedUser = localStorage.getItem("user");

  const [token, setToken] = useState(storedToken);
  const [user, setUser] = useState(storedUser ? JSON.parse(storedUser) : null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!storedToken);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserProfile = async () => {
    try {
      const response = await profileApi.get("");
      const responseData = response.data;
      
      // Handle standardized response format
      let profileData;
      if (responseData.success && responseData.data) {
        profileData = responseData.data;
      } else {
        // Fallback for old format (backward compatibility)
        profileData = responseData;
      }
      
      // Merge profile data with existing user data
      return {
        id: profileData.id,
        username: profileData.username,
        role: profileData.role,
        email: profileData.email,
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        headshot: profileData.headshot,
        has_headshot: profileData.has_headshot,
      };
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
      // Return null if profile fetch fails - we'll use basic JWT data
      return null;
    }
  };

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
      let userData = {
        id: decoded.user_id,
        username: decoded.username,
        role: decoded.role,
      };

      // Try to fetch full profile data including headshot
      const profileData = await fetchUserProfile();
      if (profileData) {
        userData = profileData;
      }

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
      
      // Handle standardized response format
      const responseData = response.data;
      let access, refresh;
      
      if (responseData.success && responseData.data) {
        // New standardized format
        access = responseData.data.access;
        refresh = responseData.data.refresh;
      } else if (responseData.access) {
        access = responseData.access;
        refresh = responseData.refresh;
      }

      if (access) {
        localStorage.setItem("access_token", access);
        setToken(access);

        const decoded = jwtDecode(access);
        let userData = {
          id: decoded.user_id,
          username: decoded.username,
          role: decoded.role,
        };

        // Try to fetch full profile data including headshot
        const profileData = await fetchUserProfile();
        if (profileData) {
          userData = profileData;
        }

        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        setIsAuthenticated(true);
      }

      if (refresh) localStorage.setItem("refresh_token", refresh);

      return { success: true };
    } catch (error) {
      console.error("Login failed:", error);
      const errorData = error.response?.data;
      
      // Handle standardized error format
      if (errorData && errorData.success === false) {
        return {
          success: false,
          error: {
            message: errorData.message,
            ...errorData.errors,
          },
        };
      }
      
      return {
        success: false,
        error: errorData || { message: "Login failed" },
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
