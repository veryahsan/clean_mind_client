import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "./context/AuthContext";
import moodApi from "./services/moodApi";
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
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import MembersList from "./pages/admin/MembersList.jsx";
import SpecialistsList from "./pages/admin/SpecialistsList.jsx";
import CreateMember from "./pages/admin/CreateMember.jsx";
import CreateSpecialistAdmin from "./pages/admin/CreateSpecialist.jsx";
import AdminVerifyLogin from "./pages/admin/AdminVerifyLogin.jsx";
import Footer from "./components/layout/Footer";
import RouteChangeHandler from "./components/common/RouteChangeHandler";

const AppRoutes = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated && window.location.pathname === "/") {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        navigate("/dashboard");
        return;
      }

      try {
        const decoded = jwtDecode(accessToken);
        const isAdmin = Boolean(decoded.is_staff) || Boolean(decoded.is_superuser);
        const userRole = decoded.role || null;
        
        if (isAdmin) {
          navigate("/admin");
        } else if (userRole === "member") {
          moodApi.get("today/")
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

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-code" element={<VerifyCode />} />
      <Route path="/verify-email/:token" element={<VerifyEmail />} />
      <Route path="/admin/verify-login/:token" element={<AdminVerifyLogin />} />
      <Route path="/create-specialist" element={<CreateSpecialist />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAdmin={true}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/members"
        element={
          <ProtectedRoute requireAdmin={true}>
            <MembersList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/specialists"
        element={
          <ProtectedRoute requireAdmin={true}>
            <SpecialistsList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/create-member"
        element={
          <ProtectedRoute requireAdmin={true}>
            <CreateMember />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/create-specialist"
        element={
          <ProtectedRoute requireAdmin={true}>
            <CreateSpecialistAdmin />
          </ProtectedRoute>
        }
      />
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
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  
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

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

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

  if (isAdminRoute) {
    return <AppRoutes />;
  }

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
