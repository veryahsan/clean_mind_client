import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import GuestRoute from "../components/auth/GuestRoute";

// Public Pages
import Home from "../pages/home/Home";
import NotFound from "../pages/not_found/NotFound";

// Auth Pages
import Login from "../pages/accounts/Login";
import Register from "../pages/accounts/Register";
import VerifyEmail from "../pages/accounts/VerifyEmail";
import VerifyCode from "../pages/accounts/VerifyCode";
import CreateSpecialist from "../pages/accounts/CreateSpecialist";

// User Pages
import Dashboard from "../pages/dashboard/Dashboard";
import Calendar from "../pages/calendar/Calendar";
import Messages from "../pages/messages/Messages";
import Assistant from "../pages/assistant/Assistant";
import Notifications from "../pages/notifications/Notifications";
import Profile from "../pages/profile/Profile";
import PublicDoctorProfile from "../pages/profile/PublicDoctorProfile";
import Appointments from "../pages/appointments/Appointments";
import ExploreDoctors from "../pages/explore-doctors/ExploreDoctors";

// Admin Pages
import AdminDashboard from "../pages/admin/AdminDashboard";
import MembersList from "../pages/admin/MembersList";
import SpecialistsList from "../pages/admin/SpecialistsList";
import CreateMember from "../pages/admin/CreateMember";
import CreateSpecialistAdmin from "../pages/admin/CreateSpecialist";
import EditMember from "../pages/admin/EditMember";
import EditSpecialist from "../pages/admin/EditSpecialist";
import AdminVerifyLogin from "../pages/admin/AdminVerifyLogin";
import SpecialistDocuments from "../pages/admin/SpecialistDocuments/SpecialistDocuments";

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
      <Route
        path="/admin/edit-member/:memberId"
        element={
          <ProtectedRoute requireAdmin={true}>
            <EditMember />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/edit-specialist/:specialistId"
        element={
          <ProtectedRoute requireAdmin={true}>
            <EditSpecialist />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/specialists/:specialistId/documents"
        element={
          <ProtectedRoute requireAdmin={true}>
            <SpecialistDocuments />
          </ProtectedRoute>
        }
      />

      {/* ==================== USER ROUTES ==================== */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
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
      {/* Public doctor profile: no login required */}
      <Route path="/profile/doctor/:id" element={<PublicDoctorProfile />} />
      <Route
        path="/appointments"
        element={
          <ProtectedRoute>
            <Appointments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/explore-doctors"
        element={
          <ProtectedRoute>
            <ExploreDoctors />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
