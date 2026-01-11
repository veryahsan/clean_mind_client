import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import Loader from "../common/Loader";

/**
 * GuestRoute Component
 *
 * Protects routes that should only be accessible to unauthenticated users.
 * If a user is already authenticated, they are redirected to their appropriate dashboard.
 */
const GuestRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Loader />;
  }

  // If user is authenticated, redirect them to appropriate dashboard
  if (isAuthenticated) {
    let redirectPath = "/dashboard";

    try {
      const accessToken = localStorage.getItem("access_token");

      if (accessToken) {
        const decoded = jwtDecode(accessToken);
        const isAdmin =
          Boolean(decoded.is_staff) || Boolean(decoded.is_superuser);

        // Set redirect path for admin users
        if (isAdmin) {
          redirectPath = "/admin";
        }
      }
    } catch (error) {
      console.error("Error decoding token in GuestRoute:", error);
    }

    // Redirect to the determined path
    return <Navigate to={redirectPath} replace />;
  }

  // User is not authenticated - allow access to guest-only route
  return children;
};

export default GuestRoute;
