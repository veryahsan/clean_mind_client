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

  const updateAvailabilityStatus = async (status) => {
    try {
      const formData = new FormData();
      formData.append("availability_status", status);
      await profileApi.patch("", formData);
    } catch (err) {
      console.error("Failed to update availability status:", err);
    }
  };

  const fetchUserDisplay = async () => {
    try {
      const response = await api.get("me/");
      const responseData = response.data;
      
      // Handle standardized response format
      if (responseData.success && responseData.data) {
        return responseData.data;
      }
      return null;
    } catch (err) {
      console.error("Failed to fetch user display info:", err);
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
        email: decoded.email,
        role: decoded.role,
        is_staff: decoded.is_staff || false,
        is_superuser: decoded.is_superuser || false,
      };

      // Fetch lightweight user display info (headshot, first_name, last_name, etc.)
      const displayData = await fetchUserDisplay();
      if (displayData) {
        userData = {
          ...userData,
          ...displayData, // Merge display data (headshot, first_name, last_name, availability_status)
        };
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
      
      // Check if admin verification is required
      if (responseData.success && responseData.data?.admin_verification_required) {
        return {
          success: false,
          adminVerificationRequired: true,
          userId: responseData.data.user_id,
          email: responseData.data.email,
          message: responseData.message || "Admin login requires verification. A code has been sent to your email.",
        };
      }
      
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
          email: decoded.email,
          role: decoded.role,
          is_staff: decoded.is_staff || false,
          is_superuser: decoded.is_superuser || false,
        };

        // Fetch lightweight user display info (headshot, first_name, last_name, etc.)
        const displayData = await fetchUserDisplay();
        if (displayData) {
          userData = {
            ...userData,
            ...displayData, // Merge display data (headshot, first_name, last_name, availability_status)
          };
        }

        // Mark user as available on successful login
        try {
          await updateAvailabilityStatus("available");
          userData = {
            ...userData,
            availability_status: "available",
          };
        } catch (e) {
          // Availability update failure shouldn't block login
          console.error("Failed to mark user as available on login:", e);
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
        // Extract non_field_errors to top level for easier access
        const nonFieldErrors = errorData.errors?.non_field_errors || errorData.non_field_errors;
        
        return {
          success: false,
          error: {
            message: errorData.message,
            non_field_errors: nonFieldErrors,
            ...errorData.errors,
            // Also include email at top level if present (for verification redirect)
            email: errorData.email || (errorData.errors && errorData.errors.email),
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
    // Fire-and-forget: mark user as offline, but don't block logout if it fails
    updateAvailabilityStatus("offline");

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
