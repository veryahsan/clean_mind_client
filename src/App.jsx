import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";
import Home from "./pages/home/Home";
import Login from "./pages/accounts/Login.jsx";
import Register from "./pages/accounts/Register.jsx";
import VerifyEmail from "./pages/accounts/VerifyEmail.jsx";
import VerifyCode from "./pages/accounts/VerifyCode.jsx";
import CreateSpecialist from "./pages/accounts/CreateSpecialist.jsx";
import MemberDashboard from "./pages/dashboard/MemberDashboard.jsx";
import Calendar from "./pages/calendar/Calendar.jsx";
import Messages from "./pages/messages/Messages.jsx";
import Assistant from "./pages/assistant/Assistant.jsx";
import Notifications from "./pages/notifications/Notifications.jsx";
import Profile from "./pages/profile/Profile.jsx";
import Footer from "./components/layout/Footer";
import RouteChangeHandler from "./components/common/RouteChangeHandler";

const AppRoutes = ({ sidebarOpen, setSidebarOpen }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      if (window.location.pathname === "/") {
        navigate("/dashboard");
      }
    }
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-code" element={<VerifyCode />} />
      <Route path="/verify-email/:token" element={<VerifyEmail />} />
      <Route path="/create-specialist" element={<CreateSpecialist />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <MemberDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/calendar"
        element={
          <ProtectedRoute>
            <Calendar />
          </ProtectedRoute>
        }
      />
      <Route
        path="/messages"
        element={
          <ProtectedRoute>
            <Messages />
          </ProtectedRoute>
        }
      />
      <Route
        path="/assistant"
        element={
          <ProtectedRoute>
            <Assistant />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth >= 1024 && isAuthenticated; // lg breakpoint
    }
    return false;
  });
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    if (typeof window !== "undefined") {
      const savedWidth = localStorage.getItem("sidebar-width");
      return savedWidth ? parseInt(savedWidth, 10) : 256; // Default to w-64 (256px)
    }
    return 256;
  });
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth >= 1024;
    }
    return false;
  });

  // Check if we're on desktop
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // Update sidebar state when authentication changes with smooth transition
  useEffect(() => {
    // Add a small delay to allow auth state to settle before changing sidebar
    const timer = setTimeout(() => {
      if (isAuthenticated && window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else if (!isAuthenticated) {
        setSidebarOpen(false);
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [isAuthenticated]);

  return (
    <>
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} sidebarWidth={sidebarWidth} isDesktop={isDesktop} />
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        sidebarWidth={sidebarWidth}
        setSidebarWidth={setSidebarWidth}
      />
      <div
        className={`min-h-screen ${
          isAuthenticated ? "bg-white lg:ml-64 transition-[margin-left] duration-300 ease-in-out" : ""
        }`}
        style={isAuthenticated && isDesktop ? { marginLeft: `${sidebarWidth}px` } : {}}
      >
        <AppRoutes sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
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
