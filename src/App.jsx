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
        navigate("/dashboard", { replace: true });
        return;
      }

      try {
        const decoded = jwtDecode(accessToken);
        const isAdmin =
          Boolean(decoded.is_staff) || Boolean(decoded.is_superuser);

        if (isAdmin) {
          navigate("/admin", { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
      } catch (error) {
        console.error("Token decode error:", error);
        navigate("/dashboard", { replace: true });
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
      <Navbar />
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
        {/* Mobile Sidebar Toggle Button - Only show when authenticated and on mobile */}
        {isAuthenticated && !isDesktop && (
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="fixed top-4 left-4 z-40 flex justify-center items-center size-10 text-gray-600 hover:bg-gray-100 rounded-lg bg-white shadow-lg border border-gray-200 focus:outline-none focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 dark:hover:text-neutral-200 dark:focus:text-neutral-200 dark:bg-neutral-800 dark:border-neutral-700 transition"
            aria-label="Toggle navigation"
          >
            <svg
              className="shrink-0 size-6"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M15 3v18" />
              <path d="m10 15-3-3 3-3" />
            </svg>
            <span className="sr-only">Navigation Toggle</span>
          </button>
        )}
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
