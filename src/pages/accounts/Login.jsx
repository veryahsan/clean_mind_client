import React, { useState } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom";
import "./accounts.scss";
import "../../styles/globals.scss"

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const validate = () => {
    const newErrors = {};

    if (!username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await api.post("login/", { username, password });
      if (res.data.access) {
        localStorage.setItem("access_token", res.data.access);
      }
      if (res.data.refresh) {
        localStorage.setItem("refresh_token", res.data.refresh);
      }
      if (res.data.access_token) {
        localStorage.setItem("access_token", res.data.access_token);
      }
      if (res.data.refresh_token) {
        localStorage.setItem("refresh_token", res.data.refresh_token);
      }

      setSuccessMessage("Login successful");
      setTimeout(() => setSuccessMessage(""), 3000);

      setUsername("");
      setPassword("");
      setErrors({});
    } catch (err) {
      const errorData = err.response?.data || {};
      const newErrors = {};

      if (errorData.detail) {
        newErrors.password = errorData.detail;
      }

      if (errorData.username) {
        newErrors.username = errorData.username[0];
      }

      if (errorData.password) {
        newErrors.password = errorData.password[0];
      }

      if (Object.keys(newErrors).length === 0) {
        newErrors.password = "Invalid username or password";
      }

      setErrors(newErrors);
    }
  };

  return (
    <div className="accounts-container">
      <h2>Login</h2>

      {successMessage && <div className="success-slider">{successMessage}</div>}

      <form onSubmit={handleLogin} noValidate>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            className="form-field"
            onChange={(e) => setUsername(e.target.value)}
          />
          {errors.username && <p className="error-text">{errors.username}</p>}
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            className="form-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <p className="error-text">{errors.password}</p>}
        </div>

        <button type="submit" className="submit-btn">Login</button>

        <div className="login-link">
          Don't have an account? <Link to="/register">Register</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
