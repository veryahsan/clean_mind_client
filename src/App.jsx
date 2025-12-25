import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/home/Home";
import Login from "./pages/accounts/Login.jsx";
import Register from "./pages/accounts/Register.jsx";
import CreateSpecialist from "./pages/accounts/CreateSpecialist.jsx";

const AppContent = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Optional: while checking auth, you could render a loader
  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create-specialist" element={<CreateSpecialist />} />
      </Routes>
      {!isAuthenticated && <Footer />}
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
