import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/accounts/Login.jsx";
import Register from "./pages/accounts/Register.jsx";
import CreateSpecialist from "./pages/accounts/CreateSpecialist.jsx";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/create-specialist" element={<CreateSpecialist />} />
    </Routes>
  );
};

export default App;
