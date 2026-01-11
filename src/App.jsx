import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "./context/AuthContext";
import moodApi from "./services/moodApi";
import AppRoutes from "./routes"; // Import routes
import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";
import Footer from "./components/layout/Footer";
import RouteChangeHandler from "./components/common/RouteChangeHandler";

const AppContent = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  // Redirect authenticated users from home page
  useEffect(() => {
    if (!isLoading && isAuthenticated && window.location.pathname === "/") {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        navigate("/dashboard");
        return;
      }

      try {
        const decoded = jwtDecode(accessToken);
        const isAdmin =
          Boolean(decoded.is_staff) || Boolean(decoded.is_superuser);
        const userRole = decoded.role || null;

        if (isAdmin) {
          navigate("/admin");
        } else if (userRole === "member") {
          moodApi
            .get("today/")
            .then(() => navigate("/dashboard"))
            .catch(() => navigate("/dashboard"));
        } else {
          navigate("/dashboard");
        }
      } catch {
        navigate("/dashboard");
      }
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Sidebar state management
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth >= 1024 && isAuthenticated && !isAdminRoute;
    }
    return false;
  });

  const [sidebarWidth, setSidebarWidth] = useState(() => {
    if (typeof window !== "undefined") {
      const savedWidth = localStorage.getItem("sidebar-width");
      return savedWidth ? parseInt(savedWidth, 10) : 256;
    }
    return 256;
  });

  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth >= 1024;
    }
    return false;
  });

  // Handle window resize
  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  // Handle sidebar visibility
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated && window.innerWidth >= 1024 && !isAdminRoute) {
        setSidebarOpen(true);
      } else if (!isAuthenticated || isAdminRoute) {
        setSidebarOpen(false);
      }
    }, 50);
    return () => clearTimeout(timer);
  }, [isAuthenticated, isAdminRoute, location.pathname]);

  // Admin routes don't show navbar/sidebar
  if (isAdminRoute) {
    return <AppRoutes />;
  }

  // Regular routes with navbar/sidebar
  return (
    <>
      <Navbar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        sidebarWidth={sidebarWidth}
        isDesktop={isDesktop}
      />
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        sidebarWidth={sidebarWidth}
        setSidebarWidth={setSidebarWidth}
      />
      <div
        className={`min-h-screen ${
          isAuthenticated
            ? "bg-white lg:ml-64 transition-[margin-left] duration-300 ease-in-out"
            : ""
        }`}
        style={
          isAuthenticated && isDesktop
            ? { marginLeft: `${sidebarWidth}px` }
            : {}
        }
      >
        <AppRoutes />
        <Footer />
      </div>
    </>
  );
};

const App = () => {
  return (
    <>
      <RouteChangeHandler />
      <AppContent />
    </>
  );
};

export default App;
