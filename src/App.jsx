import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Home from "./pages/home/Home";
import Login from "./pages/accounts/Login.jsx";
import Register from "./pages/accounts/Register.jsx";
import CreateSpecialist from "./pages/accounts/CreateSpecialist.jsx";
import Footer from "./components/layout/Footer";

const App = () => {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create-specialist" element={<CreateSpecialist />} />
      </Routes>

      <Footer />
    </>
  );
};

export default App;
