import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";
import Home from "./pages/home/Home";
import Login from "./pages/accounts/Login.jsx";
import Register from "./pages/accounts/Register.jsx";
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
        navigate("/member-dashboard");
      }
    }
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/create-specialist" element={<CreateSpecialist />} />
      <Route
        path="/member-dashboard"
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
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div
        className={`min-h-screen transition-all duration-300 ease-in-out ${
          isAuthenticated ? "lg:ml-64 bg-white" : ""
        }`}
      >
        <AppRoutes sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Footer />
      </div>
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <RouteChangeHandler />
      <AppContent />
    </AuthProvider>
  );
};

export default App;
