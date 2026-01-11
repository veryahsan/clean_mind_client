import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import GuestRoute from "../components/auth/GuestRoute";

// Public Pages
import Home from "../pages/home/Home";

// Auth Pages
import Login from "../pages/accounts/Login";
import Register from "../pages/accounts/Register";
import VerifyEmail from "../pages/accounts/VerifyEmail";
import VerifyCode from "../pages/accounts/VerifyCode";
import CreateSpecialist from "../pages/accounts/CreateSpecialist";

// User Pages
import MemberDashboard from "../pages/dashboard/MemberDashboard";
import Calendar from "../pages/calendar/Calendar";
import Messages from "../pages/messages/Messages";
import Assistant from "../pages/assistant/Assistant";
import Notifications from "../pages/notifications/Notifications";
import Profile from "../pages/profile/Profile";

// Admin Pages
import AdminDashboard from "../pages/admin/AdminDashboard";
import MembersList from "../pages/admin/MembersList";
import SpecialistsList from "../pages/admin/SpecialistsList";
import CreateMember from "../pages/admin/CreateMember";
import CreateSpecialistAdmin from "../pages/admin/CreateSpecialist";
import AdminVerifyLogin from "../pages/admin/AdminVerifyLogin";

const AppRoutes = () => {
  return (
    <Routes>
      {/* ==================== PUBLIC ROUTES ==================== */}
      <Route path="/" element={<Home />} />

      {/* ==================== GUEST-ONLY ROUTES ==================== */}
      <Route
        path="/login"
        element={
          <GuestRoute>
            <Login />
          </GuestRoute>
        }
      />
      <Route
        path="/register"
        element={
          <GuestRoute>
            <Register />
          </GuestRoute>
        }
      />
      <Route
        path="/verify-code"
        element={
          <GuestRoute>
            <VerifyCode />
          </GuestRoute>
        }
      />
      <Route
        path="/verify-email/:token"
        element={
          <GuestRoute>
            <VerifyEmail />
          </GuestRoute>
        }
      />
      <Route
        path="/create-specialist"
        element={
          <GuestRoute>
            <CreateSpecialist />
          </GuestRoute>
        }
      />

      {/* ==================== ADMIN VERIFY (PUBLIC) ==================== */}
      <Route path="/admin/verify-login/:token" element={<AdminVerifyLogin />} />

      {/* ==================== ADMIN ROUTES ==================== */}
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

      {/* ==================== USER ROUTES ==================== */}
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

export default AppRoutes;
