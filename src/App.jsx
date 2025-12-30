import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Navbar from "./components/layout/Navbar";
import Home from "./pages/home/Home";
import Login from "./pages/accounts/Login.jsx";
import Register from "./pages/accounts/Register.jsx";
import CreateSpecialist from "./pages/accounts/CreateSpecialist.jsx";
import MemberDashboard from "./pages/dashboard/MemberDashboard.jsx";
import Profile from "./pages/profile/Profile.jsx";
import Footer from "./components/layout/Footer";

const AppRoutes = () => {
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

const App = () => {
  return (
    <AuthProvider>
      <Navbar />
      <AppRoutes />
      <Footer />
    </AuthProvider>
  );
};

export default App;
